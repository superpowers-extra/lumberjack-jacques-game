abstract class InteractableBehavior extends Sup.Behavior {
  position: Sup.Math.Vector2;
  
  awake() {
    this.position = this.actor.getLocalPosition().toVector2();
    Game.interactables.push(this);
  }
  
  onDestroy() {
    let index = Game.interactables.indexOf(this);
    if (index !== -1) Game.interactables.splice(index, 1);
  }
  
  abstract interact();
}
