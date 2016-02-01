class EmptyHouseBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "player", text: "player_emptyhouse" },
  ];

  awake() {
    super.awake();
    if (this.actor.getName() === "Go Away House") {
      this.dialogs = [
        { name: "player", text: "player_goawayhouse_1" },
        { name: "goawayhouse", text: "goawayhouse_1" },
        { name: "player", text: "player_goawayhouse_2" }
      ];
    }
  }
}
Sup.registerBehavior(EmptyHouseBehavior);
