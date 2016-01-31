class DyingManBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "dyingPeasant_whatsGoingOn" },
    { name: "dyingPeasant", text: "dyingPeasant_argh" },
    { name: "player", text: "dyingPeasant_whosThere" },
    { name: "dyingPeasant", text: "dyingPeasant_help" },
    { name: "dyingPeasant", text: "dyingPeasant_theyMad" },
    { name: "player", text: "dyingPeasant_thereThere" },
    { name: "dyingPeasant", text: "dyingPeasant_hurtsSoBad" },
  ];

  afterDialogs = [
    { name: "player", text: "dyingPeasant_whyDontYouComeIn" },
    { name: "dyingPeasant", text: "dyingPeasant_imDyingHere" },
    { name: "player", text: "dyingPeasant_noVeryTalkative" }
  ]

  activated = false;
  
  awake() {
    super.awake();

    if (Game.currentGoal === Game.Goals.None) {
      Game.playerBehavior.autoPilot = true;
      
      Sup.setTimeout(1000, () => {
        this.actor.spriteRenderer.setAnimation("Help", false);
        Sup.setTimeout(1000, () => { this.interact(); });
      })
    } else {
      this.dialogs = this.afterDialogs;
    }   
  }

  interact() {
    super.interact();
    if (this.currentText === 3) Game.playerBehavior.setDirection(Utils.Directions.Left, false);
  }

  onFinish() {
    if (Game.currentGoal === Game.Goals.None) {
      Game.setGoal(Game.Goals.Village);
      Game.playerBehavior.autoPilot = false;
      this.dialogs = this.afterDialogs;
    }
  }
}
Sup.registerBehavior(DyingManBehavior);
