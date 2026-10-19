import { experience, skillAreas } from '../content/profile';
import Icon from './Icon';
import { useRef } from 'react';
import useProfileReveal from '../animations/useProfileReveal';

export default function ProfileDetails() {
  const root = useRef(null);
  useProfileReveal(root);
  return <section className="profile page-width" id="sobre-mi" aria-labelledby="profile-title" ref={root}>
    <div className="profile-intro">
      <p className="section-kicker">Software y datos</p>
      <h2 id="profile-title">Un poco sobre mí</h2>
      <p className="profile-description">Me interesan el desarrollo de software y el análisis de datos. Combino programación, bases de datos y visualización de información para resolver problemas con criterio.</p>
      <ul className="strengths" aria-label="Fortalezas">
        <li>Pensamiento analítico</li><li>Resolución de problemas</li><li>Organización</li><li>Trabajo en equipo</li>
      </ul>
      <div className="current-study"><Icon name="chart" /><div><strong>Sigo aprendiendo</strong><p>Power BI Desktop · Udemy <span className="small-tag">En curso</span></p></div></div>
    </div>
    <div className="skills" aria-label="Áreas de habilidades">
      {skillAreas.map((area) => <details className="skill-area" key={area.title}>
        <summary><Icon name={area.icon} /><span><strong>{area.title}</strong><span className="skill-preview">{area.preview}</span></span><span className="details-toggle" aria-hidden="true" /></summary>
        <ul className="skill-tags">{area.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
      </details>)}
    </div>
    <div className="experience">
      <div className="experience-heading"><h3>Experiencia que también suma.</h3><p>Organización, información y coordinación, antes y más allá del código.</p></div>
      {experience.map((item) => <article className="experience-item" key={item.company}>
        <p className="experience-period">{item.period}</p><h4>{item.company}</h4><p className="experience-role">{item.role}</p><p>{item.description}</p>
      </article>)}
    </div>
  </section>;
}
