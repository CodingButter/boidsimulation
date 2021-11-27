class Food{
    constructor(){
        this.place();
    }
    place(){
        this.position = createVector(random(windowWidth),random(windowHeight))
    }
    show(){
        strokeWeight(10);
        stroke("green");
        point(this.position.x,this.position.y);
    }
}