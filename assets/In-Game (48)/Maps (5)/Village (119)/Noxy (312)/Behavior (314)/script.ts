class NoxyBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "deliveryBoy", text: "deliveryBoy_didYouOrder" },
    { name: "player", text: "deliveryBoy_nope" },
    { name: "deliveryBoy", text: "deliveryBoy_anyway" },
    { name: "player", text: "deliveryBoy_thatWasNice" },
  ];

  ticks = -1;

  awake() {
    super.awake();
    if (NoxyBehavior.noxyHasLeft) this.actor.destroy();
  }

  interact() {
    if (NoxyBehavior.noxyHasLeft && Game.playerBehavior.activeInteractable == null) return;

    if (this.currentText === 3 && !NoxyBehavior.noxyHasLeft) {
      // Increase max health and restore full health to the player
      Game.playerBehavior.addHeart();
      Game.playerBehavior.updateHealth(PlayerBehavior.maxHealth);
      Sup.Audio.playSound("In-Game/Maps/Village/Noxy/Power Up");

      // Noxy fades away
      this.ticks = 0;
      NoxyBehavior.noxyHasLeft = true;
    }
    
    super.interact();
    if (this.currentText === 1) this.actor.spriteRenderer.setAnimation("Burger");
    if (this.currentText === 2) this.actor.spriteRenderer.setAnimation("Idle");
    if (this.currentText === 3) this.actor.spriteRenderer.setAnimation("Burger");
  }

  update() {   
    if (this.ticks === -1) return;
    
    if (this.ticks < NoxyBehavior.fadeOutTicks) {
      this.ticks++;
      
      const opacity = Sup.Math.lerp(1, 0, this.ticks/NoxyBehavior.fadeOutTicks);
      this.actor.spriteRenderer.setOpacity(opacity);
      this.actor.getChild("Shadow").spriteRenderer.setOpacity(opacity);
    }
    
    if (this.ticks >= NoxyBehavior.fadeOutTicks && Game.playerBehavior.activeInteractable !== this) {
      this.actor.destroy();
    }
  }
}
Sup.registerBehavior(NoxyBehavior);

namespace NoxyBehavior {
  export let noxyHasLeft = false;
  export const fadeOutTicks = 120;
}