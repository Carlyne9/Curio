import type { ReactNode } from "react";

import { ISO_LEFT, ISO_RIGHT, ISO_SHADOW, ISO_TOP } from "./iso-palette";

const TOP = ISO_TOP;
const LEFT = ISO_LEFT;
const RIGHT = ISO_RIGHT;
const SHADOW = ISO_SHADOW;

const GROUND_Y = 168;

function pts(points: Array<[number, number]>) {
  return points.map(([x, y]) => `${x},${y}`).join(" ");
}

type BoxProps = {
  cx: number;
  apexY: number;
  w: number;
  h: number;
};

function cubeFaces({ cx, apexY, w, h }: BoxProps) {
  const top: [number, number] = [cx, apexY];
  const right: [number, number] = [cx + w, apexY + w / 2];
  const bottom: [number, number] = [cx, apexY + w];
  const left: [number, number] = [cx - w, apexY + w / 2];
  const rightDrop: [number, number] = [cx + w, apexY + w / 2 + h];
  const bottomDrop: [number, number] = [cx, apexY + w + h];
  const leftDrop: [number, number] = [cx - w, apexY + w / 2 + h];

  return {
    topFace: pts([top, right, bottom, left]),
    leftFace: pts([left, bottom, bottomDrop, leftDrop]),
    rightFace: pts([bottom, right, rightDrop, bottomDrop])
  };
}

function IsoBox(props: BoxProps) {
  const { topFace, leftFace, rightFace } = cubeFaces(props);
  return (
    <g>
      <polygon fill={LEFT} points={leftFace} />
      <polygon fill={RIGHT} points={rightFace} />
      <polygon fill={TOP} points={topFace} />
    </g>
  );
}

/** Resting apexY for a box of size (w, h) so its base sits at `groundY`. */
function restOn(groundY: number, w: number, h: number) {
  return groundY - w - h;
}

function IsoBall({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} fill={LEFT} r={r} />
      <circle cx={cx - r / 3} cy={cy - r / 3} fill={TOP} r={r / 1.9} />
    </g>
  );
}

function GroundShadow({ cx, cy }: { cx: number; cy: number }) {
  return <ellipse cx={cx} cy={cy} fill={SHADOW} rx={68} ry={10} />;
}

function Plinth() {
  return <IsoBox apexY={GROUND_Y} cx={120} h={9} w={58} />;
}

export function SceneShell({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 248">
      <GroundShadow cx={120} cy={234} />
      <Plinth />
      {children}
    </svg>
  );
}

export function ScienceScene() {
  const flask = { cx: 120, w: 22, h: 50 };
  const flaskApex = restOn(GROUND_Y, flask.w, flask.h);
  const cap = { cx: 120, w: 10, h: 12 };
  const capApex = restOn(flaskApex, cap.w, cap.h);
  return (
    <SceneShell>
      <IsoBox apexY={flaskApex} cx={flask.cx} h={flask.h} w={flask.w} />
      <IsoBox apexY={capApex} cx={cap.cx} h={cap.h} w={cap.w} />
      <IsoBall cx={178} cy={94} r={10} />
      <IsoBall cx={192} cy={72} r={4} />
    </SceneShell>
  );
}

export function MusicScene() {
  const speaker = { cx: 115, w: 26, h: 48 };
  const speakerApex = restOn(GROUND_Y, speaker.w, speaker.h);
  const knob = { cx: 115, w: 8, h: 10 };
  const knobApex = restOn(speakerApex, knob.w, knob.h);
  return (
    <SceneShell>
      <IsoBox apexY={speakerApex} cx={speaker.cx} h={speaker.h} w={speaker.w} />
      <IsoBox apexY={knobApex} cx={knob.cx} h={knob.h} w={knob.w} />
      <IsoBall cx={174} cy={102} r={10} />
      <rect
        fill={LEFT}
        height="26"
        rx="3"
        transform="rotate(24 186 84)"
        width="6"
        x="183"
        y="66"
      />
    </SceneShell>
  );
}

export function ArtScene() {
  const canvas = { cx: 110, w: 20, h: 54 };
  const canvasApex = restOn(GROUND_Y, canvas.w, canvas.h);
  const palette = { cx: 170, w: 16, h: 10 };
  const paletteApex = restOn(GROUND_Y, palette.w, palette.h);
  return (
    <SceneShell>
      <IsoBox apexY={canvasApex} cx={canvas.cx} h={canvas.h} w={canvas.w} />
      <IsoBox apexY={paletteApex} cx={palette.cx} h={palette.h} w={palette.w} />
      <IsoBall cx={170} cy={128} r={7} />
    </SceneShell>
  );
}

export function PhilosophyScene() {
  const column = { cx: 112, w: 16, h: 60 };
  const columnApex = restOn(GROUND_Y, column.w, column.h);
  const book = { cx: 112, w: 20, h: 10 };
  const bookApex = restOn(columnApex, book.w, book.h);
  return (
    <SceneShell>
      <IsoBox apexY={columnApex} cx={column.cx} h={column.h} w={column.w} />
      <IsoBox apexY={bookApex} cx={book.cx} h={book.h} w={book.w} />
      <IsoBall cx={148} cy={56} r={9} />
    </SceneShell>
  );
}

export function HistoryScene() {
  const columnW = 10;
  const columnH = 55;
  const columnApex = restOn(GROUND_Y, columnW, columnH);
  const roof = { cx: 120, w: 36, h: 10 };
  const roofApex = restOn(columnApex, roof.w, roof.h);
  return (
    <SceneShell>
      <IsoBox apexY={columnApex} cx={96} h={columnH} w={columnW} />
      <IsoBox apexY={columnApex} cx={144} h={columnH} w={columnW} />
      <IsoBox apexY={roofApex} cx={roof.cx} h={roof.h} w={roof.w} />
      <IsoBall cx={120} cy={50} r={7} />
    </SceneShell>
  );
}

export function TechnologyScene() {
  const monitor = { cx: 116, w: 26, h: 34 };
  const monitorApex = restOn(GROUND_Y, monitor.w, monitor.h);
  const stand = { cx: 132, w: 10, h: 12 };
  const standApex = restOn(GROUND_Y, stand.w, stand.h);
  return (
    <SceneShell>
      <IsoBox apexY={standApex} cx={stand.cx} h={stand.h} w={stand.w} />
      <IsoBox apexY={monitorApex} cx={monitor.cx} h={monitor.h} w={monitor.w} />
      <IsoBall cx={150} cy={104} r={7} />
    </SceneShell>
  );
}
