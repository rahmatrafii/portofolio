const tau = Math.PI * 2;
const round = (value) => Number(value.toFixed(3));

export const careerNodeY = (index) => index % 2 === 0 ? 34 : 14;

export function createCareerVerticalRoute(centers, height, readingPoint, direction) {
  const first = centers[0];
  const last = centers.at(-1);
  const head = Math.max(first, Math.min(last, readingPoint));
  const tail = Math.max(first, Math.min(last, head - Math.sign(direction || 1) * 80));
  return {
    path: `M24 ${round(first)} L24 ${round(last)}`,
    light: `M24 ${round(tail)} L24 ${round(head)}`,
    headX: 24, headY: round(head), tailX: 24, tailY: round(tail),
    lightOpacity: Math.max(0, 1 - Math.abs(readingPoint - head) / 120),
    viewBox: `0 0 48 ${round(height)}`,
  };
}

// Zero displacement and slope at every stop keep the wave attached to stable nodes.
export function createCareerRoute(centers, viewportWidth, readingPoint, direction, trackWidth) {
  const stops = [centers[0] - viewportWidth, ...centers, centers.at(-1) + viewportWidth];
  const phase = (readingPoint - centers[0]) / 160;

  function point(x) {
    const index = Math.max(0, Math.min(stops.length - 2, stops.findIndex((stop) => stop >= x) - 1));
    const span = stops[index + 1] - stops[index];
    const t = Math.max(0, Math.min(1, (x - stops[index]) / span));
    const startY = careerNodeY(index - 1);
    const deltaY = careerNodeY(index) - startY;
    const envelope = Math.sin(Math.PI * t) ** 2;
    const angle = tau * t - phase + index * .65;
    const y = startY + deltaY * t * t * (3 - 2 * t) + 8 * Math.sin(angle) * envelope;
    const slope = (deltaY * 6 * t * (1 - t)
      + 8 * (tau * Math.cos(angle) * envelope + Math.PI * Math.sin(angle) * Math.sin(tau * t))) / span;
    return { x, y, slope };
  }

  function pathBetween(from, to) {
    const cuts = [from, ...stops.filter((x) => x > Math.min(from, to) && x < Math.max(from, to)), to]
      .sort((a, b) => from <= to ? a - b : b - a);
    const first = point(from);
    let path = `M${round(first.x)} ${round(first.y)}`;
    for (let i = 1; i < cuts.length; i++) {
      for (let part = 0; part < 8; part++) {
        const start = point(cuts[i - 1] + (cuts[i] - cuts[i - 1]) * part / 8);
        const end = point(cuts[i - 1] + (cuts[i] - cuts[i - 1]) * (part + 1) / 8);
        const handle = (end.x - start.x) / 3;
        path += ` C${round(start.x + handle)} ${round(start.y + start.slope * handle)}`
          + ` ${round(end.x - handle)} ${round(end.y - end.slope * handle)} ${round(end.x)} ${round(end.y)}`;
      }
    }
    return path;
  }

  const head = point(readingPoint);
  const tail = point(readingPoint - Math.sign(direction || 1) * 90);
  return {
    path: pathBetween(stops[0], stops.at(-1)),
    light: pathBetween(tail.x, head.x),
    headX: round(head.x), headY: round(head.y),
    tailX: round(tail.x), tailY: round(tail.y),
    viewBox: `0 0 ${round(trackWidth)} 48`,
  };
}
