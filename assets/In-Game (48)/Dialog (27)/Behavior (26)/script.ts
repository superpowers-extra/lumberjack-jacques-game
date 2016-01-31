class DialogBehavior extends Sup.Behavior {
  animatedText: AnimatedTextBehavior;

  private speaker = "";
  private portraitRenderer: Sup.SpriteRenderer;
  
  awake() {
    Game.dialogBehavior = this;
    
    this.portraitRenderer = this.actor.getChild("Portrait").spriteRenderer;
    this.animatedText = this.actor.getChild("Text").getBehavior(AnimatedTextBehavior);
  }
  
  show(speaker: string, text: string) {
    this.actor.setVisible(true);
    
    this.speaker = speaker;
    // FIXME: restore if we have the potraits
    // this.portraitRenderer.setSprite(`In-Game/Dialog/Portraits/${speaker}`);

    this.animatedText.setText(`${this.speaker.toUpperCase()}: ${text}`, this.speaker.length + 2);
  }
  
  hide() {
    this.actor.setVisible(false);
    this.animatedText.clear();
  }
}
Sup.registerBehavior(DialogBehavior);
