class PriestBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "player_coffin_nobottle" },
    { name: "priest", text: "coffin_nobottle" },
  ];

  awake() {
    if (PriestBehavior.coffinOpened === true) {
      this.actor.getChild("Coffin").destroy();
    }
    
    if (PlayerBehavior.inventory["Key"].isActive === true) {
      this.destroy();
      return;
    }
    
    super.awake();
    
    if (PlayerBehavior.inventory["Bottle"].isActive === true) {
      this.dialogs = [
        { name: "player", text: "player_coffin_withbottle" },
        { name: "priest", text: "coffin_withbottle" },
        { name: "player", text: "player_coffin_withbottle_1" },
        { name: "priest", text: "coffin_withbottle_1" },
        { name: "player", text: "player_coffin_withbottle_2" },
        { name: "priest", text: "coffin_withbottle_2" },        
      ];
    }
    
    
  }

  interact() {
    super.interact();
    if (PriestBehavior.coffinOpened === false) {
      const child = this.actor.getChild("Coffin");
      if (child != null) child.destroy();
      PriestBehavior.coffinOpened = true;
    }
  }
  
  onFinish() {
    if (PlayerBehavior.inventory["Bottle"].isActive === true && PlayerBehavior.inventory["Key"].isActive === false) {
      PlayerBehavior.removeFromInventory("Bottle");
      PlayerBehavior.addToInventory("Key");

      this.actor.spriteRenderer.setAnimation("HasBottle", false);
      const churchDoor = Sup.getActor("Church Door");
      if (churchDoor != null) {
        const b = churchDoor.getBehavior(ChurchDoorBehavior);
        if (b != null) b.playerGotDoorKey();
      }
    }
  }
}
Sup.registerBehavior(PriestBehavior);

namespace PriestBehavior {
  export let coffinOpened = false;
}
