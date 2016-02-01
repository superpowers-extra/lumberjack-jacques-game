class MassWineBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "tavern_basement_1" },
    { name: "player", text: "tavern_basement_2" },
    { name: "player", text: "tavern_basement_3" },
  ];

  awake() {
    if (MassWineBottle.bottlePickedUp === true) {
      this.actor.destroy();
      return;
    }
    super.awake();
  }

  start() {
    Sup.setTimeout(1000, ()=> {
      Game.playerBehavior.activeInteractable = this;
      this.interact();
      Game.playerBehavior.activeInteractable = null;
    });
  }

  interact() {
    if (Game.playerBehavior.activeInteractable == null) {
      this.currentText = 1;
      Game.playerBehavior.activeInteractable = this;
    }
    
    super.interact();
  }

  onFinish() {
    PlayerBehavior.addToInventory("Bottle");
    
    MassWineBottle.bottlePickedUp = true;
    this.actor.destroy();
  }
}
Sup.registerBehavior(MassWineBehavior);

namespace MassWineBottle {
  export let bottlePickedUp = false;
}