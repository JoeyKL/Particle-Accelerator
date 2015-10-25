//#### BEHAVIOR PACKAGES ####//
function addMotion(entity) {
    entity.velocity = {xSpeed: 0, ySpeed: 0};
    function updatePosition(deltaTime) {
        entity.position.x += entity.velocity.xSpeed;
        entity.position.y += entity.velocity.ySpeed;
    }
    Object.defineProperties(entity.velocity, {
        'direction': {get: function(){return Math.atan2(this.xSpeed, this.ySpeed)},
                      set: function(newDir){var oldSpeed = this.speed; this.xSpeed = oldSpeed*Math.cos(newDir); this.ySpeed = oldSpeed*Math.sin(newDir)},
                      enumerable: true},
        'speed': {get: function(){return Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2))},
                  set: function(newSpeed){var oldSpeed = this.speed; this.xSpeed*=newSpeed/oldSpeed; this.ySpeed*=newSpeed/oldSpeed},
                  enumerable: true}
    });
    entity.behaviors.push({action: updatePosition});
}

function addPhysics(entity, mass) {
    entity.mass = mass;
    entity.forces = [];
    
    function updateVelocity() {
        var calcedForces = this.forces.map(function(force){return force.call(this)}, this);
        var netForce = calcedForces.reduce(function(a,b,i,arr){return {xForce:a.xForce+b.xForce, yForce:a.yForce+b.yForce}}, {xForce: 0, yForce: 0})
        
        this.velocity.xSpeed += netForce.xForce / this.mass;
        this.velocity.ySpeed += netForce.yForce / this.mass;
    }
    
    entity.behaviors.push({action: updateVelocity});
}

function addOffScreenDeath(entity) {
    
    entity.behaviors.push({condition: offScreen, action: function(){this.destroy()}});
}

//#### CONDITIONS ####//
function collidesWith(condition) {
    return function() {
        for(var i = 0; i < this.world.entities.length; i++) {
            var entity = this.world.entities[i];
            if(condition.call(entity)) {
                if(collides(entity, this)) {
                    return true;
                }
            }
        }
        return false;
    }
}

function offScreen() {
    return this.rightmost < 0 || this.leftmost > this.world.width || this.bottommost < 0 || this.topmost > this.world.height;
}


//#### FORCES ####//
function addConstantGravity(entity, accel) {
    entity.forces.push(function(){return {xForce: accel.xAccel*this.mass, yForce: accel.yAccel*this.mass}})
}

function addUniversalGravity(entity, gravConstant) {
    entity.forces.push(function(){
        var netForce = {xForce: 0, yForce: 0};
        this.world.entities.forEach(function(entity){
            if(entity.mass && entity!=this) {
                var direction = getDirection(this.position.x,this.position.y,entity.position.x,entity.position.y);
                var distance = Math.max(getDistance(this.position.x,this.position.y,entity.position.x,entity.position.y), 20);
                var magnitude = gravConstant * this.mass * entity.mass / Math.pow(distance, 2);
                var force = {xForce: Math.cos(direction)*magnitude, yForce: Math.sin(direction)*magnitude};
                netForce.xForce += force.xForce;
                netForce.yForce += force.yForce;
            }
        }, this)
        return netForce;
    })
}

function addMagnatism(entity, charge, magConstant) {
    entity.charge = charge;
    
    entity.forces.push(function(){
        var netForce = {xForce: 0, yForce: 0};
        this.world.entities.forEach(function(entity){
            if(entity.charge && entity!=this) {
                var distance = Math.max(getDistance(this.position.x,this.position.y,entity.position.x,entity.position.y), 20);
                if(distance<150) {
                    var direction = getDirection(this.position.x,this.position.y,entity.position.x,entity.position.y);
                    var magnitude = -magConstant * this.charge * entity.charge / Math.pow(distance, 2);
                    var force = {xForce: Math.cos(direction)*magnitude, yForce: Math.sin(direction)*magnitude};
                    netForce.xForce += force.xForce;
                    netForce.yForce += force.yForce;
                }
            }
        }, this)
        return netForce;
    })
}

//utility
function getDirection(x1, y1, x2, y2) {
    return Math.atan2(y2-y1,x2-x1);
}

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(y2-y1,2) + Math.pow(x2-x1,2))
}

function collides(entityA, entityB) {
    return getDistance(entityA.position.x, entityA.position.y, entityB.position.x, entityB.position.y) < (entityA.radius + entityB.radius)
}