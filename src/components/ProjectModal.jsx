import { useEffect, useRef } from 'react';
import { attachProjectModal } from '../lib/projectModal.js';
import ProjectTechnologies from './ProjectTechnologies.jsx';

export default function ProjectModal({ selection, onClose }) {
  const root = useRef(null);
  const { project, source, trigger } = selection;

  useEffect(() => {
    const dialog = root.current;
    return attachProjectModal({ dialog, source, trigger, onClose,
      panel: dialog.querySelector('.project-modal-panel'), image: dialog.querySelector('.project-modal-image'),
      flight: dialog.querySelector('.project-modal-flight'), ripple: dialog.querySelector('.project-modal-ripple'),
      glint: dialog.querySelector('.project-modal-glint'), details: dialog.querySelector('.project-modal-details'),
      backdrop: dialog.querySelector('.project-modal-backdrop') });
  }, [project, source, trigger, onClose]);

  return (
    <dialog className="project-modal" aria-labelledby="project-modal-title" ref={root}>
      <div className="project-modal-backdrop" aria-hidden="true" />
      <div className="project-modal-ripple" aria-hidden="true" />
      <article className="project-modal-panel">
        <header className="project-modal-header">
          <h2 id="project-modal-title">{project.title}</h2>
          <button className="project-modal-close" type="button" data-modal-close aria-label="Tutup pratinjau proyek">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>
        </header>
        <div className="project-modal-content">
          <img className="project-modal-image" src={project.image} width="960" height="540" alt={`Tampilan ${project.title}`} decoding="async" />
          <div className="project-modal-details">
            <section><h3>Tentang proyek</h3><p>Detail proyek akan ditambahkan di sini.</p></section>
            {project.technologies?.length > 0 && <section><h3>Teknologi</h3><ProjectTechnologies technologies={project.technologies} /></section>}
          </div>
        </div>
      </article>
      <div className="project-modal-flight" aria-hidden="true" hidden>
        <img src={project.image} width="960" height="540" alt="" />
        <span className="project-modal-glint" />
      </div>
    </dialog>
  );
}
