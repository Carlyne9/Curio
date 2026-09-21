export type Ellipse = { cx: number; cy: number; rx: number; ry: number };

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function ellipseBetween(top: Ellipse, bottom: Ellipse, t: number): Ellipse {
  return {
    cx: lerp(top.cx, bottom.cx, t),
    cy: lerp(top.cy, bottom.cy, t),
    rx: lerp(top.rx, bottom.rx, t),
    ry: lerp(top.ry, bottom.ry, t)
  };
}

/** Left/right tangent points and the front-center point (silhouette seam). */
export function marks(e: Ellipse) {
  return {
    left: [e.cx - e.rx, e.cy] as const,
    right: [e.cx + e.rx, e.cy] as const,
    front: [e.cx, e.cy + e.ry] as const
  };
}

type Point = readonly [number, number];

/**
 * Flat-shaded half of a vessel wall between two ellipses (front-left or
 * front-right quarter). The wall itself is a single cubic Bezier from the
 * top tangent point to the bottom tangent point — not a straight line, and
 * not two curves stitched together — so there's exactly one smooth curve
 * and no seam for a kink to hide in. `bulge` is how far that curve bows
 * outward past the straight taper line; leave it 0 for a straight section
 * (like a flask's neck), or pass a positive number for a rounded belly.
 * Both ellipse arcs it hands off to (front seam and base) are the true,
 * full arcs, so the curve is tangent to them at the exact tangent points.
 */
export function halfWallPath(
  top: Ellipse,
  bottom: Ellipse,
  side: "left" | "right",
  bulge = 0
) {
  const t = marks(top);
  const b = marks(bottom);
  const dir = side === "left" ? -1 : 1;

  const p0: Point = side === "left" ? t.left : t.right;
  const p3: Point = side === "left" ? b.left : b.right;
  const h = p3[1] - p0[1];
  const p1: Point = [p0[0] + dir * bulge, p0[1] + h / 3];
  const p2: Point = [p3[0] + dir * bulge, p3[1] - h / 3];

  if (side === "left") {
    return [
      `M${p0[0]},${p0[1]}`,
      `C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
      `A${bottom.rx},${bottom.ry} 0 0,1 ${b.front[0]},${b.front[1]}`,
      `L${t.front[0]},${t.front[1]}`,
      `A${top.rx},${top.ry} 0 0,0 ${p0[0]},${p0[1]}`,
      "Z"
    ].join(" ");
  }

  return [
    `M${p0[0]},${p0[1]}`,
    `A${top.rx},${top.ry} 0 0,0 ${t.front[0]},${t.front[1]}`,
    `L${b.front[0]},${b.front[1]}`,
    `A${bottom.rx},${bottom.ry} 0 0,1 ${p3[0]},${p3[1]}`,
    `C${p2[0]},${p2[1]} ${p1[0]},${p1[1]} ${p0[0]},${p0[1]}`,
    "Z"
  ].join(" ");
}
