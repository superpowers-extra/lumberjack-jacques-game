class ChiomeBehavior extends SimpleDialogBehavior {
  dialogs = [
   { name: "chiome", text: "chiome_ouaf" },
  
 ];
    
  interact() {
    if (!Game.dialogBehavior.actor.getVisible()) {
      Sup.Audio.playSound("In-Game/Entities/Characters/Woaf Woaf");
    }
    super.interact();
  }

}
Sup.registerBehavior(ChiomeBehavior);
