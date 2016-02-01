class AnimatedTextBehavior extends Sup.Behavior {
  charsPerLine = 32;
  framesPerChar = 2;

  private text = "";
  private letterIndex = 0;
  private timer = 0;
  private blinkTimer = 0;
  private blinkDuration = 4;

  start() {
    this.setText(this.actor.textRenderer.getText());
  }

  clear() {
    this.actor.textRenderer.setText("");
    this.letterIndex = 0;
    this.timer = 0;
    this.text = "";
    this.blinkTimer = 0;
  }

  reset() {
    this.letterIndex = 0;
    this.timer = 0;
    this.actor.textRenderer.setText("");
    this.blinkTimer = 0;
  }

  setText(text: string, initialLetterIndex=0) {
    const lines: string[] = [];
    
    let lineStartIndex = 0;
    let currentLineLength = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === "|") continue;
      
      currentLineLength++;
      if (currentLineLength === this.charsPerLine) {
        let j = i;
        while (j > 0) {
          const char = text[j];
          if (char === " ") { j++; break; }
          j--;
        }
        
        lines.push(text.slice(lineStartIndex, j));
        currentLineLength = 0;
        lineStartIndex = i = j;
      }
    }
    if (currentLineLength > 0) lines.push(text.slice(lineStartIndex));
    
    /*for (let i = this.charsPerLine; prevI < text.length; i += this.charsPerLine) {
      while (i > 0 && i < text.length && text[i - 1] !== " ") i--;
      if (i > text.length) i = text.length;
      lines.push(text.slice(prevI, i));
      prevI = i;
    }*/
    
    this.text = lines.join("\n");
    this.text = this.text.replace(/\|/g, "||||||||||");
    this.letterIndex = initialLetterIndex;
    this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex).replace(/\|/g, ""));
    this.blinkTimer = 0;
  }

  isTextFullyDisplayed() { return this.letterIndex >= this.text.length; }
  progressToNextStop() {
    this.timer = 0;
    
    let nextStop = this.letterIndex;
    while (true) {
      nextStop = this.text.indexOf("|", this.letterIndex + 1);
      if (nextStop > this.letterIndex + 1 || nextStop === -1) break;
      this.letterIndex = nextStop;
    }
    
    if (nextStop === -1) this.letterIndex = this.text.length;
    else this.letterIndex = nextStop;
    
    this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex).replace(/\|/g, ""));
  }

  update() {
    if (this.letterIndex < this.text.length) {
      this.timer++;
      if (this.timer >= this.framesPerChar) {
        this.timer = 0;
        this.letterIndex++;
        this.blinkTimer = (this.blinkTimer + 1) % this.blinkDuration;
        this.actor.textRenderer.setText(this.text.slice(0, this.letterIndex).replace(/\|/g, "") + (this.blinkTimer < this.blinkDuration / 2 ? "_" : ""));
      }
    } else if (this.blinkTimer < this.blinkDuration / 2) {
      this.blinkTimer = this.blinkDuration;
      this.actor.textRenderer.setText(this.text.replace(/\|/g, ""));
    }
  }
}
Sup.registerBehavior(AnimatedTextBehavior);
