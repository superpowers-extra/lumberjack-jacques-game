class MinePathDoorBehavior extends Sup.Behavior {
  
  static doorOpened = false;
  
  awake() {
    if (BulletBehavior.doorOpened) this.actor.destroy();
  }
}
Sup.registerBehavior(MinePathDoorBehavior);
