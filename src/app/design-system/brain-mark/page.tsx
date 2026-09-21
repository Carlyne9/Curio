import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import styles from "./brain-mark.module.css";

const logoVariants = [
  { label: "Violet", src: "/logo/curio-logo-violet.svg", tile: "#FFFFFF" },
  { label: "Grey", src: "/logo/curio-logo-grey.svg", tile: "#FFFFFF" },
  { label: "Black", src: "/logo/curio-logo-black.svg", tile: "#FFFFFF" },
  { label: "White", src: "/logo/curio-logo-white.svg", tile: "#1F2430" }
] as const;

export default function BrainMarkPreviewPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/design-system">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to design system
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Test page · not part of the system</p>
          <h1>Curio logo: four flat colors</h1>
          <p className={styles.sub}>
            The real brain + wordmark artwork from Figma, recolored flat (no
            gradient, no background) to match the design system&apos;s own
            tokens: violet <code>--primary</code>, grey{" "}
            <code>--muted-foreground</code>, black <code>--foreground</code>,
            and white. Now live in the app shell&apos;s logo, plus saved as
            four standalone files in <code>public/logo/</code>.
          </p>
        </header>

        <div className={styles.grid}>
          {logoVariants.map(({ label, src, tile }) => (
            <div className={styles.card} key={label} style={{ background: tile }}>
              <Image alt={`${label} logo variant`} height={29} src={src} width={84} />
              <span
                className={styles.cardLabel}
                style={{ color: tile === "#FFFFFF" ? "#1F2430" : "#FFFFFF" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
