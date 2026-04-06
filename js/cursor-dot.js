(function initPinkDotCursor() {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='26' height='26' viewBox='0 0 26 26'>
      <circle cx='13' cy='13' r='7.2' fill='#ff4fa3' fill-opacity='0.95'/>
      <circle cx='13' cy='13' r='10.2' fill='none' stroke='#ff9dd2' stroke-opacity='0.62' stroke-width='1.7'/>
    </svg>
  `.trim();

  const encoded = encodeURIComponent(svg)
    .replace(/'/g, "%27")
    .replace(/"/g, "%22");

  const cursor = `url("data:image/svg+xml,${encoded}") 13 13, auto`;

  document.documentElement.style.cursor = cursor;
  if (document.body) {
    document.body.style.cursor = cursor;
  } else {
    window.addEventListener("DOMContentLoaded", () => {
      document.body.style.cursor = cursor;
    }, { once: true });
  }

  // Add a subtle glowing trail for fine-pointer devices.
  if (!window.matchMedia("(pointer: fine)").matches) return;

  function initCursorTrail() {
    const trail = document.createElement("div");
    trail.setAttribute("aria-hidden", "true");
    trail.style.position = "fixed";
    trail.style.left = "0";
    trail.style.top = "0";
    trail.style.width = "28px";
    trail.style.height = "28px";
    trail.style.borderRadius = "50%";
    trail.style.pointerEvents = "none";
    trail.style.zIndex = "99999";
    trail.style.opacity = "0";
    trail.style.transform = "translate3d(-999px, -999px, 0)";
    trail.style.background = "radial-gradient(circle, rgba(255, 79, 163, 0.5) 0%, rgba(255, 79, 163, 0.18) 46%, rgba(255, 79, 163, 0) 72%)";
    trail.style.boxShadow = "0 0 22px rgba(255, 79, 163, 0.45), 0 0 36px rgba(255, 139, 199, 0.24)";
    trail.style.mixBlendMode = "screen";

    document.body.appendChild(trail);

    let targetX = -999;
    let targetY = -999;
    let x = -999;
    let y = -999;
    let rafId = 0;

    function animateTrail() {
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      trail.style.transform = `translate3d(${x - 14}px, ${y - 14}px, 0)`;
      rafId = requestAnimationFrame(animateTrail);
    }

    function showTrail() {
      trail.style.opacity = "1";
      if (!rafId) rafId = requestAnimationFrame(animateTrail);
    }

    function hideTrail() {
      trail.style.opacity = "0";
    }

    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      showTrail();
    }, { passive: true });

    window.addEventListener("pointerdown", () => {
      trail.style.width = "34px";
      trail.style.height = "34px";
    });

    window.addEventListener("pointerup", () => {
      trail.style.width = "28px";
      trail.style.height = "28px";
    });

    window.addEventListener("mouseout", (event) => {
      if (!event.relatedTarget) hideTrail();
    });

    window.addEventListener("blur", hideTrail);
    window.addEventListener("focus", showTrail);
  }

  if (document.body) {
    initCursorTrail();
  } else {
    window.addEventListener("DOMContentLoaded", initCursorTrail, { once: true });
  }
})();
