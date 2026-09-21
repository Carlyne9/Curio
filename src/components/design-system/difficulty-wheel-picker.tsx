"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

import styles from "./difficulty-wheel-picker.module.css";

const ITEM_HEIGHT = 64;
const VISIBLE_RADIUS = 2;

export type WheelOption = {
  id: string;
  label: string;
};

export function DifficultyWheelPicker({
  options,
  defaultIndex = 0,
  onChange
}: {
  options: WheelOption[];
  defaultIndex?: number;
  onChange?: (option: WheelOption, index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const settleTimeout = useRef<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [liveIndex, setLiveIndex] = useState(defaultIndex);

  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    node.scrollTop = defaultIndex * ITEM_HEIGHT;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settle = useCallback(() => {
    const node = trackRef.current;
    if (!node) return;

    const index = Math.min(
      options.length - 1,
      Math.max(0, Math.round(node.scrollTop / ITEM_HEIGHT))
    );
    setSelectedIndex(index);
    onChange?.(options[index], index);
  }, [onChange, options]);

  function handleScroll() {
    const node = trackRef.current;
    if (!node) return;

    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      setLiveIndex(node.scrollTop / ITEM_HEIGHT);
    });

    if (settleTimeout.current) window.clearTimeout(settleTimeout.current);
    settleTimeout.current = window.setTimeout(settle, 120);
  }

  function goTo(index: number) {
    const node = trackRef.current;
    if (!node) return;
    const clamped = Math.min(options.length - 1, Math.max(0, index));
    node.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: "smooth" });
  }

  return (
    <div className={styles.frame}>
      <div aria-hidden="true" className={styles.selectionLineTop} />
      <div aria-hidden="true" className={styles.selectionLineBottom} />
      <div aria-hidden="true" className={styles.fadeTop} />
      <div aria-hidden="true" className={styles.fadeBottom} />

      <div
        aria-label="Research difficulty"
        className={styles.track}
        onScroll={handleScroll}
        ref={trackRef}
        role="listbox"
        style={{ paddingBlock: ITEM_HEIGHT * VISIBLE_RADIUS }}
      >
        {options.map((option, index) => {
          const distance = index - liveIndex;
          const abs = Math.abs(distance);
          const opacity = Math.max(0.18, 1 - abs * 0.42);
          const scale = Math.max(0.74, 1 - abs * 0.15);
          const rotate = Math.max(-40, Math.min(40, distance * 26));

          return (
            <button
              aria-selected={index === selectedIndex}
              className={cn(
                styles.item,
                index === selectedIndex && styles.itemActive
              )}
              key={option.id}
              onClick={() => goTo(index)}
              role="option"
              style={{
                height: ITEM_HEIGHT,
                opacity,
                transform: `rotateX(${rotate}deg) scale(${scale})`
              }}
              type="button"
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
