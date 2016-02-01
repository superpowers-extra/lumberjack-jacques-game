class MaireEnemyBehavior extends EnemyBehavior {
  health = 1;
  deathTriggered = false;
  
  behavior() {
    if (this.state === EnemyBehavior.States.Dying && ! this.deathTriggered) {
      this.deathTriggered = true;
      
      Sup.getActor("Autel").spriteRenderer.setAnimation("Autel");
      PlayerBehavior.addToInventory("Rifle");
      
      // TODO: black fade out ?
    }
  }
}
Sup.registerBehavior(MaireEnemyBehavior);
