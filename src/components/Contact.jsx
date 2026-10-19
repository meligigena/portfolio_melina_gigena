import { profile } from '../content/profile';
import Icon from './Icon';
import { useRef } from 'react';
import useContactAnimation from '../animations/useContactAnimation';

export default function Contact() {
  const root = useRef(null);
  useContactAnimation(root);
  return <section className="contact" id="contacto" aria-labelledby="contact-title" ref={root}>
    <div className="contact-content page-width">
      <p className="section-kicker">El próximo paso puede empezar acá</p>
      <div className="contact-heading"><h2 id="contact-title">¿Creamos<br />algo juntos?</h2><Icon name="spark" className="contact-spark" /></div>
      <a className="contact-email" href={profile.links.email} target="_blank" rel="noopener noreferrer" aria-label="Escribir a melinag1510@gmail.com en Gmail (nueva pestaña)">melinag1510@gmail.com <Icon name="diagonal" /></a>
      <div className="contact-bottom">
        <p><Icon name="pin" />{profile.location}</p>
        <div><a href={profile.links.github} target="_blank" rel="noopener noreferrer"><Icon name="github" /> GitHub</a><a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer"><Icon name="linkedin" /> LinkedIn</a></div>
      </div>
    </div>
    <footer className="site-footer page-width"><p>Hecho por Melina Gigena <span>· {new Date().getFullYear()}</span></p><a href="#inicio">Volver al inicio <Icon name="up" /></a></footer>
  </section>;
}
