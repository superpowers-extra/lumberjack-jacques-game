class WaitressBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "waitress_hiThere" },
    { name: "waitress", text: "waitress_hiHandsome" },
    { name: "player", text: "waitress_whatsUp" },
    { name: "waitress", text: "waitress_storyCut" },
    { name: "player", text: "waitress_cutQuestionMark" },
    { name: "waitress", text: "waitress_shortJam" },
    { name: "player", text: "waitress_aJamQuestionMark" },
    { name: "waitress", text: "waitress_youWouldntUnderstand" }
  ];

  private finish = false;

  interact() {
    super.interact();
    if (this.currentText > 2 && this.finish === false) {
      Sup.log(this.currentText);
      if (this.currentText % 2 === 0) {
        this.actor.spriteRenderer.setAnimation("Idle");
      }
      else {
         this.actor.spriteRenderer.setAnimation("Drink");
      }
    }
  }
  
  onFinish() {
    this.finish = true;
    this.actor.spriteRenderer.setAnimation("Vomit");
    Sup.setTimeout(3000, ()=>{
      this.actor.spriteRenderer.setAnimation("Idle");
    });
  }
}
Sup.registerBehavior(WaitressBehavior);
