namespace Utils {
  
  export enum Directions { Right, Up, Left, Down }
  
  export function getAngleFromDirection(direction: Directions) { return direction * Math.PI / 2; }
  export function getDirectionFromDirection(velocity: Sup.Math.Vector2) {
    let angle = velocity.angle();
    
    if (angle > Math.PI / 4 && angle < Math.PI * 3 / 4) return Directions.Up;
    else if (angle >= Math.PI * 3 / 4 || angle <= -Math.PI * 3 / 4) return Directions.Left;
    else if (angle >= -Math.PI / 4 && angle <= Math.PI / 4) return Directions.Right;
    else return Directions.Down;
  }
}