namespace Utils {
  
  export enum Directions { Right, Up, Left, Down }
  
  export function getOppositeDirection(direction: Directions) {
    switch (direction) {
      case Directions.Right: return Directions.Left;
      case Directions.Left: return Directions.Right;
      case Directions.Up: return Directions.Down;
      case Directions.Down: return Directions.Up;
    }
  }
  export function getAngleFromDirection(direction: Directions) { return direction * Math.PI / 2; }
  export function getDirectionFromVector(velocity: Sup.Math.Vector2) {
    let angle = velocity.angle();
    
    if (angle > Math.PI / 4 && angle < Math.PI * 3 / 4) return Directions.Up;
    else if (angle >= Math.PI * 3 / 4 || angle <= -Math.PI * 3 / 4) return Directions.Left;
    else if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) return Directions.Right;
    else return Directions.Down;
  }
  
  export function updateDepth(actor: Sup.Actor, y: number) { actor.setZ(-y / CameraBehavior.maxY); }
}