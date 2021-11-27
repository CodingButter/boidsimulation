class Boid{
    constructor({generation,perceptionRadius,minSpeed,maxSpeed,steeringWeight,alignmentWeight,cohesionWeight,separationWeight,foodAttractionWeight,enemyRepelWeight,randomWeight}={}){
        this.generation = generation || 1;
        this.perceptionRadius = perceptionRadius || random(50,150);
        this.energy = 2000;
        this.breed = 0;
        this.lifespan= 6000;
        this.sex = floor(random(0,2));
        this.minSpeed = minSpeed || random(1,2);
        this.maxSpeed = maxSpeed || random(2,3);
        this.position = createVector(random(windowWidth),random(windowHeight));
        this.velocity = createVector();
        this.randomHeading = createVector();
        this.acceleration = p5.Vector.random2D();
        this.steeringWeight = steeringWeight || random(.1,1.1);
        this.alignmentWeight = alignmentWeight || random(.25,1.24);
        this.cohesionWeight = cohesionWeight || random(0.1,.9);
        this.separationWeight = separationWeight || random(0.01,1);
        this.foodAttractionWeight = foodAttractionWeight || random(-1,2);
        this.enemyRepelWeight = enemyRepelWeight || random(-1,2);
        this.randomWeight = randomWeight || random(0.8);

    }

    // Stay within the bounds of the window loop around 
    edgeLoop(){
        if(this.position.x>windowWidth)this.position.x=0;
        else if(this.position.x<0)this.position.x = windowWidth;
        if(this.position.y>windowHeight)this.position.y=0;
        else if(this.position.y<0)this.position.y=windowHeight;
    }

    static splice(boid1,boid2){
        
            const mutate = random()>.95
            var newOptions = {
                generation:boid1.generation+1,
                perceptionRadius:boid2.perceptionRadius + (mutate && boid2.perceptionRadius * random(-.3,.3)),
                minSpeed:boid1.minSpeed + (mutate && boid1.minSpeed * random(-.3,.3)),
                maxSpeed:boid2.maxSpeed + (mutate && boid2.maxSpeed * random(-.3,.3)),
                steeringWeight:boid1.steeringWeight + (mutate && boid1.steeringWeight * random(-.3,.3)),
                alignmentWeight:boid2.alignmentWeight + (mutate && boid2.alighmentWeight * random(-.3,.3)),
                cohesionWeight:boid1.cohesionWeight + (mutate && boid1.cohesionWeight * random(-.3,.3)),
                separationWeight:boid2.separationWeight + (mutate && boid2.separationWeight * random(-.3,.3)),
                foodAttractionWeight:boid1.foodattractionWeight + (mutate && boid1.foodAttractionWeight * random(-.3,.3)),
                enemyRepelWeight:boid2.enemyRepelWeight + (mutate && boid2.enemyRepelWeight * random(-.3,.3)),
                randomWeight:boid1.randomWeight + (mutate && boid1.randomWeight * random(1.05))
            }
            return new Boid(newOptions);
        
    }
    calculateSteering(neighbors,enemies,food){

       
        let steeringForce = createVector();
        let alignmentForce = createVector();
        let cohesionForce = createVector();
        let separationForce = createVector();
        let randomForce = p5.Vector.random2D();
        if(neighbors.length>0){
            this.partner = neighbors.filter(neighbor=>neighbor.sex==1)[0];
        if(neighbors.length>=1 && this.sex==0){
            this.breed++;
        }
        //if(neighbors.length>10)this.dead=true;
        neighbors.forEach((neighbor)=>{
            //introduce alignment force
            alignmentForce.add(neighbor.velocity).sub(this.velocity);
            cohesionForce.add(neighbor.position)
            separationForce = p5.Vector.sub(this.position,neighbor.position).div(this.position.dist(neighbor.position))
        })
    

        //add alignment force to steering
        alignmentForce.div(neighbors.length);
        steeringForce.add(alignmentForce.mult(this.alignmentWeight));

        //add cohesion force to steering
        cohesionForce.div(neighbors.length);
        cohesionForce.sub(this.position);
        //steeringForce.add(cohesionForce.mult(this.cohesionWeight))

        //add separation force to steering
        separationForce.div(neighbors.length);
        steeringForce.add(separationForce.mult(this.separationWeight))
    }
        //add random heading
        this.randomHeading.add(randomForce.mult(this.randomWeight));
        if(abs(this.randomHeading.mag())>3)this.randomHeading = createVector();
        steeringForce.add(this.randomHeading)

        //add enemyRepel
        enemies.forEach(enemy=>{
            let enemyDist = this.position.dist(enemy.position);
            if(enemyDist<this.perceptionRadius && enemy != this){
                let enemyRepelForce = p5.Vector.sub(this.position,enemy.position).div(enemyDist)
                steeringForce.add(enemyRepelForce.mult(this.enemyRepelWeight));
            }
        })

         //add enemyRepel
         food.forEach(foodbit=>{
            let foodbitDist = this.position.dist(foodbit.position);
            if(foodbitDist<10){
                if(foodbit.place){
                    foodbit.place();
                }
                this.energy+=600;
            }
            if(foodbitDist<this.perceptionRadius && foodbit != this){
                let foodAttractionForce = p5.Vector.sub(foodbit.position,this.position).div(foodbitDist)
                steeringForce.add(foodAttractionForce.mult(this.foodAttractionWeight));
            }
        })

        return steeringForce.mult(this.steeringWeight)
    }

    //update the boid each frame
    update(boids,enemies,food){
        this.lifespan--;
        if(this.lifespan==0)this.dead=true
        this.energy -= this.velocity.mag();
        if(this.energy<0)this.dead = true;
        let neighbors = boids.filter((b)=>b!=this && this.position.dist(b.position)<this.perceptionRadius);

    
        let steeringForce = this.calculateSteering(neighbors,enemies,food);
        this.acceleration.add(steeringForce)
    
        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        if(this.velocity.mag()<this.minSpeed)this.velocity.setMag(this.minSpeed)
        this.velocity.limit(this.maxSpeed)
        this.acceleration.mult(0)
        this.edgeLoop();
    }



    //display the boid each frame
    show(){
        const size = map(this.energy,0,1000,2,5)
        strokeWeight(map(this.lifespan,0,6000,18,2));
        stroke(`rgba(255,255,255,${map(this.energy,0,1000,0,255)})`);
        point(this.position.x,this.position.y);
        strokeWeight(map(this.energy,0,1000,1,2));
        stroke("purple")
        let arrowVector = this.velocity.copy().normalize().mult(size);
        line(this.position.x,this.position.y,this.position.x+(arrowVector.x),this.position.y+(arrowVector.y));
        stroke("white")
        text(this.generation,this.position.x,this.position.y-10)
    }
}