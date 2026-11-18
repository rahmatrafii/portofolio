import { frame, cancelFrame } from 'framer-motion';
import { createHeroSkillsReveal } from './heroSkills.js';

const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);
const properties = [
  '--portrait-left', '--portrait-width', '--portrait-height',
];
const storyProperties = ['--about-interaction', '--about-pin-top', '--about-runway', '--about-photo-width', '--about-photo-height'];
const defaults = { x: 0, y: 0, scale: 1, arrival: 0, storyX: 0, detailsX: 0, storyY: 0, detailsY: 0, opacity: 1, detailsOpacity: 1 };

export function attachPortraitJourney({ root, hero, source, target, traveler, story, details, runway, stage, cards = [], navigation, scroll, motion }, { frameLoop = frame, cancel = cancelFrame, now = () => performance.now() } = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(min-width: 961px) and (hover: hover) and (pointer: fine)');
  let attached = true;
  let pendingFrame;
  let frameVersion = 0;
  let geometry;
  let dirty = true;
  let previousScroll;
  const skillReveal = createHeroSkillsReveal(cards.length);
  root.dataset.portraitMotion = 'false';

  function resetSkills() {
    skillReveal.reset();
    motion.skills?.forEach((card) => {
      card.x.set(0); card.y.set(0); card.scale.set(1); card.opacity.set(1);
    });
  }

  function reset() {
    root.dataset.portraitMotion = 'false';
    delete root.dataset.aboutLayout;
    if (navigation) delete navigation.about;
    for (const property of properties) traveler.style.removeProperty(property);
    for (const property of storyProperties) root.style.removeProperty(property);
    for (const [key, value] of Object.entries(defaults)) motion[key].set(value);
    resetSkills();
    previousScroll = undefined;
  }

  function measure() {
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const text = story.getBoundingClientRect();
    const biography = details.getBoundingClientRect();
    const track = runway.getBoundingClientRect();
    const scene = stage.getBoundingClientRect();
    const rectangles = [from, to, text, biography, track, scene];
    const cardBoxes = cards.map((card) => card.getBoundingClientRect());
    rectangles.push(...cardBoxes);
    if (cards.length && cards.length !== motion.skills?.length) return undefined;
    if (!rectangles.every((box) => [box.width, box.height].every((value) => Number.isFinite(value) && value > 0)
      && [box.left, box.top].every(Number.isFinite))) return undefined;
    const scale = Math.min(to.width / from.width, to.height / from.height);
    // Child offsets stay stable even while the stage is already sticky on restore or resize.
    const flowTop = track.top + window.scrollY;
    const fittedTop = flowTop + to.top - scene.top + to.height - from.height * scale;
    const pinTop = Math.max(112, (window.innerHeight - scene.height) / 2);
    const pinned = finePointer.matches && scene.height <= window.innerHeight - 112 - 32;
    const span = pinned
      ? Math.min(720, Math.max(480, window.innerHeight * .75))
      : Math.min(320, Math.max(220, window.innerHeight * .32));
    const screenTop = Math.max(112, window.innerHeight - from.height * scale - 32);
    const turn = Math.max(1, pinned ? flowTop - pinTop : fittedTop - screenTop);
    const stacked = window.innerWidth <= 960;
    const entrySpan = Math.min(180, Math.max(120, window.innerHeight * .2));
    // Stacked panels open in their own reading area, after the portrait has landed.
    const storyStart = Math.max(turn, flowTop + text.top - scene.top - window.innerHeight * .88);
    const detailsStart = Math.max(storyStart + entrySpan, flowTop + biography.top - scene.top - window.innerHeight * .88);
    const x = to.left + to.width / 2 - from.left - from.width / 2;
    const photoLeft = to.left + (to.width - from.width * scale) / 2;
    const photoRight = photoLeft + from.width * scale;
    const photoBottom = fittedTop + from.height * scale;
    const revealDistance = finePointer.matches ? 48 : 20;
    const columnTravel = (box, gap) => {
      const top = flowTop + box.top - scene.top;
      const overlapsPhoto = top + box.height > fittedTop && top < photoBottom;
      return overlapsPhoto ? Math.min(revealDistance, Math.max(0, gap - 12)) : revealDistance;
    };
    return {
      x,
      scale,
      pinned,
      pinTop,
      end: turn + span,
      span,
      turn,
      stacked,
      entrySpan,
      storyStart,
      detailsStart,
      foldEnd: cards.length ? Math.min(finePointer.matches ? 160 : 96, turn * .22) : 0,
      cardFolds: cardBoxes.map((box) => ({
        x: from.left + from.width / 2 - box.left - box.width / 2,
        y: from.top + from.height * .56 - box.top - box.height / 2,
      })),
      fittedTop,
      sourceTop: from.top + window.scrollY,
      sourceLeft: from.left,
      sourceWidth: from.width,
      sourceHeight: from.height,
      storyTravel: columnTravel(text, photoLeft - text.left - text.width),
      detailsTravel: columnTravel(biography, biography.left - photoRight),
    };
  }

  function render() {
    pendingFrame = undefined;
    if (!attached || reducedMotion.matches || document.visibilityState === 'hidden') return;
    if (dirty) {
      geometry = measure();
      dirty = false;
      previousScroll = undefined;
      if (geometry) {
        traveler.style.setProperty('--portrait-left', `${geometry.sourceLeft.toFixed(3)}px`);
        traveler.style.setProperty('--portrait-width', `${geometry.sourceWidth.toFixed(3)}px`);
        traveler.style.setProperty('--portrait-height', `${geometry.sourceHeight.toFixed(3)}px`);
        root.style.setProperty('--about-pin-top', `${geometry.pinTop.toFixed(3)}px`);
        root.style.setProperty('--about-runway', `${geometry.pinned ? geometry.span.toFixed(3) : 0}px`);
        root.style.setProperty('--about-photo-width', `${(geometry.sourceWidth * geometry.scale).toFixed(3)}px`);
        root.style.setProperty('--about-photo-height', `${(geometry.sourceHeight * geometry.scale).toFixed(3)}px`);
        root.dataset.aboutLayout = geometry.pinned ? 'pinned' : 'flow';
        if (navigation) navigation.about = { end: geometry.end, arrival: geometry.turn, pinned: geometry.pinned };
      }
    }
    if (!geometry) {
      reset();
      return;
    }
    const position = scroll.get();
    if (position === previousScroll && !skillReveal.active()) return;
    const traveled = Math.max(0, Math.min(geometry.end, position));
    const descent = smoothstep(clamp((traveled - geometry.foldEnd) / (geometry.turn - geometry.foldEnd)));
    const opening = geometry.stacked
      ? clamp((position - geometry.storyStart) / geometry.entrySpan)
      : clamp((traveled - geometry.turn) / geometry.span);
    const reveal = smoothstep(opening);
    const detailsReveal = geometry.stacked
      ? smoothstep(clamp((position - geometry.detailsStart) / geometry.entrySpan))
      : reveal;
    // A fixed overlay avoids canceling compositor scrolling on a document-positioned photo.
    const y = geometry.pinned
      ? geometry.sourceTop + (geometry.fittedTop - geometry.turn - geometry.sourceTop) * descent + (traveled - position)
      : geometry.sourceTop + (geometry.fittedTop - geometry.sourceTop) * descent - position;
    const scale = 1 + (geometry.scale - 1) * descent;
    const open = skillReveal.sample(position, geometry.foldEnd, now(), !finePointer.matches);
    geometry.cardFolds.forEach((fold, index) => {
      const closed = 1 - open[index];
      const card = motion.skills[index];
      card.x.set(Number(((fold.x + geometry.x * descent) * closed).toFixed(3)));
      card.y.set(Number(((fold.y + position + y - geometry.sourceTop + geometry.sourceHeight * (scale - 1) * .56) * closed).toFixed(3)));
      card.scale.set(Number((1 - .55 * closed).toFixed(6)));
      card.opacity.set(Number(smoothstep(clamp(open[index] / .4)).toFixed(6)));
    });
    motion.x.set(Number((geometry.x * descent).toFixed(3)));
    motion.y.set(Number(y.toFixed(3)));
    motion.scale.set(Number(scale.toFixed(6)));
    motion.arrival.set(Number(descent.toFixed(6)));
    motion.storyX.set(geometry.stacked ? 0 : Number((geometry.storyTravel * (1 - reveal)).toFixed(3)));
    motion.detailsX.set(geometry.stacked ? 0 : Number((-geometry.detailsTravel * (1 - reveal)).toFixed(3)));
    motion.storyY.set(geometry.stacked ? Number((18 * (1 - reveal)).toFixed(3)) : 0);
    motion.detailsY.set(geometry.stacked ? Number((16 * (1 - detailsReveal)).toFixed(3)) : 0);
    motion.opacity.set(Number(reveal.toFixed(6)));
    motion.detailsOpacity.set(Number(detailsReveal.toFixed(6)));
    root.style.setProperty('--about-interaction', opening > 0 ? 'auto' : 'none');
    root.dataset.portraitMotion = 'true';
    previousScroll = position;
    if (skillReveal.active()) schedule();
  }

  function schedule() {
    if (attached && !pendingFrame && !reducedMotion.matches && document.visibilityState !== 'hidden') {
      const version = ++frameVersion;
      pendingFrame = () => {
        if (attached && version === frameVersion) render();
      };
      frameLoop.update(pendingFrame);
    }
  }

  function cancelScheduled() {
    if (pendingFrame) cancel(pendingFrame);
    pendingFrame = undefined;
    frameVersion++;
  }

  function onScroll() {
    if (dirty || scroll.get() !== previousScroll) schedule();
  }

  function invalidate() {
    if (!attached) return;
    dirty = true;
    schedule();
  }

  function onModeChange() {
    if (!attached) return;
    if (reducedMotion.matches) {
      cancelScheduled();
      reset();
    } else {
      invalidate();
    }
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      skillReveal.pause(now());
      cancelScheduled();
    } else {
      skillReveal.resume(now());
      invalidate();
    }
  }

  const observer = window.ResizeObserver ? new window.ResizeObserver(invalidate) : null;
  for (const element of [root, hero, source, target, story, details, runway, stage]) observer?.observe(element);
  const unsubscribeScroll = scroll.on('change', onScroll);
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('pageshow', invalidate);
  window.visualViewport?.addEventListener('resize', invalidate, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);
  reducedMotion.addEventListener('change', onModeChange);
  finePointer.addEventListener('change', onModeChange);
  document.fonts?.ready.then(invalidate);
  if (reducedMotion.matches) resetSkills();
  else schedule();

  return () => {
    attached = false;
    cancelScheduled();
    observer?.disconnect();
    unsubscribeScroll();
    window.removeEventListener('resize', invalidate);
    window.removeEventListener('pageshow', invalidate);
    window.visualViewport?.removeEventListener('resize', invalidate);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    reducedMotion.removeEventListener('change', onModeChange);
    finePointer.removeEventListener('change', onModeChange);
    reset();
    delete root.dataset.portraitMotion;
  };
}

