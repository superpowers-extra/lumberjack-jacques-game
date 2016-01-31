class DoctorBehavior extends SimpleDialogBehavior {
  dialogs = [
    { name: "doctor", text: "doctor_1" },
    { name: "player", text: "player_doctor_1" },
    { name: "doctor", text: "doctor_2" },
    { name: "player", text: "player_doctor_2" },
    { name: "doctor", text: "doctor_3" },
  ];

  velocity: Sup.Math.Vector2;

  onFinish() {
    const seat = Sup.getActor("Reading Seat");
    const seatPos = seat.getPosition().toVector2();
    seatPos.y -= 0.5;
    // this.velocity = seat.getPosition().toVector2();
    // this.velocity.subtract(this.actor.getPosition().toVector2());
    // this.velocity.normalize().multiplyScalar(0.1);
    
    const moveTween = new Sup.Tween(this.actor, (this.actor.getPosition().toVector2() as any))
    .to(seatPos, 2000)
    .onUpdate((pos:any)=>{
      this.actor.setX(pos.x);
      this.actor.setY(pos.y);
    })
    .start();
  }

  update() {
    if (this.velocity != null) {
      
    }
  }
}
Sup.registerBehavior(DoctorBehavior);
