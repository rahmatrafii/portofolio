const clamp = (value) => Math.min(1, Math.max(0, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

export function createHeroSkillsReveal(count) {
  let started = false;
  let start;
  let paused;
  let previous;
  let handoff;
  let open = Array(count).fill(0);

  return {
    active: () => start !== undefined,
    reset() {
      started = true;
      start = paused = previous = handoff = undefined;
      open = Array(count).fill(1);
    },
    pause(time) { if (start !== undefined) paused = time; },
    resume(time) {
      if (paused !== undefined && start !== undefined) start += Math.max(0, time - paused);
      paused = undefined;
    },
    sample(position, range, time, compact) {
      if (!count || range <= 0) return open;
      if (!started) {
        started = true;
        if (position < 1) start = time;
      }
      if (start !== undefined && previous !== undefined && position !== previous) {
        handoff = { from: previous, to: range, direction: 1, open: [...open] };
        start = undefined;
      }
      if (handoff && previous !== undefined && position !== previous) {
        const direction = Math.sign(position - previous);
        if (direction !== handoff.direction) {
          handoff = { from: previous, to: direction > 0 ? range : 0, direction, open: [...open] };
        }
      }
      if (handoff && (position <= 0 || position >= range)) handoff = undefined;
      const duration = compact ? 460 : 560;
      const delay = compact ? 60 : 80;
      const pairs = Math.ceil(count / 2);
      if (start !== undefined && time - start >= duration + (pairs - 1) * delay) start = undefined;
      const canonical = 1 - smoothstep(clamp(position / range));
      open = open.map((_, index) => {
        if (handoff) {
          const progress = smoothstep(clamp((position - handoff.from) / (handoff.to - handoff.from)));
          return handoff.open[index] + ((handoff.direction > 0 ? 0 : 1) - handoff.open[index]) * progress;
        }
        if (start !== undefined) {
          const progress = clamp((time - start - (index % pairs) * delay) / duration);
          return (1 - (1 - progress) ** 3) * canonical;
        }
        return canonical;
      });
      previous = position;
      return open;
    },
  };
}
