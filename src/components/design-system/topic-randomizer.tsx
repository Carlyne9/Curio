"use client";

import { useEffect, useRef, useState } from "react";
import { Check, RotateCw } from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./topic-randomizer.module.css";

const TICK_COUNT = 26;
const START_DELAY = 45;
const END_DELAY = 320;

export function TopicRandomizer({
  topics,
  onAccept
}: {
  topics: string[];
  onAccept?: (topic: string) => void;
}) {
  const [displayTopic, setDisplayTopic] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  function randomTopic(exclude?: string) {
    if (topics.length <= 1) return topics[0];
    let next = topics[Math.floor(Math.random() * topics.length)];
    while (next === exclude) {
      next = topics[Math.floor(Math.random() * topics.length)];
    }
    return next;
  }

  function spin() {
    if (isSpinning) return;
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);

    setIsSpinning(true);
    setHasResult(false);

    const finalTopic = randomTopic(displayTopic ?? undefined);
    let tick = 0;
    let lastShown = displayTopic ?? undefined;

    function step() {
      const shown = randomTopic(lastShown);
      lastShown = shown;
      setDisplayTopic(shown);
      tick += 1;

      if (tick < TICK_COUNT) {
        const progress = tick / TICK_COUNT;
        const delay = START_DELAY + progress * progress * (END_DELAY - START_DELAY);
        timeoutRef.current = window.setTimeout(step, delay);
      } else {
        setDisplayTopic(finalTopic);
        setIsSpinning(false);
        setHasResult(true);
      }
    }

    step();
  }

  return (
    <div className={styles.wrap}>
      <div className={cn(styles.stage, hasResult && styles.stageLanded)}>
        <p
          className={cn(
            styles.topic,
            isSpinning && styles.topicSpinning,
            !displayTopic && styles.topicPlaceholder,
            hasResult && styles.topicLanded
          )}
          key={displayTopic ?? "placeholder"}
        >
          {displayTopic ?? "Tap spin to reveal a topic"}
        </p>
      </div>

      <div className={styles.actions}>
        {hasResult ? (
          <>
            <button
              className={cn(styles.button, styles.buttonPrimary)}
              onClick={() => displayTopic && onAccept?.(displayTopic)}
              type="button"
            >
              <Check aria-hidden="true" size={16} />
              Accept
            </button>
            <button
              className={cn(styles.button, styles.buttonSecondary)}
              onClick={spin}
              type="button"
            >
              <RotateCw aria-hidden="true" size={15} />
              Spin again
            </button>
          </>
        ) : (
          <button
            className={cn(styles.button, styles.buttonPrimary)}
            disabled={isSpinning}
            onClick={spin}
            type="button"
          >
            <RotateCw
              aria-hidden="true"
              className={isSpinning ? styles.spin : undefined}
              size={16}
            />
            {isSpinning ? "Spinning…" : "Spin for a topic"}
          </button>
        )}
      </div>
    </div>
  );
}
