import { certificates } from '../content/certificates';

export default function Header({ anchorBase = '' }) {
  return <header className="site-header">
    <a className="wordmark" href={`${anchorBase}#inicio`} aria-label="Melina Gigena, inicio">meli<span>.</span></a>
    <nav aria-label="Navegación principal">
      <a href={`${anchorBase}#sobre-mi`}>Sobre mí</a>
      <a href={`${anchorBase}#proyectos`}>Proyectos</a>
      {certificates.length > 0 && <a className="certificates-nav" href={`${anchorBase}#certificados`}>Certificados</a>}
      <a className="nav-contact" href={`${anchorBase}#contacto`}>Contactame <span aria-hidden="true">↗</span></a>
    </nav>
  </header>;
}
