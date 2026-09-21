import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  ArtScene,
  HistoryScene,
  MusicScene,
  PhilosophyScene,
  TechnologyScene
} from "@/components/design-system/category-scenes";
import { BeakerIllustration } from "@/components/design-system/beaker-illustration";
import { FlaskIllustration } from "@/components/design-system/flask-illustration";

import styles from "./icons-isometric.module.css";

const apparatus = [
  { label: "Beaker", Illustration: BeakerIllustration },
  { label: "Erlenmeyer flask", Illustration: FlaskIllustration }
] as const;

const categories = [
  { label: "Science", Scene: BeakerIllustration, bg: "#3564FF", text: "light" },
  { label: "Music", Scene: MusicScene, bg: "#FF6B7A", text: "light" },
  { label: "Art", Scene: ArtScene, bg: "#FFD166", text: "dark" },
  { label: "Philosophy", Scene: PhilosophyScene, bg: "#111832", text: "light" },
  { label: "History", Scene: HistoryScene, bg: "#6C4DFF", text: "light" },
  { label: "Technology", Scene: TechnologyScene, bg: "#42D3B2", text: "dark" }
] as const;

export default function IconsIsometricTestPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/design-system">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to design system
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Test page · not part of the system</p>
          <h1>Category illustrations: isometric diorama</h1>
          <p className={styles.sub}>
            A third direction, modeled after the isometric clay-render style
            in the reference screenshot — bone-colored objects with soft
            directional shading, staged on a bold flat-color card. Science now
            has a reworked beaker illustration; the rest are still the
            earlier block-based pass.
          </p>
        </header>

        {apparatus.map(({ label, Illustration }) => (
          <div className={styles.isolationGroup} key={label}>
            <p className={styles.isolationLabel}>{label}</p>
            <div className={styles.isolationRow}>
              <div
                className={styles.isolationCard}
                style={{ background: "#FFFFFF" }}
              >
                <Illustration />
                <span>White</span>
              </div>
              <div
                className={styles.isolationCard}
                style={{ background: "#EDECE8" }}
              >
                <Illustration />
                <span>Light grey</span>
              </div>
            </div>
          </div>
        ))}

        <div className={styles.grid}>
          {categories.map(({ label, Scene, bg, text }) => (
            <article
              className={styles.card}
              key={label}
              style={{ background: bg }}
            >
              <div className={styles.stage}>
                <Scene />
              </div>
              <p
                className={styles.cardLabel}
                data-text={text}
              >
                {label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
