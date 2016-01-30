class EyeEnemyBehavior extends EnemyBehavior {
  awake() {
    Game.enemies.push(this);
    this.position = this.actor.getLocalPosition().toVector2();
    
    this.moveSpeed = 0.1;
  }
  
  behavior() {
    
    // Movement
    if (Game.playerBehavior == null || Game.playerBehavior.health <= 0 || this.hitTimer > 0) {
      return;
    }
    
    const playerPos = Game.playerBehavior.position;
    
    if (this.position.distanceTo(playerPos) > this.moveDistance) {
      this.direction.x = Game.playerBehavior.position.x - this.position.x;
      this.direction.y = Game.playerBehavior.position.y - this.position.y;

      this.velocity.set(this.direction.x, this.direction.y);

      if (this.velocity.x !== 0 || this.velocity.y !== 0) {
        this.velocity.normalize().multiplyScalar(this.moveSpeed);
        //this.direction = Utils.getDirectionFromDirection(this.velocity);
        //this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
      } else {
        //this.actor.spriteRenderer.setAnimation(`Idle ${Utils.Directions[this.direction]}`);
      }
      
      this.actor.arcadeBody2D.setVelocity(this.velocity);
    }
    else {
      // attack ...
      if (this.hitTimer <= 0 && Game.playerBehavior.hitTimer <= 0) { 
        // ... if not being attacked by player and player not already attacked
        
        // play attack animation that takes time to run, like the player's axe
        Game.playerBehavior.hit();
      }
    }
  }
}
Sup.registerBehavior(EyeEnemyBehavior);
