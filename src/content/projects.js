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
    description: 'Un portfolio interactivo con un panel de administración para gestionar su contenido.',
    contribution: 'Frontend responsive y gestión de contenido. Base de datos, autenticación, almacenamiento y políticas RLS con Supabase.',
    technologies: ['React', 'Vite', 'JavaScript', 'GSAP', 'Supabase', 'Vercel'],
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
