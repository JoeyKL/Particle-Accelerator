function newParticleEntity(world, x, y, mass, charge) {
    var ret = newCircleEntity(world, x, y, mass);
    addMotion(ret);
    addPhysics(ret, mass);
    addUniversalGravity(ret, 2);
    addMagnatism(ret, charge, 100);
    ret.behaviors.push({condition: offScreen, action: function(){
        newParticleEntity(this.world, Math.random()*this.world.width, Math.random()*this.world.height, this.mass, this.charge);
        this.destroy();
    }});
    
    ret.behaviors.push({condition: function(){return this.world.particles.length>110}, action:function(){console.log("hunh?")}});

    switch(charge){
        case 1:
            ret.color = '#f22';
            break;
        case 0:
            ret.color = '#aaa';
            break;
        case -1:
            ret.color = '#22f';
            break;
    }
    
    ret.render = function(ctx) {
        this.world.entities.forEach(function(entity){
            if(entity!=this) {
                var distance = Math.max(getDistance(this.position.x,this.position.y,entity.position.x,entity.position.y), 20);
                
                if(distance<100) {
                    if(this.charge && entity.charge) {
                        var magnitude = 200*-this.charge * entity.charge / Math.pow(distance, 2);
                
                        ctx.strokeStyle = (magnitude<0)? 'rgba(0,128,0, '+ -magnitude +')':'rgba(128,0,31, '+ magnitude +')'
                        ctx.beginPath();
                
                        ctx.moveTo(this.position.x,this.position.y);
                        ctx.lineTo(entity.position.x, entity.position.y);
                        ctx.stroke();
                    }
                    
                    if(this.mass && entity.mass) {
                        var magnitude = 100*this.mass * entity.mass / Math.pow(distance, 2);
                
                        ctx.strokeStyle = 'rgba(63,63,63, '+ magnitude +')'
                        ctx.beginPath();
                
                        ctx.moveTo(this.position.x,this.position.y);
                        ctx.lineTo(entity.position.x, entity.position.y);
                        ctx.stroke();
                    }
                }
            }
        }, this);
        
        ctx.fillStyle = this.color || 'white';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    
    ret.world.particles.push(ret);
    return ret;
}

function newRandomParticleEntity(world, x, y) {
    var ret = newParticleEntity(world,Math.random()*world.width,Math.random()*world.height,Math.random()*1.5+1, Math.floor(Math.random()*3) -1);
    ret.velocity.xSpeed = 1;
    ret.velocity.speed = Math.random()*2;
    ret.velocity.direction = Math.random()*2*Math.PI;
    
    return ret;
}

function newGardenWorld(width, height) {
    var ret = newWorld(width, height);
    
    ret.particles = [];
    
    for(var i = 0; i<100; i++) {
        newRandomParticleEntity(ret);
    }
    
    ret.behaviors.push({condition:function(){return mouse.down},
                         action:function(){
                            var i = Math.floor(Math.random() * this.particles.length);
                            this.particles[i].destroy();
                            var particle = newParticleEntity(this,mouse.x,mouse.y,Math.random()*1.5+1, Math.floor(Math.random()*3)-1);
                            particle.velocity.xSpeed = 1;
                            particle.velocity.speed = Math.random()*2;
                            particle.velocity.direction = Math.random()*2*Math.PI;}
                         });
    ret.color = '#000';
    ret.destroyEntity = function(oldEntity){
        this.oldEntities.push(oldEntity);
        this.particles.remove(oldEntity);
    }
    return ret;
}

currentState = newWorldState(newGardenWorld(WIDTH, HEIGHT));

main();