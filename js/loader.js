function Loader(position, size, loadSeconds, callback) {
    
    var t = this;
    this.renderer = new createjs.Shape();
    this.renderer.x = position.x;
    this.renderer.y = position.y;
    Game.root.addChild(this.renderer);
    
    this.phase = 1;
    
    this.behaviour = new MonoBehaviour();
    this.behaviour.Update = function() {
        p = this.Time() / loadSeconds;
        switch(t.phase) {
            case 1:
                t.renderer.graphics.clear().beginFill("#ffd42a").moveTo(0,0).arc(0,0,size,-Math.PI*0.5,Math.PI*2*p-Math.PI*0.5,false).lineTo(0,0);
                if(p >= 1) {
                    t.phase = 2;
                    callback();
                }
                break;
            case 2:
                t.renderer.scaleX = t.renderer.scaleY = p;
                t.renderer.alpha = 1.5 - p;
                if(p >= 1.5) t.phase = 3;
                break;
            case 3:
                t.Die();
                break;
        }
    }
    
    this.Die = function() {
        t.behaviour.Destroy();
        delete t.behaviour;
        t.renderer.parent.removeChild(t.renderer);
        delete t.renderer;
        delete t;
    }
    /*
    ctx.fillStyle = myColor[i];
    ctx.beginPath();
    ctx.moveTo(canvas.width/2,canvas.height/2);
    ctx.arc(canvas.width/2,canvas.height/2,canvas.height/2,lastend,lastend+(Math.PI*2*(data[i]/myTotal)),false);
    ctx.lineTo(canvas.width/2,canvas.height/2);
    ctx.fill();
    lastend += Math.PI*2*(data[i]/myTotal);*/
}