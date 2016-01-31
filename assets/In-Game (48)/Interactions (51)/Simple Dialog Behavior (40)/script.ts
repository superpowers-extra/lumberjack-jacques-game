abstract class SimpleDialogBehavior extends InteractableBehavior {
  
  dialogs: { name: string; text: string; }[];
  currentText = 0;

  start() {
    this.position = this.actor.getPosition().toVector2();
  }

  interact() {
    if (Game.playerBehavior.activeInteractable == null) {
      this.currentText = 0;
      Game.playerBehavior.activeInteractable = this;
    }
    
    if (!Game.dialogBehavior.animatedText.isTextFullyDisplayed()) {
      Game.dialogBehavior.animatedText.progressToNextStop();
    } else if (this.currentText < this.dialogs.length) {
      Game.dialogBehavior.show(Game.getText(this.dialogs[this.currentText].name), Game.getText(this.dialogs[this.currentText].text));
      
      this.currentText++;
    } else {
      Game.dialogBehavior.hide();
      Game.playerBehavior.activeInteractable = null;
      
      this.onFinish();
    }
  }

  onFinish() {}
}
