function Enemy(id, position, speed) {
    this.id = id;
    speed *= 0.01;
    
    var t = this;
    var startPos = position;
    
    this.renderer = new createjs.Shape();
    t.renderer.x = startPos.x;
    t.renderer.y = startPos.y;
    this.renderer.type = "Enemy";
    this.renderer.graphics.beginFill("black").drawCircle(0, 0, 5);
    this.range = 10;

    Game.root.addChild(this.renderer);
    
    this.behaviour = new MonoBehaviour();
    
    var targetPos = {x: Game.objects.base.x, y: Game.objects.base.y};
    
    this.behaviour.Update = function() {
        var p = this.Time();
        var currentPos = Vector2.Lerp(startPos, targetPos, p * speed);
        t.renderer.x = currentPos.x;
        t.renderer.y = currentPos.y;
        var maxdist = Game.objects.base.range + t.range;
        if(Transform.HitTest(t.renderer, Game.objects.base, maxdist)) {
            Game.Health(-1);
            t.Die();
        }
    }
    this.Die = function() {
        this.behaviour.Destroy();
        delete this.behaviour;
        
        for(var i = 0; i < 10; i++) {
            new Particle({x: t.renderer.x, y: t.renderer.y})
        }
        
        for(var i in t.trails) {
            t.trails[i].Die();
            delete t.trails[i];
        }
        
        this.renderer.parent.removeChild(this.renderer);
        delete this.renderer;
        
        Game.objects.enemies.splice(Game.objects.enemies.indexOf(t),1);
    }
    
    function Trail(parent, distance) {
        var t = this;
        
        this.renderer = new createjs.Shape();
        this.renderer.x = parent.x;
        this.renderer.y = parent.y;
        this.renderer.graphics.beginFill("rgba(0,0,0,"+(1-(distance*0.1))+")").drawCircle(0, 0, 5-(distance/2));
        Game.root.addChild(t.renderer);
        
        this.behaviour = new MonoBehaviour();
        this.behaviour.Update = function() {
            if(t.renderer == null) return;
            t.renderer.x += (parent.x-t.renderer.x)*0.3;
            t.renderer.y += (parent.y-t.renderer.y)*0.3;
        }
        
        this.Die = function() {
            t.behaviour.Destroy();
            delete t.behaviour;
            t.renderer.parent.removeChild(t.renderer);
            delete t.renderer;
            delete t;
        }
    }
    this.trails = [];
    var parent = this.renderer;
    for(var i = 0; i < 10; i++) {
        var trail = new Trail(parent, i);
        parent = trail.renderer;
        t.trails.push(trail);
    }
}