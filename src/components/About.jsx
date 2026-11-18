import { biography, resume } from '../data/portfolio.js';
import { motion } from 'framer-motion';
import Portrait from './Portrait.jsx';
import BirdBackground from './BirdBackground.jsx';

export default function About({ portraitTargetRef, aboutStoryRef, aboutDetailsRef, aboutRunwayRef, aboutStageRef, storyStyle, detailsStyle }) {
  return (
    <section className="about" id="about" aria-labelledby="about-heading" tabIndex={-1}>
      <div className="about-runway" ref={aboutRunwayRef}>
        <div className="about-stage" ref={aboutStageRef}>
          <BirdBackground stageRef={aboutStageRef} />
          <div className="about-content">
            <div className="about-identity" ref={aboutStoryRef}>
              <motion.div className="about-panel-inner" style={storyStyle}>
                <p className="section-label">
                  <span className="section-label-line" aria-hidden="true" />Tentang saya
                </p>
                <h2 id="about-heading">
                  <span className="about-heading-line about-greeting">Halo, saya</span>{' '}
                  <span className="about-heading-line"><span className="about-name-first">Rahmat Rafi</span>{' '}<span className="about-name-last">Indrayani.</span></span>
                </h2>
                <div className="about-actions">
                  <p className="about-role">AI Engineer</p>
                  <a className="about-download" href={resume.url} download={resume.fileName}>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M5 15v5h14v-5" /></svg>
                    Unduh CV
                    <span className="about-download-format">PDF</span>
                  </a>
                </div>
              </motion.div>
            </div>
            <figure className="about-portrait" aria-hidden="true">
              <div className="about-portrait-anchor" ref={portraitTargetRef}>
                <div className="about-photo-fallback"><Portrait decorative /></div>
              </div>
            </figure>
            <div className="about-story" ref={aboutDetailsRef}>
              <motion.div className="about-panel-inner" style={detailsStyle}>
                <h3 className="about-lead">Membuat AI lebih mudah digunakan.</h3>
                <div className="about-bio">
                  {biography.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
