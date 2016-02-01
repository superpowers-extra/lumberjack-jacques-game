class ChefBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "chef", text: "chef_hi" },
    { name: "player", text: "chef_beerPlease" },
    { name: "chef", text: "chef_rightAway" },
    { name: "chef", text: "chef_thereYouGo" },
    { name: "player", text: "chef_emptyPlace" },
    { name: "chef", text: "chef_fineWine" },
    { name: "chef", text: "chef_chatty" },
  ];

  private beerIsServed = false;

  interact() {
    super.interact();
    
    if (this.currentText === 3) {
      this.actor.spriteRenderer.setAnimation("Beer", false);
      this.beerIsServed = true;
    }
  }

  update() {
    if (this.beerIsServed === true && this.actor.spriteRenderer.isAnimationPlaying() === false) {
      this.beerIsServed = false;
      this.actor.spriteRenderer.setAnimation("Worried");
    }
  }
}
Sup.registerBehavior(ChefBehavior);
