class ClosedEnemyBehavior extends EnemyBehavior {
  
  start() { this.setIdle(); }
  
  behavior() {
    const diff = Game.playerBehavior.position.clone().subtract(this.position);
    const distance = diff.length();
    
    if (this.changeStateTimer > 0) this.changeStateTimer -= 1;
    
    switch (this.state) {
      case EnemyBehavior.States.Idle:
        if (this.changeStateTimer === 0) {
          if (distance < EnemyBehavior.chargeDistance) this.setCharging();
          else this.setWalking();
        }
        break;

      case EnemyBehavior.States.Walking:
      case EnemyBehavior.States.Cooldown:
        if (this.changeStateTimer === 0) this.setIdle();
        break;

      case EnemyBehavior.States.Charging:
        if (distance <= EnemyBehavior.attackDistance) {
          this.setAttacking(diff);

        } else if (this.changeStateTimer === 0 || distance > EnemyBehavior.passiveDistance) {
          this.aggressive = false;
          this.initialPosition.copy(this.position);
          this.setIdle();

        } else {
          this.velocity.copy(diff).normalize().multiplyScalar(EnemyBehavior.chargeSpeed);
          this.direction = Utils.getDirectionFromVector(this.velocity);
          this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);
        }
        break;

      case EnemyBehavior.States.Attacking:
        if (!this.actor.spriteRenderer.isAnimationPlaying()) {
          this.setCooldown();
        } else if (this.actor.spriteRenderer.getAnimationFrameTime() / this.actor.spriteRenderer.getAnimationFrameCount() > 0.7 && distance <= EnemyBehavior.hitRange) {
          Game.playerBehavior.hit(this.direction);
        }
        break;

      case EnemyBehavior.States.Hurting:
        this.doHurting();
        break;
        
      case EnemyBehavior.States.Dying:
        if (!this.actor.spriteRenderer.isAnimationPlaying()) this.actor.destroy();
        break;
    }
  }
  
  setWalking() {
    this.state = EnemyBehavior.States.Walking;
    
    const diff = this.initialPosition.clone().subtract(this.position);
    if (diff.length() > EnemyBehavior.maxInitialPositionDistance) {
      this.velocity.copy(diff);
      
    } else {
      let angle = Sup.Math.Random.float(-Math.PI, Math.PI);
      this.velocity.setFromAngle(angle);
    }
    
    this.velocity.normalize().multiplyScalar(EnemyBehavior.walkSpeed);
    this.direction = Utils.getDirectionFromVector(this.velocity);

    this.actor.spriteRenderer.setPlaybackSpeed(0.8);
    this.actor.spriteRenderer.setAnimation(`Walk ${Utils.Directions[this.direction]}`);

    this.resetChangeTimer();
  }
  
  setCharging() {
    this.state = EnemyBehavior.States.Charging;
    
    this.actor.spriteRenderer.setPlaybackSpeed(1);

    this.resetChangeTimer();
  }
  
  setAttacking(diff: Sup.Math.Vector2) {
    this.state = EnemyBehavior.States.Attacking;

    this.direction = Utils.getDirectionFromVector(diff);
    this.velocity.set(0, 0);
    
    this.actor.spriteRenderer.setPlaybackSpeed(1);
    this.actor.spriteRenderer.setAnimation(`Attack ${Utils.Directions[this.direction]}`, false);
  }
}
Sup.registerBehavior(ClosedEnemyBehavior);
