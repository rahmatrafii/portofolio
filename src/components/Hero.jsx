import { useEffect, useRef } from 'react';
import { skills } from '../data/portfolio.js';
import { attachParallax } from '../lib/parallax.js';
import CloudBackground from './CloudBackground.jsx';
import Portrait from './Portrait.jsx';
import { motion } from 'framer-motion';

export default function Hero({ backgroundRef, heroRef, portraitSourceRef, skillMotion, active = true }) {
  const sceneRef = useRef(null);

  useEffect(() => active ? attachParallax({
    background: backgroundRef.current,
    hero: heroRef.current,
    scene: sceneRef.current,
  }) : undefined, [active, backgroundRef, heroRef]);

  return (
    <section className="hero" id="home" aria-labelledby="role" tabIndex={-1} ref={heroRef}>
      <CloudBackground heroRef={heroRef} backgroundRef={backgroundRef} />
      <div className="hero-heading">
        <h1 id="role">AI Engineer</h1>
      </div>
      <p className="hero-intro">Membangun aplikasi AI dan otomasi untuk memudahkan pekerjaan.</p>
      <div className="scene" ref={sceneRef}>
        <div className="halo" aria-hidden="true" />
        {skills.map(({ name, icon, speed, depth, style }, index) => (
          <div className="skill-position" data-speed={speed} data-depth={depth} style={{
            ...style,
            '--card-y': `${parseFloat(style['--card-y']) / 500 * 100}%`,
            '--mobile-card-y': `${parseFloat(style['--mobile-card-y']) / 330 * 100}%`,
          }} key={name}>
            <motion.div className="skill-entrance" style={skillMotion[index]}>
              <div className="skill-tile">
                <img src={icon} alt={name} width="64" height="64" />
              </div>
            </motion.div>
          </div>
        ))}
        <div className="portrait-anchor" ref={portraitSourceRef}>
          <div className="hero-portrait">
            <Portrait />
          </div>
        </div>
      </div>
    </section>
  );
}
