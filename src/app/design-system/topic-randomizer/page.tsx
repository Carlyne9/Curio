"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TopicRandomizer } from "@/components/design-system/topic-randomizer";

import styles from "./topic-randomizer.module.css";

const topics = [
  "How has science changed the way people understand uncertainty?",
  "Which hidden assumptions shape the most common ideas in science?",
  "Why do experts in science disagree even when they share the same evidence?",
  "What important discovery in science began with an accidental observation?",
  "How does culture influence what counts as progress in science?",
  "Which idea in science sounds simple but becomes complex under closer study?",
  "How have tools changed the questions people can ask in science?",
  "What does science reveal about the limits of human perception?",
  "Which overlooked person or community reshaped modern science?",
  "How does language change the way knowledge is communicated in science?",
  "What ethical tension is becoming more important in science?",
  "Which popular belief about science is most often misunderstood?"
];

export default function TopicRandomizerTestPage() {
  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/design-system">
        <ArrowLeft aria-hidden="true" size={15} />
        Back to design system
      </Link>

      <header className={styles.header}>
        <p className={styles.eyebrow}>Test page · not part of the system</p>
        <h1>Topic reveal: no wheel</h1>
        <p className={styles.sub}>
          No wheel graphic — the topic text itself cycles rapidly in place,
          slowing down until it lands on one. Accept it or spin again.
        </p>
      </header>

      <div className={styles.centerArea}>
        <TopicRandomizer topics={topics} />
      </div>
    </main>
  );
}
