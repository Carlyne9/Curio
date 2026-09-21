import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  Brain,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  FileText,
  FlaskConical,
  Info,
  LayoutGrid,
  Layers,
  Lightbulb,
  List,
  Loader2,
  Menu,
  MessageCircle,
  Palette,
  Ruler,
  Search,
  Sparkles,
  Type,
  Upload,
  XCircle,
  Zap
} from "lucide-react";

import { cn } from "@/lib/utils";

import styles from "./design-system.module.css";

const LIGHT_MIX: Record<number, number> = { 50: 92, 100: 84, 200: 68, 300: 50, 400: 25 };
const DARK_MIX: Record<number, number> = { 600: 12, 700: 28, 800: 44, 900: 60 };
const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

function rampColor(base: string, step: number) {
  if (step === 500) return base;
  if (step < 500) return `color-mix(in oklch, white ${LIGHT_MIX[step]}%, ${base})`;
  return `color-mix(in oklch, black ${DARK_MIX[step]}%, ${base})`;
}

const colorRamps = [
  {
    name: "Violet",
    token: "brand",
    base: "#6C4DFF",
    role: "Primary — main actions, focus states, AI moments"
  },
  {
    name: "Electric",
    token: "focus",
    base: "#3564FF",
    role: "Secondary — links, informational accents"
  },
  {
    name: "Aqua",
    token: "success",
    base: "#42D3B2",
    role: "Success — completion, positive status"
  },
  {
    name: "Coral",
    token: "danger",
    base: "#FF6B7A",
    role: "Destructive — errors, irreversible actions"
  },
  {
    name: "Sun",
    token: "reward",
    base: "#FFD166",
    role: "Reward — celebration, delight moments"
  },
  {
    name: "Ink",
    token: "neutral",
    base: "#111832",
    role: "Neutrals — text, borders, surfaces"
  }
] as const;

const surfaceSwatches = [
  { name: "Canvas", token: "canvas-50", value: "#F6F7FB" },
  { name: "Surface", token: "surface-0", value: "#FFFFFF" },
  { name: "Surface soft", token: "surface-100", value: "#F0F2F8" },
  { name: "Line", token: "border-200", value: "#E2E6F0" }
] as const;

const semanticText = [
  { label: "Foreground", color: "var(--ds-ink)" },
  { label: "Muted", color: "var(--ds-ink-soft)" },
  { label: "Primary", color: "var(--ds-violet)" },
  { label: "Secondary", color: "var(--ds-electric)" },
  { label: "Success", color: "var(--ds-aqua)" },
  { label: "Destructive", color: "var(--ds-coral)" },
  { label: "Reward", color: "var(--ds-sun)" }
] as const;

const typeScale = [
  {
    label: "Display",
    meta: "56–74px / 670 / -7%",
    sample: "Ideas deserve room to grow.",
    style: {
      fontSize: "clamp(2.6rem, 5.5vw, 4.6rem)",
      fontWeight: 670,
      letterSpacing: "-0.07em",
      lineHeight: 0.98
    }
  },
  {
    label: "H1",
    meta: "36px / 680 / -4%",
    sample: "Research workspace",
    style: { fontSize: 36, fontWeight: 680, letterSpacing: "-0.04em", lineHeight: 1.08 }
  },
  {
    label: "H2",
    meta: "28px / 670 / -3.5%",
    sample: "What changed in your understanding?",
    style: { fontSize: 28, fontWeight: 670, letterSpacing: "-0.035em", lineHeight: 1.14 }
  },
  {
    label: "H3",
    meta: "22px / 690 / -2.5%",
    sample: "Sources and claims",
    style: { fontSize: 22, fontWeight: 690, letterSpacing: "-0.025em", lineHeight: 1.2 }
  },
  {
    label: "H4",
    meta: "18px / 680 / -1.5%",
    sample: "Session summary",
    style: { fontSize: 18, fontWeight: 680, letterSpacing: "-0.015em", lineHeight: 1.3 }
  },
  {
    label: "H5",
    meta: "16px / 660",
    sample: "Focus timer",
    style: { fontSize: 16, fontWeight: 660, lineHeight: 1.4 }
  },
  {
    label: "H6",
    meta: "14px / 700 / uppercase",
    sample: "Section heading",
    style: {
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: "0.04em",
      textTransform: "uppercase" as const,
      lineHeight: 1.4
    }
  },
  {
    label: "Body",
    meta: "15px / 500 / 1.7",
    sample: "Capture the idea in your own words before moving on.",
    style: { fontSize: 15, fontWeight: 500, lineHeight: 1.7 }
  },
  {
    label: "Body small",
    meta: "13px / 500 / 1.6",
    sample: "Curio found a clear explanation and two supporting claims.",
    style: { fontSize: 13, fontWeight: 500, lineHeight: 1.6 }
  },
  {
    label: "Label",
    meta: "12px / 700 / +11%",
    sample: "Focus session · 24:18",
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.11em",
      textTransform: "uppercase" as const
    }
  },
  {
    label: "Caption",
    meta: "11px / 600 / muted",
    sample: "Last edited 2 minutes ago",
    style: { fontSize: 11, fontWeight: 600, color: "var(--ds-ink-soft)" }
  }
] as const;

const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;

const radiusScale = [
  { name: "sm", value: 8, use: "Chips, badges, small controls" },
  { name: "md", value: 14, use: "Buttons, inputs" },
  { name: "lg", value: 22, use: "Cards, panels" },
  { name: "xl", value: 28, use: "Section surfaces, modals" },
  { name: "full", value: 999, use: "Pills, avatars" }
] as const;

const elevationLevels = [
  { level: 0, name: "Flush", shadow: "none", use: "Page background, flat sections" },
  {
    level: 1,
    name: "Resting",
    shadow: "0 1px 2px rgba(17,24,50,.06), 0 1px 1px rgba(17,24,50,.04)",
    use: "Cards, list rows"
  },
  {
    level: 2,
    name: "Raised",
    shadow: "0 12px 28px rgba(24,31,72,.09)",
    use: "Dropdowns, popovers"
  },
  {
    level: 3,
    name: "Overlay",
    shadow: "0 22px 50px rgba(42,44,111,.17)",
    use: "Modals, dialogs"
  },
  {
    level: 4,
    name: "Spotlight",
    shadow: "0 32px 80px rgba(42,44,111,.26)",
    use: "Command palette, onboarding"
  }
] as const;

const icons = [
  { icon: Compass, label: "Explore" },
  { icon: Clock3, label: "Focus" },
  { icon: BookOpen, label: "Library" },
  { icon: FileText, label: "Notes" },
  { icon: Brain, label: "AI coach" },
  { icon: Lightbulb, label: "Insight" },
  { icon: FlaskConical, label: "Research" },
  { icon: Upload, label: "Upload" },
  { icon: Search, label: "Search" },
  { icon: Sparkles, label: "Generate" },
  { icon: MessageCircle, label: "Reflect" },
  { icon: Bell, label: "Reminder" }
] as const;

const categoryIcons = [
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

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href="/">
            <span className={styles.brandMark}>
              <Sparkles aria-hidden="true" size={19} strokeWidth={2.4} />
            </span>
            <span>Curio / Lab</span>
          </Link>

          <nav aria-label="Design system sections" className={styles.nav}>
            <a href="#colors">
              <Palette aria-hidden="true" size={17} />
              Colors
            </a>
            <a href="#typography">
              <Type aria-hidden="true" size={17} />
              Typography
            </a>
            <a href="#spacing">
              <Ruler aria-hidden="true" size={17} />
              Spacing &amp; layout
            </a>
            <a href="#elevation">
              <Layers aria-hidden="true" size={17} />
              Elevation
            </a>
            <a href="#components">
              <Menu aria-hidden="true" size={17} />
              Components
            </a>
            <a href="#icons">
              <Zap aria-hidden="true" size={17} />
              Icons
            </a>
            <a href="#illustrations">
              <Sparkles aria-hidden="true" size={17} />
              Illustrations
            </a>
          </nav>

          <div className={styles.sidebarNote}>
            <strong>Experiment only</strong>
            <br />
            This page is isolated from the current product. Approved decisions
            will be converted into shared tokens and components later.
          </div>
        </aside>

        <div className={styles.content}>
          <header className={styles.topbar}>
            <div className={styles.breadcrumb}>
              <span>Curio</span>
              <span>/</span>
              <strong>Experimental design system</strong>
            </div>
            <div className={styles.topbarActions}>
              <Link
                className={cn(styles.button, styles.buttonPrimary)}
                href="/design-system/prototype"
              >
                Open product prototype{" "}
                <ArrowRight aria-hidden="true" size={14} />
              </Link>
              <span className={styles.experimentBadge}>
                <span aria-hidden="true">●</span> v0.2 exploration
              </span>
            </div>
          </header>

          {/* Colors */}
          <section className={styles.section} id="colors">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>01 / Colors</h3>
            </div>

            <div className={cn(styles.surface, styles.colorSection)}>
              <p className={styles.panelLabel}>Brand &amp; status ramps</p>
              <div className={styles.rampList}>
                {colorRamps.map((color) => (
                  <div className={styles.colorGroup} key={color.token}>
                    <div className={styles.colorGroupHeader}>
                      <strong>{color.name}</strong>
                      <code>{color.token}</code>
                      <span>{color.role}</span>
                    </div>
                    <div className={styles.rampRow}>
                      {RAMP_STEPS.map((step) => (
                        <div
                          className={cn(
                            styles.rampSwatch,
                            step === 500 && styles.rampSwatchBase
                          )}
                          key={step}
                          style={{ background: rampColor(color.base, step) }}
                        >
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.colorFoot}>
              <article className={cn(styles.surface, styles.colorSection)}>
                <p className={styles.panelLabel}>Surfaces &amp; backgrounds</p>
                <div className={styles.flatSwatchRow}>
                  {surfaceSwatches.map((surface) => (
                    <div className={styles.flatSwatch} key={surface.token}>
                      <div
                        className={styles.flatSwatchColor}
                        style={{ background: surface.value }}
                      />
                      <div>
                        <strong>{surface.name}</strong>
                        <span>{surface.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className={cn(styles.surface, styles.colorSection)}>
                <p className={styles.panelLabel}>Text on canvas</p>
                <div className={styles.semanticTextRow}>
                  {semanticText.map((item) => (
                    <span key={item.label} style={{ color: item.color }}>
                      {item.label}
                    </span>
                  ))}
                </div>
              </article>
            </div>
          </section>

          {/* Typography */}
          <section className={styles.section} id="typography">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>02 / Typography</h3>
            </div>

            <article className={cn(styles.surface, styles.typeTable)}>
              {typeScale.map((type) => (
                <div className={styles.typeTableRow} key={type.label}>
                  <div className={styles.typeTableMeta}>
                    <span>{type.label}</span>
                    <code>{type.meta}</code>
                  </div>
                  <div style={type.style}>{type.sample}</div>
                </div>
              ))}
            </article>
          </section>

          {/* Spacing & layout */}
          <section className={styles.section} id="spacing">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>03 / Spacing &amp; layout</h3>
            </div>

            <div className={styles.foundationGrid}>
              <article className={cn(styles.surface, styles.tokenPanel)}>
                <p className={styles.panelLabel}>Spacing scale</p>
                <div className={styles.spacingList}>
                  {spacingScale.map((space) => (
                    <div className={styles.spacingRow} key={space}>
                      <code>{space}px</code>
                      <div className={styles.spacingTrack}>
                        <div
                          className={styles.spacingFill}
                          style={{ width: space }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className={cn(styles.surface, styles.tokenPanel)}>
                <p className={styles.panelLabel}>Radius scale</p>
                <div className={styles.radiusRow}>
                  {radiusScale.map((radius) => (
                    <div className={styles.radiusItem} key={radius.name}>
                      <div
                        className={styles.radiusBox}
                        style={{
                          borderRadius:
                            radius.value > 100 ? "999px" : radius.value
                        }}
                      />
                      <strong>{radius.name}</strong>
                      <code>
                        {radius.value > 100 ? "full" : `${radius.value}px`}
                      </code>
                      <span>{radius.use}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.tokenList} style={{ marginTop: 24 }}>
                  <div className={styles.tokenRow}>
                    <span>Content measure</span>
                    <code>68ch</code>
                  </div>
                  <div className={styles.tokenRow}>
                    <span>Desktop grid</span>
                    <code>12 columns</code>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Elevation */}
          <section className={styles.section} id="elevation">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>04 / Elevation</h3>
            </div>

            <div className={styles.elevationRow}>
              {elevationLevels.map((elevation) => (
                <article
                  className={styles.elevationCardV2}
                  key={elevation.level}
                >
                  <div
                    className={styles.elevationSample}
                    style={{ boxShadow: elevation.shadow }}
                  >
                    Level {elevation.level}
                  </div>
                  <strong>{elevation.name}</strong>
                  <span>{elevation.use}</span>
                  <code>{elevation.shadow}</code>
                </article>
              ))}
            </div>
          </section>

          {/* Components */}
          <section className={styles.section} id="components">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>05 / Components</h3>
            </div>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Buttons</p>
              <div className={styles.variantTable}>
                {(
                  [
                    { name: "Primary", cls: styles.buttonPrimary },
                    { name: "Secondary", cls: styles.buttonSecondary },
                    { name: "Soft", cls: styles.buttonSoft },
                    { name: "Danger", cls: styles.buttonDanger }
                  ] as const
                ).map((variant) => (
                  <div className={styles.variantRow} key={variant.name}>
                    <span className={styles.variantLabel}>{variant.name}</span>
                    <div className={styles.stateGroup}>
                      <div className={styles.stateItem}>
                        <button
                          className={cn(styles.button, variant.cls)}
                          type="button"
                        >
                          Continue
                        </button>
                        <span>Default</span>
                      </div>
                      <div className={styles.stateItem}>
                        <button
                          className={cn(styles.button, variant.cls)}
                          disabled
                          type="button"
                        >
                          Continue
                        </button>
                        <span>Disabled</span>
                      </div>
                      <div className={styles.stateItem}>
                        <button
                          className={cn(styles.button, variant.cls)}
                          disabled
                          type="button"
                        >
                          <Loader2
                            aria-hidden="true"
                            className={styles.spin}
                            size={15}
                          />
                          Continue
                        </button>
                        <span>Loading</span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className={styles.variantRow}>
                  <span className={styles.variantLabel}>Icon</span>
                  <div className={styles.stateGroup}>
                    <div className={styles.stateItem}>
                      <button
                        aria-label="Open notifications"
                        className={styles.iconButton}
                        type="button"
                      >
                        <Bell aria-hidden="true" size={18} />
                      </button>
                      <span>Default</span>
                    </div>
                    <div className={styles.stateItem}>
                      <button
                        aria-label="Open notifications"
                        className={styles.iconButton}
                        disabled
                        type="button"
                      >
                        <Bell aria-hidden="true" size={18} />
                      </button>
                      <span>Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Form fields</p>
              <div className={styles.fieldStatesGrid}>
                <div className={styles.fieldStateCard}>
                  <span className={styles.fieldStateLabel}>Default</span>
                  <label className={styles.fieldLabel}>
                    Search your library
                    <span className={styles.searchWrap}>
                      <Search aria-hidden="true" size={17} />
                      <input
                        className={styles.searchField}
                        placeholder="Topics, notes, categories…"
                      />
                    </span>
                  </label>
                </div>
                <div className={styles.fieldStateCard}>
                  <span className={styles.fieldStateLabel}>Focus</span>
                  <label className={styles.fieldLabel}>
                    Search your library
                    <span className={styles.searchWrap}>
                      <Search aria-hidden="true" size={17} />
                      <input
                        className={cn(styles.searchField, styles.fieldFocusPreview)}
                        defaultValue="memory consolidation"
                      />
                    </span>
                  </label>
                </div>
                <div className={styles.fieldStateCard}>
                  <span className={styles.fieldStateLabel}>Disabled</span>
                  <label className={styles.fieldLabel}>
                    Search your library
                    <span className={styles.searchWrap}>
                      <Search aria-hidden="true" size={17} />
                      <input
                        className={styles.searchField}
                        disabled
                        placeholder="Topics, notes, categories…"
                      />
                    </span>
                  </label>
                </div>
                <div className={styles.fieldStateCard}>
                  <span className={styles.fieldStateLabel}>Error</span>
                  <label className={styles.fieldLabel}>
                    Search your library
                    <span className={styles.searchWrap}>
                      <Search aria-hidden="true" size={17} />
                      <input
                        className={cn(styles.searchField, styles.fieldErrorPreview)}
                        defaultValue=""
                        placeholder="Topics, notes, categories…"
                      />
                    </span>
                    <span className={styles.fieldError}>
                      Search needs at least 2 characters.
                    </span>
                  </label>
                </div>
              </div>

              <div className={styles.fieldStack} style={{ marginTop: 24 }}>
                <label className={styles.fieldLabel}>
                  Research difficulty
                  <select className={styles.select} defaultValue="curious">
                    <option value="curious">
                      Curious — an approachable introduction
                    </option>
                    <option value="focused">Focused — moderate depth</option>
                    <option value="deep">Deep dive — advanced research</option>
                  </select>
                </label>
                <label className={styles.fieldLabel}>
                  Reflection
                  <textarea
                    className={styles.textarea}
                    defaultValue="The strongest connection I found was…"
                  />
                </label>
              </div>
            </article>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Chips &amp; badges</p>
              <div className={styles.demoRow}>
                <span className={styles.chip}>Neutral</span>
                <span className={cn(styles.chip, styles.chipActive)}>
                  <Check aria-hidden="true" size={13} /> Active
                </span>
                <span className={cn(styles.chip, styles.chipSuccess)}>
                  Success
                </span>
                <span className={cn(styles.chip, styles.chipWarning)}>
                  Warning
                </span>
                <span className={cn(styles.chip, styles.chipDanger)}>
                  Danger
                </span>
              </div>
            </article>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Tabs</p>
              <div className={styles.demoRow}>
                <div className={styles.tabs}>
                  <button
                    className={cn(styles.tab, styles.tabActive)}
                    type="button"
                  >
                    Notes
                  </button>
                  <button className={styles.tab} type="button">
                    Sources
                  </button>
                  <button className={styles.tab} type="button">
                    AI coach
                  </button>
                </div>
              </div>
              <p className={styles.componentCaption}>Tab group</p>
              <div className={styles.demoRow}>
                <div className={styles.segmented}>
                  <button
                    className={cn(styles.segmentedOption, styles.segmentedOptionActive)}
                    type="button"
                  >
                    <List aria-hidden="true" size={14} /> List
                  </button>
                  <button className={styles.segmentedOption} type="button">
                    <LayoutGrid aria-hidden="true" size={14} /> Grid
                  </button>
                </div>
              </div>
              <p className={styles.componentCaption}>Segmented control</p>
            </article>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Alerts &amp; banners</p>
              <div className={styles.bannerGrid}>
                <div className={cn(styles.banner, styles.bannerInfo)} role="status">
                  <Info aria-hidden="true" size={18} />
                  <div>
                    <strong>Your notes are aligned with the topic.</strong>
                    <span>Curio found a clear explanation and two supporting claims.</span>
                  </div>
                </div>
                <div className={cn(styles.banner, styles.bannerSuccess)} role="status">
                  <CheckCircle2 aria-hidden="true" size={18} />
                  <div>
                    <strong>Session saved to your library.</strong>
                    <span>You can revisit and reflect on it anytime.</span>
                  </div>
                </div>
                <div className={cn(styles.banner, styles.bannerWarning)} role="status">
                  <AlertTriangle aria-hidden="true" size={18} />
                  <div>
                    <strong>Your focus session is about to end.</strong>
                    <span>Wrap up your notes in the next 2 minutes.</span>
                  </div>
                </div>
                <div className={cn(styles.banner, styles.bannerDanger)} role="alert">
                  <XCircle aria-hidden="true" size={18} />
                  <div>
                    <strong>We couldn&apos;t save your last note.</strong>
                    <span>Check your connection and try again.</span>
                  </div>
                </div>
              </div>
            </article>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Progress</p>
              <div className={styles.progressGroup}>
                <div className={styles.progressMeta}>
                  <span>Focus session</span>
                  <span>62%</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressValue} />
                </div>
              </div>
            </article>

            <article className={cn(styles.surface, styles.componentPanelV2)}>
              <p className={styles.panelLabel}>Content card</p>
              <div className={styles.sessionCard}>
                <div className={styles.sessionCardTop}>
                  <span
                    className={styles.experimentBadge}
                    style={{
                      color: "white",
                      borderColor: "rgba(255,255,255,.3)",
                      background: "rgba(255,255,255,.12)"
                    }}
                  >
                    Science · Deep dive
                  </span>
                </div>
                <div className={styles.sessionCardBody}>
                  <h4>Why do some memories become stronger during sleep?</h4>
                  <p>
                    Explored memory consolidation, hippocampal replay, and the
                    role of slow-wave sleep.
                  </p>
                  <div className={styles.statusLine}>
                    <span>42 focused minutes</span>
                    <span>4 sources</span>
                  </div>
                </div>
              </div>
            </article>
          </section>

          {/* Icons */}
          <section className={styles.section} id="icons">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>06 / Iconography</h3>
            </div>
            <div className={styles.categoryIconPreview}>
              <div className={styles.categoryIconPreviewHeader}>
                <div>
                  <p className={styles.panelLabel}>Category icon experiment</p>
                  <h3>Soft 3D · Curio violet collection</h3>
                </div>
                <span>Reference direction</span>
              </div>
              <div className={styles.categoryIconGrid}>
                {categoryIcons.map((category) => (
                  <figure className={styles.categoryIconCard} key={category.label}>
                    <Image
                      alt={`${category.label} category icon in Curio's soft 3D violet style`}
                      height={720}
                      src={category.src}
                      width={720}
                    />
                    <figcaption>{category.label}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
            <div className={cn(styles.surface, styles.iconPanel)}>
              <div className={styles.iconGrid}>
                {icons.map(({ icon: Icon, label }) => (
                  <div className={styles.iconTile} key={label}>
                    <span className={styles.iconWell}>
                      <Icon aria-hidden="true" size={22} strokeWidth={1.9} />
                    </span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Illustrations */}
          <section className={styles.section} id="illustrations">
            <div className={styles.sectionHeader}>
              <h3 className={styles.eyebrow}>07 / Illustration Lab</h3>
            </div>
          </section>

          <footer className={styles.footer}>
            <span>Curio Experimental Design System · v0.2</span>
            <Link
              className={cn(styles.button, styles.buttonSecondary)}
              href="/"
            >
              Return to current Curio{" "}
              <ArrowRight aria-hidden="true" size={15} />
            </Link>
          </footer>
        </div>
      </div>
    </main>
  );
}
