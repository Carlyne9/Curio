import {
  ISO_LEFT,
  ISO_LIQUID_LEFT,
  ISO_LIQUID_RIGHT,
  ISO_LIQUID_TOP,
  ISO_OPENING,
  ISO_RIGHT,
  ISO_SHADOW,
  ISO_TOP
} from "./iso-palette";
import { ellipseBetween, halfWallPath, type Ellipse } from "./iso-vessel";

// Real beakers are close to a straight cylinder — only a slight taper.
const TOP: Ellipse = { cx: 150, cy: 96, rx: 64, ry: 38 };
const BOTTOM: Ellipse = { cx: 150, cy: 232, rx: 60, ry: 35 };
const LIQUID_LEVEL = 0.42; // 0 = top rim, 1 = base
const BULGE = 16;

export function BeakerIllustration() {
  const liquid = ellipseBetween(TOP, BOTTOM, LIQUID_LEVEL);

  return (
    <svg aria-hidden="true" viewBox="0 0 300 300">
      <ellipse cx="150" cy="270" fill={ISO_SHADOW} opacity="0.5" rx="80" ry="12" />

      <path d={halfWallPath(TOP, BOTTOM, "left", BULGE)} fill={ISO_LEFT} />
      <path d={halfWallPath(TOP, BOTTOM, "right", BULGE)} fill={ISO_RIGHT} />

      <path d={halfWallPath(liquid, BOTTOM, "left", BULGE)} fill={ISO_LIQUID_LEFT} />
      <path
        d={halfWallPath(liquid, BOTTOM, "right", BULGE)}
        fill={ISO_LIQUID_RIGHT}
      />
      <ellipse
        cx={liquid.cx}
        cy={liquid.cy}
        fill={ISO_LIQUID_TOP}
        rx={liquid.rx}
        ry={liquid.ry}
      />

      <circle cx="128" cy="210" fill={ISO_LIQUID_TOP} r="4" />
      <circle cx="170" cy="225" fill={ISO_LIQUID_TOP} r="3" />

      <g stroke={ISO_RIGHT} strokeLinecap="round" strokeWidth="3">
        <line x1="186" x2="203" y1="155" y2="151" />
        <line x1="188" x2="206" y1="185" y2="181" />
      </g>

      <ellipse
        cx="222"
        cy="82"
        fill={ISO_LEFT}
        rx="15"
        ry="9"
        stroke={ISO_RIGHT}
        strokeWidth="2"
        transform="rotate(-20 222 82)"
      />

      <ellipse cx={TOP.cx} cy={TOP.cy} fill={ISO_TOP} rx={TOP.rx} ry={TOP.ry} />
      <ellipse
        cx={TOP.cx}
        cy={TOP.cy}
        fill={ISO_OPENING}
        rx={TOP.rx - 8}
        ry={TOP.ry - 4}
      />
    </svg>
  );
}
