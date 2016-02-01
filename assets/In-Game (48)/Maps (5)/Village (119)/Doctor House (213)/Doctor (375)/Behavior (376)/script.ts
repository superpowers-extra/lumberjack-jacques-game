class DoctorBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "doctor", text: "doctor_1" },
    { name: "player", text: "player_doctor_1" },
    { name: "doctor", text: "doctor_2" },
    { name: "player", text: "player_doctor_2" },
    { name: "doctor", text: "doctor_3" },
  ];

  velocity: Sup.Math.Vector2;
  soundIsPlaying = false;

  update() {
    if (this.currentText === 1 && this.soundIsPlaying === false) {
      this.soundIsPlaying = true;
      Sup.Audio.playSound("In-Game/Maps/Village/Doctor House/Doctor/Sound", 0.4, {loop: false});
    }
  }

  onFinish() {
    const seat = Sup.getActor("Reading Seat");
    seat.setZ(-5)
    const seatPos = seat.getPosition().toVector2();
    seatPos.y -= 0.5;
    
    Game.playerBehavior.autoPilot = true;
    
    this.actor.setZ(0);
    
    const moveTween = new Sup.Tween(this.actor, (this.actor.getPosition().toVector2() as any))
    .to(seatPos, 2000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate((pos:any) => {
      this.actor.arcadeBody2D.warpPosition(pos);
    })
    .onComplete(() => {
      Game.playerBehavior.setDirection(Utils.Directions.Up, false);
      Game.playerBehavior.autoPilot = false;
      const bookBehavior = this.actor.getBehavior(BookBehavior);
      if (bookBehavior != null) bookBehavior.interact();
    })
    .start();
  }
}
Sup.registerBehavior(DoctorBehavior);
