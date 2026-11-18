const floatEase = 'cubic-bezier(.32,0,.52,1)';
const timing = { travel: 550, stagger: 80, reveal: 110, return: 590, tilt: 70 };

function matrixValues(transform = '') {
  return transform.match(/^matrix(?:3d)?\((.*)\)$/)?.[1].split(',').map(Number) ?? [];
}

export function readSheetPose(sheet, browser = window) {
  const inner = sheet?.querySelector('.folder-sheet-inner');
  if (!inner) return null;
  const box = inner.getBoundingClientRect();
  const style = browser.getComputedStyle(inner);
  const width = parseFloat(style.width) || inner.offsetWidth || box.width;
  const height = parseFloat(style.height) || inner.offsetHeight || box.height;
  if (![box.left, box.top, box.width, box.height, width, height].every(Number.isFinite)
    || [box.width, box.height, width, height].some((value) => value <= 0)) return null;
  const matrix = matrixValues(browser.getComputedStyle(sheet).transform);
  const angle = matrix.length ? Math.atan2(matrix[1], matrix[0]) * 180 / Math.PI : 0;
  return { cx: box.left + box.width / 2, cy: box.top + box.height / 2, width, height,
    angle: Number.isFinite(angle) ? angle : 0 };
}

export function floatSheetFrames(pose, viewport, index) {
  if (!pose || ![pose.cx, pose.cy, pose.angle, pose.width, pose.height, viewport.width, viewport.height].every(Number.isFinite)
    || [pose.width, pose.height, viewport.width, viewport.height].some((value) => value <= 0)) return null;
  const diagonal = Math.hypot(pose.width, pose.height);
  const endY = Math.min(-diagonal / 2 - 28, pose.cy - pose.height - 48);
  const drift = Math.min(24, viewport.width * .04) * (index / 3 * 2 - 1);
  const endAngle = index % 2 ? 3 : -3;
  return Array.from({ length: 17 }, (_, step) => {
    const offset = step / 16;
    const smooth = offset * offset * (3 - 2 * offset);
    const cx = pose.cx + drift * (smooth + .3 * Math.sin(Math.PI * offset));
    const cy = pose.cy + (endY - pose.cy) * offset;
    const angle = pose.angle + (endAngle - pose.angle) * smooth;
    const opacity = Math.max(0, Math.min(1, (cy + diagonal / 2 + 16) / (diagonal / 2 + 32)));
    return { transform: `translate3d(${cx - pose.width / 2}px, ${cy - pose.height / 2}px, 0) rotate(${angle}deg)`, opacity, offset };
  });
}

export function localSheetFrames(frames, pose, resting) {
  const matrix = matrixValues(resting);
  const restX = (matrix.length === 16 ? matrix[12] : matrix[4]) || 0;
  const restY = (matrix.length === 16 ? matrix[13] : matrix[5]) || 0;
  const radians = pose.angle * Math.PI / 180;
  const cos = Math.cos(radians), sin = Math.sin(radians);
  // Cancel the frozen fan rotation so the original sheet follows the viewport path inside its folder.
  return frames.map((frame) => {
    const values = frame.transform.match(/translate3d\(([-+\d.eE]+)px, ([-+\d.eE]+)px, 0\) rotate\(([-+\d.eE]+)deg\)/);
    const dx = Number(values[1]) + pose.width / 2 - pose.cx;
    const dy = Number(values[2]) + pose.height / 2 - pose.cy;
    return { ...frame, transform: `translate3d(${restX + dx * cos + dy * sin}px, ${restY - dx * sin + dy * cos}px, 0) rotate(${Number(values[3]) - pose.angle}deg)` };
  });
}

export function createSheetTransition(selected, { browser = window, doc = document } = {}) {
  const folder = selected.closest('.project-folder');
  const sheets = [...(folder?.querySelectorAll('.folder-sheet') ?? [])];
  if (sheets.length !== 4 || !sheets.includes(selected)) return null;
  const records = sheets.map((sheet) => {
    const inner = sheet.querySelector('.folder-sheet-inner');
    if (!inner?.animate || !inner.querySelector('img') || !readSheetPose(sheet, browser)) return null;
    return { sheet, inner, resting: browser.getComputedStyle(inner).transform, index: Number(sheet.dataset.sheetIndex),
      saved: { transform: inner.style.transform, transition: inner.style.transition,
        sheetTransform: sheet.style.transform, sheetTransition: sheet.style.transition } };
  });
  if (records.some((record) => !record)) return null;
  const tilt = selected.closest('.folder-tilt');
  const savedTilt = tilt && { transform: tilt.style.transform, transition: tilt.style.transition };
  const frozenTilt = tilt && browser.getComputedStyle(tilt).transform;
  if (tilt) Object.assign(tilt.style, { transform: frozenTilt, transition: 'none' });
  records.forEach((record) => {
    const frozenSheet = browser.getComputedStyle(record.sheet).transform;
    Object.assign(record.sheet.style, { transform: frozenSheet, transition: 'none' });
    Object.assign(record.inner.style, { transform: record.resting, transition: 'none' });
    record.sheet.classList.add('project-sheet-source');
  });
  const animations = new Set();
  let disposed = false;
  let layer;
  let backdrop;

  function play(element, keyframes, duration, easing = floatEase, startTime, delay = 0) {
    if (disposed) return Promise.resolve(false);
    const animation = element.animate(keyframes, { duration, delay, easing, fill: 'both' });
    if (Number.isFinite(startTime)) animation.startTime = startTime;
    animations.add(animation);
    return animation.finished.then(() => !disposed, () => false);
  }

  function createBackdrop() {
    layer = doc.createElement('div');
    layer.className = 'project-transition-layer';
    layer.setAttribute('aria-hidden', 'true');
    backdrop = doc.createElement('div');
    backdrop.className = 'project-transition-backdrop';
    layer.append(backdrop);
    doc.body.append(layer);
  }

  function paths(order) {
    // Neutral geometry is measured before paint; the actual tilt settles while the sheets already move.
    if (tilt) tilt.style.transform = 'none';
    const poses = order.map(({ sheet }) => readSheetPose(sheet, browser));
    if (tilt) tilt.style.transform = frozenTilt;
    const frames = poses.map((pose, step) => {
      const path = floatSheetFrames(pose, { width: browser.innerWidth, height: browser.innerHeight }, order[step].index);
      return path && localSheetFrames(path, pose, order[step].resting);
    });
    return frames.every(Boolean) ? frames : null;
  }

  function settleTilt(startTime) {
    return tilt?.animate ? play(tilt, [{ transform: frozenTilt }, { transform: 'none' }], timing.tilt, floatEase, startTime) : Promise.resolve(true);
  }

  return {
    async leaveFolder(page, onComplete = () => {}) {
      if (disposed) return false;
      const order = [...records].reverse();
      const frames = paths(order);
      if (!frames) return false;
      createBackdrop();
      const startTime = doc.timeline?.currentTime;
      const scheduled = order.map((record, step) => play(record.inner, frames[step], timing.travel, floatEase, startTime, step * timing.stagger));
      scheduled.push(settleTilt(startTime));
      scheduled.push(play(backdrop, [{ opacity: 0, offset: 0 }, { opacity: 0, offset: .7 },
        { opacity: 1, offset: 1 }], timing.travel, 'ease-in-out', startTime, (order.length - 1) * timing.stagger));
      const result = await Promise.all(scheduled);
      if (disposed || !result.every(Boolean)) return false;
      onComplete();
      return !disposed;
    },
    async reveal() {
      if (disposed) return false;
      const ready = await play(backdrop, [{ opacity: 1 }, { opacity: 0 }], timing.reveal);
      layer?.remove();
      return ready;
    },
    async returnToFolder(page) {
      if (disposed) return false;
      const images = [...(page?.querySelectorAll('.project-card > img[data-project-index]') ?? [])];
      if (!records.every((record) => images.some((image) => Number(image.dataset.projectIndex) === record.index))) return false;
      const frames = paths(records);
      if (!frames) return false;
      const startTime = doc.timeline?.currentTime;
      const scheduled = [play(page, [{ opacity: 1 }, { opacity: 0 }], timing.reveal, 'ease-out', startTime), settleTilt(startTime)];
      records.forEach((record, step) => {
        const returning = frames[step].map((frame) => ({ ...frame, offset: 1 - frame.offset })).reverse();
        scheduled.push(play(record.inner, returning, timing.return, floatEase, startTime, timing.reveal + step * timing.stagger));
      });
      return (await Promise.all(scheduled)).every(Boolean);
    },
    dispose() {
      disposed = true;
      animations.forEach((animation) => animation.cancel());
      animations.clear();
      layer?.remove();
      records.forEach((record) => {
        const { saved } = record;
        Object.assign(record.inner.style, { transform: saved.transform, transition: saved.transition });
        Object.assign(record.sheet.style, { transform: saved.sheetTransform, transition: saved.sheetTransition });
        record.sheet.classList.remove('project-sheet-source');
      });
      if (tilt) Object.assign(tilt.style, savedTilt);
    },
  };
}
