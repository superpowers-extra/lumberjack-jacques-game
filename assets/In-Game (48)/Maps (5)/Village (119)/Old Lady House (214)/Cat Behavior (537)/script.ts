class CatBehavior extends SimpleDialogBehavior {
  awake() {
    super.awake();
    if (this.actor.getName() === "Frog Cat") {
      this.dialogs = [ { name: "cat", text: "frogcat" } ];
    } else {
      this.dialogs = [ { name: "cat", text: `cat_${Sup.Math.Random.integer(1, 8)}` } ];
    }
  }
  
  interact() {
    if (this.actor.getName() != "Frog Cat") {
      this.dialogs = [ { name: "cat", text: `cat_${Sup.Math.Random.integer(1, 8)}` } ];
    }
    super.interact();
  }
}
Sup.registerBehavior(CatBehavior);
