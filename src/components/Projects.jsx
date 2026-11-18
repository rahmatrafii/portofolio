import { useEffect, useRef, useState } from 'react';
import { projectCategories, projects } from '../data/projects.js';
import PaperPlane from './PaperPlane.jsx';
import ProjectCategoryIcon from './ProjectCategoryIcon.jsx';

const backPath = 'M24 40H180C190 40 194 36 200 29L216 10C222 3 229 1 240 1H376C389 1 399 11 399 24V296C399 309 389 319 376 319H24C11 319 1 309 1 296V64C1 51 11 40 24 40Z';
const frontPath = 'M24 88H140C151 88 157 92 165 101L178 115C184 122 191 125 202 125H376C389 125 399 135 399 148V296C399 309 389 319 376 319H24C11 319 1 309 1 296V112C1 99 11 88 24 88Z';
const frontClip = 'M.06 .275H.35C.3775 .275 .3925 .2875 .4125 .3156L.445 .3594C.46 .3813 .4775 .3906 .505 .3906H.94C.9725 .3906 .9975 .4219 .9975 .4625V.925C.9975 .9656 .9725 .9969 .94 .9969H.06C.0275 .9969 .0025 .9656 .0025 .925V.35C.0025 .3094 .0275 .275 .06 .275Z';

function FolderSurface({ slug, front = false }) {
  const id = `folder-${slug}-${front ? 'front' : 'back'}`;
  return (
    <svg className={front ? 'folder-front-surface' : 'folder-back'} viewBox="0 0 400 320" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2=".7" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor={front ? '#e3f0f8' : '#d9ebf8'} />
          <stop offset="1" stopColor={front ? '#adcbe1' : '#bed8ec'} />
        </linearGradient>
        {front && <clipPath id={`folder-clip-${slug}`} clipPathUnits="objectBoundingBox"><path d={frontClip} /></clipPath>}
      </defs>
      <path className="folder-outline" d={front ? frontPath : backPath} fill={`url(#${id})`} stroke="#8db2ce" strokeWidth="1" />
      <path d={front ? frontPath : backPath} fill="none" stroke="#ffffff" strokeOpacity=".7" strokeWidth="1" transform="translate(0 1)" />
    </svg>
  );
}

function ProjectFolder({ category, open, onToggle, active }) {
  const ref = useRef(null);
  const pointerBounds = useRef(null);
  const entries = projects.filter((project) => project.category === category.slug).slice(0, 4);

  useEffect(() => {
    if (!active) {
      pointerBounds.current = null;
      ref.current.style.removeProperty('--pointer-x');
      ref.current.style.removeProperty('--pointer-y');
    }
  }, [active]);

  function pointerEnter(event) {
    if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
    pointerBounds.current = event.currentTarget.getBoundingClientRect();
  }

  function pointerMove(event) {
    const box = pointerBounds.current;
    if (!box?.width || !box.height) return;
    const x = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1));
    ref.current.style.setProperty('--pointer-x', x.toFixed(3));
    ref.current.style.setProperty('--pointer-y', y.toFixed(3));
  }

  function pointerLeave() {
    pointerBounds.current = null;
    ref.current.style.removeProperty('--pointer-x');
    ref.current.style.removeProperty('--pointer-y');
  }

  return (
    <article className="project-folder" data-category={category.slug} data-open={open} ref={ref}
      onPointerEnter={pointerEnter} onPointerMove={pointerMove} onPointerLeave={pointerLeave}>
      <div className="folder-body">
        <div className="folder-shadow" aria-hidden="true" />
        <div className="folder-tilt">
          <FolderSurface slug={category.slug} />
          <div className="folder-previews" id={`previews-${category.slug}`} inert={!open} aria-hidden={!open}>
            {entries.map((project, index) => (
              <a className="folder-sheet" href={`/${category.slug}`} key={index} data-sheet-index={index}
                aria-label={`Lihat semua proyek ${category.label}, pratinjau ${index + 1}`}
                style={{ '--depth': 3 - index, '--slot': (index / 3 * 2 - 1), '--angle': `${index * 2 - 3}deg`, zIndex: index + 1 }}>
                <span className="folder-sheet-arrival"><span className="folder-sheet-inner">
                  <img src={project.image} alt="" width="960" height="540" loading="lazy" decoding="async" />
                </span></span>
              </a>
            ))}
          </div>
          <div className="folder-front-arrival">
            <div className="folder-front">
              <FolderSurface slug={category.slug} front />
              <button className="folder-toggle" type="button" onClick={onToggle}
                aria-expanded={open} aria-controls={`previews-${category.slug}`}
                aria-label={`${open ? 'Tutup' : 'Buka'} folder ${category.label}, ${entries.length} pratinjau`}
                style={{ clipPath: `url(#folder-clip-${category.slug})` }}>
                <span className="folder-emblem" aria-hidden="true"><ProjectCategoryIcon category={category.slug} /></span>
                <span className="folder-name">{category.label}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Projects({ active = true, restoredFolder } = {}) {
  const root = useRef(null);
  const [open, setOpen] = useState(() => restoredFolder ?? (typeof window === 'undefined' ? null : window.history?.state?.projectFolder ?? null));

  useEffect(() => {
    if (active && restoredFolder) setOpen(restoredFolder);
  }, [active, restoredFolder]);

  function changeOpen(next) {
    setOpen(next);
    window.history.replaceState({ ...window.history.state, projectFolder: next }, '');
  }

  useEffect(() => {
    if (!active) return;
    const section = root.current;
    const folders = [...section.querySelectorAll('.project-folder')];
    let attached = true;
    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (!attached || !entry.isIntersecting) return;
        entry.target.dataset.entered = 'true';
        observer.unobserve(entry.target);
      }), { threshold: .12 });
      folders.forEach((folder) => observer.observe(folder));
      section.dataset.enhanced = 'true';
    }
    function dismiss(event) {
      const current = section.querySelector('.project-folder[data-open="true"]');
      if (current && !current.contains(event.target)) {
        setOpen(null);
        window.history.replaceState({ ...window.history.state, projectFolder: null }, '');
      }
    }
    function keyboard(event) {
      if (event.key !== 'Escape') return;
      const current = section.querySelector('.project-folder[data-open="true"]');
      if (!current) return;
      if (current.contains(document.activeElement)) current.querySelector('.folder-toggle').focus({ preventScroll: true });
      setOpen(null);
      window.history.replaceState({ ...window.history.state, projectFolder: null }, '');
    }
    function revealFocus(event) {
      const folder = event.target.closest('.project-folder');
      if (folder) { folder.dataset.entered = 'true'; observer?.unobserve(folder); }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', keyboard);
    section.addEventListener('focusin', revealFocus);
    return () => {
      attached = false;
      observer?.disconnect();
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', keyboard);
      section.removeEventListener('focusin', revealFocus);
      delete section.dataset.enhanced;
    };
  }, [active]);

  return (
    <section className="projects" id="projects" aria-labelledby="projects-heading" tabIndex={-1} ref={root}>
      <div className="projects-content">
        <div className="projects-heading">
          <div><h2 id="projects-heading">My Projects</h2><p>Buka folder untuk melihat koleksi proyek.</p></div>
          <PaperPlane stageRef={root} active={active} />
        </div>
        <div className="projects-folders">
          {projectCategories.map((category) => <ProjectFolder key={category.slug} category={category}
            active={active} open={open === category.slug} onToggle={() => changeOpen(open === category.slug ? null : category.slug)} />)}
        </div>
      </div>
    </section>
  );
}
