class BloodBehavior extends Sup.Behavior {
  start() {
    this.actor.spriteRenderer.setAnimation("Animation", false);
  }

  update() {
    if (!this.actor.spriteRenderer.isAnimationPlaying()) this.actor.destroy();
  }
}
Sup.registerBehavior(BloodBehavior);
