import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  ArtScene,
  HistoryScene,
  MusicScene,
  PhilosophyScene,
  ScienceScene,
  TechnologyScene
} from "@/components/design-system/category-scenes";

import styles from "./icons-isometric-chalk.module.css";

const categories = [
  { label: "Science", Scene: ScienceScene },
  { label: "Music", Scene: MusicScene },
  { label: "Art", Scene: ArtScene },
  { label: "Philosophy", Scene: PhilosophyScene },
  { label: "History", Scene: HistoryScene },
  { label: "Technology", Scene: TechnologyScene }
] as const;

export default function IconsIsometricChalkTestPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/design-system">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to design system
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Test page · not part of the system</p>
          <h1>Isometric shapes, chalk white &amp; grey</h1>
          <p className={styles.sub}>
            Same isometric block language as before — flat-shaded faces, no
            outlines — just recolored to a neutral chalk white-to-grey scale
            instead of the cream/violet mix, and shown on plain white and
            light grey so the shape and material read without a bold card
            color competing for attention.
          </p>
        </header>

        <div className={styles.grid}>
          {categories.map(({ label, Scene }, i) => (
            <article
              className={styles.card}
              key={label}
              style={{ background: i % 2 === 0 ? "#FFFFFF" : "#EEEEEA" }}
            >
              <div className={styles.stage}>
                <Scene />
              </div>
              <p className={styles.cardLabel}>{label}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
