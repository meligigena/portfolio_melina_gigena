import { lazy, Suspense } from 'react';
import Header from './components/Header';
import Intro from './components/Intro';
import ProfileDetails from './components/ProfileDetails';
import ProjectGallery from './components/ProjectGallery';
import Certificates from './components/Certificates';
import Contact from './components/Contact';

const InvitationCaseStudy = lazy(() => import('./pages/InvitationCaseStudy'));

export default function App() {
  if (window.location.pathname.replace(/\/$/, '') === '/proyectos/invitacion-xv') {
    return <Suspense fallback={<p className="page-width" role="status">Cargando proyecto…</p>}><InvitationCaseStudy /></Suspense>;
  }
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header /><main id="contenido"><Intro /><ProfileDetails /><ProjectGallery /><Certificates /><Contact /></main></>;
}
