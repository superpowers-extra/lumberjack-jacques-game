class ChefBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "chef", text: "chef_1" },
    { name: "player", text: "player_beer_1" },
    { name: "chef", text: "chef_2" },
    { name: "player", text: "player_beer_2" },
    { name: "chef", text: "chef_3" },   
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
