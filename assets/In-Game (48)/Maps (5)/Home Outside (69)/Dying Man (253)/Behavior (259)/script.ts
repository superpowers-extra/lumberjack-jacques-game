class DyingManBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "dyingPeasant_whatsGoingOn" },
    { name: "dyingPeasant", text: "dyingPeasant_argh" },
    { name: "player", text: "dyingPeasant_whatsGoingOn2" },
    { name: "dyingPeasant", text: "dyingPeasant_help" },
    { name: "dyingPeasant", text: "dyingPeasant_help2" },
    { name: "player", text: "dyingPeasant_ok" },
    { name: "player", text: "dyingPeasant_ok2" }
  ];

  afterDialogs = [
    { name: "player", text: "dyingPeasant_wontMove" }
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
