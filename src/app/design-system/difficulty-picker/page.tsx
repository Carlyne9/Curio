"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  DifficultyWheelPicker,
  type WheelOption
} from "@/components/design-system/difficulty-wheel-picker";

import styles from "./difficulty-picker.module.css";

const difficulties: (WheelOption & { description: string })[] = [
  {
    id: "low",
    label: "Low",
    description:
      "A broad, accessible topic with a clear starting point and familiar ideas."
  },
  {
    id: "medium",
    label: "Medium",
    description:
      "A more focused topic with added context, nuance, and room for comparison."
  },
  {
    id: "high",
    label: "High",
    description:
      "A complex topic that calls for deeper analysis and competing perspectives."
  }
];

export default function DifficultyPickerTestPage() {
  const [selected, setSelected] = useState(difficulties[1]);

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <Link className={styles.back} href="/design-system">
          <ArrowLeft aria-hidden="true" size={15} />
          Back to design system
        </Link>

        <header className={styles.header}>
          <p className={styles.eyebrow}>Test page · not part of the system</p>
          <h1>Research difficulty: spin picker</h1>
          <p className={styles.sub}>
            An iOS-style wheel instead of the three-card grid — scroll or drag
            to spin, and it snaps to the closest value. Testing whether this
            reads more playful than three cards.
          </p>
        </header>

        <div className={styles.demo}>
          <DifficultyWheelPicker
            defaultIndex={1}
            onChange={(_option, index) => setSelected(difficulties[index])}
            options={difficulties}
          />

          <div className={styles.summary}>
            <strong>{selected.label}</strong>
            <p>{selected.description}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
