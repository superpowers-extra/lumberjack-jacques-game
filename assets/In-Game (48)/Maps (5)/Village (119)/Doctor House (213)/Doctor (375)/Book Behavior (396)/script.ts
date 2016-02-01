class BookBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "player_book" }
  ];

  awake() {
    if (BookBehavior.bookPickedUp === true) {
      this.destroy();
      return;
    }
    // super.awake(); // do not register in  Game.interactibles
  } 

  onFinish() {
    PlayerBehavior.addToInventory("Book");
    
    BookBehavior.bookPickedUp = true;
    this.destroy();
  }
}
Sup.registerBehavior(BookBehavior);

namespace BookBehavior {
  export let bookPickedUp = false;
}