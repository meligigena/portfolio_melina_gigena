import { useMemo, useRef, useState } from 'react';
import { projects, projectCategories } from '../content/projects';
import { ScrollTrigger, useGSAP, gsap } from '../animations/gsap';
import useProjectGallery from '../animations/useProjectGallery';
import ProjectCard from './ProjectCard';
import Icon from './Icon';

export default function ProjectGallery({ items = projects }) {
  const root = useRef(null);
  const controls = useRef(null);
  const pendingPosition = useRef(null);
  const [active, setActive] = useState(0);
  const [category, setCategory] = useState('all');
  const visible = useMemo(() => category === 'all' ? items : items.filter((project) => project.categories.includes(category)), [items, category]);
  useProjectGallery(root, controls, setActive, visible);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
      }).from('.gallery-heading > div:first-child', { y: 24, opacity: 0, duration: 0.65 })
        .from('.project-filters', { opacity: 0.4, duration: 0.5 }, '<0.1');
    });
    return () => media.revert();
  }, { scope: root });

  useGSAP(() => {
    if (pendingPosition.current === null) return;
    const previousTop = pendingPosition.current;
    pendingPosition.current = null;
    ScrollTrigger.refresh();
    controls.current?.select(0, 'instant');
    window.scrollBy({ top: root.current.querySelector('.project-filters').getBoundingClientRect().top - previousTop, behavior: 'instant' });
  }, { scope: root, dependencies: [category] });

  const filter = (next) => {
    if (next === category) return;
    pendingPosition.current = root.current.querySelector('.project-filters').getBoundingClientRect().top;
    setActive(0);
    setCategory(next);
  };
  const select = (index) => controls.current?.select(index);
  const count = visible.length;

  return <section className="gallery" id="proyectos" ref={root} aria-labelledby="projects-title" aria-roledescription="galería de proyectos">
    <div className="gallery-heading page-width">
      <div><p className="section-kicker">Proyectos seleccionados</p><h2 id="projects-title">De la idea a la web<span>.</span></h2></div>
      <div className="project-filters" role="group" aria-label="Filtrar proyectos">
        {projectCategories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} aria-controls="project-results" onClick={() => filter(item.id)}>{item.label}</button>)}
      </div>
    </div>
    <div id="project-results">
      <p className="sr-only" role="status">{count === 0 ? 'Sin proyectos en esta categoría.' : count + (count === 1 ? ' proyecto disponible.' : ' proyectos disponibles.')}</p>
      {count > 0 ? <div className="projects-viewport" data-testid="projects-viewport" tabIndex={count > 1 ? 0 : undefined} aria-label="Proyectos. Usá los controles o las flechas del teclado para recorrerlos.">
        <ol className="projects-track" aria-label="Proyectos principales" data-testid="projects-track">
          {visible.map((project, index) => <li className="project-slot" key={project.id} data-index={index}><ProjectCard project={project} index={index} /></li>)}
        </ol>
      </div> : <div className="project-empty page-width"><Icon name="chart" /><p>Próximamente, proyectos de análisis de datos.</p></div>}
    </div>
    <div className="gallery-controls page-width">
      {count > 1 && <><p className="gallery-hint"><Icon name="down" /><span className="desktop-hint">Bajá para recorrer</span><span className="touch-hint">Deslizá para explorar</span></p>
        <div className="project-selector" role="group" aria-label="Elegir proyecto">
          <button type="button" className="round-control previous-control" aria-label="Proyecto anterior" disabled={active === 0} onClick={() => select(active - 1)}><Icon name="arrow" /></button>
          <span className="project-counter" aria-live="polite" aria-atomic="true">{active + 1} <span>de {count}</span></span>
          <button type="button" className="round-control" aria-label="Proyecto siguiente" disabled={active === count - 1} onClick={() => select(active + 1)}><Icon name="arrow" /></button>
        </div></>}
      <a className="gallery-skip" href="#certificados">Seguir a certificados <Icon name="down" /></a>
    </div>
  </section>;
}
