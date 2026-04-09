(function initFakeChatroom() {
  const desktopMq = window.matchMedia("(min-width: 961px)");
  const names = [
    "Ken Bassman",
    "Amy Groove",
    "Josh Pocket",
    "Mina Strings",
    "Leo Funkline",
    "Nora Session",
    "Chris LowEnd",
    "Evan Slap",
  ];

  const messages = [
    {
      text: "Loved the pocket on your latest line. Tight with the kick.",
      href: "#projects",
      label: "View Projects"
    },
    {
      text: "Your timing notes are clear. Click-ready approach is solid.",
      href: "#skills",
      label: "See Skills"
    },
    {
      text: "That warm DI tone works really well for worship sets.",
      href: "#experience",
      label: "Check Experience"
    },
    {
      text: "Can we talk about bass support for a small live set next month?",
      href: "#contact",
      label: "Go to Contact"
    },
    {
      text: "Your music balance story is super unique.",
      href: "#summary",
      label: "Back to Summary"
    },
    {
      text: "I like how you serve the song first, then add fills.",
      href: "https://instagram.com",
      label: "Instagram"
    },
    {
      text: "The groove demo is clean. Want to collaborate?",
      href: "https://linkedin.com",
      label: "LinkedIn"
    },
    {
      text: "Can I send charts for a trial rehearsal?",
      href: "mailto:you@example.com",
      label: "Email"
    },
  ];

  let root = null;
  let feed = null;
  let heartLane = null;
  let header = null;
  let minimizeBtn = null;
  let minimizedPreview = null;
  let minimizedPreviewText = null;
  let loopId = 0;
  let heartLoopId = 0;
  let hasInitialPlacement = false;
  let hasUserMoved = false;
  let resizeRafId = 0;

  const CHAT_MARGIN = 12;
  const RIGHT_SAFE_LANE = 116;
  const START_MINIMIZED = true;

  function pick(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function nowTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function makeMessageNode(entry, senderName) {
    const wrap = document.createElement("article");
    wrap.className = "fake-chat-msg";

    const meta = document.createElement("div");
    meta.className = "fake-chat-meta";

    const name = document.createElement("span");
    name.className = "fake-chat-name";
    name.textContent = senderName;

    const time = document.createElement("span");
    time.className = "fake-chat-time";
    time.textContent = nowTime();

    meta.appendChild(name);
    meta.appendChild(time);

    const text = document.createElement("p");
    text.className = "fake-chat-text";
    text.textContent = entry.text;

    wrap.appendChild(meta);
    wrap.appendChild(text);

    if (entry.href && entry.label) {
      const link = document.createElement("a");
      link.className = "fake-chat-link";
      link.href = entry.href;
      link.textContent = entry.label;

      if (entry.href.startsWith("http")) {
        link.target = "_blank";
        link.rel = "noopener";
      }

      wrap.appendChild(link);
    }

    return wrap;
  }

  function updateMinimizedPreview(senderName, messageText) {
    if (!minimizedPreviewText) return;

    minimizedPreviewText.textContent = `${senderName}: ${messageText}`;
    minimizedPreviewText.classList.remove("is-flip");
    // Restart the animation on every new chat line.
    void minimizedPreviewText.offsetWidth;
    minimizedPreviewText.classList.add("is-flip");
  }

  function pushMessage() {
    if (!feed) return;

    const entry = pick(messages);
    const senderName = pick(names);
    const msg = makeMessageNode(entry, senderName);
    feed.appendChild(msg);
    updateMinimizedPreview(senderName, entry.text);

    requestAnimationFrame(() => {
      msg.classList.add("is-visible");
    });

    while (feed.children.length > 8) {
      feed.removeChild(feed.firstElementChild);
    }

    feed.scrollTop = feed.scrollHeight;
  }

  function pushHeart() {
    if (!heartLane) return;

    const heart = document.createElement("span");
    heart.className = "material-icons fake-chat-heart";
    heart.textContent = "favorite";

    const size = 13 + Math.floor(Math.random() * 10);
    const duration = 1800 + Math.floor(Math.random() * 1800);
    const drift = -8 + Math.floor(Math.random() * 16);
    const palette = ["#ff6b7a", "#f78fb3", "#ff9f43", "#84ffe2"];
    const color = palette[Math.floor(Math.random() * palette.length)];

    heart.style.setProperty("--heart-size", `${size}px`);
    heart.style.setProperty("--heart-duration", `${duration}ms`);
    heart.style.setProperty("--heart-drift", `${drift}px`);
    heart.style.setProperty("--heart-color", color);

    heartLane.appendChild(heart);
    heart.addEventListener("animationend", () => {
      heart.remove();
    });
  }

  function scheduleNext() {
    if (!desktopMq.matches) return;
    const delay = 2200 + Math.floor(Math.random() * 2400);
    loopId = window.setTimeout(() => {
      pushMessage();
      scheduleNext();
    }, delay);
  }

  function stopLoop() {
    if (loopId) {
      clearTimeout(loopId);
      loopId = 0;
    }

    if (heartLoopId) {
      clearTimeout(heartLoopId);
      heartLoopId = 0;
    }
  }

  function scheduleHearts() {
    if (!desktopMq.matches) return;
    const delay = 480 + Math.floor(Math.random() * 980);
    heartLoopId = window.setTimeout(() => {
      pushHeart();
      if (Math.random() > 0.62) pushHeart();
      scheduleHearts();
    }, delay);
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function placeInitialPosition() {
    if (!root || hasInitialPlacement) return;

    const rect = root.getBoundingClientRect();
    const measuredWidth = rect.width || 290;
    const measuredHeight = rect.height || 340;
    const maxLeft = Math.max(CHAT_MARGIN, window.innerWidth - measuredWidth - RIGHT_SAFE_LANE);
    const maxTop = Math.max(CHAT_MARGIN, window.innerHeight - measuredHeight - CHAT_MARGIN);
    const preferredRightSlot = window.innerWidth - measuredWidth - RIGHT_SAFE_LANE;
    const initialLeft = clamp(preferredRightSlot, CHAT_MARGIN, maxLeft);
    const initialTop = clamp(16, CHAT_MARGIN, maxTop);

    root.style.left = `${initialLeft}px`;
    root.style.top = `${initialTop}px`;
    root.style.right = "auto";

    hasInitialPlacement = true;
  }

  function keepInsideViewport() {
    if (!root || !hasInitialPlacement) return;

    const rect = root.getBoundingClientRect();
    const left = Number.parseFloat(root.style.left || "0");
    const top = Number.parseFloat(root.style.top || "0");
    const maxLeft = Math.max(CHAT_MARGIN, window.innerWidth - rect.width - CHAT_MARGIN);
    const maxTop = Math.max(CHAT_MARGIN, window.innerHeight - rect.height - CHAT_MARGIN);

    root.style.left = `${clamp(left, CHAT_MARGIN, maxLeft)}px`;
    root.style.top = `${clamp(top, CHAT_MARGIN, maxTop)}px`;
  }

  function placePreferredRightSlot() {
    if (!root) return;

    const rect = root.getBoundingClientRect();
    const maxLeft = Math.max(CHAT_MARGIN, window.innerWidth - rect.width - CHAT_MARGIN);
    const maxTop = Math.max(CHAT_MARGIN, window.innerHeight - rect.height - CHAT_MARGIN);
    const preferredLeft = clamp(window.innerWidth - rect.width - RIGHT_SAFE_LANE, CHAT_MARGIN, maxLeft);
    const currentTop = Number.parseFloat(root.style.top || "16");

    root.style.left = `${preferredLeft}px`;
    root.style.top = `${clamp(currentTop, CHAT_MARGIN, maxTop)}px`;
    root.style.right = "auto";
  }

  function syncOnResize() {
    if (!desktopMq.matches || !root) return;
    if (hasUserMoved) keepInsideViewport();
    else placePreferredRightSlot();
  }

  function setupDrag() {
    if (!root || !header || header.dataset.dragBound === "1") return;

    let dragging = false;
    let startX = 0;
    let startY = 0;
    let baseLeft = 0;
    let baseTop = 0;

    function onPointerMove(event) {
      if (!dragging || !root) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      const rect = root.getBoundingClientRect();
      const maxLeft = Math.max(CHAT_MARGIN, window.innerWidth - rect.width - CHAT_MARGIN);
      const maxTop = Math.max(CHAT_MARGIN, window.innerHeight - rect.height - CHAT_MARGIN);

      root.style.left = `${clamp(baseLeft + dx, CHAT_MARGIN, maxLeft)}px`;
      root.style.top = `${clamp(baseTop + dy, CHAT_MARGIN, maxTop)}px`;
      root.style.right = "auto";
    }

    function stopDragging(pointerId) {
      dragging = false;
      if (header && typeof header.releasePointerCapture === "function") {
        try {
          header.releasePointerCapture(pointerId);
        } catch {
          // No-op: pointer may already be released.
        }
      }
      if (root) root.classList.remove("is-dragging");
    }

    header.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (!root) return;
      if (event.target instanceof Element && event.target.closest(".fake-chatroom-minimize")) return;

      const left = Number.parseFloat(root.style.left || "0");
      const top = Number.parseFloat(root.style.top || "0");
      if (!Number.isFinite(left) || !Number.isFinite(top)) return;

      dragging = true;
      hasUserMoved = true;
      startX = event.clientX;
      startY = event.clientY;
      baseLeft = left;
      baseTop = top;

      root.classList.add("is-dragging");
      header.setPointerCapture(event.pointerId);
    });

    header.addEventListener("pointermove", onPointerMove);

    header.addEventListener("pointerup", (event) => {
      stopDragging(event.pointerId);
    });

    header.addEventListener("pointercancel", (event) => {
      stopDragging(event.pointerId);
    });

    header.dataset.dragBound = "1";
  }

  function setMinimized(minimized) {
    if (!root || !minimizeBtn) return;
    root.classList.toggle("is-minimized", minimized);
    minimizeBtn.setAttribute("aria-expanded", minimized ? "false" : "true");
    minimizeBtn.setAttribute("title", minimized ? "Expand chat panel" : "Minimize chat panel");
    minimizeBtn.setAttribute("aria-label", minimized ? "Expand chat panel" : "Minimize chat panel");

    const icon = minimizeBtn.querySelector(".material-icons");
    if (icon) icon.textContent = minimized ? "open_in_full" : "remove";

    const label = minimizeBtn.querySelector(".fake-chatroom-toggle-label");
    if (label) label.textContent = minimized ? "Open" : "Hide";
  }

  function setupMinimize() {
    if (!minimizeBtn || minimizeBtn.dataset.bound === "1") return;

    const toggleMinimize = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!root) return;
      const next = !root.classList.contains("is-minimized");
      setMinimized(next);
      keepInsideViewport();
    };

    minimizeBtn.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
    });

    minimizeBtn.addEventListener("click", (event) => {
      toggleMinimize(event);
    });

    minimizeBtn.dataset.bound = "1";
  }

  function ensureUi() {
    if (root) return;

    root = document.createElement("aside");
    root.className = "fake-chatroom";
    root.setAttribute("aria-live", "polite");
    root.setAttribute("aria-label", "Fan chat highlights");

    header = document.createElement("div");
    header.className = "fake-chatroom-header";

    const headMain = document.createElement("div");
    headMain.className = "fake-chatroom-head-main";

    const headActions = document.createElement("div");
    headActions.className = "fake-chatroom-head-actions";

    const title = document.createElement("strong");
    title.className = "fake-chatroom-title";
    title.textContent = "Chat Room";

    const status = document.createElement("span");
    status.className = "fake-chatroom-status";
    status.textContent = "Live chat";

    minimizeBtn = document.createElement("button");
    minimizeBtn.type = "button";
    minimizeBtn.className = "fake-chatroom-minimize";
    minimizeBtn.setAttribute("aria-label", "Toggle chat panel");
    minimizeBtn.innerHTML = '<span class="material-icons" aria-hidden="true">remove</span><span class="fake-chatroom-toggle-label">Hide</span>';

    headMain.appendChild(title);
    headMain.appendChild(status);
    headActions.appendChild(minimizeBtn);

    header.appendChild(headMain);
    header.appendChild(headActions);

    minimizedPreview = document.createElement("div");
    minimizedPreview.className = "fake-chatroom-min-preview";

    minimizedPreviewText = document.createElement("span");
    minimizedPreviewText.className = "fake-chatroom-min-preview-text";
    minimizedPreviewText.textContent = "Live chat preview";

    minimizedPreview.appendChild(minimizedPreviewText);

    feed = document.createElement("div");
    feed.className = "fake-chatroom-feed";

    heartLane = document.createElement("div");
    heartLane.className = "fake-chat-hearts";
    heartLane.setAttribute("aria-hidden", "true");

    root.appendChild(header);
    root.appendChild(minimizedPreview);
    root.appendChild(feed);
    root.appendChild(heartLane);

    document.body.appendChild(root);

    placeInitialPosition();
    setupDrag();
    setupMinimize();
    setMinimized(START_MINIMIZED);
  }

  function start() {
    ensureUi();
    if (!root) return;

    root.classList.add("is-visible");

    // Re-anchor after render so actual element dimensions are known.
    requestAnimationFrame(() => {
      if (!desktopMq.matches || !root) return;
      syncOnResize();
    });

    if (feed && feed.children.length === 0) {
      pushMessage();
      pushMessage();
      pushMessage();
    }

    if (heartLane && heartLane.children.length === 0) {
      pushHeart();
      pushHeart();
    }

    stopLoop();
    scheduleNext();
    scheduleHearts();
  }

  function stop() {
    stopLoop();
    if (root) root.classList.remove("is-visible");
  }

  desktopMq.addEventListener("change", (event) => {
    if (event.matches) start();
    else stop();
  });

  window.addEventListener("resize", () => {
    if (!desktopMq.matches) return;
    if (resizeRafId) cancelAnimationFrame(resizeRafId);
    resizeRafId = requestAnimationFrame(() => {
      resizeRafId = 0;
      syncOnResize();
    });
  });

  if (desktopMq.matches) {
    start();
  }
})();
