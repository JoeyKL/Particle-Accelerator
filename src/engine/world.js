function newWorld(width, height) {
    var ret = {
        width: width,
        height: height,
        
        entities: [],
        newEntities: [],
        oldEntities: [],
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
            
            for(var i = 0; i < this.entities.length; i++) {
                var entity = this.entities[i];
                if(entity && typeof entity.update === 'function') {
                    entity.update(deltaTime);
                }
            }
            
            this.oldEntities.forEach(function(entity){this.entities.remove(entity)}, this);
            this.oldEntities = [];
            
            this.newEntities.forEach(function(entity){this.entities.push(entity)}, this);
            this.newEntities = [];
            
        },
        
        render: function(ctx) {
            ctx.fillStyle = this.color || 'black';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            
            for(var i = 0; i < this.entities.length; i++) {
                var entity = this.entities[i];
                if(entity && typeof entity.render === 'function') {
                    entity.render(ctx);
                }
            }
        },
        
        addEntity: function(newEntity) {
            this.newEntities.push(newEntity);
        }, 
        
        destroyEntity: function(oldEntity) {
            this.oldEntities.push(oldEntity);
        }

    };
    
    
    
    return ret;
}
