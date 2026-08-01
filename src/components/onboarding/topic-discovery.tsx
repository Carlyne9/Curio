"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  Atom,
  Cpu,
  Globe2,
  Music2,
  Palette,
  RotateCw,
  Scale,
  type LucideIcon
} from "lucide-react";

import { startSession } from "@/app/(app)/workspace/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { topicCategories, topicSeeds, type TopicSeed } from "@/data/topic-seeds";
import {
  buildDifficultyChallenge,
  researchDifficulties,
  type ResearchDifficulty
} from "@/lib/topics";

type TopicDiscoveryProps = {
  error?: string;
};

type DiscoveryStep = "field" | "difficulty" | "topic" | "timer";

const categoryIcons: Record<string, LucideIcon> = {
  Science: Atom,
  Music: Music2,
  Art: Palette,
  Philosophy: Scale,
  Technology: Cpu,
  Culture: Globe2
};

const wheelColors = ["#6457f9", "#f7c873", "#e98aa4", "#62b6a6"];
const quickDurations = [15, 25, 45, 60];

export function TopicDiscovery({ error }: TopicDiscoveryProps) {
  const prefersReducedMotion = useReducedMotion();
  const [step, setStep] = useState<DiscoveryStep>("field");
  const [category, setCategory] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<TopicSeed | null>(null);
  const [pendingTopic, setPendingTopic] = useState<TopicSeed | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [pendingNumber, setPendingNumber] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ResearchDifficulty | "">("");
  const [durationMinutes, setDurationMinutes] = useState(25);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const categoryTopics = useMemo(
    () => topicSeeds.filter((topic) => topic.category === category),
    [category]
  );
  const wheelSlots = categoryTopics.slice(0, 12);
  const segmentSize = 30;
  const wheelBackground = `conic-gradient(${wheelSlots
    .map(
      (_, index) =>
        `${wheelColors[index % wheelColors.length]} ${index * segmentSize}deg ${(index + 1) * segmentSize}deg`
    )
    .join(", ")})`;
  const selectedDifficultyOption = researchDifficulties.find(
    (difficulty) => difficulty.value === selectedDifficulty
  );

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSelectedTopic(null);
    setPendingTopic(null);
    setSelectedNumber(null);
    setPendingNumber(null);
    setSelectedDifficulty("");
    setIsSpinning(false);
    setStep("difficulty");
  }

  function returnToFields() {
    setSelectedTopic(null);
    setPendingTopic(null);
    setSelectedNumber(null);
    setPendingNumber(null);
    setSelectedDifficulty("");
    setIsSpinning(false);
    setStep("field");
  }

  function spinWheel() {
    if (wheelSlots.length < 12 || !selectedDifficulty || isSpinning) {
      return;
    }

    let selectedIndex = Math.floor(Math.random() * wheelSlots.length);

    if (wheelSlots.length > 1 && selectedIndex + 1 === selectedNumber) {
      selectedIndex = (selectedIndex + 1) % wheelSlots.length;
    }

    const nextTopic = wheelSlots[selectedIndex];

    if (!nextTopic) {
      return;
    }

    const targetRotation = 360 - (selectedIndex * segmentSize + segmentSize / 2);
    setPendingTopic(nextTopic);
    setPendingNumber(selectedIndex + 1);
    setSelectedTopic(null);
    setSelectedNumber(null);
    setIsSpinning(true);
    setRotation((current) => {
      const normalizedRotation = ((current % 360) + 360) % 360;
      const alignment = (targetRotation - normalizedRotation + 360) % 360;
      return current + (prefersReducedMotion ? 360 : 1440) + alignment;
    });
  }

  function chooseDifficulty(difficulty: ResearchDifficulty) {
    setSelectedDifficulty(difficulty);
    setSelectedTopic(null);
    setPendingTopic(null);
    setSelectedNumber(null);
    setPendingNumber(null);
    setStep("topic");
  }

  function returnToDifficulty() {
    setSelectedTopic(null);
    setPendingTopic(null);
    setSelectedNumber(null);
    setPendingNumber(null);
    setIsSpinning(false);
    setStep("difficulty");
  }

  function finishSpin() {
    if (!isSpinning) {
      return;
    }

    setSelectedTopic(pendingTopic);
    setSelectedNumber(pendingNumber);
    setPendingTopic(null);
    setPendingNumber(null);
    setIsSpinning(false);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-center gap-2" aria-label="Onboarding progress">
          {["field", "difficulty", "topic", "timer"].map((stage, index) => {
            const stages: DiscoveryStep[] = ["field", "difficulty", "topic", "timer"];
            const currentIndex = stages.indexOf(step);
            const isReached = index <= currentIndex;

            return (
              <span
                aria-hidden="true"
                className={
                  isReached
                    ? "h-2 w-12 rounded-full bg-primary transition-colors"
                    : "h-2 w-12 rounded-full bg-muted transition-colors"
                }
                key={stage}
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
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                  Step 1 of 4
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
                  What are you curious about today?
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Start with the part of the world you feel curious about today.
                </p>
              </header>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {topicCategories.map((topicCategory) => {
                  const Icon = categoryIcons[topicCategory] ?? Globe2;

                  return (
                    <button
                      className="group min-h-44 rounded-[2rem] border bg-card p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
                      key={topicCategory}
                      onClick={() => chooseCategory(topicCategory)}
                      type="button"
                    >
                      <Icon
                        className="mb-10 h-8 w-8 text-primary transition-transform group-hover:scale-110"
                        aria-hidden="true"
                      />
                      <span className="text-xl font-semibold">{topicCategory}</span>
                      <span className="mt-2 block text-sm text-muted-foreground">
                        12 starter topics
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
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                  Step 2 of 4 · {category}
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">
                  Choose your research difficulty.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  This changes the depth of the challenge, not which topics can appear.
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
                          ? "min-h-64 rounded-[2rem] border border-primary bg-primary p-6 text-left text-primary-foreground shadow-xl shadow-primary/20"
                          : "min-h-64 rounded-[2rem] border bg-card p-6 text-left transition hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10"
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
                      <span className="mt-12 block text-2xl font-semibold">{difficulty.label}</span>
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
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                  Step 3 of 4 · {category} ·{" "}
                  <span className="capitalize">{selectedDifficulty}</span>
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Spin for a topic.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  The topics stay hidden. When the pointer lands on a number, Curio reveals the
                  topic behind it.
                </p>
              </header>

              <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                <Card className="overflow-hidden">
                  <CardContent className="py-8 sm:py-12">
                    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
                      <div className="absolute left-1/2 top-0 z-20 h-0 w-0 -translate-x-1/2 border-x-[18px] border-t-[32px] border-x-transparent border-t-foreground" />
                      <motion.div
                        animate={{ rotate: rotation }}
                        className="absolute inset-3 rounded-full border-[14px] border-card shadow-2xl shadow-black/15"
                        onAnimationComplete={finishSpin}
                        style={{ background: wheelBackground }}
                        transition={{
                          duration: prefersReducedMotion ? 0.15 : 2.8,
                          ease: [0.12, 0.8, 0.2, 1]
                        }}
                      >
                        {wheelSlots.map((topic, index) => {
                          const angle = index * segmentSize + segmentSize / 2;
                          const radians = (angle * Math.PI) / 180;
                          const left = 50 + 40 * Math.sin(radians);
                          const top = 50 - 40 * Math.cos(radians);

                          return (
                            <span
                              className="absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-card text-sm font-bold shadow sm:h-11 sm:w-11"
                              key={topic.id}
                              style={{ left: `${left}%`, top: `${top}%` }}
                            >
                              {index + 1}
                            </span>
                          );
                        })}
                      </motion.div>
                      <Button
                        className="absolute left-1/2 top-1/2 z-30 h-28 w-28 -translate-x-1/2 -translate-y-1/2 shadow-xl sm:h-32 sm:w-32"
                        disabled={!selectedDifficulty || isSpinning}
                        onClick={spinWheel}
                        type="button"
                      >
                        <RotateCw className="mr-2 h-5 w-5" aria-hidden="true" />
                        {isSpinning ? "Spinning" : "Spin"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:sticky lg:top-6">
                  <CardHeader>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                      Selected level
                    </p>
                    <CardTitle className="mt-2 text-2xl">
                      {selectedDifficultyOption?.label}
                    </CardTitle>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {selectedDifficultyOption?.description}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedTopic ? (
                      <div className="space-y-4 border-t pt-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                            Number {selectedNumber} reveals
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold">{selectedTopic.title}</h2>
                        </div>
                        <div className="rounded-2xl bg-muted p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                            {selectedDifficulty} challenge
                          </p>
                          <p className="mt-2 text-sm leading-6">
                            {buildDifficultyChallenge(
                              selectedTopic.challenge,
                              selectedDifficulty
                            )}
                          </p>
                        </div>
                        <div className="grid gap-2">
                          <Button onClick={() => setStep("timer")} type="button">
                            Accept topic
                          </Button>
                          <Button onClick={spinWheel} type="button" variant="secondary">
                            Spin again
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="border-t pt-4 text-sm leading-6 text-muted-foreground">
                        Spin the wheel to reveal one of twelve hidden {category} topics.
                      </p>
                    )}
                  </CardContent>
                </Card>
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
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-primary">
                  Step 4 of 4
                </p>
                <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                  How long do you want to focus?
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  Choose a realistic window. You can finish early if the learning loop feels
                  complete.
                </p>
              </header>

              <Card className="mx-auto max-w-2xl">
                <CardHeader className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {selectedTopic.title} ·{" "}
                    <span className="capitalize">{selectedDifficulty}</span>
                  </p>
                  <CardTitle className="mt-4 text-6xl tabular-nums">
                    {durationMinutes}
                    <span className="ml-2 text-xl font-medium text-muted-foreground">minutes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-7">
                  <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                    <span>10 min</span>
                    <span>60 min</span>
                  </div>
                  <input
                    aria-label="Session duration in minutes"
                    className="w-full accent-primary"
                    max="60"
                    min="10"
                    onChange={(event) => setDurationMinutes(Number(event.target.value))}
                    step="5"
                    type="range"
                    value={durationMinutes}
                  />
                  <div className="flex flex-wrap justify-center gap-2">
                    {quickDurations.map((duration) => (
                      <button
                        aria-pressed={durationMinutes === duration}
                        className={
                          durationMinutes === duration
                            ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                            : "rounded-full bg-muted px-4 py-2 text-sm font-semibold"
                        }
                        key={duration}
                        onClick={() => setDurationMinutes(duration)}
                        type="button"
                      >
                        {duration} min
                      </button>
                    ))}
                  </div>

                  <form action={startSession}>
                    <input name="topicId" type="hidden" value={selectedTopic.id} />
                    <input name="challengeId" type="hidden" value={selectedTopic.challengeId} />
                    <input name="difficultyLevel" type="hidden" value={selectedDifficulty} />
                    <input name="durationMinutes" type="hidden" value={durationMinutes} />
                    <Button className="w-full" type="submit">
                      Start focus session
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  );
}
