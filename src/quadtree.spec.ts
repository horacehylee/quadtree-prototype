import { QuadTree } from "./quadtree";
import { Rect } from "./rect";
import { Point } from "./point";

const createTestQuadTree = (capacity: number) => {
  const boundary = new Rect(0, 0, 100, 100);
  const quadTree = new QuadTree(boundary, capacity);
  return quadTree;
};

describe("Quadtree", () => {
  describe("insert", () => {
    it("should insert point into empty quadTree", () => {
      const quadTree = createTestQuadTree(1);
      const entity = { position: new Point(5, 10) };
      quadTree.insert(entity);

      expect(quadTree.entities).toEqual([entity]);
    });

    it("should not insert point if out of boundary", () => {
      const quadTree = createTestQuadTree(1);
      const p1 = { position: new Point(-100.1, 0) };
      const p2 = { position: new Point(100.1, 0) };
      const p3 = { position: new Point(0, -100.1) };
      const p4 = { position: new Point(0, 100.1) };

      quadTree.insert(p1);
      quadTree.insert(p2);
      quadTree.insert(p3);
      quadTree.insert(p4);

      expect(quadTree.entities).toEqual([]);
    });

    it("should split if inserting point to full quadtree", () => {
      const quadTree = createTestQuadTree(2);
      const p1 = { position: new Point(0, 0) };
      const p2 = { position: new Point(3, 3) };
      const p3 = { position: new Point(-3, -3) };

      quadTree.insert(p1);
      quadTree.insert(p2);
      quadTree.insert(p3);

      expect(quadTree.entities).toEqual([p1, p2]);
      expect(quadTree.southWest.entities).toEqual([p3]);
    });
  });

  describe("split", () => {
    it("should split into 4 quadrants", () => {
      const quadTree = createTestQuadTree(2);
      quadTree.split();

      expect(quadTree.northEast).not.toBeNull();
      expect(quadTree.northEast.capacity).toBe(2);
      expect(quadTree.northEast.boundary).toEqual(new Rect(50, 50, 50, 50));
      expect(quadTree.northWest).not.toBeNull();
      expect(quadTree.northWest.boundary).toEqual(new Rect(-50, 50, 50, 50));
      expect(quadTree.southEast).not.toBeNull();
      expect(quadTree.southEast.boundary).toEqual(new Rect(50, -50, 50, 50));
      expect(quadTree.southWest).not.toBeNull();
      expect(quadTree.southWest.boundary).toEqual(new Rect(-50, -50, 50, 50));
    });
  });
});
