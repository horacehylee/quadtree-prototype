import { Point } from "./point";

export class Rect {
  x: number;
  y: number;
  hw: number;
  hh: number;

  constructor(x: number, y: number, hw: number, hh: number) {
    this.x = x;
    this.y = y;
    this.hw = hw;
    this.hh = hh;
  }

  contains(point: Point) {
    // console.log(point.y >= this.y - this.hh, point.y, this.y - this.hh)
    // console.log(point.y < this.y + this.hh, point.y, this.y + this.hh)
    return (
      point.x >= this.x - this.hw &&
      point.x < this.x + this.hw &&
      point.y >= this.y - this.hh &&
      point.y < this.y + this.hh
    );
  }

  intersects(rect: Rect) {
    return !(
      this.x + this.hw < rect.x - rect.hw ||
      this.x - this.hw > rect.x + rect.hw ||
      this.y + this.hh < rect.y - rect.hh ||
      this.y - this.hh > rect.y + rect.hh
    );
  }
}
