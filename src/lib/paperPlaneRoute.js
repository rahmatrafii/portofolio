export function createPaperPlaneRoute(width, height, random = Math.random) {
  if (![width, height].every(Number.isFinite) || width < 160 || height < 70) return null;
  const center = height / 2;
  const range = Math.max(0, height / 2 - 35);
  const y = () => center + (random() * 2 - 1) * range;
  const startY = y(), endY = y();
  const cx = width * (.42 + random() * .16);
  const radiusX = 42 + random() * 24;
  const radiusY = Math.min(13, range);
  const k = .55228475;
  const move = ['M', width + 96, startY];
  const segments = random() < .55 ? [
    ['C', width * .85, startY, cx + k * radiusX, center + radiusY, cx, center + radiusY],
    ['C', cx - k * radiusX, center + radiusY, cx - radiusX, center + k * radiusY, cx - radiusX, center],
    ['C', cx - radiusX, center - k * radiusY, cx - k * radiusX, center - radiusY, cx, center - radiusY],
    ['C', cx + k * radiusX, center - radiusY, cx + radiusX, center - k * radiusY, cx + radiusX, center],
    ['C', cx + radiusX, center + k * radiusY, cx + k * radiusX, center + radiusY, cx, center + radiusY],
    ['C', cx - k * radiusX, center + radiusY, width * .12, endY, -96, endY],
  ] : [
    ['C', width * .85, startY, cx + width * .16, center - range, cx, center - range],
    ['C', cx - width * .16, center - range, width * .12, center + range, -96, endY],
  ];
  return [move, ...segments].map((command) => command.map((value) => typeof value === 'number' ? Number(value.toFixed(3)) : value).join(' ')).join(' ');
}

export function attachPaperPlaneRoute({ sky, plane }, browser = window) {
  let attached = true;
  let width = 0, height = 0;
  function renew() {
    if (!attached) return;
    const path = createPaperPlaneRoute(width, height);
    if (!path) return;
    sky.style.setProperty('--plane-path', `path("${path}")`);
    sky.dataset.routeReady = 'true';
  }
  function measure() {
    if (!attached) return;
    const box = sky.getBoundingClientRect();
    if (box.width === width && box.height === height) return;
    width = box.width; height = box.height;
    renew();
  }
  function next(event) {
    if (event.target === plane && event.animationName === 'paper-plane-flight') renew();
  }
  const observer = browser.ResizeObserver ? new browser.ResizeObserver(measure) : null;
  observer?.observe(sky);
  if (!observer) browser.addEventListener('resize', measure);
  plane.addEventListener('animationiteration', next);
  measure();
  return () => {
    attached = false;
    observer?.disconnect();
    if (!observer) browser.removeEventListener('resize', measure);
    plane.removeEventListener('animationiteration', next);
    sky.style.removeProperty('--plane-path');
    delete sky.dataset.routeReady;
  };
}
