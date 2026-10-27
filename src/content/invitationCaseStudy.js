import cover from '../assets/projects/invitation/invitation-desktop-envelope.jpg';
import desktop from '../assets/projects/invitation/invitation-desktop-envelope@2x.png';
import mobile from '../assets/projects/invitation/invitation-mobile-envelope@2x.png';
import calendar from '../assets/projects/invitation/invitation-mobile-date@2x.png';
import music from '../assets/projects/invitation/invitation-music@2x.png';
import form from '../assets/projects/invitation/invitation-form@2x.png';
import confirmations from '../assets/projects/invitation/01_confirmaciones.png';
import statistics from '../assets/projects/invitation/02_estadisticas.png';
import selection from '../assets/projects/invitation/03_seleccion_mensajes.png';
import guestMenu from '../assets/projects/invitation/menu2.png';
import generation from '../assets/projects/invitation/menu1.png';
import slides from '../assets/projects/invitation/05_presentacion_slides.png';

export const invitation = {
  title: 'Invitación digital interactiva — XV Mía Jazmín',
  description: 'Una experiencia web personalizada que combina animaciones, confirmación de asistencia y automatización de datos con Google Workspace.',
  demoURL: 'https://invitacion-15s-mia-jazmin.vercel.app/demo',
  detailPath: '/proyectos/invitacion-xv',
  technologies: ['HTML', 'CSS', 'JavaScript', 'Vercel', 'Google Apps Script', 'Google Sheets', 'Google Slides'],
  cover,
};

export const demoCaptures = {
  desktop: { src: desktop, width: 2880, height: 1800, pixelRatio: 2, title: 'Apertura de la invitación', alt: 'Captura real de la demo: sobre plateado sobre fondo negro, nombre Mía Jazmín y esferas de disco.', caption: 'El recorrido empieza con un sobre que se abre al tocarlo.' },
  mobile: { src: mobile, width: 780, height: 1688, pixelRatio: 2, title: 'Invitación en mobile', alt: 'La apertura de la invitación adaptada a una pantalla de teléfono.', caption: 'La misma identidad visual, adaptada a una pantalla táctil.' },
  calendar: { src: calendar, width: 752, height: 1644, pixelRatio: 2, title: 'Calendario de la demo', alt: 'Calendario plateado de la demo con el día del evento destacado.', caption: 'Fecha, calendario y detalles del evento dentro del recorrido vertical.' },
  music: { src: music, width: 2850, height: 1182, pixelRatio: 2, title: 'Reproductor de música', alt: 'Reproductor de la demo con forma de disco de vinilo plateado y un botón de reproducción.', caption: 'La música se inicia con una acción del invitado.' },
  form: { src: form, width: 1240, height: 1738, pixelRatio: 2, title: 'Formulario de asistencia', alt: 'Formulario vacío de la demo: cantidad de personas, nombre, apellido, edad, alimentación, canción y mensaje.', caption: 'Captura real del formulario de la demo, sin datos personales cargados.' },
};

// Approved fictional demonstration data. Preserve the supplied PNGs unchanged.
export const workspaceCaptures = {
  confirmations: {
    src: confirmations, width: 1484, height: 555,
    title: 'Registro de confirmaciones',
    alt: 'Google Sheets con invitados organizados por grupo, nombre, estado de pago, tipo de invitación, alimentación, canción y mensaje. Registros ficticios de demostración.',
    caption: 'Registro de confirmaciones enviado desde la web: cada invitado conserva su grupo y sus preferencias. Datos ficticios.',
  },
  statistics: {
    src: statistics, width: 1461, height: 438,
    title: 'Panel de estadísticas',
    alt: 'Panel de Google Sheets con totales de confirmaciones y asistentes, pagos, tipos de invitación y requerimientos alimentarios de la demostración.',
    caption: 'Indicadores y distribuciones para consultar la organización del evento. Las cifras corresponden a la demostración.',
  },
  selection: {
    src: selection, width: 1176, height: 397,
    title: 'Selección de mensajes',
    alt: 'Google Sheets con casillas para incluir mensajes en la presentación, remitentes ficticios, grupos y fechas de registro.',
    caption: 'Las casillas de “Incluir en presentación” permiten elegir qué mensajes se utilizarán. Datos ficticios.',
  },
  generation: {
    src: generation, width: 1163, height: 102, focusX: 1,
    title: 'Generación de presentaciones',
    alt: 'Google Sheets con el menú Mensajes para Mía abierto y la opción Generar presentación de mensajes. Captura del menú, sin la tabla de mensajes.',
    caption: 'Mensajes para Mía → Generar presentación de mensajes. Una acción del menú inicia el proceso.',
  },
  guests: {
    src: guestMenu, width: 982, height: 167, focusX: 1,
    title: 'Administración de invitados',
    alt: 'Menú personalizado Administración de invitados de Google Sheets: Dar de baja a la persona seleccionada, Recuperar a la persona seleccionada y Restablecer orden por grupo.',
    caption: 'Herramientas desarrolladas con Google Apps Script e integradas al menú de Google Sheets.',
  },
  slides: {
    src: slides, width: 1077, height: 534, focusX: 0.6,
    title: 'Resultado en Google Slides',
    alt: 'Presentación generada en Google Slides con un mensaje ficticio y su remitente, sobre fondo negro con estrellas y una esfera de disco.',
    caption: 'Resultado de la automatización: una diapositiva personalizada para proyectar durante el evento. Mensaje y remitente ficticios.',
  },
};

export const messageSteps = [
  { id: 'select', label: 'Seleccionar', icon: 'database', tool: 'Google Sheets', title: 'Elegir qué incluir', description: 'Las casillas de la planilla definen qué mensajes formarán parte de la presentación.', capture: workspaceCaptures.selection },
  { id: 'generate', label: 'Generar', icon: 'branch', tool: 'Google Apps Script', title: 'Del menú a la automatización', description: 'En “Mensajes para Mía” se elige “Generar presentación de mensajes”. Apps Script toma la selección y construye las diapositivas.', capture: workspaceCaptures.generation, compact: true },
  { id: 'present', label: 'Presentar', icon: 'chart', tool: 'Google Slides', title: 'El resultado, listo para proyectar', description: 'Los mensajes seleccionados se convierten en diapositivas personalizadas con el estilo visual de la invitación.', capture: workspaceCaptures.slides },
];

export const guestActions = [
  { id: 'deactivate', label: 'Dar de baja', icon: 'down', tool: 'Administración de invitados', title: 'Gestionar una baja', description: 'La acción “Dar de baja a la persona seleccionada” permite gestionar su baja desde la planilla.', capture: workspaceCaptures.guests, compact: true },
  { id: 'recover', label: 'Recuperar invitado', icon: 'up', tool: 'Administración de invitados', title: 'Recuperar a una persona', description: 'La acción “Recuperar a la persona seleccionada” permite recuperar a alguien previamente dado de baja.', capture: workspaceCaptures.guests, compact: true },
];

export const integrationSteps = [
  { id: 'web', tool: 'Invitación web', action: 'Completar', icon: 'code', detail: 'El invitado completa la asistencia de su grupo y puede sumar una canción y un mensaje personalizado.' },
  { id: 'script', tool: 'Google Apps Script', action: 'Registrar', icon: 'branch', detail: 'Recibe los datos enviados desde la web y los registra en Google Sheets. También ejecuta la generación de la presentación.' },
  { id: 'sheets', tool: 'Google Sheets', action: 'Organizar', icon: 'database', detail: 'Centraliza invitados y grupos, tipos de invitación, estados de pago y preferencias para facilitar la administración.' },
  { id: 'selection', tool: 'Selección de mensajes', action: 'Elegir', icon: 'layers', detail: 'Desde las casillas de la planilla se eligen los mensajes que se quieren incluir y se ejecuta la acción del menú.' },
  { id: 'slides', tool: 'Google Slides', action: 'Presentar', icon: 'chart', detail: 'La automatización genera diapositivas personalizadas con los mensajes seleccionados, listas para proyectar durante el evento.' },
];

export const formFeatures = [
  { icon: 'layers', title: 'Una confirmación, varias personas', text: 'La cantidad elegida agrega los campos de cada invitado.' },
  { icon: 'code', title: 'El valor depende de la edad', text: 'El formulario calcula el total a partir de las edades ingresadas.' },
  { icon: 'database', title: 'Preferencias por invitado', text: 'Cada persona puede indicar sus requerimientos alimentarios.' },
  { icon: 'mail', title: 'Algo más que asistencia', text: 'Una canción para la pista y un mensaje para la protagonista.' },
];
