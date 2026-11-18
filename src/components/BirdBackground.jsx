import { useEffect, useRef } from 'react';
import { attachCloudMotion } from '../lib/cloudMotion.js';

const birds = [
  { size: 58, height: '12%', duration: 43, delay: -14, wing: 4.2, phase: -1.4, drift: -18, rest: '18%', opacity: 0.42 },
  { size: 42, height: '25%', duration: 49, delay: -36, wing: 4.7, phase: -3.8, drift: 13, rest: '76%', opacity: 0.3 },
  { size: 34, height: '7%', duration: 52, delay: -24, wing: 3.8, phase: -2.2, drift: -10, rest: '42%', opacity: 0.24 },
  { size: 48, height: '37%', duration: 38, delay: -33, wing: 4.4, phase: -0.3, drift: 17, rest: '88%', opacity: 0.34 },
  { near: true, size: 64, height: '48px', duration: 76, delay: -20, wing: 4.5, phase: -2.6, drift: -12, rest: '10%', blur: 1.75, opacity: .24 },
];

const careerBirds = [
  { size: 44, height: '8px', duration: 47, delay: -11, wing: 4.6, phase: -1.9, drift: -8, rise: -4, rest: '12%', opacity: .34 },
  { size: 28, height: '30px', duration: 59, delay: -39, wing: 5.1, phase: -3.6, drift: 6, rise: 4, rest: '46%', opacity: .22 },
  { size: 36, height: '50px', duration: 41, delay: -32, wing: 4.2, phase: -0.8, drift: -10, rise: -8, rest: '82%', opacity: .3 },
  { size: 32, height: 'calc(100% - 104px)', duration: 53, delay: -17, wing: 4.8, phase: -2.7, drift: 8, rise: 10, rest: '24%', opacity: .24 },
  { size: 26, height: 'calc(100% - 56px)', duration: 61, delay: -45, wing: 5.3, phase: -4.1, drift: -6, rise: -14, rest: '76%', opacity: .2 },
  { near: true, size: 72, height: 'calc(100% - 84px)', duration: 84, delay: -14, wing: 4.3, phase: -1.7, drift: -8, rise: -12, rest: '84%', blur: 2.25, opacity: .22 },
];

export default function BirdBackground({ stageRef, scene = 'about' }) {
  const skyRef = useRef(null);
  const flock = scene === 'career' ? careerBirds : birds;

  // Birds share the clouds' offscreen, hidden-tab, and reduced-motion lifecycle.
  useEffect(() => attachCloudMotion({
    hero: stageRef.current,
    background: skyRef.current,
  }), [stageRef]);

  return (
    <div className={scene === 'career' ? 'career-sky' : 'about-sky'} ref={skyRef} aria-hidden="true">
      {flock.map((bird, index) => (
        <span className={`bird-flight${bird.near ? ' bird-flight-near' : ''}`} key={index} style={{
          '--bird-size': `${bird.size}px`,
          '--flight-height': bird.height,
          '--flight-duration': `${bird.duration}s`,
          '--flight-delay': `${bird.delay}s`,
          '--wing-cycle': `${bird.wing}s`,
          '--wing-delay': `${bird.phase}s`,
          '--bird-drift': `${bird.drift}px`,
          '--bird-rise': `${bird.rise ?? 0}px`,
          '--bird-blur': `${bird.blur ?? 0}px`,
          '--rest-x': bird.rest,
          opacity: bird.opacity,
        }}>
          <span className="bird-sprite" />
        </span>
      ))}
    </div>
  );
}
