import { animate, spring, utils } from "animejs";
import { initPixelCatFrames, initPixelDogFrames } from "./pet-animation.js";

const sections = document.querySelectorAll("section.section, section.hero");
const navLinks = document.querySelectorAll(".nav-links a");
const topbar = document.querySelector(".topbar");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function syncHeaderHeightVar() {
  if (!topbar) return;
  const height = Math.round(topbar.offsetHeight || 0);
  document.documentElement.style.setProperty("--header-height", `${height}px`);
}

function getHeaderOffset() {
  return (topbar?.offsetHeight || 0) + 12;
}

function animateScrollTo(targetY) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  const duration = Math.min(2800, Math.max(1600, Math.abs(distance) * 1.15));

  if (prefersReducedMotion || Math.abs(distance) < 8) {
    window.scrollTo(0, targetY);
    return;
  }

  const startTime = performance.now();

  function easeInOutCubic(progress) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  }

  window.requestAnimationFrame(step);
}

function smoothScrollTo(id) {
  const target = document.getElementById(id);
  if (!target) return;

  const targetY = Math.max(
    target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset(),
    0
  );

  animateScrollTo(targetY);
}

function updateHashSafely(href, id) {
  try {
    history.replaceState(null, "", href);
  } catch {
    window.location.hash = id;
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (!href || href === "#") return;

    const id = href.slice(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(id);
    updateHashSafely(href, id);
  });
});

function onScroll() {
  const headerOffset = getHeaderOffset();
  let currentId = "";

  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= headerOffset + 30 && rect.bottom >= headerOffset + 80) {
      currentId = sec.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      currentId && link.getAttribute("href") === `#${currentId}`
    );
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("load", () => {
  syncHeaderHeightVar();
  if (window.location.hash) {
    smoothScrollTo(window.location.hash.slice(1));
  }

  onScroll();
});

window.addEventListener("resize", syncHeaderHeightVar);

function initMobileTopbarMotion() {
  if (!topbar || prefersReducedMotion) return;

  const mobileMq = window.matchMedia("(max-width: 768px)");
  let lastY = window.scrollY;
  let hidden = false;
  let animating = false;

  function animateTopbar(shouldHide) {
    if (hidden === shouldHide || animating) return;

    hidden = shouldHide;
    animating = true;

    topbar.classList.toggle("topbar-compact", shouldHide);

    if (mobileMq.matches) {
      animate(topbar, {
        opacity: shouldHide ? [1, 0.2] : [0.2, 1],
        duration: 320,
        ease: "outExpo",
        onComplete: () => {
          animating = false;
        },
      });
      return;
    }

    const travel = Math.max(44, Math.round((topbar.offsetHeight || 56) + 8));
    animate(topbar, {
      translateY: shouldHide ? [0, -travel] : [-travel, 0],
      opacity: shouldHide ? [1, 0.05] : [0.05, 1],
      duration: 340,
      ease: "outExpo",
      onComplete: () => {
        animating = false;
      },
    });
  }

  function resetTopbar() {
    hidden = false;
    topbar.classList.remove("topbar-compact");
    topbar.style.transform = "none";
    topbar.style.opacity = "1";
    syncHeaderHeightVar();
  }

  window.addEventListener("scroll", () => {
    if (!mobileMq.matches) return;

    const y = window.scrollY;
    const delta = y - lastY;

    if (y < 40) {
      animateTopbar(false);
    } else if (delta > 8) {
      animateTopbar(true);
    } else if (delta < -8) {
      animateTopbar(false);
    }

    lastY = y;
  }, { passive: true });

  mobileMq.addEventListener("change", (event) => {
    resetTopbar();
    syncHeaderHeightVar();
  });
}

syncHeaderHeightVar();
initMobileTopbarMotion();
onScroll();

initPixelCatFrames();
initPixelDogFrames();

// Material-style ripple on buttons
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = e.clientX - rect.left - size / 2 + "px";
    ripple.style.top = e.clientY - rect.top - size / 2 + "px";
    btn.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

/* ── Bass Story – Scroll-driven animation (anime.js) ──────── */
(function initBassStory() {
  const [story] = utils.$("#bass-story");
  if (!story) return;

  const sceneSections = [
    {
      section: document.getElementById("summary"),
      scene: 0, color: "#48f2c8",
      title: "Hello, I'm Jeffrey Leett",
      lead: "Business analyst by day, bass guitarist by night. I enjoy designing clear workflows, collaborating with stakeholders, and laying down solid low‑end foundations—whether in operations or in a groove.",
      points: ["Based in Hong Kong", "Bass · Rock · Funk · Worship", "HTML · CSS · JS · Python"],
      chips: [
        { kicker: "Base", label: "Hong Kong" },
        { kicker: "Dual Track", label: "Analyst + bass player" },
        { kicker: "Stack", label: "HTML, CSS, JS, Python" },
        { kicker: "Music", label: "Rock, funk, worship" },
      ],
      alt: null,
    },
    {
      section: document.getElementById("skills"),
      scene: 1, color: "#7dd3fc",
      title: "Bass & Music",
      lead: "I focus on groove, pocket, and serving the song—comfortable locking to a click and adapting to different arrangements.",
      points: ["Fingerstyle & pick", "Rock · Pop · Funk", "Playing with click", "Basic arranging"],
      chips: [
        { kicker: "Focus", label: "Groove before flash" },
        { kicker: "Timing", label: "Click-ready playing" },
        { kicker: "Mindset", label: "Serve the song" },
        { kicker: "Tech", label: "Workflow-driven builder" },
      ],
      alt: {
        title: "Tech & Analysis",
        lead: "I work with data, web, and automation—bringing structure to processes and building tools that simplify work.",
        points: ["Business analysis", "Workflow design", "HTML · CSS · JS", "Python · SQL"],
      },
    },
    {
      section: document.getElementById("experience"),
      scene: 2, color: "#ffb347",
      title: "Day job · Business & tech",
      lead: "Assistant Business Analyst since Sep 2024, and IS Intern in 2023—designing workflows and building data tools in Hong Kong.",
      points: ["Documented business workflows", "Collaborated with dev teams", "Analysed data for efficiency"],
      chips: [
        { kicker: "Delivery", label: "Workflow mapping" },
        { kicker: "Ops", label: "Data-backed decisions" },
        { kicker: "Teamwork", label: "Cross-team collaboration" },
        { kicker: "Music", label: "Weekly live sets" },
      ],
      alt: {
        title: "Music · Bands & gigs",
        lead: "Bass Guitarist · Local band / church / project · Year–Present",
        points: ["Played weekly sets with drums", "Adapted songs from charts", "Worked on dynamics & intros"],
      },
    },
    {
      section: document.getElementById("projects"),
      scene: 3, color: "#facc15",
      title: "Music & Audio",
      lead: "A small collection of groove-focused tracks recorded at home to show feel, tone, and versatility.",
      points: [
        "Recorded DI and amp sim",
        "Experimented with tone",
        `<a class="copy-link" href="#" target="_blank" rel="noopener">Personal · Demo</a>`,
      ],
      chips: [
        { kicker: "Audio", label: "DI + amp sim tests" },
        { kicker: "Tone", label: "Record, refine, compare" },
        { kicker: "Web", label: "Responsive single page" },
        { kicker: "Build", label: "Vanilla HTML, CSS, JS" },
      ],
      alt: {
        title: "Web & Systems",
        lead: "This single-page site: a mix of professional profile and bass guitar visual identity.",
        points: [
          "Designed from scratch",
          "Responsive layout",
          `<a class="copy-link" href="https://github.com" target="_blank" rel="noopener">HTML · CSS · JS</a>`,
        ],
      },
      
    },
    {
      section: document.getElementById("contact"),
      scene: 4, color: "#ff6b7a",
      title: "Let's talk",
      lead: "Need a reliable bass player for your next set or a detail-oriented analyst for your next system? I’d love to chat.",
      points: [],
      chips: [
        { kicker: "Location", label: "Hong Kong", icon: "place", href: "https://maps.google.com/?q=Hong+Kong" },
        { kicker: "Reach", label: "Email", icon: "mail", href: "mailto:you@example.com" },
        { kicker: "Work", label: "LinkedIn", icon: "linkedin", href: "https://linkedin.com" },
        { kicker: "Music", label: "Instagram", icon: "instagram", href: "https://instagram.com" },
      ],
      alt: null,
    },
  ].filter((item) => item.section);

  const scenes = [
    document.getElementById("scene-plugin"),
    document.getElementById("scene-amp"),
    document.getElementById("scene-tune"),
    document.getElementById("scene-fret"),
    document.getElementById("scene-play"),
  ].filter(Boolean);
  const dots = document.querySelectorAll(".story-dot");
  const observerProgress = document.querySelector(".observer-fg");
  const observerRingWrap = document.querySelector(".observer-ring-wrap");
  const scenePlugInSvg = document.querySelector("#scene-plugin .story-svg");
  const storyCopyTitle = document.getElementById("story-copy-title");
  const storyCopyLead = document.getElementById("story-copy-lead");
  const storyCopyPoints = document.getElementById("story-copy-points");
  const storyCopyAlt = document.getElementById("story-copy-alt");
  const storyCopyAltTitle = document.getElementById("story-copy-alt-title");
  const storyCopyAltLead = document.getElementById("story-copy-alt-lead");
  const storyCopyAltPoints = document.getElementById("story-copy-alt-points");
  const orbitChips = Array.from(document.querySelectorAll(".orbit-chip"));
  const mobileStoryMq = window.matchMedia("(max-width: 480px)");
  const sceneActivationOffset = 72;
  let observerCircumference = 0;
  let active = -1;
  let activeOrbitScene = -1;

  if (observerProgress) {
    const radius = Number(observerProgress.getAttribute("r") || 54);
    observerCircumference = 2 * Math.PI * radius;
    observerProgress.style.strokeDasharray = String(observerCircumference);
    observerProgress.style.strokeDashoffset = String(observerCircumference);
  }

  function currentSceneFromSections() {
    const marker = getHeaderOffset() + sceneActivationOffset;
    let nextScene = 0;
    let theme = sceneSections[0] || null;

    // Always return scene 0 when at very top of page
    if (window.scrollY < 10) {
      return { scene: 0, theme: sceneSections[0] || null };
    }

    sceneSections.forEach((item) => {
      const { section, scene } = item;
      if (section.getBoundingClientRect().top <= marker) {
        nextScene = scene;
        theme = item;
      }
    });

    return { scene: nextScene, theme };
  }

  function scrollToStorySection(id) {
    const target = document.getElementById(id);
    if (!target) return;

    const marker = getHeaderOffset() + sceneActivationOffset;
    const targetY = Math.max(
      target.getBoundingClientRect().top + window.pageYOffset - marker,
      0
    );

    animateScrollTo(targetY);

    const selected = sceneSections.find((item) => item.section?.id === id);
    if (!selected) return;

    showScene(selected.scene);
    const stepProgress = scenes.length > 1 ? selected.scene / (scenes.length - 1) : 1;
    updateObserver(stepProgress, selected.scene, selected);
    updateCopyMotion(selected);
  }

  function updateObserver(progressValue, sceneIdx, theme) {
    if (observerProgress && observerCircumference > 0) {
      observerProgress.style.strokeDashoffset = String(observerCircumference * (1 - progressValue));
    }

    if (theme?.color) {
      document.documentElement.style.setProperty("--scene-theme", theme.color);
    }

    updateOrbitChips(theme);
    updateContactSidebarVisibility(sceneIdx);

    if (theme && storyCopyTitle && storyCopyLead && storyCopyPoints) {
      storyCopyTitle.textContent = theme.title;
      storyCopyLead.textContent = theme.lead;
      storyCopyPoints.innerHTML = "";
      theme.points.forEach((line) => {
        const li = document.createElement("li");
        li.innerHTML = line;
        storyCopyPoints.appendChild(li);
      });
    }

    if (storyCopyAlt) {
      if (theme?.alt) {
        storyCopyAlt.classList.remove("hidden");
        if (storyCopyAltTitle) storyCopyAltTitle.textContent = theme.alt.title;
        if (storyCopyAltLead) storyCopyAltLead.textContent = theme.alt.lead;
        if (storyCopyAltPoints) {
          storyCopyAltPoints.innerHTML = "";
          theme.alt.points.forEach((line) => {
            const li = document.createElement("li");
            li.innerHTML = line;
            storyCopyAltPoints.appendChild(li);
          });
        }
      } else {
        storyCopyAlt.classList.add("hidden");
      }
    }
  }

  function updateOrbitChips(theme) {
    if (!orbitChips.length) return;

    const chips = theme?.chips || [];
    const sceneChanged = activeOrbitScene !== (theme?.scene ?? -1);
    activeOrbitScene = theme?.scene ?? -1;

    orbitChips.forEach((chip, index) => {
      const item = chips[index];
      const kicker = chip.querySelector(".orbit-chip-kicker");
      const text = chip.querySelector(".orbit-chip-text");

      if (!item) {
        chip.classList.add("is-hidden");
        if (kicker) kicker.textContent = "";
        if (text) text.textContent = "";
        return;
      }

      if (kicker) kicker.textContent = item.kicker;
      if (text) {
        text.textContent = "";
        if (item.href) {
          const link = document.createElement("a");
          link.className = "orbit-chip-link";
          link.href = item.href;
          if (item.href.startsWith("http")) {
            link.target = "_blank";
            link.rel = "noopener";
          }

          if (item.icon) {
            const icon = createChipIconElement(item.icon);
            link.appendChild(icon);
          }

          const label = document.createElement("span");
          label.className = "orbit-chip-link-label";
          label.textContent = item.label;
          link.appendChild(label);
          text.appendChild(link);
        } else {
          text.textContent = item.label;
        }
      }
      chip.classList.remove("is-hidden");
    });

    if (sceneChanged && !prefersReducedMotion) {
      const visibleChips = orbitChips.filter((chip, index) => chips[index]);
      if (visibleChips.length) {
        animate(visibleChips, {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 360,
          delay: (_, index) => index * 45,
          ease: "outQuad",
        });
      }
    }
  }

  function createChipIconElement(iconName) {
    if (iconName === "linkedin") {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.classList.add("orbit-chip-brand-icon");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("fill", "currentColor");
      path1.setAttribute("d", "M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v15H.22V8zm7.29 0h4.37v2.05h.06c.61-1.15 2.11-2.36 4.35-2.36 4.65 0 5.51 3.06 5.51 7.03V23h-4.56v-6.99c0-1.67-.03-3.82-2.33-3.82-2.33 0-2.69 1.82-2.69 3.7V23H7.51V8z");
      svg.appendChild(path1);
      return svg;
    }

    if (iconName === "instagram") {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.setAttribute("aria-hidden", "true");
      svg.classList.add("orbit-chip-brand-icon");

      const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path1.setAttribute("fill", "currentColor");
      path1.setAttribute("d", "M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9A3.7 3.7 0 0 0 7.5 20.2h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9zm9.85 1.35a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8z");
      svg.appendChild(path1);
      return svg;
    }

    const icon = document.createElement("span");
    icon.className = "material-icons orbit-chip-icon";
    icon.textContent = iconName;
    return icon;
  }

  function updateCopyMotion(theme) {
    if (!theme?.section) return;

    const rect = theme.section.getBoundingClientRect();
    const start = getHeaderOffset() + 24;
    const end = Math.max(start + 1, window.innerHeight * 0.62);
    const rawProgress = (start - rect.top) / (end - start);
    const progress = Math.min(Math.max(rawProgress, 0), 1);
    const isMobileStory = mobileStoryMq.matches;

    if (isMobileStory) {
      if (storyCopyTitle) storyCopyTitle.style.opacity = "1";
      if (storyCopyLead) {
        storyCopyLead.style.opacity = "1";
        storyCopyLead.style.transform = "translateY(0)";
      }
      if (storyCopyPoints) {
        storyCopyPoints.style.opacity = "1";
        storyCopyPoints.style.transform = "translateY(0)";
      }

      if (storyCopyAlt) {
        storyCopyAlt.style.opacity = storyCopyAlt.classList.contains("hidden") ? "0" : "1";
        storyCopyAlt.style.transform = "translateX(-50%) translateY(0)";
      }
      return;
    }

    const mainTranslateY = Math.round(progress * 34);
    const altTranslateY = Math.round(progress * 28);
    const opacity = Math.max(0.18, 1 - progress * 0.78);

    if (storyCopyTitle) storyCopyTitle.style.opacity = String(opacity);
    if (storyCopyLead) {
      storyCopyLead.style.opacity = String(opacity);
      storyCopyLead.style.transform = `translateY(${mainTranslateY}px)`;
    }
    if (storyCopyPoints) {
      storyCopyPoints.style.opacity = String(opacity);
      storyCopyPoints.style.transform = `translateY(${mainTranslateY}px)`;
    }

    if (storyCopyAlt) {
      storyCopyAlt.style.opacity = storyCopyAlt.classList.contains("hidden") ? "0" : String(opacity);
      storyCopyAlt.style.transform = `translateY(${altTranslateY}px)`;
    }
  }

  function resetTransforms(selector) {
    document.querySelectorAll(selector).forEach((element) => {
      element.style.transform = "";
      element.style.opacity = "";
    });
  }

  function resetSceneState(idx) {
    const scene = scenes[idx];
    const label = scene?.querySelector(".story-label");
    if (label) {
      label.style.opacity = "0";
      label.style.transform = "translateY(12px)";
    }

    if (idx === 0) {
      resetTransforms("#scene-plugin .heart-core");
      resetTransforms("#scene-plugin .heart-glow");
      resetTransforms("#scene-plugin .heart-pulse");
      resetTransforms("#scene-plugin .heart-shine");
    }

    if (idx === 1) {
      const toggle = scene?.querySelector(".amp-toggle");
      const pointer = scene?.querySelector(".volume-pointer");
      const level = scene?.querySelector(".volume-level");
      const powerLed = scene?.querySelector(".amp-power-led");
      if (toggle) toggle.setAttribute("cx", "240");
      if (pointer) pointer.style.transform = "";
      if (level) level.setAttribute("width", "0");
      if (powerLed) powerLed.setAttribute("fill", "#333");
    }

    if (idx === 2) {
      resetTransforms("#scene-tune .tuning-peg");
      resetTransforms("#scene-tune .tuning-hand");
      resetTransforms("#scene-tune .tune-string");
    }

    if (idx === 3) {
      resetTransforms("#scene-fret .fret-finger");
    }

    if (idx === 4) {
      resetTransforms("#scene-play .finger");
      resetTransforms("#scene-play .play-string");
      resetTransforms("#scene-play .music-note");
      const waves = scene?.querySelectorAll(".sound-wave") || [];
      waves.forEach((wave) => {
        wave.setAttribute("r", "0");
        wave.style.opacity = "0";
      });
    }
  }

  /* ── scene transitions ─── */
  function showScene(idx) {
    if (idx === active) return;

    active = idx;
    dots.forEach((d) => {
      const scene = Number(d.getAttribute("data-scene"));
      d.classList.toggle("active", scene === idx);
    });

    scenes.forEach((scene, sceneIndexValue) => {
      if (!scene) return;
      animate(scene, {
        opacity: sceneIndexValue === idx ? 1 : 0,
        duration: 320,
        ease: "outQuad",
      });

      // Keep scenes non-interactive by default; allow clicks only on Scene 0 when active.
      scene.style.pointerEvents = idx === 0 && sceneIndexValue === 0 ? "auto" : "none";
    });

    resetSceneState(idx);

    if (idx === 0) animatePlugIn();
    else if (idx === 1) animateAmp();
    else if (idx === 2) animateTune();
    else if (idx === 3) animateFret();
    else animatePlay();
  }

  function replaySceneZeroAnimation() {
    if (active !== 0) return;

    resetSceneState(0);
    animatePlugIn();

    if (observerRingWrap) {
      observerRingWrap.classList.remove("is-replay-glow");
      void observerRingWrap.offsetWidth;
      observerRingWrap.classList.add("is-replay-glow");
      window.setTimeout(() => {
        observerRingWrap.classList.remove("is-replay-glow");
      }, 860);
    }
  }

  if (scenePlugInSvg) {
    scenePlugInSvg.style.cursor = "pointer";
    scenePlugInSvg.style.outline = "none";
    scenePlugInSvg.style.userSelect = "none";
    scenePlugInSvg.style.webkitTapHighlightColor = "transparent";
    scenePlugInSvg.style.touchAction = "manipulation";
    scenePlugInSvg.setAttribute("tabindex", "-1");
    scenePlugInSvg.setAttribute("focusable", "false");
    scenePlugInSvg.addEventListener("click", replaySceneZeroAnimation);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", (event) => {
      const href = dot.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const id = href.slice(1);
      event.preventDefault();
      event.stopImmediatePropagation();
      smoothScrollTo(id);
      updateHashSafely(href, id);
    }, true);
  });

  /* ── Scene 1: Heart pulse ─── */
  function animatePlugIn() {
    animate(".heart-core", {
      scale: [0.84, 1.08, 0.97, 1.03, 1],
      duration: 1280,
      ease: "outQuad",
    });
    animate(".heart-glow", {
      scale: [0.62, 1.08],
      opacity: [0.05, 0.32, 0.12],
      duration: 1220,
      ease: "outQuad",
    });
    animate(".heart-pulse", {
      scale: [0.72, 1.24],
      opacity: [0.22, 0],
      duration: 1240,
      delay: function (_, i) { return i * 180; },
      ease: "outCubic",
    });
    animate(".heart-shine", {
      opacity: [0.25, 0.9, 0.5],
      duration: 980,
      ease: "inOutSine",
    });
    // Label
    animate("#scene-plugin .story-label", {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
      delay: 600,
      ease: "outQuad",
    });
  }

  function animateAmp() {
    animate(".amp-toggle", {
      translateX: [0, 12],
      duration: 420,
      ease: "outQuad",
    });

    animate(".amp-power-led", {
      fill: ["#333", "#7dd3fc"],
      duration: 320,
      delay: 200,
      ease: "outQuad",
    });

    animate(".volume-pointer", {
      rotate: [0, 58],
      transformOrigin: "186px 189px",
      duration: 700,
      ease: "outCubic",
    });

    animate(".volume-level", {
      width: [0, 40],
      duration: 700,
      ease: "outCubic",
    });
  }

  /* ── Scene 2: Tune the bass ─── */
  function animateTune() {
    // Rotate tuning pegs
    animate(".tuning-peg", {
      rotate: [0, 360],
      duration: 800,
      ease: spring({ bounce: 0.35 }),
      delay: function (_, i) { return i * 200; },
    });
    // Hand rocks back and forth
    animate(".tuning-hand", {
      translateX: [0, 8, 0, -8, 0],
      translateY: [0, -4, 0, -4, 0],
      duration: 1200,
      ease: "inOutSine",
    });
    // Strings vibrate (quick horizontal jitter)
    animate(".tune-string", {
      translateX: [0, 2, -2, 1, -1, 0],
      duration: 400, ease: "inOutSine",
      delay: function (_, i) { return 600 + i * 100; },
      loop: 3,
    });
    // Label
    animate("#scene-tune .story-label", {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
      delay: 500,
      ease: "outQuad",
    });
  }

  function animateFret() {
    animate("#scene-fret .fret-finger", {
      scale: [0.7, 1.05, 1],
      opacity: [0.3, 1],
      delay: function (_, i) { return i * 180; },
      duration: 520,
      ease: "outBack",
    });
  }

  /* ── Scene 3: Play! ─── */
  function animatePlay() {
    // Fingers pluck downward
    animate(".finger", {
      translateY: [0, 8, -2, 0],
      duration: 500,
      ease: spring({ bounce: 0.5 }),
      delay: function (_, i) { return i * 200; },
    });

    // Strings vibrate
    animate(".play-string", {
      translateX: [0, 3, -3, 2, -2, 1, -1, 0],
      duration: 600, ease: "inOutSine",
      delay: function (_, i) { return 300 + i * 80; },
      loop: 4,
    });

    // Sound waves expand outward
    animate(".sound-wave", {
      r: [0, 80],
      opacity: [0.8, 0],
      strokeWidth: [2, 0.3],
      duration: 1200, ease: "outCubic",
      delay: function (_, i) { return 500 + i * 300; },
    });

    // Music notes float up
    animate(".music-note", {
      opacity: [0, 1, 0],
      translateY: [0, -40],
      duration: 1400, ease: "outQuad",
      delay: function (_, i) { return 700 + i * 250; },
    });

    // Label
    animate("#scene-play .story-label", {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 500,
      delay: 400,
      ease: "outQuad",
    });
  }

  /* ── animated section titles (staggered reveal) ─── */
  function animateSectionTitle(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    const title = section.querySelector(".section-title");
    if (!title) return;

    const titleText = title.textContent;
    title.innerHTML = titleText
      .split("")
      .map((char) => `<span class="title-char" style="opacity: 0; display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`)
      .join("");

    animate(".title-char", {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 450,
      delay: (_, i) => i * 40,
      ease: "outQuad",
    });
  }

  /* ── continuous orbit effect (floating elements) ─── */
  function initContinuousOrbits() {
    animate(".orbit-element, .floating-decoration", {
      translateY: [0, -16, 0],
      duration: 3400,
      ease: "inOutSine",
      loop: true,
    });

    animate(".orbit-spin", {
      rotate: [0, 360],
      duration: 8000,
      ease: "linear",
      loop: true,
    });
  }

  /* ── color transitions on scroll ─── */
  function updateScrollColorIndicator() {
    const indicator = document.querySelector(".scroll-color-indicator");
    if (!indicator) return;
    const themeColor = getComputedStyle(document.documentElement).getPropertyValue("--scene-theme").trim();
    indicator.style.background = themeColor || "#48f2c8";
  }

  function updateContactSidebarVisibility(sceneIdx) {
    const sidebar = document.getElementById("desktop-contact-sidebar");
    if (!sidebar) return;
    if (sceneIdx === 4) {
      sidebar.style.opacity = "1";
      sidebar.style.pointerEvents = "auto";
    } else {
      sidebar.style.opacity = "0";
      sidebar.style.pointerEvents = "none";
    }
  }

  /* ── floating particles system ─── */
  function initFloatingParticles() {
    const container = document.querySelector(".particles-container");
    if (!container) return;

    const particleCount = 24;
    const particleTypes = ["particle-1", "particle-2", "particle-3"];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      const type = particleTypes[i % particleTypes.length];
      particle.className = `particle ${type}`;

      const x = Math.random() * window.innerWidth;
      const y = Math.random() * window.innerHeight;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      container.appendChild(particle);

      const duration = 4000 + Math.random() * 2000;
      const delay = Math.random() * 1000;

      animate(particle, {
        translateY: [-80 - Math.random() * 120, 80 + Math.random() * 120],
        translateX: [0, (Math.random() - 0.5) * 80],
        opacity: [0, 0.6, 0],
        duration,
        delay,
        ease: "linear",
        loop: true,
      });
    }
  }

  /* ── scroll listener ─── */
  let ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      const state = currentSceneFromSections();
      const sceneIdx = state.scene;
      showScene(sceneIdx);
      const stepProgress = scenes.length > 1 ? sceneIdx / (scenes.length - 1) : 1;
      updateObserver(stepProgress, sceneIdx, state.theme);
      updateCopyMotion(state.theme);
      updateScrollColorIndicator();
      ticking = false;
    });
  }, { passive: true });

  const initialState = currentSceneFromSections();
  showScene(initialState.scene);
  const initialStepProgress = scenes.length > 1 ? initialState.scene / (scenes.length - 1) : 1;
  updateObserver(initialStepProgress, initialState.scene, initialState.theme);
  updateCopyMotion(initialState.theme);

  /* ── initialize all continuous animations ─── */
  initFloatingParticles();
  initContinuousOrbits();
  animateSectionTitle("skills");
  animateSectionTitle("experience");
  animateSectionTitle("projects");
  animateSectionTitle("contact");
})();