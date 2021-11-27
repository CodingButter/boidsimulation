class Shark extends Boid{
    constructor(){
        super();
        this.biteRadius = 30;
        this.maxSpeed = 2
        this.steeringWeight= 1;
        this.alignmentWeight = .0007;
        this.cohesionWeight = .001;
        this.separationWeight = .001;
        this.perceptionRadius = 300;
        this.enemyRepelWeight = -.08
        this.randomWeight = .01
    }
    calculateSteering(neighbors,enemies,food){

       
        let steeringForce = createVector();
        let alignmentForce = createVector();
        let cohesionForce = createVector();
        let separationForce = createVector();
        let randomForce = p5.Vector.random2D();
        if(neighbors.length>0){
        
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
        

        return steeringForce.mult(this.steeringWeight)
    }
    update(boids){
        super.update(boids,boids,boids);
        boids.forEach((boid)=>{
            if(boid.position.dist(this.position)<this.biteRadius)boid.dead=true;
        })
    }
    show(){
        const size = 20
        strokeWeight(25);
        stroke("grey");
        point(this.position.x,this.position.y);
        strokeWeight(2);
        stroke("white")
        let arrowVector = this.velocity.copy().normalize().mult(size);
        line(this.position.x,this.position.y,this.position.x+(arrowVector.x),this.position.y+(arrowVector.y));
    }
}