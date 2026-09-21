const INK = "#1F2430";
const VIOLET_DEEP = "#6C4DFF";
const VIOLET_MID = "#8B7FFF";
const VIOLET_SOFT = "#D9D2FF";
const CREAM = "#FFFDF8";
const AMBER = "#F7C873";
export const CATEGORY_TILE_BG = "#EFEBFF";

type IllustrationProps = {
  className?: string;
};

export function ScienceIllustration({ className }: IllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 96 96"
    >
      <ellipse
        cx="48"
        cy="50"
        opacity="0.9"
        rx="34"
        ry="14"
        stroke={VIOLET_MID}
        strokeWidth="3"
      />
      <circle cx="14" cy="50" fill={VIOLET_DEEP} r="4" />
      <path
        d="M38,28 L26,64 Q26,74 36,74 L60,74 Q70,74 70,64 L58,28 Z"
        fill={CREAM}
      />
      <path
        d="M31,56 L26,64 Q26,74 36,74 L60,74 Q70,74 70,64 L65,56 Z"
        fill={VIOLET_DEEP}
      />
      <circle cx="44" cy="64" fill={VIOLET_SOFT} r="2" />
      <circle cx="52" cy="68" fill={VIOLET_SOFT} r="1.6" />
      <path
        d="M38,28 L26,64 Q26,74 36,74 L60,74 Q70,74 70,64 L58,28 Z"
        stroke={INK}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <rect
        fill={CREAM}
        height="12"
        rx="2"
        stroke={INK}
        strokeWidth="3"
        width="16"
        x="40"
        y="16"
      />
      <circle cx="82" cy="50" fill={VIOLET_SOFT} r="3" stroke={INK} strokeWidth="2" />
    </svg>
  );
}

export function MusicIllustration({ className }: IllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 96 96"
    >
      <path
        d="M18,46 Q18,14 48,14 Q78,14 78,46"
        stroke={VIOLET_DEEP}
        strokeLinecap="round"
        strokeWidth="8"
      />
      <rect
        fill={VIOLET_SOFT}
        height="30"
        rx="10"
        stroke={INK}
        strokeWidth="3"
        width="20"
        x="10"
        y="42"
      />
      <circle cx="20" cy="57" fill={VIOLET_DEEP} r="6" />
      <rect
        fill={VIOLET_SOFT}
        height="30"
        rx="10"
        stroke={INK}
        strokeWidth="3"
        width="20"
        x="66"
        y="42"
      />
      <circle cx="76" cy="57" fill={VIOLET_DEEP} r="6" />
      <rect fill={INK} height="28" rx="2" width="4" x="44" y="34" />
      <ellipse
        cx="54"
        cy="40"
        fill={INK}
        rx="8"
        ry="5"
        transform="rotate(20 54 40)"
      />
      <ellipse
        cx="42"
        cy="66"
        fill={VIOLET_DEEP}
        rx="8"
        ry="6"
        stroke={INK}
        strokeWidth="2"
        transform="rotate(-15 42 66)"
      />
    </svg>
  );
}

export function ArtIllustration({ className }: IllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 96 96"
    >
      <circle cx="44" cy="50" fill={CREAM} r="32" stroke={INK} strokeWidth="3" />
      <circle
        cx="60"
        cy="62"
        fill={CATEGORY_TILE_BG}
        r="8"
        stroke={INK}
        strokeWidth="2"
      />
      <circle cx="30" cy="34" fill={VIOLET_DEEP} r="6" />
      <circle cx="48" cy="26" fill={VIOLET_SOFT} r="6" stroke={INK} strokeWidth="2" />
      <circle cx="24" cy="54" fill={AMBER} r="6" />
      <g transform="rotate(35 70 18)">
        <rect fill={VIOLET_DEEP} height="30" rx="4" width="8" x="66" y="-6" />
        <rect
          fill="#B9B9C6"
          height="8"
          stroke={INK}
          strokeWidth="2"
          width="10"
          x="65"
          y="22"
        />
        <path
          d="M64,30 L76,30 L70,42 Z"
          fill={CREAM}
          stroke={INK}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

export function PhilosophyIllustration({ className }: IllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 96 96"
    >
      <path
        d="M20,86 Q20,60 30,54 L66,54 Q76,60 76,86 Z"
        fill={VIOLET_SOFT}
        stroke={INK}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M34,58 L30,86" stroke={VIOLET_DEEP} strokeWidth="2" />
      <path d="M48,54 L46,86" stroke={VIOLET_DEEP} strokeWidth="2" />
      <path d="M62,58 L66,86" stroke={VIOLET_DEEP} strokeWidth="2" />
      <circle cx="48" cy="34" fill={CREAM} r="18" stroke={INK} strokeWidth="3" />
      <path
        d="M64,26 Q74,20 76,18"
        stroke={VIOLET_MID}
        strokeDasharray="1 4"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <circle cx="76" cy="18" fill={VIOLET_DEEP} r="5" />
      <line
        stroke={VIOLET_DEEP}
        strokeLinecap="round"
        strokeWidth="2"
        x1="76"
        x2="76"
        y1="6"
        y2="1"
      />
      <line
        stroke={VIOLET_DEEP}
        strokeLinecap="round"
        strokeWidth="2"
        x1="86"
        x2="91"
        y1="18"
        y2="18"
      />
      <line
        stroke={VIOLET_DEEP}
        strokeLinecap="round"
        strokeWidth="2"
        x1="83"
        x2="87"
        y1="11"
        y2="7"
      />
    </svg>
  );
}

export function HistoryIllustration({ className }: IllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 96 96"
    >
      <rect
        fill={CREAM}
        height="60"
        rx="6"
        stroke={INK}
        strokeWidth="3"
        width="34"
        x="14"
        y="18"
      />
      <circle cx="31" cy="18" fill={VIOLET_SOFT} r="7" stroke={INK} strokeWidth="2.5" />
      <circle cx="31" cy="78" fill={VIOLET_SOFT} r="7" stroke={INK} strokeWidth="2.5" />
      <rect fill={VIOLET_DEEP} height="3" rx="1.5" width="22" x="20" y="36" />
      <rect fill={VIOLET_DEEP} height="3" rx="1.5" width="22" x="20" y="44" />
      <rect fill={VIOLET_DEEP} height="3" rx="1.5" width="16" x="20" y="52" />
      <path
        d="M56,24 L82,24 L70,48 L82,72 L56,72 L68,48 Z"
        fill={CREAM}
        stroke={INK}
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path d="M62,28 L78,28 L70,44 Z" fill={VIOLET_SOFT} />
      <path d="M65,68 L75,68 L70,54 Z" fill={VIOLET_DEEP} />
      <rect fill={VIOLET_DEEP} height="6" rx="3" width="30" x="54" y="20" />
      <rect fill={VIOLET_DEEP} height="6" rx="3" width="30" x="54" y="70" />
    </svg>
  );
}

export function TechnologyIllustration({ className }: IllustrationProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 96 96"
    >
      <rect fill={INK} height="12" rx="2" width="6" x="32" y="10" />
      <rect fill={INK} height="12" rx="2" width="6" x="58" y="10" />
      <rect fill={INK} height="12" rx="2" width="6" x="32" y="74" />
      <rect fill={INK} height="12" rx="2" width="6" x="58" y="74" />
      <rect fill={INK} height="6" rx="2" width="12" x="10" y="32" />
      <rect fill={INK} height="6" rx="2" width="12" x="10" y="58" />
      <rect fill={INK} height="6" rx="2" width="12" x="74" y="32" />
      <rect fill={INK} height="6" rx="2" width="12" x="74" y="58" />
      <rect
        fill={VIOLET_SOFT}
        height="52"
        rx="12"
        stroke={INK}
        strokeWidth="3"
        width="52"
        x="22"
        y="22"
      />
      <rect fill={VIOLET_DEEP} height="24" rx="6" width="24" x="36" y="36" />
    </svg>
  );
}
