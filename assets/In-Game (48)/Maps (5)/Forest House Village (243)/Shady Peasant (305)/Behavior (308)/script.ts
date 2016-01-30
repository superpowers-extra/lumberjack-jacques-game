class ShadyPeasantBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "shadyPeasant_whatsUp" },
    { name: "shadyPeasant", text: "shadyPeasant_nothingNuch" },
  ];

  afterDialogs = [
    { name: "player", text: "shadyPeasant_heh" }
  ];

  activated = false;
  
  awake() {
    super.awake();

    // Shady peasant only appears while we're going to the village
    if (Game.currentGoal !== Game.Goals.Village) {
      this.actor.destroy();
      return;
    }
  }

  onFinish() {
    this.dialogs = this.afterDialogs;
  }
}
Sup.registerBehavior(ShadyPeasantBehavior);
