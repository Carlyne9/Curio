import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  ArtIllustration,
  HistoryIllustration,
  MusicIllustration,
  PhilosophyIllustration,
  ScienceIllustration,
  TechnologyIllustration
} from "@/components/design-system/category-illustrations";

import styles from "./icons-2d.module.css";

const categories = [
  {
    label: "Science",
    Illustration: ScienceIllustration,
    src: "/design-system/icons/categories/science.webp"
  },
  {
    label: "Music",
    Illustration: MusicIllustration,
    src: "/design-system/icons/categories/music.webp"
  },
  {
    label: "Art",
    Illustration: ArtIllustration,
    src: "/design-system/icons/categories/art.webp"
  },
  {
    label: "Philosophy",
    Illustration: PhilosophyIllustration,
    src: "/design-system/icons/categories/philosophy.webp"
  },
  {
    label: "History",
    Illustration: HistoryIllustration,
    src: "/design-system/icons/categories/history.webp"
  },
  {
    label: "Technology",
    Illustration: TechnologyIllustration,
    src: "/design-system/icons/categories/technology.webp"
  }
] as const;

export default function Illustrations2DTestPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/design-system">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to design system
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Test page · not part of the system</p>
          <h1>Category illustrations: 3D vs 2D</h1>
          <p className={styles.sub}>
            Same six categories and the same violet, drawn as small flat
            illustrated scenes instead of single-glyph icons — so you can
            compare the current soft-3D renders against a 2D illustration
            direction.
          </p>
        </header>

        <div className={styles.grid}>
          {categories.map(({ label, Illustration, src }) => (
            <article className={styles.card} key={label}>
              <p className={styles.cardLabel}>{label}</p>
              <div className={styles.pair}>
                <div className={styles.slot}>
                  <div className={styles.stage3d}>
                    <Image
                      alt={`${label} category illustration, soft 3D style`}
                      height={200}
                      src={src}
                      width={200}
                    />
                  </div>
                  <span className={styles.slotTag}>3D</span>
                </div>
                <div className={styles.slot}>
                  <div className={styles.stage2d}>
                    <Illustration className={styles.illustration} />
                  </div>
                  <span className={styles.slotTag}>2D</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
