class WaitressBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "player_waitress_1" },
    { name: "waitress", text: "waitress_1" },
    { name: "player", text: "player_waitress_2" },
    { name: "waitress", text: "waitress_2" },
    { name: "player", text: "player_waitress_3" },
    { name: "waitress", text: "waitress_3" },
    { name: "player", text: "player_waitress_4" },
    { name: "waitress", text: "waitress_4" },
    { name: "player", text: "player_waitress_5" },
    { name: "waitress", text: "waitress_5" },
  ];

  interact() {
    super.interact();
    if (this.currentText > 2 && this.currentText < 10) {
      if (this.currentText % 2 === 0) {
        this.actor.spriteRenderer.setAnimation("Idle");
      }
      else {
         this.actor.spriteRenderer.setAnimation("Drink");
      }
    }
  }

  onFinish() {
    this.actor.spriteRenderer.setAnimation("Vomit");
    Sup.setTimeout(3000, ()=>{
      this.actor.spriteRenderer.setAnimation("Idle");
    });
  }
}
Sup.registerBehavior(WaitressBehavior);
