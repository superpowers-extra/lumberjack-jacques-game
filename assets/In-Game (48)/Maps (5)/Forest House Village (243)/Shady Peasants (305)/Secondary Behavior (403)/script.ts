class SecondaryShadyPeasantBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "shadyPeasant", text: "shadyPeasant_justLookingForBerries" },
  ];

  afterDialogs = [
    { name: "shadyPeasant", text: "shadyPeasant_goAway" },
    { name: "player", text: "shadyPeasant_wowRude" },
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
Sup.registerBehavior(SecondaryShadyPeasantBehavior);
