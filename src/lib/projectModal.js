const easing = 'cubic-bezier(.16,1,.3,1)';

export function attachProjectModal({ dialog, panel, image, flight, ripple, glint, details, backdrop, source, trigger, onClose }, {
  browser = window, doc = document,
} = {}) {
  const reduced = browser.matchMedia('(prefers-reduced-motion: reduce)');
  const animations = new Set();
  const savedOverflow = [doc.documentElement.style.overflow, doc.body.style.overflow];
  let locked = false;
  let alive = true;
  let phase = 'opening';
  let generation = 0;
  let destination;

  function rect(element) {
    const box = element?.isConnected !== false && element?.getBoundingClientRect();
    return box && [box.left, box.top, box.width, box.height].every(Number.isFinite)
      && box.width > 0 && box.height > 0
      && box.top + box.height > 0 && box.top < browser.innerHeight ? box : null;
  }
  function animate(element, frames, duration, delay = 0) {
    const animation = element.animate(frames, { duration, delay, easing, fill: 'both' });
    animations.add(animation);
    return animation.finished.catch(() => {});
  }
  function clearAnimations() {
    animations.forEach((animation) => animation.cancel());
    animations.clear();
  }
  function unlock() {
    if (!locked) return;
    doc.documentElement.style.overflow = savedOverflow[0];
    doc.body.style.overflow = savedOverflow[1];
    locked = false;
  }
  function positionFlight() {
    Object.assign(flight.style, { left: `${destination.left}px`, top: `${destination.top}px`,
      width: `${destination.width}px`, height: `${destination.height}px` });
  }
  function toSource(box) {
    return `translate(${box.left - destination.left}px, ${box.top - destination.top}px) scale(${box.width / destination.width}, ${box.height / destination.height})`;
  }
  function settle() {
    if (!alive || phase === 'closed' || phase === 'closing') return;
    generation++;
    clearAnimations();
    [panel, details, backdrop].forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
    image.style.visibility = '';
    flight.hidden = true;
    phase = 'open';
  }
  function finishClose() {
    if (!alive || phase === 'closed') return;
    generation++;
    phase = 'closed';
    clearAnimations();
    image.style.visibility = '';
    flight.hidden = true;
    const restoreFocus = dialog.contains(doc.activeElement);
    if (dialog.open) dialog.close();
    unlock();
    if (restoreFocus && trigger?.isConnected && doc.visibilityState !== 'hidden') trigger.focus({ preventScroll: true });
    onClose();
  }
  async function close() {
    if (!alive || phase === 'closed' || phase === 'closing') return;
    const wasFlying = !flight.hidden;
    const start = wasFlying ? browser.getComputedStyle(flight).transform : 'none';
    const panelStyle = browser.getComputedStyle(panel);
    const startPanel = { opacity: panelStyle.opacity, transform: panelStyle.transform };
    const startBackdrop = browser.getComputedStyle(backdrop).opacity;
    phase = 'closing';
    const token = ++generation;
    clearAnimations();
    if (typeof panel.animate !== 'function' || doc.visibilityState === 'hidden') { finishClose(); return; }
    const origin = rect(source);
    if (!wasFlying) destination = rect(image);
    const canFly = !reduced.matches && origin && destination;
    const duration = reduced.matches ? 90 : 420;
    const jobs = [animate(panel, [startPanel, reduced.matches ? { opacity: 0 } : { opacity: 0, transform: 'scale(.95)' }], duration),
      animate(backdrop, [{ opacity: startBackdrop }, { opacity: 0 }], duration)];
    if (canFly) {
      positionFlight();
      flight.hidden = false;
      image.style.visibility = 'hidden';
      jobs.push(animate(flight, [{ opacity: 1, transform: start }, { opacity: 1, transform: toSource(origin) }], duration));
    } else { flight.hidden = true; image.style.visibility = ''; }
    await Promise.all(jobs);
    if (alive && generation === token) finishClose();
  }
  function cancel(event) { event.preventDefault(); void close(); }
  function click(event) {
    if (event.target === backdrop || event.target.closest?.('[data-modal-close]')) void close();
  }
  function resize() {
    if (phase === 'closing') finishClose();
    else settle();
  }
  function visibility() { if (doc.visibilityState === 'hidden') finishClose(); }

  dialog.showModal();
  doc.documentElement.style.overflow = 'hidden';
  doc.body.style.overflow = 'hidden';
  locked = true;
  dialog.querySelector('button')?.focus({ preventScroll: true });
  dialog.addEventListener('cancel', cancel);
  dialog.addEventListener('click', click);
  panel.addEventListener('scroll', resize, { passive: true });
  browser.addEventListener('resize', resize);
  reduced.addEventListener('change', resize);
  doc.addEventListener('visibilitychange', visibility);

  async function enter() {
    if (typeof panel.animate !== 'function') { settle(); return; }
    const token = ++generation;
    const origin = rect(source);
    destination = rect(image);
    const canFly = !reduced.matches && origin && destination;
    const duration = reduced.matches ? 100 : 660;
    const jobs = [animate(backdrop, [{ opacity: 0 }, { opacity: 1 }], reduced.matches ? 100 : 180),
      animate(panel, reduced.matches ? [{ opacity: 0 }, { opacity: 1 }] : [
        { opacity: 0, transform: 'scale(.88)' }, { opacity: 1, transform: 'scale(1.012)', offset: .85 },
        { opacity: 1, transform: 'none' }], reduced.matches ? 100 : 560, reduced.matches ? 0 : 80)];
    if (canFly) {
      positionFlight();
      flight.hidden = false;
      image.style.visibility = 'hidden';
      jobs.push(animate(flight, [
        { transform: toSource(origin), offset: 0 },
        { transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top - 14}px) scale(${origin.width / destination.width * 1.03}, ${origin.height / destination.height * 1.03}) rotate(-3deg)`, offset: .18 },
        { transform: 'scale(1.018) rotate(.35deg)', offset: .82 }, { transform: 'none', offset: 1 },
      ], duration));
      Object.assign(ripple.style, { left: `${origin.left + origin.width / 2 - 24}px`, top: `${origin.top + origin.height / 2 - 24}px` });
      jobs.push(animate(ripple, [{ opacity: .14, transform: 'scale(.3)' }, { opacity: 0, transform: 'scale(10)' }], 520));
      jobs.push(animate(glint, [{ transform: 'translateX(-95%)' }, { transform: 'translateX(95%)' }], 360, 130));
    }
    jobs.push(animate(details, reduced.matches ? [{ opacity: 0 }, { opacity: 1 }]
      : [{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], reduced.matches ? 100 : 180, reduced.matches ? 0 : 460));
    await Promise.all(jobs);
    if (alive && generation === token) settle();
  }
  void enter().catch(() => { if (alive) settle(); });

  return () => {
    alive = false;
    generation++;
    clearAnimations();
    dialog.removeEventListener('cancel', cancel);
    dialog.removeEventListener('click', click);
    panel.removeEventListener('scroll', resize);
    browser.removeEventListener('resize', resize);
    reduced.removeEventListener('change', resize);
    doc.removeEventListener('visibilitychange', visibility);
    if (dialog.open) dialog.close();
    unlock();
  };
}
