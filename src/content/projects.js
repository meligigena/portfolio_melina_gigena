import solCover from '../assets/sol-fanara.webp';
import { invitation } from './invitationCaseStudy';

export const projectCategories = [
  { id: 'all', label: 'Todos' },
  { id: 'software', label: 'Desarrollo de software' },
  { id: 'data', label: 'Análisis de datos' },
];

export const projects = [
  {
    id: 'sol-fanara',
    categories: ['software'],
    title: 'Portfolio de Sol Fanara',
    category: 'Desarrollo web',
    status: 'Publicado',
    description: 'Un portfolio web interactivo para presentar trabajos de diseño gráfico.',
    contribution: 'Frontend responsive y panel de administración con Supabase Database, Auth y Storage, operaciones CRUD y políticas RLS. Despliegue en Vercel.',
    technologies: ['React', 'Vite', 'JavaScript', 'GSAP/ScrollTrigger', 'Supabase', 'Vercel'],
    url: 'https://solfanara.com',
    cover: solCover,
    coverAlt: 'Captura real del inicio de Sol Fanara: título Portfolio sobre fondo blanco.',
  },
  {
    id: 'invitacion',
    categories: ['software'],
    title: invitation.title,
    category: 'Invitación digital',
    status: 'Demo disponible',
    description: invitation.description,
    technologies: invitation.technologies,
    url: invitation.demoURL,
    linkLabel: 'Ver demo',
    detailURL: invitation.detailPath,
    cover: invitation.cover,
    coverAlt: 'Captura real de la demo de XV Mía Jazmín: sobre plateado y esferas de disco sobre fondo negro.',
    coverLabel: 'Demo interactiva',
    coverClass: 'invitation-demo-cover',
    coverWidth: 1440,
    coverHeight: 900,
  },
];
