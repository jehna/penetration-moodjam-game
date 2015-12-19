function Particle(spawn) {
    
    var t = this;
    
    this.speed = 30;
    this.dir = {}
    this.dir.x = Math.random();
    this.dir.y = 1-this.dir.x;
    if(Random.Bool()) { this.dir.x-=1; this.dir.y-=1 }; // invert
    
    
    this.renderer = new createjs.Shape();
    this.renderer.graphics.beginFill("black").rect(0, 0, 15, 2);
    t.renderer.x = spawn.x;
    t.renderer.y = spawn.y;
    Game.root.addChild(this.renderer);
    
    var frameCount = 0;
    this.behaviour = new MonoBehaviour();
    this.behaviour.Update = function() {
        t.renderer.x += t.dir.x * t.speed;
        t.renderer.y += t.dir.y * t.speed;
        frameCount++;
        if(frameCount > 30) t.Die();
    }
    
    this.Die = function() {
        t.behaviour.Destroy();
        delete t.behaviour;
        t.renderer.parent.removeChild(t.renderer);
        delete t.renderer;
        delete t;
    }
    
    Transform.LookAt(this.renderer, this.dir, true);
    
}

function Particle_Star(num) {
    var t = this;
    this.speed = Math.random();
    this.maxY = Game.root.canvas.height + 100;
    
    this.renderer = new createjs.Container();
    LoadImage("star"+num+".png", function() {
        var i = new createjs.Bitmap(this)
        i.x = i.y = 0;
        t.renderer.addChild(i);
    });
    this.renderer.x = Random.Range(0, Game.root.canvas.width);
    this.renderer.scaleX = this.renderer.scaleY = Math.random();
    Game.root.addChildAt(this.renderer, 2);
    
    this.behaviour = new MonoBehaviour();
    this.currY = Random.Range(0,this.maxY);
    this.behaviour.Update = function() {
        t.currY = (t.currY + t.speed) % t.maxY;
        t.renderer.y = t.currY -50;
        t.renderer.rotation += t.speed*2;
    }
    
}