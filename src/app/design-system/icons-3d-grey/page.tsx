import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import styles from "./icons-3d-grey.module.css";

const categories = [
  { label: "Science", src: "/design-system/icons/categories/science.webp" },
  { label: "Music", src: "/design-system/icons/categories/music.webp" },
  { label: "Art", src: "/design-system/icons/categories/art.webp" },
  {
    label: "Philosophy",
    src: "/design-system/icons/categories/philosophy.webp"
  },
  { label: "History", src: "/design-system/icons/categories/history.webp" },
  {
    label: "Technology",
    src: "/design-system/icons/categories/technology.webp"
  }
] as const;

const treatments = [
  { key: "original", label: "Original (violet)", filter: "none" },
  { key: "grey", label: "Grayscale", filter: "grayscale(1)" },
  {
    key: "chalk",
    label: "Chalk (brighter, flatter)",
    filter: "grayscale(1) brightness(1.18) contrast(0.88)"
  }
] as const;

export default function Icons3DGreyTestPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/design-system">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to design system
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Test page · not part of the system</p>
          <h1>Same 3D renders, chalk white &amp; grey</h1>
          <p className={styles.sub}>
            Keeping the existing soft-3D category renders as-is and testing a
            desaturated palette on them with a CSS filter — no new assets,
            just a quick way to see if losing the violet works before
            committing to it. Two filter strengths per category, next to the
            original for reference.
          </p>
        </header>

        {categories.map(({ label, src }) => (
          <section className={styles.row} key={label}>
            <p className={styles.rowLabel}>{label}</p>
            <div className={styles.swatches}>
              {treatments.map((treatment) => (
                <div className={styles.swatch} key={treatment.key}>
                  <div className={styles.stage}>
                    <Image
                      alt={`${label} category icon, ${treatment.label} treatment`}
                      height={200}
                      src={src}
                      style={{ filter: treatment.filter }}
                      width={200}
                    />
                  </div>
                  <span>{treatment.label}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
