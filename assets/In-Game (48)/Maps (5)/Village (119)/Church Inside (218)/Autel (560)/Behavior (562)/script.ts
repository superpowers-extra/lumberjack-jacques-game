class AutelBehavior extends InteractableBehavior {
  start() {
    if (PlayerBehavior.inventory["Rifle"].isActive) this.actor.spriteRenderer.setAnimation("Autel");
  }
  
  interact() {
    if (PlayerBehavior.inventory["Rifle"].isActive || Game.currentGoal !== Game.Goals.Shotgun) return;
    
    Game.setGoal(Game.Goals.Boss);
    this.actor.spriteRenderer.setAnimation("Autel");
    PlayerBehavior.addToInventory("Rifle");
    
    // Allow leaving
    Sup.getActor("Markers").getChild("Village").getBehavior(TeleportBehavior).enabled = true;
    Sup.getActor("Limits").getChild("Bottom Right").arcadeBody2D.setSize(10, 1);
  }
}
Sup.registerBehavior(AutelBehavior);
