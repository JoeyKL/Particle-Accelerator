function newGameWorld(width, height) {
    var ret = newWorld(width, height);
    ret.spawnEnemy = function() {
        var dir = Math.random() * Math.PI*2;
        var pos = {x: this.turret.position.x + Math.cos(dir)*500, y: this.turret.position.y + Math.sin(dir)*500}
        newEnemyEntity(this, pos.x, pos.y, this.turret);
    };

    ret.turret = newTurretEntity(ret, width/2, height/2);
    ret.behaviors.push({condition: function(){return Math.random()<0.05}, action:ret.spawnEnemy});
    return ret;
}