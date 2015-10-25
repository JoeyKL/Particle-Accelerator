function newTurretEntity(world, x, y) {
    var ret = newCircleEntity(world, x, y, 15);
    ret.ID = 'turret';
    ret.cannon = newCannon([{direction: -Math.PI/12, template:{radius: 7, hue: 210, speed: 10}},
                            {direction: Math.PI/12, template:{radius: 7, hue: 210, speed: 10}},
                            {direction: 0, template:{radius: 9, hue: 240, speed: 10}}]);
    ret.cooldown = 0;
    ret.cooltime = 150;
    ret.behaviors.push({condition: function(){return mouse.down && this.cooldown <= 0},
                        actions: [function(){this.cannon.fire(this.world, this.position.x, this.position.y,
                                             getDirection(this.position.x, this.position.y, mouse.x, mouse.y) )},
                                  function(){this.cooldown = this.cooltime;}] });
    ret.behaviors.push({actions: [function(deltaTime){this.cooldown = Math.max(this.cooldown-deltaTime, 0)},function(){var lightness = Math.floor(this.cooldown*256/this.cooltime);lightness = 256-lightness;this.color = 'rgb('+lightness+', ' +lightness+', '+lightness+')'}] } );
    return ret;
}

function newCannon(bullets) {
    var ret = {
        bullets: bullets,
        fire: function(world, x, y, dir){
            for(var i = 0; i < this.bullets.length; i++) {
                newBulletEntity(world, x, y, dir + this.bullets[i].direction, this.bullets[i].template);
            }
        }
    };
    return ret;
}

function newBulletEntity(world, x, y, dir, template) {
    var ret = newCircleEntity(world, x, y, template.radius);
    addMotion(ret);
    addOffScreenDeath(ret);
    ret.ID = 'bullet';
    ret.color = 'hsl('+template.hue+', 70%, 50%)';
    ret.velocity.xSpeed = 1;
    ret.velocity.ySpeed = 1;
    ret.velocity.direction = dir;
    ret.velocity.speed = template.speed;
    
    return ret;
}

function newEnemyEntity(world, x, y, turret) {
    var ret = newCircleEntity(world, x, y, 10);
    addMotion(ret);
    addPhysics(ret);
    addUniversalGravity(ret, 10);
    ret.ID = 'enemy';
    ret.color = 'white';
    ret.velocity.xSpeed = 1;
    ret.velocity.ySpeed = 1;
    ret.velocity.direction = getDirection(ret.position.x, ret.position.y, turret.position.x, turret.position.y);
    ret.velocity.speed = 4;
    ret.behaviors.push({condition: collidesWith(function(){return this.ID == 'turret'}),
                        actions: [destroy, function(){this.world.turret.radius-=0.5}]});
    ret.behaviors.push({condition: collidesWith(function(){return this.ID == 'bullet'}),
                        action: destroy});
    return ret;
}
