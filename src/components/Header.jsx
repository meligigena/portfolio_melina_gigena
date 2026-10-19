import { certificates } from '../content/certificates';

export default function Header() {
  return <header className="site-header">
    <a className="wordmark" href="#inicio" aria-label="Melina Gigena, inicio">meli<span>.</span></a>
    <nav aria-label="Navegación principal">
      <a href="#sobre-mi">Sobre mí</a>
      <a href="#proyectos">Proyectos</a>
      {certificates.length > 0 && <a className="certificates-nav" href="#certificados">Certificados</a>}
      <a className="nav-contact" href="#contacto">Contactame <span aria-hidden="true">↗</span></a>
    </nav>
  </header>;
}
