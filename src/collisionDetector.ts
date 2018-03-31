import { Point } from "./point";

export const circleCollided = (
  positionA: Point,
  positionB: Point,
  radiusA: number,
  radiusB: number
) => {
  const dx = positionA.x - positionB.x;
  const dy = positionA.y - positionB.y;
  const radii = radiusA + radiusB;
  return dx * dx + dy * dy <= radii * radii;
};

export const findCircleCollisionPoint = (
  positionA: Point,
  positionB: Point,
  radiusA: number,
  radiusB: number
) => {
  const x =
    (positionA.x * radiusB + positionB.x * radiusA) / (radiusA + radiusB);
  const y =
    (positionA.y * radiusB + positionB.y * radiusA) / (radiusA + radiusB);
  return new Point(x, y);
};
