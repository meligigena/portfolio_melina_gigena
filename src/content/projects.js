import solCover from '../assets/sol-fanara.webp';

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
    title: 'Invitación digital de 15 años',
    category: 'Invitación digital',
    status: 'Próximamente',
    description: 'Una invitación web interactiva para una celebración de 15 años.',
    note: 'Un nuevo proyecto está tomando forma.',
    technologies: [],
  },
];
