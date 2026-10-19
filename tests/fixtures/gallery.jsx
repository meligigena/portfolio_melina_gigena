import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from '../../src/components/Header';
import ProjectGallery from '../../src/components/ProjectGallery';
import Certificates from '../../src/components/Certificates';
import { projects } from '../../src/content/projects';
import '../../src/styles/tokens.css';
import '../../src/styles/global.css';
import '../../src/styles/portfolio.css';

const count = Number(new URLSearchParams(window.location.search).get('count') ?? 2);
const items = Array.from({ length: count }, (_, index) => ({
  ...projects[index % projects.length],
  id: 'fixture-' + index,
}));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><Header /><main><ProjectGallery items={items} /><Certificates /></main></React.StrictMode>,
);
