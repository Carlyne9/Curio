"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Clock3,
  Coffee,
  FileText,
  Lightbulb,
  Plus,
  RotateCw,
  Save,
  Search,
  Sparkles,
  Upload,
  WandSparkles
} from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./product-flow-prototype.module.css";

type PrototypeStep = "category" | "difficulty" | "wheel" | "timer";
type PrototypeView = "setup" | "workspace";

const PROTOTYPE_STAGES: PrototypeStep[] = [
  "category",
  "difficulty",
  "wheel",
  "timer"
];

const categories = [
  {
    name: "Science",
    description: "Nature, discovery, and the physical world",
    icon: "/design-system/icons/categories/science.webp"
  },
  {
    name: "Music",
    description: "Sound, culture, memory, and expression",
    icon: "/design-system/icons/categories/music.webp"
  },
  {
    name: "Art",
    description: "Images, ideas, design, and visual culture",
    icon: "/design-system/icons/categories/art.webp"
  },
  {
    name: "Philosophy",
    description: "Meaning, ethics, knowledge, and existence",
    icon: "/design-system/icons/categories/philosophy.webp"
  },
  {
    name: "History",
    description: "People, power, change, and memory",
    icon: "/design-system/icons/categories/history.webp"
  },
  {
    name: "Technology",
    description: "Tools, systems, invention, and society",
    icon: "/design-system/icons/categories/technology.webp"
  }
] as const;

const difficulties = [
  {
    id: "low",
    title: "Low",
    description:
      "A broad, accessible topic with a clear starting point and familiar ideas."
  },
  {
    id: "medium",
    title: "Medium",
    description:
      "A more focused topic with added context, nuance, and room for comparison."
  },
  {
    id: "high",
    title: "High",
    description:
      "A complex topic that calls for deeper analysis and competing perspectives."
  }
] as const;

const topicTemplates = [
  "How has {field} changed the way people understand uncertainty?",
  "Which hidden assumptions shape the most common ideas in {field}?",
  "Why do experts in {field} disagree even when they share the same evidence?",
  "What important discovery in {field} began with an accidental observation?",
  "How does culture influence what counts as progress in {field}?",
  "Which idea in {field} sounds simple but becomes complex under closer study?",
  "How have tools changed the questions people can ask in {field}?",
  "What does {field} reveal about the limits of human perception?",
  "Which overlooked person or community reshaped modern {field}?",
  "How does language change the way knowledge is communicated in {field}?",
  "What ethical tension is becoming more important in {field}?",
  "Which popular belief about {field} is most often misunderstood?"
] as const;

const wheelColors = [
  "#6C4DFF",
  "#4566F2",
  "#A349E8",
  "#3A7DEB",
  "#D94CBE",
  "#5364D8",
  "#8A56E8",
  "#2E8BCF",
  "#B94CA8",
  "#5260BA",
  "#764FCA",
  "#397AB5"
] as const;

const wheelBackground = `conic-gradient(${wheelColors
  .map((color, index) => `${color} ${index * 30}deg ${(index + 1) * 30}deg`)
  .join(", ")})`;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function ProductFlowPrototype() {
  const [view, setView] = useState<PrototypeView>("setup");
  const [step, setStep] = useState<PrototypeStep>("category");
  const [category, setCategory] = useState("Science");
  const [difficulty, setDifficulty] = useState("medium");
  const [duration, setDuration] = useState(30);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(duration * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [workspaceMode, setWorkspaceMode] = useState<"research" | "reflection">(
    "research"
  );

  const selectedDifficulty =
    difficulties.find((item) => item.id === difficulty) ?? difficulties[1];
  const selectedTopic = useMemo(() => {
    if (!selectedNumber) {
      return null;
    }

    return topicTemplates[selectedNumber - 1].replace(
      "{field}",
      category.toLowerCase()
    );
  }, [category, selectedNumber]);

  useEffect(() => {
    if (view !== "workspace" || !timerRunning || remainingSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [remainingSeconds, timerRunning, view]);

  function chooseCategory(nextCategory: string) {
    setCategory(nextCategory);
    setSelectedNumber(null);
    setStep("difficulty");
  }

  function chooseDifficulty(nextDifficulty: string) {
    setDifficulty(nextDifficulty);
    setSelectedNumber(null);
    setStep("wheel");
  }

  function spinWheel() {
    if (isSpinning) {
      return;
    }

    const nextNumber = Math.floor(Math.random() * 12) + 1;
    const segmentCenter = (nextNumber - 1) * 30 + 15;
    const nextRotation =
      Math.ceil(rotation / 360) * 360 + 5 * 360 + (360 - segmentCenter);

    setSelectedNumber(null);
    setIsSpinning(true);
    setRotation(nextRotation);

    window.setTimeout(() => {
      setSelectedNumber(nextNumber);
      setIsSpinning(false);
    }, 2300);
  }

  function enterWorkspace() {
    setRemainingSeconds(duration * 60);
    setTimerRunning(true);
    setWorkspaceMode("research");
    setView("workspace");
  }

  function restartPrototype() {
    setView("setup");
    setStep("category");
    setSelectedNumber(null);
    setTimerRunning(false);
    setRemainingSeconds(duration * 60);
  }

  return (
    <main className={styles.page}>
      <header className={styles.previewHeader}>
        <div className={styles.brandRow}>
          <Link className={styles.brand} href="/design-system">
            <span className={styles.brandMark}>
              <Sparkles aria-hidden="true" size={17} />
            </span>
            Curio / Product Lab
          </Link>
          <span className={styles.prototypeBadge}>
            Interactive prototype · nothing is saved
          </span>
        </div>

        <div className={styles.viewTabs}>
          <button
            className={view === "setup" ? styles.viewTabActive : styles.viewTab}
            onClick={() => setView("setup")}
            type="button"
          >
            Guided setup
          </button>
          <button
            className={
              view === "workspace" ? styles.viewTabActive : styles.viewTab
            }
            onClick={() => {
              setRemainingSeconds(duration * 60);
              setView("workspace");
            }}
            type="button"
          >
            Research workspace
          </button>
        </div>
      </header>

      {view === "setup" ? (
        <div className={styles.setupShell}>
          <div className={styles.stepBar} aria-label="Guided setup progress">
            {PROTOTYPE_STAGES.map((stage, index) => {
              const currentIndex = PROTOTYPE_STAGES.indexOf(step);
              const isCompleted = index < currentIndex;
              const isActive = index === currentIndex;

              return (
                <span
                  aria-hidden={isActive ? undefined : true}
                  aria-label={
                    isActive ? `Current step ${index + 1}` : undefined
                  }
                  className={cn(
                    styles.stepBarSegment,
                    (isCompleted || isActive) && styles.stepBarSegmentFilled,
                    isActive && styles.stepBarSegmentActive
                  )}
                  key={stage}
                />
              );
            })}
          </div>
          <section className={styles.stage}>
            {step === "category" ? (
              <div className={styles.stageContent}>
                <StageHeading
                  title={"What are you\ncurious about today?"}
                  body="Start with the part of the world you feel curious about today."
                />
                <div className={styles.categoryGrid}>
                  {categories.map(({ name, description, icon }) => (
                    <button
                      className={styles.choiceCard}
                      key={name}
                      onClick={() => chooseCategory(name)}
                      type="button"
                    >
                      <span className={styles.choiceTitleRow}>
                        <span className={styles.choiceIcon}>
                          <Image
                            alt=""
                            aria-hidden="true"
                            height={720}
                            src={icon}
                            width={720}
                          />
                        </span>
                        <strong>{name}</strong>
                      </span>
                      <span className={styles.choiceDescription}>
                        {description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === "difficulty" ? (
              <div className={styles.stageContent}>
                <BackButton
                  label="Choose another field"
                  onClick={() => setStep("category")}
                />
                <StageHeading
                  eyebrow={category}
                  title="Choose your topic difficulty."
                  body="Choose how simple or challenging you want your topic to be. This changes the complexity of the question you receive."
                />
                <div className={styles.difficultyGrid}>
                  {difficulties.map((item) => (
                    <button
                      aria-pressed={difficulty === item.id}
                      className={
                        difficulty === item.id
                          ? styles.difficultySelected
                          : styles.difficultyCard
                      }
                      key={item.id}
                      onClick={() => chooseDifficulty(item.id)}
                      type="button"
                    >
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {step === "wheel" ? (
              <div className={styles.stageContent}>
                <BackButton
                  label="Change difficulty"
                  onClick={() => setStep("difficulty")}
                />
                <StageHeading
                  eyebrow={`${category} · ${selectedDifficulty.title}`}
                  title="Spin for a topic."
                  body="The twelve topics remain hidden. The number under the pointer reveals your prompt."
                />

                <div className={styles.topicReveal} aria-live="polite">
                  {selectedTopic ? (
                    <>
                      <span>Number {selectedNumber} revealed</span>
                      <strong>{selectedTopic}</strong>
                    </>
                  ) : (
                    <>
                      <span>Your topic will appear here</span>
                      <strong>
                        {isSpinning
                          ? "Finding a question worth following…"
                          : "Spin when you’re ready."}
                      </strong>
                    </>
                  )}
                </div>

                <div className={styles.wheelLayout}>
                  <div className={styles.wheelStage}>
                    <div className={styles.pointer} />
                    <div
                      className={styles.wheel}
                      style={{
                        background: wheelBackground,
                        transform: `rotate(${rotation}deg)`
                      }}
                    >
                      {topicTemplates.map((_, index) => {
                        const angle = index * 30 + 15;
                        const radians = (angle * Math.PI) / 180;
                        const left = 50 + 40 * Math.sin(radians);
                        const top = 50 - 40 * Math.cos(radians);

                        return (
                          <span
                            className={styles.wheelNumber}
                            key={index}
                            style={{ left: `${left}%`, top: `${top}%` }}
                          >
                            {index + 1}
                          </span>
                        );
                      })}
                    </div>
                    <button
                      className={styles.spinButton}
                      disabled={isSpinning}
                      onClick={spinWheel}
                      type="button"
                    >
                      <RotateCw aria-hidden="true" size={20} />
                      {isSpinning ? "Spinning" : "Spin"}
                    </button>
                  </div>

                  <aside className={styles.contextCard}>
                    <span className={styles.contextIcon}>
                      <WandSparkles aria-hidden="true" size={20} />
                    </span>
                    <p className={styles.eyebrow}>Your setup</p>
                    <h3>{category}</h3>
                    <p>{selectedDifficulty.description}</p>
                    <dl>
                      <div>
                        <dt>Difficulty</dt>
                        <dd>{selectedDifficulty.title}</dd>
                      </div>
                      <div>
                        <dt>Topic pool</dt>
                        <dd>12 hidden prompts</dd>
                      </div>
                    </dl>
                    <button
                      className={styles.primaryButton}
                      disabled={!selectedTopic}
                      onClick={() => setStep("timer")}
                      type="button"
                    >
                      Set focus time <ArrowRight aria-hidden="true" size={16} />
                    </button>
                  </aside>
                </div>
              </div>
            ) : null}

            {step === "timer" ? (
              <div className={styles.stageContent}>
                <BackButton
                  label="Back to topic"
                  onClick={() => setStep("wheel")}
                />
                <StageHeading
                  eyebrow={`${category} · ${selectedDifficulty.title}`}
                  title="How long do you want to focus?"
                  body="Choose a realistic research window from ten minutes to one hour."
                />
                <div className={styles.timerCard}>
                  <div className={styles.timerSummary}>
                    <span className={styles.timerIcon}>
                      <Clock3 aria-hidden="true" size={24} />
                    </span>
                    <p>{selectedTopic}</p>
                    <strong>{duration}</strong>
                    <span>minutes</span>
                  </div>
                  <div className={styles.timerControls}>
                    <div className={styles.rangeLabels}>
                      <span>10 minutes</span>
                      <span>60 minutes</span>
                    </div>
                    <input
                      aria-label="Focus duration"
                      className={styles.range}
                      max="60"
                      min="10"
                      onChange={(event) =>
                        setDuration(Number(event.target.value))
                      }
                      step="5"
                      type="range"
                      value={duration}
                    />
                    <div className={styles.quickTimes}>
                      {[10, 20, 30, 45, 60].map((time) => (
                        <button
                          className={
                            duration === time
                              ? styles.quickTimeActive
                              : styles.quickTime
                          }
                          key={time}
                          onClick={() => setDuration(time)}
                          type="button"
                        >
                          {time} min
                        </button>
                      ))}
                    </div>
                    <div className={styles.breakNote}>
                      <Coffee aria-hidden="true" size={18} />
                      <span>
                        A short optional break becomes available halfway
                        through.
                      </span>
                    </div>
                    <button
                      className={styles.primaryButton}
                      onClick={enterWorkspace}
                      type="button"
                    >
                      Enter preview workspace{" "}
                      <ArrowRight aria-hidden="true" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </section>
        </div>
      ) : (
        <section className={styles.workspace}>
          <header className={styles.workspaceHeader}>
            <div>
              <div className={styles.workspaceMeta}>
                <span>{category}</span>
                <span>·</span>
                <span>{selectedDifficulty.title}</span>
                <span className={styles.savedBadge}>
                  <Check aria-hidden="true" size={12} /> Saved
                </span>
              </div>
              <h1>
                {selectedTopic ??
                  topicTemplates[0].replace("{field}", category.toLowerCase())}
              </h1>
              <p>
                Challenge: Explain the strongest evidence, then identify one
                unresolved question.
              </p>
            </div>

            <div className={styles.focusTimer}>
              <span className={styles.timerIconSmall}>
                <Clock3 aria-hidden="true" size={18} />
              </span>
              <div>
                <span>
                  {timerRunning ? "Focus in progress" : "Focus paused"}
                </span>
                <strong>{formatTime(remainingSeconds)}</strong>
              </div>
              <button
                onClick={() => setTimerRunning((current) => !current)}
                type="button"
              >
                {timerRunning ? "Pause preview" : "Resume preview"}
              </button>
            </div>
          </header>

          <div className={styles.workspaceProgress}>
            <div
              style={{
                width: `${Math.min(100, ((duration * 60 - remainingSeconds) / (duration * 60)) * 100)}%`
              }}
            />
          </div>

          <nav
            className={styles.workspaceModeTabs}
            aria-label="Workspace mode preview"
          >
            <button
              className={
                workspaceMode === "research"
                  ? styles.modeTabActive
                  : styles.modeTab
              }
              onClick={() => setWorkspaceMode("research")}
              type="button"
            >
              Research
            </button>
            <button
              className={
                workspaceMode === "reflection"
                  ? styles.modeTabActive
                  : styles.modeTab
              }
              onClick={() => setWorkspaceMode("reflection")}
              type="button"
            >
              Reflection preview
            </button>
          </nav>

          {workspaceMode === "research" ? (
            <div className={styles.workspaceGrid}>
              <aside className={styles.workspacePanel}>
                <div className={styles.panelHeading}>
                  <div>
                    <span className={styles.eyebrow}>Evidence</span>
                    <h2>Sources</h2>
                  </div>
                  <button aria-label="Add a source" type="button">
                    <Plus aria-hidden="true" size={17} />
                  </button>
                </div>
                <div className={styles.sourceCard}>
                  <span className={styles.sourceIcon}>
                    <FileText aria-hidden="true" size={16} />
                  </span>
                  <div>
                    <strong>Introduction to the topic</strong>
                    <span>Primary overview · 8 min read</span>
                  </div>
                </div>
                <div className={styles.sourceCard}>
                  <span className={styles.sourceIcon}>
                    <BookOpen aria-hidden="true" size={16} />
                  </span>
                  <div>
                    <strong>Competing explanations</strong>
                    <span>Research paper · Saved</span>
                  </div>
                </div>
                <button className={styles.secondaryButton} type="button">
                  <Plus aria-hidden="true" size={15} /> Add source
                </button>

                <div className={styles.claimSection}>
                  <span className={styles.eyebrow}>Key claims</span>
                  <div className={styles.claimCard}>
                    The evidence is strongest when multiple explanations are
                    compared.
                  </div>
                  <button className={styles.textButton} type="button">
                    + Capture another claim
                  </button>
                </div>
              </aside>

              <article className={styles.notesPanel}>
                <div className={styles.notesToolbar}>
                  <div>
                    <button type="button">B</button>
                    <button type="button">I</button>
                    <button type="button">H2</button>
                    <button type="button">• List</button>
                  </div>
                  <span>Autosaved just now</span>
                </div>
                <textarea
                  aria-label="Prototype research notes"
                  className={styles.notesArea}
                  defaultValue={`What I understand so far\n\nThe central idea is not just about collecting facts. It is about comparing explanations and noticing which assumptions shape the evidence.\n\nOne connection I want to explore further is…`}
                />
                <div className={styles.uploadStrip}>
                  <span className={styles.uploadIcon}>
                    <Upload aria-hidden="true" size={17} />
                  </span>
                  <div>
                    <strong>Have handwritten notes?</strong>
                    <span>
                      Upload images or a PDF to keep them with this session.
                    </span>
                  </div>
                  <button type="button">Upload</button>
                </div>
              </article>

              <aside className={styles.workspacePanel}>
                <div className={styles.panelHeading}>
                  <div>
                    <span className={styles.eyebrow}>Curio intelligence</span>
                    <h2>AI Coach</h2>
                  </div>
                  <span className={styles.aiIcon}>
                    <Sparkles aria-hidden="true" size={18} />
                  </span>
                </div>
                <div className={styles.coachCard}>
                  <span className={styles.coachGlow} />
                  <strong>Build your understanding first.</strong>
                  <p>
                    Curio will review your notes and claims after reflection,
                    then highlight strengths, gaps, and useful follow-up
                    questions.
                  </p>
                </div>

                <div className={styles.checklist}>
                  <span className={styles.eyebrow}>Session progress</span>
                  {[
                    "Focus timer started",
                    "Notes captured",
                    "One source added"
                  ].map((item) => (
                    <div key={item}>
                      <span className={styles.checkIcon}>
                        <Check aria-hidden="true" size={12} />
                      </span>
                      {item}
                    </div>
                  ))}
                  <div>
                    <span className={styles.emptyCheck} />
                    Complete reflection
                  </div>
                </div>

                <button
                  className={styles.primaryButton}
                  onClick={() => setWorkspaceMode("reflection")}
                  type="button"
                >
                  Preview reflection <ArrowRight aria-hidden="true" size={16} />
                </button>
              </aside>
            </div>
          ) : (
            <div className={styles.reflectionShell}>
              <div className={styles.reflectionIntro}>
                <span className={styles.reflectionIcon}>
                  <Lightbulb aria-hidden="true" size={24} />
                </span>
                <p className={styles.eyebrow}>Reflection</p>
                <h2>Turn the research into your own understanding.</h2>
                <p>
                  Reflection helps Curio understand what became clearer, what
                  remains uncertain, and where the AI Coach should challenge you
                  next.
                </p>
              </div>
              <div className={styles.reflectionFields}>
                <label>
                  What became clearer during this session?
                  <textarea defaultValue="I now understand that…" />
                </label>
                <label>
                  What question remains unresolved?
                  <textarea defaultValue="I still want to know…" />
                </label>
                <label>
                  How confident are you now?
                  <div className={styles.confidenceRow}>
                    {["Still unsure", "Somewhat clear", "Confident"].map(
                      (label, index) => (
                        <button
                          className={index === 1 ? styles.confidenceActive : ""}
                          key={label}
                          type="button"
                        >
                          {label}
                        </button>
                      )
                    )}
                  </div>
                </label>
                <button className={styles.primaryButton} type="button">
                  Generate preview AI review{" "}
                  <Sparkles aria-hidden="true" size={16} />
                </button>
              </div>
            </div>
          )}

          <footer className={styles.workspaceFooter}>
            <button
              className={styles.textButton}
              onClick={restartPrototype}
              type="button"
            >
              <ArrowLeft aria-hidden="true" size={15} /> Restart guided setup
            </button>
            <div>
              <span>This is a visual prototype. Changes are not saved.</span>
              <button className={styles.secondaryButton} type="button">
                <Save aria-hidden="true" size={15} /> Finish preview
              </button>
            </div>
          </footer>
        </section>
      )}
    </main>
  );
}

function StageHeading({
  eyebrow,
  title,
  body
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <header className={styles.stageHeading}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2>{title}</h2>
      <p>{body}</p>
    </header>
  );
}

function BackButton({
  label,
  onClick
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={styles.backButton} onClick={onClick} type="button">
      <ArrowLeft aria-hidden="true" size={15} /> {label}
    </button>
  );
}
