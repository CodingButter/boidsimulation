var flock,food,enemies,totalEnemies,totalFood,totalBoids,mouse,maxGeneration;

function setup(){
    //textFont('roboto');
    textSize(40);
    textAlign(CENTER, CENTER);
    totalBoids = 120;
    totalEnemies = 10;
    totalFood=32;
    enemies = new Array(totalEnemies).fill(0).map(()=>new Shark());
    flock = new Array(totalBoids).fill(0).map(()=>new Boid())
    food = new Array(totalFood).fill(0).map(()=>new Food());
    mouse = {
        position:createVector()
    }
    createCanvas(windowWidth,windowHeight)
}

function renderStats(){
    var stats = []
    text(`Boids:${flock.length}`,10,20);
    text(`maxGeneration:${maxGeneration}`,10,40)
    Object.keys(flock[0]).map((k,i)=>{
            var values = flock.filter((boid)=>!isNaN(boid[k]))
            if(values.length>0)stats.push(`${k}:${Math.floor(100*(values.map((boid)=>boid[k]).reduce((a,i)=>a+i)/flock.length))/100}`)
    });
    stats.forEach((k,i)=>text(k,10,i*20+60))
}

function draw(){
    
    if(flock.length<3)location.href=`?maxGeneration=${maxGeneration}`;
    maxGeneration = flock.map(({generation})=>generation).sort().reverse()[0]
    
    mouse.position.x = mouseX;
    mouse.position.y = mouseY;
    background("black");
    flock.forEach((boid)=>{
        
        if(boid.breed>150){
            if(boid.partner && boid.partner.sex==1 && boid.sex==0 && boid.lifespan<4800 && boid.partner.lifespan<4800){
                boid.energy-=500;
                flock.push(Boid.splice(boid,boid.partner));
                flock.push(Boid.splice(boid,boid.partner));
                boid.breed=0;
            }
           
        }
        boid.update(flock,[mouse,...enemies],food);
        boid.show();
    })
    flock.filter(boid=>boid.dead).forEach((boid)=>{
        flock.splice(flock.indexOf(boid),1);
    })
    enemies.forEach((enemy)=>{
        enemy.update(flock,[],flock);
        enemy.show();
    });
    food.forEach((f)=>{
        f.show();
    })
    if(flock.length>=3)renderStats();
}