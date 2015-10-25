/**
 * Creates a basic entity with a position and an empty list of behaviors
 * @param {number} x - The horrizontal coordinate
 * @param {number} y - The vertical coordinate
 */
function newEntity(world, x, y) {
    var ret = {
        world: world,
        position: {x:x, y:y},
        
        behaviors: [],
        
        update: function(deltaTime) {
            for(var i = 0; i<this.behaviors.length; i++) {
                var behavior = this.behaviors[i];
                if(typeof behavior.condition === 'undefined' || behavior.condition.call(this)) {
                    if(typeof behavior.actions === 'object') {
                        for(var j = 0; j<behavior.actions.length; j++) {
                            behavior.actions[j].call(this, deltaTime);
                        }
                    }
                    else if(typeof behavior.action === 'function') {
                        behavior.action.call(this, deltaTime);
                    }
                }
            }
        },
        
        destroy: function() {
            this.world.destroyEntity(this);
        }
    }
    world.addEntity(ret)
    return ret;
}

/**
 * Creates an new rectangular entity with the specified x, y, width, and height
 * @param {number} x - The horrizontal coordinate (entity origin top left)
 * @param {number} y - The vertical coordinate (entity origin top left)
 * @param {number} w - The width of the rectangle
 * @param {number} h - The height of the rectangle
 */
function newRectEntity(world, x, y, w, h) {
    var ret = newEntity(world, x, y);
    
    ret.w = w;
    ret.h = h;
        
    ret.render = function(ctx) {
        ctx.fillStyle = this.color || 'white';
        ctx.fillRect(x, y, w, h)
    }
    Object.defineProperties(ret, {
        'leftmost': {get: function(){return this.position.x}},
        'rightmost': {get: function(){return this.position.x+this.w}},
        'topmost': {get: function(){return this.position.y}},
        'bottommost': {get: function(){return this.position.y+this.h}}});
    return ret;
}

/**
 * Creates an new circlular entity with the specified x, y, and radius
 * @param {number} x - The horrizontal coordinate (entity origin center)
 * @param {number} y - The vertical coordinate (entity origin center)
 * @param {number} r - The circle radius
 */
function newCircleEntity(world, x, y, r) {
    var ret = newEntity(world, x, y);
      
    ret.radius = r;
        
    ret.render = function(ctx) {
        ctx.fillStyle = this.color || 'white';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    };
    Object.defineProperties(ret, {
        'leftmost': {get: function(){return this.position.x-this.radius}},
        'rightmost': {get: function(){return this.position.x+this.radius}},
        'topmost': {get: function(){return this.position.y-this.radius}},
        'bottommost': {get: function(){return this.position.y+this.radius}}
    });
    return ret;
}