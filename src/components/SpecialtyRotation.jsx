import { useRef } from 'react';
import useSpecialtyRotation from '../animations/useSpecialtyRotation';

const specialties = ['Desarrollo de software', 'Análisis de datos', 'Sistemas de Información'];

export default function SpecialtyRotation() {
  const root = useRef(null);
  useSpecialtyRotation(root);
  return <div className="intro-role" ref={root}>
    <span className="sr-only">Desarrollo de software, Análisis de datos y Sistemas de Información.</span>
    <span className="specialty-stack" aria-hidden="true">
      {specialties.map((specialty) => <span className="specialty-text" key={specialty}>{specialty}</span>)}
    </span>
  </div>;
}
