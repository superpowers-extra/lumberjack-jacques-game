class MassWineBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "tavern_basement_2" },
    { name: "player", text: "tavern_basement_3" },
  ];

  intro = true;

  awake() {
    if (MassWineBottle.bottlePickedUp === true) {
      this.actor.destroy();
      return;
    }
    Game.playerBehavior.autoPilot = true;
    Game.playerBehavior.clearMotion();
    
    super.awake();
  }

  start() {
    Sup.setTimeout(500, () => {
      Game.playerBehavior.autoPilot = false;
      Game.playerBehavior.activeInteractable = this;
      Game.dialogBehavior.show("player", Game.getText("tavern_basement_1"));
    });
  }

  interact() {
    if (this.intro) {
      this.intro = false;
      Game.dialogBehavior.hide();
      Game.playerBehavior.activeInteractable = null;
      return;
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