(function initPageLoader() {
  const loader = document.getElementById("page-loader");
  if (!loader) return;

  const progress = document.getElementById("page-loader-progress");
  const track = loader.querySelector(".page-loader-track");
  const minDuration = 1650;
  const start = performance.now();

  let rafId = 0;

  function update(now) {
    const elapsed = Math.min(now - start, minDuration);
    const ratio = elapsed / minDuration;
    const pct = Math.round((elapsed / minDuration) * 100);
    if (progress) progress.textContent = `${pct}%`;

    // Move beams from both edges to center over the shortened intro window.
    const beamPct = Math.min(ratio * 50, 50);
    const beamTarget = track || loader;
    beamTarget.style.setProperty("--beam-left", `${beamPct}%`);
    beamTarget.style.setProperty("--beam-right", `${beamPct}%`);

    if (elapsed < minDuration) {
      rafId = requestAnimationFrame(update);
      return;
    }

    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }

    loader.classList.add("is-hidden");

    window.setTimeout(() => {
      loader.remove();
    }, 420);
  }

  rafId = requestAnimationFrame(update);
})();
