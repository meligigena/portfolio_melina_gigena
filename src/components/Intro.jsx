import { useRef } from 'react';
import portrait from '../assets/melina.webp';
import { profile } from '../content/profile';
import useIntroAnimation from '../animations/useIntroAnimation';
import Icon from './Icon';
import SpecialtyRotation from './SpecialtyRotation';

export default function Intro() {
  const root = useRef(null);
  useIntroAnimation(root);

  return <section className="intro page-width" id="inicio" aria-labelledby="intro-title" ref={root}>
    <div className="intro-copy">
      <p className="intro-greeting">Hola, soy Meli<span aria-hidden="true"> ✳</span></p>
      <h1 id="intro-title">Melina<br />Gigena<span className="name-dot">.</span></h1>
      <SpecialtyRotation />
      <p className="intro-description">{profile.introduction}</p>
      <div className="intro-actions">
        <a className="button button-dark" href="#proyectos">Ver proyectos <Icon name="down" /></a>
        <a className="text-link" href={profile.links.github} target="_blank" rel="noopener noreferrer">GitHub <Icon name="diagonal" /></a>
        <a className="text-link" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Icon name="diagonal" /></a>
      </div>
    </div>
    <div className="portrait-composition">
      <div className="portrait-orbit" aria-hidden="true" />
      <span className="portrait-spark" aria-hidden="true">✳</span>
      <figure className="portrait-frame">
        <img src={portrait} alt="Melina Gigena" width="800" height="1067" fetchPriority="high" />
        <figcaption><Icon name="pin" /> {profile.location}</figcaption>
      </figure>
      <div className="portrait-note"><Icon name="code" /><span>Curiosidad para aprender, <br />tecnología para crear.</span></div>
    </div>
    <dl className="academic-strip">
      <div><dt>Ingeniería en Sistemas</dt><dd>4.º año <span>· UTN Córdoba</span></dd></div>
      <div><dt>Promedio académico</dt><dd>9,0 <span>· Desde 2023</span></dd></div>
      <div><dt>Inglés</dt><dd>B2 <span>· Cambridge First Certificate</span></dd></div>
    </dl>
  </section>;
}
