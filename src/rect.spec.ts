import { Rect } from "./rect";
import { Point } from "./point";

describe("Rect", () => {
  describe("contains", () => {
    it("should return true", () => {
      const rect = new Rect(0, 0, 10, 10);
      expect(rect.contains(new Point(0, 0))).toBe(true);
      expect(rect.contains(new Point(5, 5))).toBe(true);
    });
  });
});
