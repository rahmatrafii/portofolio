const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const pixels = (value) => `${value.toFixed(2)}px`;

export function attachParallax({ background, hero, scene }) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)');
  const layers = Array.from(scene.querySelectorAll('.skill-position'), (element) => ({
    element,
    depth: Number(element.dataset.depth),
  }));
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let heroHeight;
  let bounds;
  let sceneTop;
  let scroll = 0;
  let targetScroll = 0;
  let pendingFrame = 0;
  let lastTime = null;
  const canAnimate = () => desktop.matches && !reducedMotion.matches;

  function measure() {
    heroHeight = hero.offsetHeight;
    bounds = scene.getBoundingClientRect();
    sceneTop = bounds.top + window.scrollY;
  }

  function render() {
    const progress = clamp(scroll / heroHeight, 0, 1);
    const depthProgress = 1 - (1 - progress) ** 2;
    background.style.setProperty('--cloud-offset', pixels(depthProgress * heroHeight * 0.16));
    background.style.setProperty('--sky-offset', pixels(depthProgress * heroHeight * 0.08));
    scene.style.setProperty('--halo-offset', pixels(depthProgress * 32));
    scene.style.setProperty('--halo-x', pixels(pointer.x * 4));
    for (const { element, depth } of layers) {
      element.style.setProperty('--skill-offset', pixels(0));
      element.style.setProperty('--pointer-x', pixels(pointer.x * depth * 0.7));
      element.style.setProperty('--pointer-y', pixels(pointer.y * depth * 0.28));
    }
  }

  function scheduleUpdate() {
    if (!pendingFrame && canAnimate()) {
      if (lastTime === null) lastTime = window.performance.now();
      pendingFrame = window.requestAnimationFrame(updateLayers);
    }
  }

  function updateLayers(timestamp) {
    pendingFrame = 0;
    const elapsed = clamp(timestamp - lastTime, 0, 64);
    lastTime = timestamp;
    const alpha = 1 - Math.exp(-elapsed / 90);
    scroll += (targetScroll - scroll) * alpha;
    pointer.x += (pointer.targetX - pointer.x) * alpha;
    pointer.y += (pointer.targetY - pointer.y) * alpha;
    const settled = Math.abs(targetScroll - scroll) < 0.1
      && Math.abs(pointer.targetX - pointer.x) < 0.001
      && Math.abs(pointer.targetY - pointer.y) < 0.001;
    if (settled) {
      scroll = targetScroll;
      pointer.x = pointer.targetX;
      pointer.y = pointer.targetY;
    }
    render();
    if (settled) lastTime = null;
    else scheduleUpdate();
  }

  function onScroll() {
    if (!canAnimate()) return;
    const next = clamp(window.scrollY, 0, heroHeight);
    if (next !== targetScroll) {
      targetScroll = next;
      scheduleUpdate();
    }
  }

  function resetPointer() {
    pointer.targetX = pointer.targetY = 0;
    scheduleUpdate();
  }

  function onPointerMove(event) {
    if (!canAnimate()) return;
    pointer.targetX = clamp((event.clientX - bounds.left) / bounds.width * 2 - 1, -1, 1);
    pointer.targetY = clamp((event.clientY + window.scrollY - sceneTop) / bounds.height * 2 - 1, -1, 1);
    scheduleUpdate();
  }

  function onModeChange() {
    window.cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    lastTime = null;
    pointer.x = pointer.y = pointer.targetX = pointer.targetY = 0;
    scroll = targetScroll = canAnimate() ? clamp(window.scrollY, 0, heroHeight) : 0;
    render();
  }

  function onResize() {
    measure();
    onModeChange();
  }

  measure();
  onModeChange();
  scene.addEventListener('pointermove', onPointerMove, { passive: true });
  scene.addEventListener('pointerleave', resetPointer, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  reducedMotion.addEventListener('change', onModeChange);
  desktop.addEventListener('change', onModeChange);

  return () => {
    window.cancelAnimationFrame(pendingFrame);
    scene.removeEventListener('pointermove', onPointerMove);
    scene.removeEventListener('pointerleave', resetPointer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    reducedMotion.removeEventListener('change', onModeChange);
    desktop.removeEventListener('change', onModeChange);
    background.style.removeProperty('--cloud-offset');
    background.style.removeProperty('--sky-offset');
    scene.style.removeProperty('--halo-offset');
    scene.style.removeProperty('--halo-x');
    for (const { element } of layers) {
      element.style.removeProperty('--skill-offset');
      element.style.removeProperty('--pointer-x');
      element.style.removeProperty('--pointer-y');
    }
  };
}
