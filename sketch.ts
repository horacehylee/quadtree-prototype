import {
  circleCollided,
  findCircleCollisionPoint
} from "./src/collisionDetector";
import { Circle } from "./src/circle";
import { QuadTree } from "./src/quadtree";
import { Rect } from "./src/rect";
import { Point } from "./src/point";

let paused = false;

const sketch = (p: p5) => {
  p.preload = () => {};

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.draw();
  };

  const padding = 30;
  const size = Math.min(p.windowWidth, p.windowHeight) - padding * 2;
  // const size = 200;

  const boundary = new Rect(
    p.windowWidth / 2,
    p.windowHeight / 2,
    size / 2,
    size / 2
  );
  const quadTree = new QuadTree(boundary, 2);
  const circles: Circle[] = [];

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    const numOfCircles = 200;
    for (let i = 0; i < numOfCircles; i++) {
      const x = p.windowWidth / 2 - size / 2 + Math.random() * size;
      const y = p.windowHeight / 2 - size / 2 + Math.random() * size;
      const point = new Point(x, y);
      const radius = 10;
      const speedMin = 0.05;
      const speed = 0.15;
      const velocity = new Point(
        (speedMin + Math.random() * speed) * (Math.random() < 0.5 ? -1: 1 ),
        (speedMin + Math.random() * speed) * (Math.random() < 0.5 ? -1: 1 )
      );
      const circle = new Circle(point, radius, velocity);
      quadTree.insert(circle);
      circles.push(circle);
    }
  };

  // p.mouseClicked = () => {
  //   const x = p.mouseX;
  //   const y = p.mouseY;
  //   const point = new Point(x, y);
  //   quadTree.insert(point);
  //   circles.push(new Circle(point, 10));
  // };

  p.keyPressed = () => {
    if (p.keyCode == 32) {
      if (paused) {
        p.loop();
      } else {
        p.noLoop();
      }
      paused = !paused;
    }
  };

  p.draw = () => {
    // === Update ===
    const dt = 1000 / p.frameRate();
    if (dt < 100) {
      quadTree.reset();

      for (let circle of circles) {
        circle.preUpdate(dt);
      }

      for (let circle of circles) {
        quadTree.insert(circle, circle.nextPosition);
      }

      for (let circle of circles) {
        circle.update(quadTree, dt);
      }
    }

    // === Render ===

    // Frame
    p.background(0, 0, 0);
    p.stroke(255);
    p.strokeWeight(2);
    p.noFill();
    p.rect(
      p.windowWidth / 2 - size / 2,
      p.windowHeight / 2 - size / 2,
      size,
      size
    );

    // QuadTree
    quadTree.show(p);

    for (let circle of circles) {
      circle.render(p);
    }

    // p.stroke(0, 255, 0);
    // p.strokeWeight(1);
    // p.fill(0, 255, 0);
    // p.ellipse(p.mouseX, p.mouseY, 20, 20);

    // for (let circle of circles) {
    //   const collided = circleCollided(
    //     circle.position,
    //     new Point(p.mouseX, p.mouseY),
    //     circle.radius,
    //     10
    //   );
    //   if (collided) {
    //     const collidedPoint = findCircleCollisionPoint(
    //       circle.position,
    //       new Point(p.mouseX, p.mouseY),
    //       circle.radius,
    //       10
    //     );
    //     console.log(collidedPoint);
    //     p.stroke(255, 0, 0);
    //     p.fill(255, 0, 0);
    //     p.ellipse(collidedPoint.x, collidedPoint.y, 10, 10);
    //   }
    // }

    // Selection
    // const selection = new Rect(p.mouseX, p.mouseY, 100, 100);
    // let count = 0;
    // quadTree.retrive(selection, point => {
    //   p.stroke(0, 255, 0);
    //   p.strokeWeight(1);
    //   p.fill(0, 255, 0);
    //   p.ellipse(point.position.x, point.position.y, 20, 20);
    //   count++;
    // });
    // p.noFill();
    // p.rect(
    //   selection.x - selection.hw,
    //   selection.y - selection.hh,
    //   selection.hw * 2,
    //   selection.hh * 2
    // );

    // FPS Counter
    p.textSize(16);
    p.stroke(255);
    p.fill(255);
    p.text(Math.floor(p.frameRate()) + " FPS", 0, 0, 200, 200);
  };
};

new p5(sketch);
