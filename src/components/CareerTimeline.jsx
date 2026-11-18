import { useEffect, useMemo, useRef } from 'react';
import { motion, motionValue, useMotionValue, useTransform } from 'framer-motion';
import { career } from '../data/career.js';
import { attachCareerTimeline } from '../lib/careerTimeline.js';
import { careerNodeY } from '../lib/careerRoute.js';
import BirdBackground from './BirdBackground.jsx';

const entries = career.flatMap((chapter) => chapter.entries);

function CareerRoute({ route }) {
  const path = useTransform(route, (value) => value?.path ?? '');
  const light = useTransform(route, (value) => value?.light ?? '');
  const viewBox = useTransform(route, (value) => value?.viewBox ?? '0 0 1 48');
  const headX = useTransform(route, (value) => value?.headX ?? 0);
  const headY = useTransform(route, (value) => value?.headY ?? 0);
  const tailX = useTransform(route, (value) => value?.tailX ?? 0);
  const tailY = useTransform(route, (value) => value?.tailY ?? 0);
  const opacity = useTransform(route, (value) => value ? 1 : 0);
  const lightOpacity = useTransform(route, (value) => value?.lightOpacity ?? 1);

  return (
    <motion.svg className="career-route" viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true" style={{ opacity }}>
      <defs>
        <motion.linearGradient id="career-travel-light" gradientUnits="userSpaceOnUse" x1={tailX} y1={tailY} x2={headX} y2={headY}>
          <stop stopColor="#3f8b86" stopOpacity="0" /><stop offset=".6" stopColor="#3f8b86" stopOpacity=".65" /><stop offset="1" stopColor="#42a797" />
        </motion.linearGradient>
      </defs>
      <motion.path className="career-route-base" d={path} />
      <motion.g style={{ opacity: lightOpacity }}>
        <motion.path className="career-route-aura" d={light} stroke="url(#career-travel-light)" />
        <motion.path className="career-route-light" d={light} stroke="url(#career-travel-light)" />
        <motion.circle className="career-light-halo" cx={headX} cy={headY} r="7" />
        <motion.circle className="career-light-head" cx={headX} cy={headY} r="2.5" />
      </motion.g>
    </motion.svg>
  );
}

function CareerEntry({ entry, chapter, focus }) {
  const index = entries.indexOf(entry);
  const nodeOpacity = useTransform(focus, [0, 1], [.24, 1]);
  const nodeScale = useTransform(focus, [0, 1], [.9, 1.08]);
  const copyOpacity = useTransform(focus, [0, 1], [.74, 1]);

  return (
    <li className="career-item" data-chapter={chapter} data-organization={entry.id} style={{ '--career-stop-y': `${careerNodeY(index)}px` }}>
      <motion.span className="career-node" aria-hidden="true" style={{ opacity: nodeOpacity, scale: nodeScale }}>
        <motion.span className="career-node-glow" style={{ opacity: focus }} />
        <span className="career-diamond"><motion.span style={{ opacity: focus }} /></span>
      </motion.span>
      <span className="career-connector" aria-hidden="true" />
      <motion.div className="career-copy" style={{ opacity: copyOpacity, '--career-focus': focus }}>
        <div className="career-content">
          <div className="career-identity">
            {entry.logo && <span className="career-brand" aria-hidden="true"><img src={entry.logo} alt="" width="96" height="44" loading="lazy" /></span>}
            <div>
              <h4>{entry.organization}</h4>
              <p className="career-period">
                <time dateTime={entry.start}>{entry.start}</time>
                {entry.end && <>–{entry.end === 'sekarang' ? entry.end : <time dateTime={entry.end}>{entry.end}</time>}</>}
              </p>
            </div>
          </div>
          <p className="career-role">{entry.role}</p>
          {entry.affiliation && <p className="career-affiliation">{entry.affiliation}</p>}
          {(entry.category || entry.note) && <p className="career-meta"><span className="career-category">{entry.category || entry.note}</span></p>}
        </div>
      </motion.div>
    </li>
  );
}

export default function CareerTimeline({ scroll, active = true }) {
  const rootRef = useRef(null);
  const runwayRef = useRef(null);
  const stageRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const focus = useMemo(() => Object.fromEntries(career.flatMap((chapter) =>
    chapter.entries.map((entry) => [entry.id, motionValue(0)]))), []);
  const x = useMotionValue(0);
  const chapterProgress = useMotionValue(0);
  const route = useMotionValue(null);
  const educationOpacity = useTransform(chapterProgress, [0, .5, 1], [1, 0, 0]);
  const experienceOpacity = useTransform(chapterProgress, [0, .5, 1], [0, 0, 1]);

  useEffect(() => active ? attachCareerTimeline({
    root: rootRef.current,
    runway: runwayRef.current,
    stage: stageRef.current,
    viewport: viewportRef.current,
    track: trackRef.current,
    items: [...trackRef.current.querySelectorAll('.career-item')],
    scroll,
    motion: { x, focus: Object.values(focus), chapter: chapterProgress, route },
  }) : undefined, [active, scroll, x, focus, chapterProgress, route]);

  return (
    <section className="career" id="journey" ref={rootRef} aria-labelledby="career-heading" tabIndex={-1}>
      <h2 className="sr-only" id="career-heading">Education &amp; Experience</h2>
      <div className="career-runway" ref={runwayRef}>
        <div className="career-stage" ref={stageRef}>
          <BirdBackground stageRef={stageRef} scene="career" />
          <a className="career-skip" href="#home">Kembali ke beranda</a>
          <div className="career-current-chapter" aria-hidden="true">
            <motion.span style={{ opacity: educationOpacity }}>Education</motion.span>
            <motion.span style={{ opacity: experienceOpacity }}>Experience</motion.span>
          </div>
          <div className="career-window" ref={viewportRef}>
            <motion.div className="career-track" ref={trackRef} style={{ x }}>
              <CareerRoute route={route} />
              {career.map((chapter) => (
                <div className="career-group" key={chapter.id}>
                  <h3>{chapter.title}</h3>
                  <ol className="career-items" aria-label={chapter.title}>
                    {chapter.entries.map((entry) => <CareerEntry key={entry.id} entry={entry} chapter={chapter.id} focus={focus[entry.id]} />)}
                  </ol>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
