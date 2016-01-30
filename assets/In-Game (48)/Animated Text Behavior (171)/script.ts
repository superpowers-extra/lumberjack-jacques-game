class AnimatedTextBehavior extends Sup.Behavior {
  charsPerLine = 32;
  framesPerChar = 1;

  private text = "";
  private letterIndex = 0;
  private timer = 0;

  start() {
    this.setText(this.actor.textRenderer.getText());
  }

  clear() {
    this.actor.textRenderer.setText("");
    this.letterIndex = 0;
    this.timer = 0;
    this.text = "";
  }

  reset() {
    this.letterIndex = 0;
    this.timer = 0;
    this.actor.textRenderer.setText("");
  }

  setText(text: string) {
    this.actor.textRenderer.setText("");
    
    const lines: string[] = [];
    
    let prevI = 0;
    for (let i = this.charsPerLine; prevI < text.length; i += this.charsPerLine) {
      while (i > 0 && i < text.length && text[i - 1] !== " ") i--;
      if (i > text.length) i = text.length;
      lines.push(text.slice(prevI, i));
      prevI = i;
    }
    
    this.text = lines.join("\n");
    this.letterIndex = 0;
  }

  isTextFullyDisplayed() { return this.letterIndex >= this.text.length; }
  fullyDisplayText() {
    this.timer = 0;
    this.letterIndex = this.text.length;
    this.actor.textRenderer.setText(this.text);
  }

  update() {
    if (this.letterIndex < this.text.length) {
      this.timer++;
      if (this.timer >= this.framesPerChar) {
        this.timer = 0;
        this.letterIndex++;
        this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex));
      }
    }
  }
}
Sup.registerBehavior(AnimatedTextBehavior);
