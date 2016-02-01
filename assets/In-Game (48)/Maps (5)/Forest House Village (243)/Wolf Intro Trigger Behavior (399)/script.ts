class WolfIntroTriggerBehavior extends InteractableBehavior {
  
  awake() {
    // NOTE: Not calling super.awake() here
    // because we don't want to register
    // in the list of interactables
    
    this.position = this.actor.getLocalPosition().toVector2();
    
    // Wolf trigger only appear when going to the village
    if (WolfIntroTriggerBehavior.spoken) {
      this.actor.destroy();
      return;
    }
  }
  
  onDestroy() {}
  
  interact() {
    if (Game.dialogBehavior.animatedText.isTextFullyDisplayed()) {
      Game.dialogBehavior.hide();
      Game.playerBehavior.activeInteractable = null;
      this.actor.destroy();
      
      WolfIntroTriggerBehavior.spoken = true;
    } else {
      Game.dialogBehavior.animatedText.progressToNextStop();
    }
  }
  
  update() {
    if (Game.playerBehavior.activeInteractable === this) return;
    
    if (Game.playerBehavior.position.x < this.position.x) {
      Sup.Audio.playSound("In-Game/Maps/Forest House Village/Howling");
      Game.playerBehavior.activeInteractable = this;
      Game.playerBehavior.clearMotion();
      Game.dialogBehavior.show("player", Game.getText("wolves_lookingAggressive"));
    }
  }
}
Sup.registerBehavior(WolfIntroTriggerBehavior);

namespace WolfIntroTriggerBehavior {
  export let spoken = false;
}
