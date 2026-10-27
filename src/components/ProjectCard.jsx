import Icon from './Icon';

export default function ProjectCard({ project, index }) {
  return <article className="project-card" data-project={project.id} aria-labelledby={`project-${project.id}`}>
    <div className={`project-cover ${project.coverClass || (project.cover ? 'sol-cover' : 'invitation-cover')}`}>
      {project.cover ? <img src={project.cover} alt={project.coverAlt} width={project.coverWidth || 1440} height={project.coverHeight || 479} loading="lazy" /> : <div className="invitation-concept"><span>Invitación de 15s</span><span className="invitation-flourish" aria-hidden="true"><Icon name="spark" /></span></div>}
      <span className="cover-label">{project.coverLabel || (project.cover ? 'solfanara.com' : 'Concepto visual')}</span>
    </div>
    <div className="project-body">
      <div className="project-meta"><span>{project.category}</span><span className={`project-status ${project.url ? 'is-published' : ''}`}>{project.status}</span></div>
      <h3 id={`project-${project.id}`}>{project.title}</h3>
      <p className="project-description">{project.description}</p>
      {project.contribution && <p className="project-contribution"><strong>Mi aporte</strong> {project.contribution}</p>}
      {project.technologies.length > 0 && <ul className="project-technologies" aria-label="Tecnologías">{project.technologies.map((tech) => <li key={tech}>{tech}</li>)}</ul>}
      {project.note && <p className="project-note">{project.note}</p>}
      <div className="project-bottom">
        <div className="project-actions">{project.url ? <a className="project-link" href={project.url} target="_blank" rel="noopener noreferrer">{project.linkLabel || 'Ver proyecto'} <Icon name="diagonal" /></a> : <p className="coming-soon">Próximamente <Icon name="spark" /></p>}{project.detailURL && <a className="project-link project-detail-link" href={project.detailURL} target="_blank" rel="noopener noreferrer">Ver detalles <Icon name="diagonal" /></a>}</div>
        <span className="project-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
      </div>
    </div>
  </article>;
}
