type Hand = { actor: Sup.Actor; initialPosition: Sup.Math.Vector2; position: Sup.Math.Vector2; };

class BettyJollyEnemyBehavior extends Sup.Behavior implements Enemy {
  
  private triggered = false;
  
  private state: BettyJollyEnemyBehavior.States;
  private changeStateTimer: number;
  
  position: Sup.Math.Vector2;

  private neckActor: Sup.Actor;
  
  private idleTimer = 0;
  private headActor: Sup.Actor;
  private headPosition: Sup.Math.Vector2;
  
  private tongueActor: Sup.Actor;
  private tongueAngle = 0;

  private leftShoulderActor: Sup.Actor;
  private leftShoulderPosition: Sup.Math.Vector2;
  private rightShoulderActor: Sup.Actor;
  private rightShoulderPosition: Sup.Math.Vector2;

  private attackState: BettyJollyEnemyBehavior.AttackStates;
  private attackTimer: number;
  private attackPosition: Sup.Math.Vector2;
  private shadowActor: Sup.Actor;
  
  health = 20;
  radius = 2;
  private hitTimer = 0;
  
  private bloodCount = 0;
  private opacity = 1;

  hands: { [name: string] : Hand } = {};
  
  awake() {
    Game.enemies.push(this);
    
    this.position = this.actor.getLocalPosition().toVector2();
    this.neckActor = this.actor.getChild("Neck");
    this.headActor = this.actor.getChild("Head");
    this.headPosition = this.headActor.getLocalPosition().toVector2();
    
    this.tongueActor = this.headActor.getChild("Tongue").setVisible(false);
    
    this.leftShoulderActor = this.actor.getChild("Left Shoulder");
    this.leftShoulderPosition = this.leftShoulderActor.getLocalPosition().toVector2();
    this.rightShoulderActor = this.actor.getChild("Right Shoulder");
    this.rightShoulderPosition = this.rightShoulderActor.getLocalPosition().toVector2();
    
    this.shadowActor = this.actor.getChild("Shadow");
    this.shadowActor.setVisible(false);
    
    let leftHandActor = this.actor.getChild("Left Hand");
    let initialLeftHandPosition = leftHandActor.getLocalPosition().toVector2();
    let leftHandPosition = initialLeftHandPosition.clone();
    this.hands["Left"] = { actor: leftHandActor, initialPosition: initialLeftHandPosition, position: leftHandPosition };
    
    let rightHandActor = this.actor.getChild("Right Hand");
    let initialRightHandPosition = rightHandActor.getLocalPosition().toVector2();
    let rightHandPosition = initialRightHandPosition.clone();
    this.hands["Right"] = { actor: rightHandActor, initialPosition: initialRightHandPosition, position: rightHandPosition };
    
    this.setIdle();
  }

  start() { Sup.getActor("Markers").destroy(); }
  
  update() {
    if (this.state === BettyJollyEnemyBehavior.States.Dying) {
      this.opacity *= 0.985;
      this.neckActor.spriteRenderer.setOpacity(this.opacity);
      this.headActor.spriteRenderer.setOpacity(this.opacity);
      this.tongueActor.spriteRenderer.setOpacity(this.opacity);
      this.leftShoulderActor.spriteRenderer.setOpacity(this.opacity);
      this.rightShoulderActor.spriteRenderer.setOpacity(this.opacity);
      this.hands["Left"].actor.spriteRenderer.setOpacity(this.opacity);
      this.hands["Right"].actor.spriteRenderer.setOpacity(this.opacity);
      return;
    }
    
    this.idleTimer += 1;
    if (this.state !== BettyJollyEnemyBehavior.States.TongAttacking)
      this.headActor.setLocalPosition(this.headPosition).moveLocal(0.2 * Math.sin(this.idleTimer / 10), 0.15 * Math.sin(this.idleTimer / 8));

    this.leftShoulderActor.setLocalPosition(this.leftShoulderPosition).moveLocal(0.1 * Math.sin(this.idleTimer / 12 + 1), 0.08 * Math.sin(this.idleTimer / 10 + 1));
    this.rightShoulderActor.setLocalPosition(this.rightShoulderPosition).moveLocal(0.08 * Math.sin(this.idleTimer / 10 + 2), 0.1 * Math.sin(this.idleTimer / 7));
    
    if (this.state !== BettyJollyEnemyBehavior.States.LeftAttacking)
      this.hands["Left"].actor.setLocalPosition(this.hands["Left"].position).moveLocal(0.2 * Math.sin(this.idleTimer / 15 - 1), 0.23 * Math.sin(this.idleTimer / 20));
    if (this.state !== BettyJollyEnemyBehavior.States.RightAttacking)
      this.hands["Right"].actor.setLocalPosition(this.hands["Right"].position).moveLocal(0.2 * Math.sin(this.idleTimer / 15 - 1), 0.23 * Math.sin(this.idleTimer / 20));
    
    
    if (!this.triggered) {
      if (Game.playerBehavior.position.y > 8) this.triggered = true;
      return;
    }
    
    if (this.hitTimer > 0) {
      this.hitTimer -= 1;
      if (this.hitTimer === 0) {
        this.headActor.spriteRenderer.setColor(1, 1, 1);
      }
    }
    
    switch (this.state) {
      case BettyJollyEnemyBehavior.States.Idle:
        this.changeStateTimer -= 1;
        if (this.changeStateTimer === 0) this.setAttack();
        break;
      
      case BettyJollyEnemyBehavior.States.LeftAttacking:
        this.doAttack(this.hands["Left"]);
        break;

      case BettyJollyEnemyBehavior.States.RightAttacking:
        this.doAttack(this.hands["Right"]);
        break;
        
      case BettyJollyEnemyBehavior.States.TongAttacking:
        this.attackTimer -= 1;
        
        if (this.attackState === BettyJollyEnemyBehavior.AttackStates.Waiting) {
          if (this.attackTimer === 0) {
            this.attackState = BettyJollyEnemyBehavior.AttackStates.Shaking;
            this.attackTimer = BettyJollyEnemyBehavior.vibrateDuration;
          }
        
      } else if (this.attackState === BettyJollyEnemyBehavior.AttackStates.Shaking) {
          this.headActor.setLocalPosition(this.headPosition)
            .moveLocalX(Sup.Math.Random.float(-BettyJollyEnemyBehavior.tongueVibrateOffset, BettyJollyEnemyBehavior.tongueVibrateOffset))
            .moveLocalY(Sup.Math.Random.float(-BettyJollyEnemyBehavior.tongueVibrateOffset, BettyJollyEnemyBehavior.tongueVibrateOffset));
          
          if (this.attackTimer === 0) {
            this.attackState = BettyJollyEnemyBehavior.AttackStates.Acting;
            this.attackTimer = BettyJollyEnemyBehavior.tongueAttackDuration;
          }
          
        } else {
          this.tongueActor.setVisible(true);
          this.tongueAngle += BettyJollyEnemyBehavior.tongueSpeed;
          this.tongueActor.setLocalEulerZ(this.tongueAngle);

          let diff = Game.playerBehavior.position.clone().subtract(this.position);
          if (diff.length() < BettyJollyEnemyBehavior.tongueAttackRange && Math.abs(Sup.Math.wrapAngle(diff.angle() - (this.tongueAngle - Math.PI / 2))) < 0.1)
            Game.playerBehavior.hit(Utils.getDirectionFromVector(diff))

          if (this.attackTimer === 0) {
            this.headActor.spriteRenderer.setSprite("In-Game/Entities/Enemies/Betty Jolly/Head Close");
            this.tongueActor.setVisible(false);
            this.setIdle();
          }
        }
        break;
    }
  }

  setIdle() {
    this.state = BettyJollyEnemyBehavior.States.Idle;
    
    this.changeStateTimer = 90;
  }

  setAttack() {
    this.attackState = BettyJollyEnemyBehavior.AttackStates.Moving;
    
    this.attackTimer = 0;
    this.attackPosition = Game.playerBehavior.position.clone().subtract(this.position);
    this.attackPosition.add(Sup.Math.Random.float(-0.2, 0.2), Sup.Math.Random.float(-0.2, 0.2));
    this.attackPosition.y += BettyJollyEnemyBehavior.attackOffset;
    
    let random = Math.random();
    if (random < 0.2) {
      this.state = BettyJollyEnemyBehavior.States.TongAttacking;
      this.attackState = BettyJollyEnemyBehavior.AttackStates.Shaking;
      this.attackTimer = BettyJollyEnemyBehavior.tongueVibrateDuration;
      this.tongueAngle = Sup.Math.Random.float(-Math.PI, Math.PI);
      this.headActor.spriteRenderer.setSprite("In-Game/Entities/Enemies/Betty Jolly/Head Open");
      
    } else if (random > 0.6) {
      if (this.hands["Right"].position.distanceTo(this.attackPosition) > BettyJollyEnemyBehavior.triggerAttackRange) this.setIdle();
      else {
        this.state = BettyJollyEnemyBehavior.States.RightAttacking;
        this.attackState = BettyJollyEnemyBehavior.AttackStates.Moving;
      }

    } else {
      if (this.hands["Left"].position.distanceTo(this.attackPosition) > BettyJollyEnemyBehavior.triggerAttackRange) this.setIdle();
      else {
        this.state = BettyJollyEnemyBehavior.States.LeftAttacking;
        this.attackState = BettyJollyEnemyBehavior.AttackStates.Moving;
      }
    }
  }

  doAttack(activeHand: Hand) {
    switch (this.attackState) {
      case BettyJollyEnemyBehavior.AttackStates.Moving:
        activeHand.position.lerp(this.attackPosition, 0.15);
        activeHand.actor.setLocalPosition(activeHand.position);

        if (activeHand.position.distanceTo(this.attackPosition) < 0.2) {
          this.attackState = BettyJollyEnemyBehavior.AttackStates.Shaking;
          activeHand.actor.spriteRenderer.setSprite("In-Game/Entities/Enemies/Betty Jolly/Hand Close");
        }
        break;

      case BettyJollyEnemyBehavior.AttackStates.Shaking:
        activeHand.actor.setLocalPosition(activeHand.position)
          .moveLocalX(Sup.Math.Random.float(-BettyJollyEnemyBehavior.vibrateOffset, BettyJollyEnemyBehavior.vibrateOffset))
          .moveLocalY(Sup.Math.Random.float(-BettyJollyEnemyBehavior.vibrateOffset, BettyJollyEnemyBehavior.vibrateOffset));

        this.attackTimer += 1;
        if (this.attackTimer > BettyJollyEnemyBehavior.vibrateDuration) {
          this.attackState = BettyJollyEnemyBehavior.AttackStates.Acting;
          this.shadowActor.setVisible(true);
          this.shadowActor.setLocalPosition(this.attackPosition).moveLocalY(-BettyJollyEnemyBehavior.attackOffset);
        }
        break;

      case BettyJollyEnemyBehavior.AttackStates.Acting:
        let targetY = this.attackPosition.y - BettyJollyEnemyBehavior.attackOffset;
        activeHand.position.y = Sup.Math.lerp(activeHand.position.y, targetY, 0.2);
        activeHand.actor.setLocalY(activeHand.position.y);

        let scale = 1 - (activeHand.position.y - targetY) / BettyJollyEnemyBehavior.attackOffset;
        scale *= BettyJollyEnemyBehavior.shadowMaxScale;
        this.shadowActor.setLocalScale(scale, scale, 1);

        if (activeHand.position.y - targetY < 0.3) {
          Game.cameraBehavior.vibrate(40, 0.2);
          
          let diff = activeHand.position.clone().add(this.position).subtract(Game.playerBehavior.position);
          if (diff.length() < BettyJollyEnemyBehavior.attackRange) {
            Game.playerBehavior.hit(Utils.Directions.Down, true);
          }
          
          this.attackState = BettyJollyEnemyBehavior.AttackStates.Waiting;
          this.attackTimer = 0;
        }
        break;
        
      case BettyJollyEnemyBehavior.AttackStates.Waiting:
        this.attackTimer += 1;
        if (this.attackTimer > BettyJollyEnemyBehavior.waitDelay) {
          this.attackState = BettyJollyEnemyBehavior.AttackStates.Cooldown;
          this.shadowActor.setVisible(false);
          activeHand.actor.spriteRenderer.setSprite("In-Game/Entities/Enemies/Betty Jolly/Hand Open");
        }
        break;
        
      case BettyJollyEnemyBehavior.AttackStates.Cooldown:
        if (activeHand.position.distanceTo(activeHand.initialPosition) > 0.3) {
          activeHand.position.lerp(activeHand.initialPosition, 0.04);
          activeHand.actor.setLocalPosition(activeHand.position);
        } else {
          this.setIdle();
        }
        break;
    }
  }
  
  hit(direction: Utils.Directions) {
    this.health -= 1;
    
    if (this.health === 0) {
      this.state = BettyJollyEnemyBehavior.States.Dying;
      Game.playerBehavior.autoPilot = true;
      Game.playerBehavior.clearMotion();
      
      Fade.start(Fade.Direction.Out, { duration: 2000, delay: 400 }, () => { Sup.loadScene("Menus/The End/Scene"); });
      
      let spawnBlood = () => {
        if (this.actor.isDestroyed()) return;
        
        let bloodActor = Sup.appendScene("In-Game/FX/Blood/Prefab", this.actor)[0];
        bloodActor.spriteRenderer.setSprite("In-Game/FX/Blood/Big Hit");
        bloodActor.setLocalPosition(Sup.Math.Random.float(-5, 5), Sup.Math.Random.float(-5, 5), 2);
        Sup.setTimeout(BettyJollyEnemyBehavior.bloodSpawnInterval, spawnBlood)
      }
      spawnBlood();

    } else {
      this.headActor.spriteRenderer.setColor(3, 3, 3);
      this.hitTimer = BettyJollyEnemyBehavior.hitDelay;
    }
  }
}
Sup.registerBehavior(BettyJollyEnemyBehavior);

namespace BettyJollyEnemyBehavior {
  export enum States { Idle, LeftAttacking, RightAttacking, TongAttacking, Hurting, Dying };
  export enum AttackStates { Moving, Shaking, Acting, Waiting, Cooldown };
  
  export const attackOffset = 3;
  export const attackRange = 3;
  export const triggerAttackRange = 8;
  export const shadowMaxScale = 4;
  export const vibrateOffset = 0.5;
  export const vibrateDuration = 10;
  export const waitDelay = 45;
  
  export const tongueVibrateOffset = 0.2;
  export const tongueVibrateDuration = 20;
  export const tongueSpeed = 0.2;
  export const tongueAttackDuration = 200;
  export const tongueAttackRange = 6;
  
  export const hitDelay = 15;
  
  export const bloodSpawnInterval = 200; // milliseconds
}
