import Header from './components/Header';
import Intro from './components/Intro';
import ProfileDetails from './components/ProfileDetails';
import ProjectGallery from './components/ProjectGallery';
import Certificates from './components/Certificates';
import Contact from './components/Contact';

export default function App() {
  return <><a className="skip-link" href="#contenido">Saltar al contenido</a><Header /><main id="contenido"><Intro /><ProfileDetails /><ProjectGallery /><Certificates /><Contact /></main></>;
}
