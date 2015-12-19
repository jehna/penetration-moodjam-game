$(function() {
    // Create canvas
    $("#canvasID").attr("width", $(window).width()).attr("height", $(window).height());
    Game.root = new createjs.Stage("canvasID");
    createjs.Ticker.setFPS(50);
    
    Game.Start();
    
    createjs.Ticker.addEventListener("tick", function() {
        Game.root.update();
    });
});


function LoadImage(img, callback) {

var i = new Image();
i.onload = callback;
i.src = 'images/'+img;
    
}

var Random = {
    Range : function(from, to) {
        if(typeof to == "unidentified") {
            to = from;
            from = 0;
        }
        
        var diff = to-from;
        return from + parseInt(Math.random()*diff)
    },
    Bool : function() {
        return Math.random() < 0.5;
    }
}

var Mathf = {
    Lerp : function(a, b, t) {
        return a + t * (b - a);
    }
}

var Vector2 = {
    Lerp : function(a, b, t) {
        return {
            x: Mathf.Lerp(a.x, b.x, t),
            y: Mathf.Lerp(a.y, b.y, t)
        }
    }
    
}

var Transform = {
    LookAt : function(what, to, isLocal) {
        var TOPLEFT = 180;
        var TOPRIGHT = 0;
        var BOTTOMLEFT = 180;
        var BOTTOMRIGHT = 0;
        
        var tgt;
        if(isLocal) tgt = to;
        else tgt = what.globalToLocal(to.x, to.y);
        
        var dir;
        var rotAmount = 90;
        if(tgt.x < 0 && tgt.y < 0) {
            dir = TOPLEFT;
        } else if(tgt.x >= 0 && tgt.y < 0) {
            dir = TOPRIGHT;
            rotAmount = -rotAmount;
        } else if(tgt.x < 0 && tgt.y >= 0) {
            rotAmount = -rotAmount;
            dir = BOTTOMLEFT;
        } else if(tgt.x >= 0 && tgt.y >= 0) {
            dir = BOTTOMRIGHT;
        }
        
        var scale = {
            x: Math.abs(tgt.x)/(Math.abs(tgt.x)+Math.abs(tgt.y)),
            y: Math.abs(tgt.y)/(Math.abs(tgt.x)+Math.abs(tgt.y))
        }
        var rot = Math.asin(Math.abs(scale.y))*rotAmount;
        what.rotation =  rot + dir;
    },
    
    HitTest : function(from, to, distance) {
        var p = from.localToLocal(0, 0, to);
        return(p.x*p.x+p.y*p.y < distance*distance);
    }
}

/*function StartGame() {
    //Create a stage by getting a reference to the canvas
    stage = new createjs.Stage("canvasID");
    //Create a Shape DisplayObject.
    circle = new createjs.Container();
    //circle.graphics.beginFill("red").drawCircle(0, 0, 40);
    //Set position of Shape instance.
    circle.x = circle.y = 50;
    //Add Shape instance to stage display list.
    stage.addChild(circle);
    //Update stage will render next frame
    stage.update();

    var i = new Image();
    i.onload = function() {
        circle.addChild(new createjs.Bitmap(this));
    }
    i.src = "images/base.svg";

    //Update stage will re-nder next frame
    createjs.Ticker.addEventListener("tick", handleTick);
    
    document.addEventListener("keydown", function(c) {
        c.preventDefault();
        console.log("moi",c);
        console.log(stage.scaleX);
        stage.update();
    });
    
    document.addEventListener("mousemove", function(c) {
        stage.scaleX = stage.scaleY = 1 + (c.x/100);
        stage.x = 0 - (c.x/2);
    });
    
    function handleTick() {
     //Circle will move 10 units to the right.
        //circle.x += 10;
        //Will cause the circle to wrap back
        //if (circle.x > stage.canvas.width) { circle.x = 0; }
        stage.update();
    }
}

var stage;*/
