// Game handler
var Game = {
    
    settings : {
        spawnrate : 5,
        selectedGun : null,
        maxHealth : 10
    },
    
    Start : function() {
        
        Game._health = Game.settings.maxHealth; // Don't use like this. Usage: Game.Health(+3);
        Game.Health(0);
        
        // Create stats
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild( stats.domElement );
        createjs.Ticker.addEventListener("tick", stats.update);
        
        // Create our base
        var base = new createjs.Container();
        Game.root.addChild(base);
        LoadImage("base_test.png", function() {
            var i = new createjs.Bitmap(this)
            i.x = i.y = -110;
            base.addChild(i);
        });
        base.behaviour = new MonoBehaviour();
        
        base.behaviour.Update = function() {
            base.rotation += 0.5;
        }
        
        base.x = Game.root.canvas.width * 0.5;
        base.y = Game.root.canvas.height * 0.5;
        base.range = 100;
        
        Game.objects.base = base;
        
        var hitEffect = new createjs.Shape();
        hitEffect.alpha = 0;
        hitEffect.graphics.beginFill("#F00").drawRect(0,0,Game.root.canvas.width,Game.root.canvas.height);
        hitEffect.visible = false;
        Game.root.addChild(hitEffect);
        Game.objects.hitEffect = hitEffect;
        hitEffect.behaviour = new MonoBehaviour();
        hitEffect.behaviour.Update = function() {
            if(!hitEffect.behaviour.started) return;
            hitEffect.alpha -= 0.05;
            if(hitEffect.alpha <= 0.05) {
                hitEffect.behaviour.started = false;
                hitEffect.visible = false;;
                hitEffect.alpha = 0;
            }
        }
        hitEffect.behaviour.Start = function() {
            hitEffect.behaviour.started = true;
            hitEffect.visible = true;
            hitEffect.alpha = 0.7;
        }
        
        // Create decorations
        var bg = new createjs.Shape();
        bg.graphics.beginFill("#ffd42a").drawRect(0, 0, Game.root.canvas.width, Game.root.canvas.height);
        Game.root.addChildAt(bg,0);
        // Stars
        for(var i = 0; i < 10; i++) {
            new Particle_Star(1);
            new Particle_Star(2);
        }
        
        bg.addEventListener("click", function(e) {
            var hit = Game.root.getObjectUnderPoint(e.stageX, e.stageY);
            if(hit.id == Game.objects.base.children[0].id) {
                Game.Pause(true);
            }
            // Do the harlem shake here
            if(Game.settings.selectedGun) Game.settings.selectedGun.Shoot({x: e.stageX, y:e.stageY});
        });
        
        Game.objects.guns.push(new Gun("blast", Weapon_Blast, 2, true));
        Game.objects.guns.push(new Gun("blast2", Weapon_Blast, 2, true));
        Game.objects.guns.push(new Gun("radiusblast", Weapon_Blast, 2, false));
        $("#guns a:first").click();
        
        // Create enemy
        Game.spawner.Spawn();
        
    },
    
    Pause : function(on) {
        Game.Health(0);
        createjs.Ticker.setPaused(on);
        if(on) {
            $("#fader").fadeTo("slow",0.3);
            $("#paused").fadeIn();
        } else {
            $("#fader, #paused").fadeOut();
        }
        return;
    },
    
    Health : function(value) {
        
        Game._health = Math.max(0, Game._health + value);
        if(value < 0) {
            // Do something awful
            Game.objects.hitEffect.behaviour.Start();
        }
        var p = Game._health/Game.settings.maxHealth;
        var c = p*255;
        $("#health .bar").css({width: (p*100)+"%"});
        $("#health").stop().stop().stop().fadeIn().delay(2000).fadeOut();
        
        if(Game._health <= 0) {
            // Game Over
            createjs.Ticker.setPaused(true);
            $("#fader").fadeTo("slow", 0.8);
            $("#gameover").fadeIn();
            $("#score").text(Math.floor(createjs.Ticker.getTime(false) / 100) / 10)
        }
        
    },
    
    objects : {
        enemies : [],
        guns : []
    },
    
    spawner : {
        
        numSpawned : 0,
        
        Spawn : function(spawnNew) {
            if(!createjs.Ticker.getPaused()) {
                spawnNew = (spawnNew != false);
                
                var spawnPos = {x: 0, y: 0};
                
                spawnPos.x = Random.Bool() ? -100 : Game.root.canvas.width + 100;
                spawnPos.y = Random.Range(0, Game.root.canvas.height);
                
                Game.spawner.numSpawned++;
                var e = new Enemy(Game.spawner.numSpawned, spawnPos, 10);
                Game.objects.enemies.push(e);
                
                // Here's the actual game logic. BEWARE!!!!!
                switch(Game.spawner.numSpawned) {
                    case 1:
                    case 18:
                    case 62:
                        spawnrate = 5;
                        break;
                    case 3:
                    case 17:
                    case 60:
                    case 81:
                    case 170:
                    case 171:
                    case 172:
                    case 192:
                    case 222:
                    case 252:
                    case 272:
                    case 282:
                        Game.spawner.Spawn(true); // Start 2 simutaneous
                        break;
                    case 4:
                    case 30:
                    case 100:
                        spawnrate = 3;
                        break;
                    case 7:
                    case 36:
                    case 130:
                        Game.spawner.Spawn(false); // Spawn extra guys
                        break;
                    case 12:
                    case 40:
                    case 120:
                        spawnrate = 2;
                        break;
                }
            }
            // Set new spawn
            if(spawnNew) setTimeout(Game.spawner.Spawn, Game.settings.spawnrate * 1000 * (Math.random() + 0.5));
        }
        
    }
    
}