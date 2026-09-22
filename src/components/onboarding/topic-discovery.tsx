"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, RotateCw } from "lucide-react";

import { startSession } from "@/app/(app)/workspace/actions";
import { DURATION_CONFIG, DurationPicker } from "@/components/onboarding/duration-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  topicCategories,
  topicSeeds,
  type TopicSeed
} from "@/data/topic-seeds";
import {
  buildDifficultyChallenge,
  researchDifficulties,
  type ResearchDifficulty
} from "@/lib/topics";

type TopicDiscoveryProps = {
  error?: string;
};

type DiscoveryStep = "field" | "difficulty" | "topic" | "timer";

const DISCOVERY_STAGES: DiscoveryStep[] = ["field", "difficulty", "topic", "timer"];

const categoryIllustrations: Record<string, string> = {
  Science: "/categories/science.webp",
  Music: "/categories/music.webp",
  Art: "/categories/art.webp",
  Philosophy: "/categories/philosophy.webp",
  Technology: "/categories/technology.webp",
  Culture: "/categories/culture.webp"
};

const categoryDescriptions: Record<string, string> = {
  Science: "Nature, discovery, and the physical world",
  Music: "Sound, memory, and how we express ourselves",
  Art: "Images, ideas, and visual culture",
  Philosophy: "Meaning, ethics, and the nature of existence",
  Technology: "Tools, systems, and how they shape society",
  Culture: "Customs, belief, and the stories people share"
};

const SPIN_TICKS = 26;
const SPIN_START_DELAY = 45;
const SPIN_END_DELAY = 320;

export function TopicDiscovery({ error }: TopicDiscoveryProps) {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<DiscoveryStep>("field");
  const [category, setCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicSeed | null>(null);
  const [landedTopic, setLandedTopic] = useState<TopicSeed | null>(null);
  const [hasSpinResult, setHasSpinResult] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    ResearchDifficulty | ""
  >("");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinTimeoutRef = useRef<number | null>(null);

  const categoryTopics = useMemo(
    () => topicSeeds.filter((topic) => topic.category === category),
    [category]
  );
  const selectedDifficultyOption = researchDifficulties.find(
    (difficulty) => difficulty.value === selectedDifficulty
  );

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) window.clearTimeout(spinTimeoutRef.current);
    };
  }, []);

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSelectedTopic(null);
    setLandedTopic(null);
    setHasSpinResult(false);
    setSelectedDifficulty("");
    setIsSpinning(false);
    setStep("difficulty");
  }

  function returnToFields() {
    setSelectedTopic(null);
    setLandedTopic(null);
    setHasSpinResult(false);
    setSelectedDifficulty("");
    setIsSpinning(false);
    setStep("field");
  }

  function randomTopic(pool: TopicSeed[], exclude?: TopicSeed | null) {
    if (pool.length <= 1) return pool[0];
    let next = pool[Math.floor(Math.random() * pool.length)];
    while (next.id === exclude?.id) {
      next = pool[Math.floor(Math.random() * pool.length)];
    }
    return next;
  }

  function spinTopic() {
    if (categoryTopics.length === 0 || isSpinning) {
      return;
    }

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }

    setIsSpinning(true);
    setHasSpinResult(false);

    const finalTopic = randomTopic(categoryTopics, landedTopic);

    if (prefersReducedMotion) {
      setLandedTopic(finalTopic);
      setIsSpinning(false);
      setHasSpinResult(true);
      return;
    }

    let tick = 0;
    let lastShown = landedTopic;

    const step = () => {
      const shown = randomTopic(categoryTopics, lastShown);
      lastShown = shown;
      setLandedTopic(shown);
      tick += 1;

      if (tick < SPIN_TICKS) {
        const progress = tick / SPIN_TICKS;
        const delay =
          SPIN_START_DELAY + progress * progress * (SPIN_END_DELAY - SPIN_START_DELAY);
        spinTimeoutRef.current = window.setTimeout(step, delay);
      } else {
        setLandedTopic(finalTopic);
        setIsSpinning(false);
        setHasSpinResult(true);
      }
    };

    step();
  }

  function chooseDifficulty(difficulty: ResearchDifficulty) {
    setSelectedDifficulty(difficulty);
    setDurationMinutes(DURATION_CONFIG[difficulty].defaultValue);
    setSelectedTopic(null);
    setLandedTopic(null);
    setHasSpinResult(false);
    setStep("topic");
  }

  function returnToDifficulty() {
    setSelectedTopic(null);
    setLandedTopic(null);
    setHasSpinResult(false);
    setIsSpinning(false);
    setStep("difficulty");
  }

  function acceptTopic() {
    if (!landedTopic) return;
    setSelectedTopic(landedTopic);
    setStep("timer");
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div
          className="mb-8 flex items-center justify-center gap-2"
          aria-label="Onboarding progress"
        >
          {DISCOVERY_STAGES.map((stage, index) => {
            const currentIndex = DISCOVERY_STAGES.indexOf(step);
            const isCompleted = index < currentIndex;
            const isActive = index === currentIndex;

            return (
              <motion.span
                animate={{ width: isActive ? 64 : 32 }}
                aria-label={
                  isActive ? `Current step ${index + 1}` : undefined
                }
                aria-hidden={isActive ? undefined : true}
                className={
                  isCompleted || isActive
                    ? "h-2 rounded-full bg-primary transition-colors"
                    : "h-2 rounded-full bg-muted transition-colors"
                }
                key={stage}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.35,
                  ease: [0.22, 1, 0.36, 1]
                }}
              />
            );
          })}
        </div>

        {error ? (
          <p className="mx-auto mb-6 max-w-2xl rounded-2xl bg-muted px-4 py-3 text-center text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <AnimatePresence mode="wait">
          {step === "field" ? (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="field"
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            >
              <header className="mx-auto mb-10 max-w-3xl text-center">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                  What are you curious about today?
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Start with the part of the world you feel curious about today.
                </p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topicCategories.map((topicCategory) => {
                  const illustrationSrc =
                    categoryIllustrations[topicCategory] ??
                    categoryIllustrations.Culture;

                  return (
                    <button
                      className="group rounded-[2rem] border bg-card p-5 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 sm:min-h-44 sm:p-6"
                      key={topicCategory}
                      onClick={() => chooseCategory(topicCategory)}
                      type="button"
                    >
                      <Image
                        alt=""
                        aria-hidden="true"
                        className="mb-6 h-16 w-16 object-contain transition-transform group-hover:scale-110 sm:mb-10 sm:h-20 sm:w-20"
                        height={160}
                        src={illustrationSrc}
                        width={160}
                      />
                      <span className="text-xl font-semibold">
                        {topicCategory}
                      </span>
                      <span className="mt-2 block text-sm text-muted-foreground">
                        {categoryDescriptions[topicCategory] ??
                          categoryDescriptions.Culture}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          ) : null}

          {step === "difficulty" ? (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="difficulty"
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            >
              <button
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={returnToFields}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Choose another field
              </button>

              <header className="mx-auto mb-10 max-w-3xl text-center">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
                  Choose your research difficulty.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  This changes the depth of the challenge, not which topics can
                  appear.
                </p>
              </header>

              <div className="grid gap-4 md:grid-cols-3">
                {researchDifficulties.map((difficulty, index) => {
                  const isSelected = selectedDifficulty === difficulty.value;

                  return (
                    <button
                      aria-pressed={isSelected}
                      className={
                        isSelected
                          ? "rounded-[2rem] border border-primary bg-primary p-5 text-left text-primary-foreground shadow-xl shadow-primary/20 md:min-h-64 md:p-6"
                          : "rounded-[2rem] border bg-card p-5 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10 md:min-h-64 md:p-6"
                      }
                      key={difficulty.value}
                      onClick={() => chooseDifficulty(difficulty.value)}
                      type="button"
                    >
                      <span
                        className={
                          isSelected
                            ? "text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/75"
                            : "text-sm font-semibold uppercase tracking-[0.2em] text-primary"
                        }
                      >
                        Level {index + 1}
                      </span>
                      <span className="mt-6 block text-2xl font-semibold md:mt-12">
                        {difficulty.label}
                      </span>
                      <span
                        className={
                          isSelected
                            ? "mt-3 block text-sm leading-6 text-primary-foreground/80"
                            : "mt-3 block text-sm leading-6 text-muted-foreground"
                        }
                      >
                        {difficulty.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          ) : null}

          {step === "topic" && selectedDifficulty ? (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="topic"
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            >
              <button
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={returnToDifficulty}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Change difficulty
              </button>

              <header className="mx-auto mb-8 max-w-3xl text-center">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  Spin for a topic.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Topics stay hidden until you spin — watch them cycle until
                  one sticks.
                </p>
              </header>

              <div className="mx-auto max-w-2xl">
                <p className="mb-4 text-center text-sm font-medium text-muted-foreground">
                  {selectedDifficultyOption?.label} difficulty · {category}
                </p>

                <Card
                  className="overflow-hidden border-2 border-primary transition-shadow duration-200"
                  style={{
                    boxShadow: hasSpinResult
                      ? "0 0 0 8px rgba(100, 87, 249, 0.35)"
                      : undefined
                  }}
                >
                  <CardContent className="flex min-h-[240px] items-center justify-center p-10 text-center">
                    <motion.p
                      animate={{ opacity: 1, y: 0 }}
                      className={
                        landedTopic
                          ? "max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl"
                          : "text-lg text-muted-foreground"
                      }
                      initial={{ opacity: 0, y: 3 }}
                      key={landedTopic?.id ?? "placeholder"}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.16 }}
                    >
                      {landedTopic?.title ?? "Tap spin for topic"}
                    </motion.p>
                  </CardContent>
                </Card>

                {hasSpinResult && landedTopic ? (
                  <div className="mt-6 rounded-2xl bg-muted p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                      {selectedDifficulty} challenge
                    </p>
                    <p className="mt-2 text-sm leading-6">
                      {buildDifficultyChallenge(
                        landedTopic.challenge,
                        selectedDifficulty
                      )}
                    </p>
                  </div>
                ) : null}

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {hasSpinResult ? (
                    <>
                      <Button onClick={acceptTopic} type="button">
                        Accept topic
                      </Button>
                      <Button
                        onClick={spinTopic}
                        type="button"
                        variant="secondary"
                      >
                        <RotateCw className="mr-2 h-4 w-4" aria-hidden="true" />
                        Spin again
                      </Button>
                    </>
                  ) : (
                    <Button disabled={isSpinning} onClick={spinTopic} type="button">
                      <RotateCw
                        className={
                          isSpinning
                            ? "mr-2 h-4 w-4 animate-spin"
                            : "mr-2 h-4 w-4"
                        }
                        aria-hidden="true"
                      />
                      {isSpinning ? "Spinning" : "Spin for a topic"}
                    </Button>
                  )}
                </div>
              </div>
            </motion.section>
          ) : null}

          {step === "timer" && selectedTopic && selectedDifficulty ? (
            <motion.section
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key="timer"
              transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
            >
              <button
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                onClick={() => setStep("topic")}
                type="button"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to topic
              </button>

              <header className="mx-auto mb-10 max-w-3xl text-center">
                <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                  How long do you want to focus?
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Choose a realistic window. You can finish early if the
                  learning loop feels complete.
                </p>
              </header>

              <DurationPicker
                difficulty={selectedDifficulty}
                onChange={setDurationMinutes}
                value={durationMinutes}
              />

              <form action={startSession} className="mx-auto mt-10 max-w-md">
                <input name="topicId" type="hidden" value={selectedTopic.id} />
                <input
                  name="challengeId"
                  type="hidden"
                  value={selectedTopic.challengeId}
                />
                <input
                  name="difficultyLevel"
                  type="hidden"
                  value={selectedDifficulty}
                />
                <input
                  name="durationMinutes"
                  type="hidden"
                  value={durationMinutes}
                />
                <Button className="w-full" type="submit">
                  Start focus session
                </Button>
              </form>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
