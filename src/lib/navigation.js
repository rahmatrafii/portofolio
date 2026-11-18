export function attachNavigation(sections, onUpdate) {
  let positions = [];
  let pendingFrame = 0;
  let previous;

  function update() {
    pendingFrame = 0;
    const y = window.scrollY;
    const bottom = document.documentElement.scrollHeight - window.innerHeight;
    let activeId = positions[0]?.id ?? 'home';
    for (const section of positions) {
      if (section.top <= y + 140) activeId = section.id;
    }
    if (bottom > 0 && y >= bottom - 2) activeId = positions.at(-1).id;
    const scrolled = previous?.scrolled ? y > 16 : y > 48;
    if (activeId !== previous?.activeId || scrolled !== previous?.scrolled) {
      previous = { activeId, scrolled };
      onUpdate(previous);
    }
  }

  function scheduleUpdate() {
    if (!pendingFrame) pendingFrame = window.requestAnimationFrame(update);
  }

  function measure() {
    positions = sections.map((section) => ({
      id: section.id,
      top: section.getBoundingClientRect().top + window.scrollY,
    }));
    scheduleUpdate();
  }

  const observer = window.ResizeObserver ? new window.ResizeObserver(measure) : null;
  sections.forEach((section) => observer?.observe(section));
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  measure();

  return () => {
    observer?.disconnect();
    window.cancelAnimationFrame(pendingFrame);
    window.removeEventListener('scroll', scheduleUpdate);
    window.removeEventListener('resize', measure);
  };
}
