class ShadyPeasantBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "shadyPeasant", text: "shadyPeasant_whereIsHe" },
    { name: "player", text: "shadyPeasant_whatsUp" },
    { name: "shadyPeasant", text: "shadyPeasant_nothingMuch" },
    { name: "player", text: "shadyPeasant_soundsWeird" },
    { name: "shadyPeasant", text: "shadyPeasant_yesSir" },
    { name: "player", text: "shadyPeasant_weirdGuy" }
  ];

  afterDialogs = [
    { name: "shadyPeasant", text: "shadyPeasant_leaveMeAlone" },
    { name: "player", text: "shadyPeasant_right" }
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

  update() {
    if (Sup.Math.Random.integer(0, 30) === 0) {
      this.actor.spriteRenderer.setAnimation(Sup.Math.Random.integer(1, 3).toString());
    }
  }

  onFinish() {
    this.dialogs = this.afterDialogs;
  }
}
Sup.registerBehavior(ShadyPeasantBehavior);
