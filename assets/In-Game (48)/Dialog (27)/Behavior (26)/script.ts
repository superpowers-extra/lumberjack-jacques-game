class DialogBehavior extends Sup.Behavior {
  animatedText: AnimatedTextBehavior;

  private speaker = "";
  private portraitRenderer: Sup.SpriteRenderer;
  
  awake() {
    Game.dialogBehavior = this;
    
    this.portraitRenderer = this.actor.getChild("Portrait").spriteRenderer;
    this.animatedText = this.actor.getChild("Text").getBehavior(AnimatedTextBehavior);
  }
  
  show(speakerID: string, text: string) {
    this.actor.setVisible(true);
    
    this.speaker = Game.getText(speakerID);
    const portrait = Sup.get(`In-Game/Dialog/Portraits/${speakerID}`, Sup.Sprite, { ignoreMissing: true });
    this.portraitRenderer.setSprite(portrait);

    this.animatedText.setText(`${this.speaker.toUpperCase()}: ${text}`, this.speaker.length + 2);
  }
  
  hide() {
    this.actor.setVisible(false);
    this.animatedText.clear();
  }
}
Sup.registerBehavior(DialogBehavior);
