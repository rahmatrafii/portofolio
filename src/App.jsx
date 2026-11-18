import { useEffect, useMemo, useRef } from 'react';
import { motion, motionValue, useMotionValue } from 'framer-motion';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Header from './components/Header.jsx';
import CareerTimeline from './components/CareerTimeline.jsx';
import Portrait from './components/Portrait.jsx';
import Projects from './components/Projects.jsx';
import Gallery from './components/Gallery.jsx';
import { attachPortraitJourney } from './lib/portraitJourney.js';
import { attachSmoothScroll } from './lib/smoothScroll.js';
import { skills } from './data/portfolio.js';

export default function App({ active = true, navigationRef, restoredFolder } = {}) {
  const backgroundRef = useRef(null);
  const journeyRef = useRef(null);
  const heroRef = useRef(null);
  const portraitSourceRef = useRef(null);
  const portraitTargetRef = useRef(null);
  const portraitTravelerRef = useRef(null);
  const aboutStoryRef = useRef(null);
  const aboutDetailsRef = useRef(null);
  const aboutRunwayRef = useRef(null);
  const aboutStageRef = useRef(null);
  const ownNavigationRef = useRef({});
  const sectionNavigationRef = navigationRef ?? ownNavigationRef;
  const scroll = useMotionValue(0);
  const photoX = useMotionValue(0);
  const photoY = useMotionValue(0);
  const photoScale = useMotionValue(1);
  const photoArrival = useMotionValue(0);
  const storyX = useMotionValue(0);
  const detailsX = useMotionValue(0);
  const storyY = useMotionValue(0);
  const detailsY = useMotionValue(0);
  const storyOpacity = useMotionValue(1);
  const detailsOpacity = useMotionValue(1);
  const skillMotion = useMemo(() => skills.map(() => ({
    x: motionValue(0), y: motionValue(0), scale: motionValue(1), opacity: motionValue(0),
  })), []);

  useEffect(() => {
    if (!active) return;
    const detachJourney = attachPortraitJourney({
      root: journeyRef.current,
      hero: heroRef.current,
      source: portraitSourceRef.current,
      target: portraitTargetRef.current,
      traveler: portraitTravelerRef.current,
      story: aboutStoryRef.current,
      details: aboutDetailsRef.current,
      runway: aboutRunwayRef.current,
      stage: aboutStageRef.current,
      cards: [...heroRef.current.querySelectorAll('.skill-position')],
      navigation: sectionNavigationRef.current,
      scroll,
      motion: { x: photoX, y: photoY, scale: photoScale, arrival: photoArrival,
        storyX, detailsX, storyY, detailsY, opacity: storyOpacity, detailsOpacity, skills: skillMotion },
    });
    const detachScroll = attachSmoothScroll(scroll, { navigation: sectionNavigationRef.current });
    return () => {
      detachScroll();
      detachJourney();
    };
  }, [active, sectionNavigationRef, scroll, photoX, photoY, photoScale, photoArrival, storyX, detailsX, storyY, detailsY, storyOpacity, detailsOpacity, skillMotion]);

  return (
    <>
      <a className="skip-link" href="#about">Lewati ke konten</a>
      <Header active={active} />
      <main className="page">
        <div className="intro-journey" ref={journeyRef}>
          <Hero backgroundRef={backgroundRef} heroRef={heroRef} portraitSourceRef={portraitSourceRef} skillMotion={skillMotion} active={active} />
          <About portraitTargetRef={portraitTargetRef} aboutStoryRef={aboutStoryRef} aboutDetailsRef={aboutDetailsRef}
            aboutRunwayRef={aboutRunwayRef} aboutStageRef={aboutStageRef}
            storyStyle={{ x: storyX, y: storyY, opacity: storyOpacity }} detailsStyle={{ x: detailsX, y: detailsY, opacity: detailsOpacity }} />
          <motion.div className="portrait-traveler" ref={portraitTravelerRef} aria-hidden="true"
            style={{ x: photoX, y: photoY, scale: photoScale, '--portrait-arrival': photoArrival }}>
            <Portrait decorative />
          </motion.div>
        </div>
        <CareerTimeline scroll={scroll} active={active} />
        <Projects active={active} restoredFolder={restoredFolder} />
        <Gallery scroll={scroll} active={active} />
      </main>
    </>
  );
}
