function frameSeq(basePath, count) {
  return Array.from({ length: count }, (_, index) =>
    `${basePath}/frame_${String(index).padStart(3, "0")}.png`
  );
}

function getTranslateX(element) {
  const matrix = getComputedStyle(element).transform;
  if (!matrix || matrix === "none") return 0;

  if (matrix.startsWith("matrix3d(")) {
    const values = matrix
      .slice(9, -1)
      .split(",")
      .map((value) => Number(value.trim()));
    return Number.isFinite(values[12]) ? values[12] : 0;
  }

  if (matrix.startsWith("matrix(")) {
    const values = matrix
      .slice(7, -1)
      .split(",")
      .map((value) => Number(value.trim()));
    return Number.isFinite(values[4]) ? values[4] : 0;
  }

  return 0;
}

function randomDuration([minMs, maxMs]) {
  return minMs + Math.floor(Math.random() * (maxMs - minMs + 1));
}

function initPixelAnimalAnimator(config, options = {}) {
  const animal = document.querySelector(options[config.selectorOption] || config.defaultSelector);
  if (!animal) return;

  const desktopMq = window.matchMedia(options.desktopMediaQuery || "(min-width: 961px)");
  const frameMs = options.frameMs ?? config.frameMs ?? 120;
  const assets = config.buildAssets();
  const defaultStates = options.states || config.defaultStates;
  const movingStates = new Set(config.movingStates);

  let sprite = animal.querySelector(config.spriteClass);
  if (!sprite) {
    sprite = document.createElement("img");
    sprite.className = config.spriteClass.replace(".", "");
    sprite.alt = "";
    sprite.decoding = "async";
    animal.appendChild(sprite);
  }

  let frameTimer = null;
  let frameIndex = 0;
  let currentState = config.initialState;
  let stateStart = Date.now();
  let stateDurationMs = randomDuration(config.movingStateDuration);
  let activeDirection = "east";
  let lastX = null;

  function pauseMotion() {
    animal.style.animationPlayState = "paused";
  }

  function resumeMotion() {
    animal.style.animationPlayState = "running";
  }

  function updateDirectionFromMotion() {
    const x = getTranslateX(animal);
    if (lastX !== null) {
      const delta = x - lastX;
      const nextDirection = delta > 0.05 ? "east" : delta < -0.05 ? "west" : activeDirection;
      if (nextDirection !== activeDirection) {
        activeDirection = nextDirection;
        frameIndex = 0;
      }
    }
    lastX = x;
  }

  function chooseRandomState() {
    const next = defaultStates[Math.floor(Math.random() * defaultStates.length)];
    currentState = next;
    frameIndex = 0;
    stateStart = Date.now();

    if (movingStates.has(next)) {
      stateDurationMs = randomDuration(config.movingStateDuration);
      resumeMotion();
      updateDirectionFromMotion();
      return;
    }

    stateDurationMs = randomDuration(config.idleStateDuration);
    pauseMotion();
  }

  function getFramesForCurrentState() {
    const resolved = config.resolveFrames({
      state: currentState,
      direction: activeDirection,
      assets,
      sprite,
    });

    if (!resolved || !resolved.frames || resolved.frames.length === 0) {
      return null;
    }

    if (typeof resolved.spriteTransform === "string") {
      sprite.style.transform = resolved.spriteTransform;
    }

    return resolved.frames;
  }

  function renderFrame() {
    if (movingStates.has(currentState)) {
      updateDirectionFromMotion();
    }

    if (Date.now() - stateStart >= stateDurationMs) {
      chooseRandomState();
    }

    const frames = getFramesForCurrentState();
    if (!frames) return;

    sprite.src = frames[frameIndex];
    frameIndex = (frameIndex + 1) % frames.length;
  }

  function stopFrames() {
    if (frameTimer) {
      clearInterval(frameTimer);
      frameTimer = null;
    }
  }

  function syncFrames() {
    if (!desktopMq.matches) {
      stopFrames();
      pauseMotion();
      sprite.style.transform = "none";
      sprite.src = config.defaultFrame(assets);
      return;
    }

    if (!frameTimer) {
      currentState = config.initialState;
      frameIndex = 0;
      stateStart = Date.now();
      stateDurationMs = randomDuration(config.movingStateDuration);
      activeDirection = "east";
      lastX = getTranslateX(animal);
      resumeMotion();
      renderFrame();
      frameTimer = setInterval(renderFrame, frameMs);
    }
  }

  syncFrames();
  desktopMq.addEventListener("change", syncFrames);

  return {
    stop() {
      stopFrames();
      pauseMotion();
      desktopMq.removeEventListener("change", syncFrames);
    },
  };
}

export function initPixelCatFrames(options = {}) {
  return initPixelAnimalAnimator(
    {
      selectorOption: "catSelector",
      defaultSelector: ".pixel-cat",
      spriteClass: ".pixel-cat-sprite",
      initialState: "run",
      defaultStates: ["run"],
      movingStates: ["run"],
      movingStateDuration: [3200, 5600],
      idleStateDuration: [2400, 4600],
      buildAssets() {
        return {
          runningEast: frameSeq("./assets/black_white_cat/running/east", 6),
          angryEast: frameSeq("./assets/black_white_cat/angry/east", 7),
          angryWest: frameSeq("./assets/black_white_cat/angry/west", 7),
          lickingSouth: frameSeq("./assets/black_white_cat/licking/south", 12),
        };
      },
      defaultFrame(assets) {
        return assets.runningEast[0];
      },
      resolveFrames({ state, direction, assets }) {
        if (state === "run") {
          return {
            frames: assets.runningEast,
            spriteTransform: direction === "east" ? "none" : "scaleX(-1)",
          };
        }

        if (state === "angry-east") {
          return { frames: assets.angryEast, spriteTransform: "none" };
        }

        if (state === "angry-west") {
          return { frames: assets.angryWest, spriteTransform: "none" };
        }

        if (state === "lick-east") {
          return { frames: assets.lickingSouth, spriteTransform: "none" };
        }

        return { frames: assets.lickingSouth, spriteTransform: "scaleX(-1)" };
      },
    },
    options
  );
}

export function initPixelDogFrames(options = {}) {
  return initPixelAnimalAnimator(
    {
      selectorOption: "dogSelector",
      defaultSelector: ".pixel-dog",
      spriteClass: ".pixel-dog-sprite",
      initialState: "run",
      defaultStates: ["run", "sneak", "run"],
      movingStates: ["run", "sneak"],
      movingStateDuration: [3200, 5600],
      idleStateDuration: [2400, 4600],
      buildAssets() {
        return {
          runningEast: frameSeq("./assets/shiba_dog/animations/running-6-frames/east", 6),
          runningWest: frameSeq("./assets/shiba_dog/animations/running-6-frames/west", 6),
          sneakingEast: frameSeq("./assets/shiba_dog/animations/sneaking/east", 8),
          sneakingWest: frameSeq("./assets/shiba_dog/animations/sneaking/west", 8),
          barkSouth: frameSeq("./assets/shiba_dog/animations/bark/south", 6),
          barkWest: frameSeq("./assets/shiba_dog/animations/bark/west", 6),
        };
      },
      defaultFrame(assets) {
        return assets.runningEast[0];
      },
      resolveFrames({ state, direction, assets }) {
        if (state === "run") {
          return {
            frames: direction === "east" ? assets.runningEast : assets.runningWest,
            spriteTransform: "none",
          };
        }

        if (state === "sneak") {
          return {
            frames: direction === "east" ? assets.sneakingEast : assets.sneakingWest,
            spriteTransform: "none",
          };
        }

        if (state === "bark-south") {
          return { frames: assets.barkSouth, spriteTransform: "none" };
        }

        return { frames: assets.barkWest, spriteTransform: "none" };
      },
    },
    options
  );
}
