import { Rect } from "./rect";
import { Point } from "./point";

export interface IEntity {
  position: Point;
}

export class QuadTree {
  boundary: Rect;
  capacity: number;
  entities: IEntity[];

  splitted: boolean;
  northEast: QuadTree;
  northWest: QuadTree;
  southEast: QuadTree;
  southWest: QuadTree;

  constructor(boundary: Rect, capacity: number) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.entities = [];
    this.splitted = false;
  }

  insert(entity: IEntity, overridePosition?: Point) {
    const position = overridePosition? overridePosition : entity.position;
    if (!this.boundary.contains(position)) {
      return;
    }
    if (this.entities.length < this.capacity) {
      this.entities.push(entity);
      return;
    }
    if (!this.splitted) {
      this.split();
    }
    this.northEast.insert(entity, position);
    this.northWest.insert(entity, position);
    this.southEast.insert(entity, position);
    this.southWest.insert(entity, position);
  }

  split() {
    this.splitted = true;

    const subHw = this.boundary.hw / 2;
    const subHh = this.boundary.hh / 2;

    this.northEast = new QuadTree(
      new Rect(this.boundary.x + subHw, this.boundary.y + subHh, subHw, subHh),
      this.capacity
    );
    this.northWest = new QuadTree(
      new Rect(this.boundary.x - subHw, this.boundary.y + subHh, subHw, subHh),
      this.capacity
    );
    this.southEast = new QuadTree(
      new Rect(this.boundary.x + subHw, this.boundary.y - subHh, subHw, subHh),
      this.capacity
    );
    this.southWest = new QuadTree(
      new Rect(this.boundary.x - subHw, this.boundary.y - subHh, subHw, subHh),
      this.capacity
    );
  }

  retrive(range: Rect, callback: (entity: IEntity) => void) {
    // let found = [];
    if (!this.boundary.intersects(range)) {
      // return found;
      return;
    }
    for (let entity of this.entities) {
      if (range.contains(entity.position)) {
        // found.push(point);
        callback(entity);
      }
    }
    if (this.splitted) {
      this.northEast.retrive(range, callback);
      this.northWest.retrive(range, callback);
      this.southEast.retrive(range, callback);
      this.southWest.retrive(range, callback);
    }
    // return found;
  }

  reset() {
    this.entities.length = 0;
    this.northEast = null;
    this.northWest = null;
    this.southEast = null;
    this.southWest = null;
    this.splitted = false;
  }

  show(p5: p5) {
    p5.strokeWeight(1);
    p5.noFill();
    p5.stroke(255, 0, 0);
    p5.rect(
      this.boundary.x - this.boundary.hw,
      this.boundary.y - this.boundary.hh,
      this.boundary.hw * 2,
      this.boundary.hh * 2
    );
    if (this.splitted) {
      this.northEast.show(p5);
      this.northWest.show(p5);
      this.southEast.show(p5);
      this.southWest.show(p5);
    }
  }
}
