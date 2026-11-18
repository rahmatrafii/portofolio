export function attachCloudMotion({ hero, background }) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = !window.IntersectionObserver;
  let attached = true;

  function update() {
    if (attached) {
      background.dataset.playing = String(inView
        && document.visibilityState !== 'hidden'
        && !reducedMotion.matches);
    }
  }

  const observer = window.IntersectionObserver
    ? new window.IntersectionObserver((entries) => {
      const entry = entries.find((item) => item.target === hero);
      if (entry) {
        inView = entry.isIntersecting;
        update();
      }
    })
    : null;

  document.addEventListener('visibilitychange', update);
  reducedMotion.addEventListener('change', update);
  observer?.observe(hero);
  update();

  return () => {
    attached = false;
    observer?.disconnect();
    document.removeEventListener('visibilitychange', update);
    reducedMotion.removeEventListener('change', update);
    background.dataset.playing = 'false';
  };
}
