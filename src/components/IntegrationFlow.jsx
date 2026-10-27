import { useRef, useState } from 'react';
import { gsap, useGSAP } from '../animations/gsap';
import { integrationSteps } from '../content/invitationCaseStudy';
import Icon from './Icon';

export default function IntegrationFlow() {
  const root = useRef(null);
  const playback = useRef(null);
  const [selected, setSelected] = useState(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const nodes = root.current.querySelectorAll('.cs-flow-step');
      const timeline = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
      });
      nodes.forEach((node, index) => {
        timeline.from(node.querySelector('.cs-flow-icon'), { scale: 0.65, opacity: 0, duration: 0.4 }, index * 0.5);
        const line = node.querySelector('.cs-flow-line');
        const packet = node.querySelector('.cs-flow-packet');
        if (line) {
          timeline.from(line, { scaleX: 0, transformOrigin: '0px 6px', duration: 0.35 }, index * 0.5 + 0.2)
            .fromTo(packet, { opacity: 0, attr: { cx: 2 } }, { opacity: 1, attr: { cx: 29 }, duration: 0.35, ease: 'none' }, index * 0.5 + 0.2)
            .to(packet, { opacity: 0, duration: 0.1 }, index * 0.5 + 0.55);
        }
      });
      playback.current = timeline;
      return () => { playback.current = null; };
    });
    return () => media.revert();
  }, { scope: root });

  return <div className="cs-flow" ref={root}>
    <div className="cs-flow-topline"><p>Del formulario al evento</p><button type="button" className="text-link cs-flow-replay" onClick={() => playback.current?.restart()}><Icon name="branch" /> Repetir recorrido</button></div>
    <div role="group" aria-label="Explorar el flujo de integración">
      <ol className="cs-flow-steps">
        {integrationSteps.map((step, index) => <li className="cs-flow-step" key={step.id}>
          <button type="button" className={`cs-flow-node ${selected === index ? 'is-selected' : ''}`} aria-pressed={selected === index} aria-controls="flow-description" onClick={() => setSelected(index)}>
            <span className="cs-flow-icon"><Icon name={step.icon} /></span>
            <span className="cs-flow-action">{step.action}</span><strong>{step.tool}</strong>
          </button>
          {index < integrationSteps.length - 1 && <span className="cs-flow-connector" aria-hidden="true">
            <svg viewBox="0 0 32 12" fill="none">
              <g className="cs-flow-line" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0 6H31" /><path className="cs-flow-arrow" d="m27 2 4 4-4 4" />
              </g>
              <circle className="cs-flow-packet" cx="2" cy="6" r="2.5" fill="black" />
            </svg>
          </span>}
        </li>)}
      </ol>
    </div>
    <div className="cs-flow-description" id="flow-description" role="status" aria-live="polite" aria-atomic="true"><Icon name={integrationSteps[selected].icon} /><p><strong>{integrationSteps[selected].tool}</strong>{integrationSteps[selected].detail}</p></div>
    <p className="cs-flow-footnote">El registro se automatiza. La selección de los mensajes y la generación se inician desde la planilla.</p>
  </div>;
}
