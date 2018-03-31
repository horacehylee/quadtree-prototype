import { circleCollided, findCircleCollisionPoint } from "./collisionDetector";
import { QuadTree, IEntity } from "./quadtree";
import { Point } from "./point";
import { Rect } from "./rect";

export class Circle implements IEntity {
  position: Point;
  nextPosition: Point;
  velocity: Point;
  radius: number;

  collidedEntities: IEntity[];
  collisionRangeSize: number = 30;

  constructor(position: Point, radius: number, velocity: Point) {
    this.position = position;
    this.nextPosition = position;
    this.radius = radius;
    this.velocity = velocity;
    this.collidedEntities = [];
  }

  preUpdate(dt: number) {
    this.collidedEntities.length = 0;
    this.nextPosition = new Point(
      this.position.x + this.velocity.x * dt,
      this.position.y + this.velocity.y * dt
    );
  }

  update(quadTree: QuadTree, dt: number) {
    // if (this.velocity.x == 0 && this.velocity.y == 0) {
    //   return;
    // }

    const collisionRange = new Rect(
      this.nextPosition.x,
      this.nextPosition.y,
      this.collisionRangeSize,
      this.collisionRangeSize
    );
    quadTree.retrive(collisionRange, (otherCircle: Circle) => {
      if (otherCircle == this || otherCircle.collidedEntities.includes(this)) {
        return;
      }
      if (
        !circleCollided(
          this.nextPosition,
          otherCircle.nextPosition,
          this.radius,
          otherCircle.radius
        )
      ) {
        return;
      }
      const collisionPoint = findCircleCollisionPoint(
        this.nextPosition,
        otherCircle.position,
        this.radius,
        otherCircle.radius
      );

      const temp = new Point(this.velocity.x, this.velocity.y);
      this.velocity.x = otherCircle.velocity.x;
      this.velocity.y = otherCircle.velocity.y;
      otherCircle.velocity.x = temp.x;
      otherCircle.velocity.y = temp.y;
      this.collidedEntities.push(otherCircle);
      otherCircle.collidedEntities.push(this);
    });

    if (!quadTree.boundary.contains(this.nextPosition)) {
      if (
        this.nextPosition.x >= quadTree.boundary.x + quadTree.boundary.hw ||
        this.nextPosition.x < quadTree.boundary.x - quadTree.boundary.hw
      ) {
        this.velocity.x *= -1;
      }

      if (
        this.nextPosition.y >= quadTree.boundary.y + quadTree.boundary.hh ||
        this.nextPosition.y < quadTree.boundary.y - quadTree.boundary.hh
      ) {
        this.velocity.y *= -1;
      }
    }

    this.position.x += this.velocity.x * dt;
    this.position.y += this.velocity.y * dt;
  }

  render(p5: p5, color?: p5.Color) {
    color = color ? color : 255;
    p5.stroke(color);
    p5.strokeWeight(1);
    p5.fill(color);
    p5.ellipse(
      this.position.x,
      this.position.y,
      this.radius * 2,
      this.radius * 2
    );

    p5.line(
      this.position.x,
      this.position.y,
      this.position.x + this.velocity.x * 200,
      this.position.y + this.velocity.y * 200
    );

    // const collisionRange = new Rect(
    //   this.nextPosition.x,
    //   this.nextPosition.y,
    //   this.collisionRangeSize,
    //   this.collisionRangeSize
    // );
    // p5.stroke(0, 255, 0);
    // p5.strokeWeight(1);
    // p5.fill(0, 255, 0);
    // p5.noFill();
    // p5.rect(
    //   collisionRange.x - collisionRange.hw,
    //   collisionRange.y - collisionRange.hh,
    //   collisionRange.hw * 2,
    //   collisionRange.hh * 2
    // );
  }
}
