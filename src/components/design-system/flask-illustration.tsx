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

const NECK_TOP: Ellipse = { cx: 150, cy: 60, rx: 16, ry: 9.5 };
const NECK_BOTTOM: Ellipse = { cx: 150, cy: 118, rx: 13, ry: 7.5 };
const BASE: Ellipse = { cx: 150, cy: 232, rx: 74, ry: 43 };
const LIQUID_LEVEL = 0.55; // 0 = shoulder, 1 = base
const BULGE = 18;

export function FlaskIllustration() {
  const liquid = ellipseBetween(NECK_BOTTOM, BASE, LIQUID_LEVEL);

  return (
    <svg aria-hidden="true" viewBox="0 0 300 300">
      <ellipse cx="150" cy="276" fill={ISO_SHADOW} opacity="0.5" rx="86" ry="12" />

      <path d={halfWallPath(NECK_BOTTOM, BASE, "left", BULGE)} fill={ISO_LEFT} />
      <path d={halfWallPath(NECK_BOTTOM, BASE, "right", BULGE)} fill={ISO_RIGHT} />

      <path d={halfWallPath(liquid, BASE, "left", BULGE)} fill={ISO_LIQUID_LEFT} />
      <path d={halfWallPath(liquid, BASE, "right", BULGE)} fill={ISO_LIQUID_RIGHT} />
      <ellipse
        cx={liquid.cx}
        cy={liquid.cy}
        fill={ISO_LIQUID_TOP}
        rx={liquid.rx}
        ry={liquid.ry}
      />

      <circle cx="132" cy="222" fill={ISO_LIQUID_TOP} r="4" />
      <circle cx="174" cy="236" fill={ISO_LIQUID_TOP} r="3" />

      <path d={halfWallPath(NECK_TOP, NECK_BOTTOM, "left")} fill={ISO_LEFT} />
      <path d={halfWallPath(NECK_TOP, NECK_BOTTOM, "right")} fill={ISO_RIGHT} />

      <g stroke={ISO_RIGHT} strokeLinecap="round" strokeWidth="3">
        <line x1="182" x2="200" y1="188" y2="184" />
        <line x1="192" x2="212" y1="214" y2="209" />
      </g>

      <ellipse
        cx={NECK_TOP.cx}
        cy={NECK_TOP.cy}
        fill={ISO_TOP}
        rx={NECK_TOP.rx}
        ry={NECK_TOP.ry}
      />
      <ellipse
        cx={NECK_TOP.cx}
        cy={NECK_TOP.cy}
        fill={ISO_OPENING}
        rx={NECK_TOP.rx - 5}
        ry={NECK_TOP.ry - 2.5}
      />
    </svg>
  );
}
