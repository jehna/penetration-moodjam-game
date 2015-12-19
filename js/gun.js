function Gun(name, bullet, speed, enabled) {
    
    var gun = this;
    
    var $link = $('<a class="btn btn-large"></a>').appendTo("#guns .btn-group");;
    $link.addClass("disabled");
    //else $link.addClass("active");
    
    // Select a gun
    $link.click(function() {
        if(!$link.is(".active")) {
            $(".active").removeClass("active");
            $link.addClass("active");
            Game.settings.selectedGun = gun;
        }
    });
    
    $link.append('<img src="images/'+name+'.png" />');
    
    var $loader = $('<div class="loadmeter"></div>').appendTo($link);
    
    
    LoadImage(name+'_ingame.png', function() {
        gun.image = this;
    });
    
    
    // Create loader
    this.loaded = 0;
    this.speed = speed;
    this.isLoading = false;
    this.startedLoading = -1;
    /*this.behaviour = new MonoBehaviour();
    this.behaviour.Update = function() {
        if(gun.isLoading) {
        }
    }*/
    this.CanShoot = function() {
        gun.isLoading = false;
        $loader.addClass("ready");
        $("#canvasID").css({cursor: 'crosshair'});
    }
    
    this.LoadAgain = function() {
        
        gun.isLoading = true;
        $loader.removeClass("ready");
        $("#canvasID").css({cursor: 'wait'});
        new Loader({x: Game.objects.base.x, y: Game.objects.base.y}, 20, gun.speed, gun.CanShoot);
        
    }
    
    // Shoot
    this.Shoot = function(to) {
        if(gun.isLoading) return;
        
        new bullet(to, gun.image);
        gun.LoadAgain();
        
        // Reduce load time to make game faster
        gun.speed *= 0.99;
        
    }
    
    this.Enable = function() {
        //gun.startedLoading = createjs.Ticker.getTime(false);
        $link.removeClass("disabled");
        gun.LoadAgain();
    }
    
    if(enabled) this.Enable();
    
}

function Weapon_Blast(to, image) {
    var t = this;
    var speed = 10;
    var invert = {x:1,y:1};
    
    var TOPLEFT = 180;
    var TOPRIGHT = 0;
    var BOTTOMLEFT = 180;
    var BOTTOMRIGHT = 0;
    
    // Create renderer
    this.renderer = new createjs.Container();
    this.renderer.x = Game.root.canvas.width * 0.5;
    this.renderer.y = Game.root.canvas.height * 0.5;
    this.range = image.width * 0.5;
    
    var i = new createjs.Bitmap(image);
    i.x = -image.width * 0.5;
    i.y = -image.height * 0.5;
    
    this.renderer.addChild(i);
    Game.root.addChild(this.renderer);
    
    var tgt = this.renderer.globalToLocal(to.x, to.y);
    var dir;
    var rotAmount = 90;
    if(tgt.x < 0 && tgt.y < 0) {
        dir = TOPLEFT;
        invert.x = -1;
        invert.y = -1;
    } else if(tgt.x >= 0 && tgt.y < 0) {
        dir = TOPRIGHT;
        invert.y = -1;
        rotAmount = -rotAmount;
    } else if(tgt.x < 0 && tgt.y >= 0) {
        invert.x = -1;
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
    t.renderer.rotation =  rot + dir;
    
    // Set start position to radius
    t.renderer.x += scale.x * invert.x * 90;
    t.renderer.y += scale.y * invert.y * 90;
    
    this.behaviour = new MonoBehaviour();
    this.behaviour.Update = function() {
        
        // TODO: change this to be lerped
        t.renderer.x += scale.x * speed * invert.x;
        t.renderer.y += scale.y * speed * invert.y;
        
        for(var i in Game.objects.enemies) {
            var e = Game.objects.enemies[i];
            var maxdist = e.range+ t.range;
            if(Transform.HitTest(e.renderer, t.renderer, maxdist)) {
                e.Die();
                t.Die();
                return;
            };
        }
        if(t.renderer.x < -100 || t.renderer.x > Game.root.canvas.width + 100 || t.renderer.y < -100 || t.renderer.y > Game.root.canvas.height + 100) {
            t.Die();
        };
        
        //t.renderer.getMatrix().appendTransform(10,10);
    }
    
    this.Die = function() {
        t.behaviour.Destroy();
        delete t.behaviour;
        t.renderer.parent.removeChild(t.renderer);
        delete t.renderer;  
        delete t;
    }
}