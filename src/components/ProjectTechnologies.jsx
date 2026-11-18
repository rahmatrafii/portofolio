export default function ProjectTechnologies({ technologies, compact = false }) {
  if (!technologies?.length) return null;
  const visible = compact ? technologies.slice(0, 4) : technologies;
  const remaining = technologies.length - visible.length;

  return (
    <div className={`project-technologies${compact ? ' project-technologies-compact' : ''}`}>
      <ul className="project-tech-list" role="list" aria-label="Teknologi proyek">
        {visible.map((technology) => <li className="project-tech-tag" key={technology.name} title={compact ? technology.name : undefined}>
          <span className="project-tech-mark"><img src={technology.icon} width="24" height="24" alt="" decoding="async" /></span>
          <span className={compact ? 'sr-only' : undefined}>{technology.name}</span>
        </li>)}
        {remaining > 0 && <li className="project-tech-more" title={technologies.slice(4).map((technology) => technology.name).join(', ')}>
          <span aria-hidden="true">+{remaining}</span>
          <span className="sr-only">{remaining} teknologi lainnya: {technologies.slice(4).map((technology) => technology.name).join(', ')}</span>
        </li>}
      </ul>
    </div>
  );
}
