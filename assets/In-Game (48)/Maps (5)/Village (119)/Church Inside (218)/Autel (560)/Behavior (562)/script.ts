class AutelBehavior extends InteractableBehavior {
  start() {
    if (PlayerBehavior.inventory["Rifle"].isActive) this.actor.spriteRenderer.setAnimation("Autel");
  }
  
  interact() {
    if (PlayerBehavior.inventory["Rifle"].isActive || Game.currentGoal !== Game.Goals.Boss) return;
    
    this.actor.spriteRenderer.setAnimation("Autel");
    PlayerBehavior.addToInventory("Rifle");
  }
}
Sup.registerBehavior(AutelBehavior);
