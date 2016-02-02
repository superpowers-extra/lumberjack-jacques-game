class ChurchDoorBehavior extends SimpleDialogBehavior {
  static ChurchOpened = false;
  
  dialogs = [
    { name: "player", text: "church_nokey" },
  ];
  
  awake() {
    super.awake();
    if (ChurchDoorBehavior.ChurchOpened) {
      this.allowEntrance();
      return;
    }
    else if (PlayerBehavior.inventory["Key"].isActive === true) {
      this.playerGotDoorKey();
      // Sup.log("key", PlayerBehavior.inventory["Key"].isActive);
      
    }
  }

  interact() {
    if (this.currentText === 0) {
      if (this.dialogs[0].text === "church_nokey") {
        Sup.Audio.playSound("In-Game/Maps/Global/Houses/Church Cimentry/Locked Church Door", 1, {loop: false});
      }
      else if (this.dialogs[0].text === "church_key") {
        Sup.Audio.playSound("In-Game/Maps/Global/Houses/Church Cimentry/Opening Church Door", 1, {loop: false});
      }
    }
    super.interact();
  }

  // called from PriestBehavior
  playerGotDoorKey() {
    this.dialogs = [ { name: "player", text: "church_key" } ];
    // Sup.log("player got key", this.dialogs);
  }

  allowEntrance() {
    Sup.getActor("Markers").getChild("Village_Church Inside").addBehavior(TeleportBehavior, { direction: "Up" });
    this.actor.destroy();
  }

  onFinish() {
    Sup.log("finish church key", this.dialogs[0].text,  PlayerBehavior.inventory["Key"].isActive)
    if (this.dialogs[0].text === "church_key") {
      this.allowEntrance();
      ChurchDoorBehavior.ChurchOpened = true;
      PlayerBehavior.removeFromInventory("Key");
    }    
  }
}
Sup.registerBehavior(ChurchDoorBehavior);

