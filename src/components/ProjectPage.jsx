import { useCallback, useEffect, useState } from 'react';
import { projects } from '../data/projects.js';
import ProjectTechnologies from './ProjectTechnologies.jsx';
import ProjectModal from './ProjectModal.jsx';

export default function ProjectPage({ route, active = true }) {
  const [selection, setSelection] = useState(null);
  const closeProject = useCallback(() => setSelection(null), []);
  const { category, project } = route;
  const found = route.type !== 'not-found';
  const title = !found ? 'Halaman tidak ditemukan' : project?.title ?? category.label;
  const collection = category ? projects.filter((item) => item.category === category.slug) : [];
  const backToCollection = Boolean(project || (!found && category));
  const backHref = backToCollection ? `/${category.slug}` : '/#projects';
  const backLabel = backToCollection ? `Kembali ke koleksi ${category.label}` : 'Kembali ke portofolio';

  useEffect(() => { setSelection(null); }, [category?.slug, project?.slug, active]);

  function openProject(item, event) {
    if (!active) return;
    const trigger = event.currentTarget;
    setSelection({ project: item, trigger, source: trigger.closest('.project-card').querySelector('img[data-project-index]') });
  }

  useEffect(() => {
    if (!active) return;
    const previous = document.title;
    document.title = `${title} | Rafi`;
    return () => { document.title = previous; };
  }, [active, title]);

  return (
    <div className="collection-scene">
      <div className="collection-sky" aria-hidden="true">
        <img className="collection-cloud" src="/images/cloud-bank-1000.webp"
          width="1000" height="333" alt="" decoding="async" />
      </div>
      <a className="skip-link" href="#project-content">Lewati ke konten</a>
      <header className="collection-header">
        <a className="collection-home" href={backHref} aria-label={backLabel} title={backLabel}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
            <path d="M20 12H4m7-7-7 7 7 7" />
          </svg>
        </a>
      </header>
      <main className="project-page" id="project-content" tabIndex={-1}>
        <div className={`collection-heading${route.type === 'category' ? ' collection-heading-category' : ''}`}>
          <h1 tabIndex={-1}>{title}</h1>
          {found && <div className="collection-heading-copy">
            {route.type === 'category' && <svg className="collection-heading-arrow" viewBox="0 0 64 64" width="48" height="48"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
              <path d="m12 12 40 40M24 52h28V24" />
            </svg>}
            <p className="collection-intro">{project ? project.summary : category.description}</p>
          </div>}
        </div>
        {!found ? <p>Halaman ini belum tersedia. <a href={category ? `/${category.slug}` : '/#projects'}>Kembali ke koleksi proyek</a>.</p>
          : <>
            {project ? <article className="project-detail">
              <img className="project-detail-image" src={project.image} width="960" height="540" alt={`Tampilan ${project.title}`}
                style={{ viewTransitionName: `project-${category.slug}-${project.slug}` }} />
              <h2>Tentang proyek</h2><p>Detail proyek akan ditambahkan di sini.</p>
              {project.technologies?.length > 0 && <section className="project-detail-technologies">
                <h2>Teknologi</h2>
                <ProjectTechnologies technologies={project.technologies} />
              </section>}
            </article> : <div className="project-grid">
              {collection.map((item, index) => (
                <article className="project-card" key={item.slug}>
                  <img src={item.image} alt="" data-project-index={index} width="960" height="540"
                    style={{ viewTransitionName: `project-${category.slug}-${item.slug}` }}
                    loading={index === 0 ? 'eager' : 'lazy'} fetchPriority={index === 0 ? 'high' : undefined} decoding="async" />
                  <button className="project-card-preview" type="button" aria-haspopup="dialog"
                    onClick={(event) => openProject(item, event)} aria-label={`Lihat detail ${item.title}`} />
                  <div className="project-card-copy">
                    <h2>{item.title}</h2>
                    {!item.temporary && item.summary && <p>{item.summary}</p>}
                    <div className="project-card-footer">
                      {item.technologies?.length > 0 && <div className="project-card-technologies">
                        <ProjectTechnologies technologies={item.technologies} compact />
                      </div>}
                      <button className="project-card-action" type="button" aria-haspopup="dialog"
                        onClick={(event) => openProject(item, event)} aria-label={`Lihat proyek ${item.title}`}>Lihat proyek
                        <svg className="project-card-arrow" viewBox="0 0 24 24" width="32" height="32" fill="none"
                          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                          <path d="M5 12h14m-6-6 6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>}
          </>}
      </main>
      {selection && active && <ProjectModal selection={selection} onClose={closeProject} />}
    </div>
  );
}
