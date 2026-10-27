import { useId, useRef, useState } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../animations/gsap';
import CaseStudyFigure from './CaseStudyFigure';
import Icon from './Icon';

export default function CaseStudySequence({ label, steps, numbered = true, className = '' }) {
  const root = useRef(null);
  const id = useId();
  const [selected, setSelected] = useState(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const panel = root.current.querySelector('[role="tabpanel"]:not([hidden])');
      gsap.timeline({ defaults: { ease: 'power2.out' } })
        .from(panel.querySelector('.cs-sequence-copy'), { y: 8, opacity: 0, duration: 0.3 })
        .from(root.current.querySelector('[aria-selected="true"] .cs-sequence-marker'), { scale: 0.88, duration: 0.3 }, 0);
    });
    ScrollTrigger.refresh();
    return () => media.revert();
  }, { scope: root, dependencies: [selected], revertOnUpdate: true });

  const onKeyDown = (event, index) => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % steps.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + steps.length) % steps.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = steps.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    root.current.querySelectorAll('[role="tab"]')[next].focus();
  };

  return <div ref={root} className={`cs-sequence ${className}`}>
    <div className="cs-sequence-tabs" role="tablist" aria-label={label}>
      {steps.map((step, index) => <button key={step.id} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)} onKeyDown={(event) => onKeyDown(event, index)}>
        <span className="cs-sequence-marker" aria-hidden="true">{numbered ? index + 1 : <Icon name={step.icon} />}</span><span>{step.label}</span><Icon name="arrow" />
      </button>)}
    </div>
    {steps.map((step, index) => <div key={step.id} className="cs-sequence-panel" id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`} hidden={selected !== index} tabIndex="0">
      <div className="cs-sequence-copy"><div><span className="cs-tool-label"><Icon name={step.icon} /> {step.tool}</span><h3>{step.title}</h3></div><p>{step.description}</p></div>
      <CaseStudyFigure capture={step.capture} className={step.compact ? 'cs-menu-capture' : ''} />
      {step.note && <p className="cs-sequence-note">{step.note}</p>}
    </div>)}
  </div>;
}
