# Portfolio de Melina Gigena

Portfolio personal en español, con recorrido principal y un caso de estudio independiente. React 19.3.1, Vite 8.3.4, JavaScript, CSS y GSAP 3.15.0 con ScrollTrigger y `@gsap/react` 2.1.2.

## Iniciar en local

Requiere Node 24.x. El entorno utilizado fue Node 24.18.0 y npm 12.0.1. Las versiones de dependencias están fijadas en `package.json` y `package-lock.json`.

```sh
npm ci
npm run dev
```

Abrir http://127.0.0.1:5173. No requiere variables de entorno ni servicios externos.

## Verificar

Para preparar Chromium la primera vez:

```sh
npx playwright install chromium
```

Para verificar la aplicación:

```sh
npm run build
npm run lint
node --test --test-isolation=none tests/unit/projectGalleryGeometry.test.js
npm run test:e2e
```

Los E2E públicos usan el build de producción: ejecutar `build` antes de `test:e2e`. Playwright inicia `vite preview` en 4173 y un servidor de desarrollo en 4174 para `tests/fixtures`. Los montajes aislados prueban cero, uno y cuatro proyectos bajo StrictMode y no forman parte del build público. Se cubren 1440 × 900, 768 × 1024 y 390 × 844, además de 1366 × 720, 1024 × 768 y 320 × 740; teclado, swipe, filtros, enlaces, certificados, movimiento reducido y cambios de viewport. Los casos exclusivos de desktop se omiten en tablet y mobile. Las capturas quedan en `output/playwright/updated-*.png`.

El build comprueba los hashes de los PDF: solo publica los certificados originales autorizados y rechaza cualquier CV. `assets/cvs` y `.agents` también están bloqueados en el servidor de desarrollo.

## Contenido y estructura

- `src/content/profile.js`: presentación, habilidades, experiencia y enlaces.
- `src/content/projects.js`: proyectos. Hay exactamente dos: Sol Fanara e invitación digital.
- `src/content/certificates.js`: certificados locales, títulos, emisores, fechas y vistas previas.
- `src/components`: contenido semántico e interfaz.
- `src/animations`: integración con `useGSAP`, entrada coordinada y galería con ScrollTrigger.
- `src/styles/tokens.css`: paleta rosa, blanco y negro; fuentes y variables visuales.
- `src/styles/portfolio.css`: composición y adaptaciones responsive.
- `src/assets`: imágenes WebP optimizadas y miniaturas de los PDF.
- `public/fonts`: Syne, Instrument Sans, Pinyon Script y Manrope, servidas localmente con sus licencias OFL.
- `tests/e2e`: pruebas de interacción con Playwright Test.
- `tests/unit`: geometría verificada con el runner de Node, sin paquetes adicionales.

Para agregar un proyecto, incorporar un objeto a `projects.js` e indicar sus categorías con `categories: ['software']`, `categories: ['data']` o ambas cuando corresponda. El campo `category` conserva la descripción visible. El recorrido se calcula con las posiciones reales de las tarjetas. Solo los objetos con URL generan un enlace; los proyectos futuros muestran su estado. El filtro inicial es Todos; Análisis de datos muestra un estado vacío hasta incorporar proyectos reales de esa categoría.

## Galería

En desktop de al menos 1024 px de ancho y 700 px de alto, sin movimiento reducido y con dos o más proyectos, la sección queda fija y el scroll vertical mueve la pista hacia la derecha. Sol Fanara comienza centrado; la invitación está físicamente a su izquierda y termina centrada. El orden del DOM se conserva. La pista y las tarjetas se transforman por separado. La escala depende de la distancia al centro, sin abrir enlaces automáticamente. El recorrido incluye 72 px iniciales de lectura y 180 px finales con el último proyecto centrado. Hasta 800 px de alto se utiliza una tarjeta con portada lateral para mantener todo su contenido visible.

En tablet, mobile y ventanas de menos de 700 px de alto se usa desplazamiento horizontal nativo con scroll snap y controles accesibles. Las flechas del teclado, Inicio y Fin permiten recorrer la galería. Con `prefers-reduced-motion`, los proyectos se muestran sin pinning ni perspectiva. Con cero o un proyecto no se genera recorrido ni pinning; los filtros permanecen disponibles. Los contextos, observadores y listeners se limpian al filtrar, cambiar de modo o desmontar componentes.

## Presentación y movimiento

El encabezado mantiene el rosa empolvado `#E9A4BF` y el logo utiliza Manrope SemiBold. La presentación equilibra desarrollo de software y análisis de datos, conservando los antecedentes y conocimientos existentes.

Las tres especialidades del Home alternan con 3,2 segundos de lectura y transiciones de 0,5 segundos, dentro de un espacio estable. El botón permite pausar y reanudar; el lector de pantalla dispone de una descripción estática de las tres áreas. La foto conserva su entrada original con una duración de 2,3 segundos.

Perfil, habilidades, experiencia, proyectos, certificados y contacto tienen entradas coordinadas mediante GSAP. La estrella original emite un destello aproximadamente cada siete segundos. La rotación y los destellos se pausan fuera de pantalla y con la pestaña oculta. Todas las animaciones respetan `prefers-reduced-motion`.

## Procedencia de assets

- Foto: derivada de `assets/foto_cv/foto_cv.JPEG`, orientada y comprimida a WebP.
- Portada de Sol Fanara: captura real del título Portfolio del home, tomada con Playwright el 19 de octubre de 2026. El sitio y sus servicios no se modificaron.
- Invitación XV Mía Jazmín: capturas reales de la demo pública `https://invitacion-15s-mia-jazmin.vercel.app/demo`, obtenidas con Playwright el 27 de octubre de 2026. El detalle utiliza nuevas capturas PNG con `deviceScaleFactor: 2`: apertura desktop (2880×1800), apertura mobile (780×1688), calendario (752×1644), reproductor (2850×1182) y formulario vacío (1240×1738). Sus archivos terminan en `@2x.png`; se recomprimieron sin pérdida, conservando los mismos píxeles. Solo se abrieron el sobre y el formulario; se bloquearon solicitudes distintas de GET y conexiones con Google Apps Script. La portada de la galería conserva el JPEG anterior. El proyecto externo no se modificó.
- Certificados: los cuatro PDF de `assets/certificados`, importados individualmente. Las miniaturas WebP provienen de sus primeras páginas, renderizadas con herramientas ya disponibles en el entorno; no requieren un visor PDF en la aplicación.
- Fuentes: Google Fonts. Manrope se obtiene de `fonts.gstatic.com` y su licencia de `google/fonts`, directorio `ofl/manrope`. Sus licencias están junto a los WOFF2. No se solicitan fuentes externas durante la navegación.

El archivo de Cambridge es una constancia de resultados (Statement of Results), por lo que se identifica así. AWS Essentials se presenta como curso finalizado. Power BI sigue identificado como estudio en curso. Codex está finalizado en octubre de 2026.

Los CV y las skills se conservan como fuentes de solo lectura. Los CV no se copian a `public`, no se ofrecen para descarga y no se incluyen en `dist`.

## Alcance actual y siguiente iteración

### Caso de estudio de XV Mía Jazmín

La ruta `/proyectos/invitacion-xv` (también con barra final) carga la página de detalle mediante un import diferido. El recorrido principal sigue en `/`. Para esta única ruta se usa `window.location.pathname`, sin incorporar una dependencia de routing. `vercel.json` reescribe exclusivamente ambas variantes hacia `index.html`, manteniendo el acceso directo y la recarga una vez que exista un despliegue autorizado. La configuración local de Vite permite probar la ruta, pero no sustituye la verificación futura en Vercel.

La tarjeta distingue “Demo disponible” de un proyecto publicado y abre tanto la demo como el detalle en otras pestañas. El encabezado reutiliza el componente existente con enlaces de regreso al portfolio. Las explicaciones cubren el diseño, el formulario, la administración en Sheets y la generación de Slides; el diagrama interactivo muestra el flujo de herramientas con GSAP, selección por teclado y soporte para movimiento reducido. La animación se ejecuta una vez y puede repetirse; no tiene pinning. Las imágenes se amplían en un diálogo nativo con Escape y restitución del foco.

Archivos específicos: `src/pages/InvitationCaseStudy.jsx`, `src/content/invitationCaseStudy.js`, `src/components/IntegrationFlow.jsx`, `src/components/CaseStudyFigure.jsx`, `src/components/CaseStudySequence.jsx`, `src/animations/useCaseStudyAnimation.js` y `src/styles/project-detail.css`. El contenido de la tarjeta y la página comparte título, tecnologías y URL.

Las capturas de Google Workspace fueron autorizadas con sus datos ficticios intactos. Los originales están en `assets/projects/invitation/`, junto con `LEEME.txt`; las copias utilizadas por la web están en `src/assets/projects/invitation/`. Los PNG se conservaron byte por byte, sin anonimizar, sustituir nombres o mensajes, ni alterar cifras. `menu1.png` (1163×102) reemplaza en la página a la captura completa `04_generar_presentacion.png`, que se conserva en el repositorio. `menu2.png` (982×167) documenta las bajas, recuperación y organización por grupo. Las otras cuatro capturas de Sheets y Slides siguen intactas. No hay fuentes de Google de mayor resolución disponibles: la mejora consiste en evitar ampliaciones CSS y rotaciones que suavicen el texto, mantener la proporción y ofrecer lectura a tamaño de origen. No se ha recreado ni inventado información para añadir nitidez.

`CaseStudySequence` presenta tres pasos de automatización y dos acciones de gestión mediante pestañas accesibles, con flechas de teclado, Inicio/Fin y entrada táctil. Las transiciones GSAP animan el texto y el marcador seleccionado; las imágenes permanecen quietas. Las interacciones son demostrativas y no hacen solicitudes a Google. Los conectores del diagrama usan línea y punta dentro del mismo SVG, que gira al pasar a orientación vertical, conservando la animación y su repetición. Todo respeta movimiento reducido y limpia sus contextos GSAP.

La secuencia de automatización se identifica como **Seleccionar → Generar → Presentar**. Cada pestaña muestra una explicación breve y su captura real; el segundo paso utiliza el menú de generación y el tercero, el resultado en Google Slides.

`CaseStudyFigure` limita cada captura a su ancho lógico original, conserva su relación de aspecto y ofrece “Ajustar a pantalla” y “Ver detalles”. Los PNG de la demo utilizan sus píxeles adicionales a escala 2×; las interfaces de Google se leen a tamaño original. En mobile, el modo de detalle de los menús empieza por la opción relevante y permite desplazarse; Escape cierra el diálogo y devuelve el foco. La página identifica discretamente los datos ficticios.

Verificación de las mejoras: `npm run build` y `npm run lint` correctos. La ejecución final `npm run test:e2e -- tests/e2e/project-detail.spec.js --workers=1 --timeout=90000` aprobó 30 casos en 2,5 minutos, en desktop, tablet y mobile. Incluye alineación y centrado de conectores con tolerancia de 1 px en anchos 1440, 1000, 999, 768, 390 y 320; repetición del recorrido; movimiento reducido; pestañas por teclado, mouse y tacto; seis capturas de Google servidas byte por byte; proporciones y resolución 2× de la demo; zoom, desplazamiento, Escape y restitución del foco; navegación y conservación de la posición de la galería. Las siete copias originales de Google en `src` conservan su SHA-256, incluida la imagen anterior de generación que ya no se muestra. Las revisiones visuales quedan en `output/playwright/improved-*.png`, `sequence-*.png`, `workspace-*.png` y `case-study-*.png`. No se realizó ningún despliegue ni se modificaron documentos externos.

`tests/e2e/project-detail.spec.js` comprueba acceso directo y recarga, enlaces, conservación de la posición de la galería al abrir pestañas, flujo interactivo, movimiento reducido, ampliación con teclado y tamaños desktop/tablet/mobile, incluyendo 320 px. Las capturas de revisión se guardan en `output/playwright/case-study-*.png`. El contenido de Sheets y Slides se basa en la descripción y las imágenes aportadas; no se accedió a los documentos originales ni se probaron sus automatizaciones.

Verificación del 27 de octubre de 2026: `npm run build`, `npm run lint` y las seis pruebas unitarias de geometría finalizaron correctamente. La ejecución completa de Playwright con cuatro workers tuvo 71 casos aprobados, 12 omitidos por tamaño de pantalla y un timeout en la descarga de un certificado en mobile. Después se agregó la comprobación de finalización/repetición de la animación y cambio de movimiento reducido. La repetición de certificados y detalle con dos workers aprobó los 21 casos en desktop, tablet y mobile, incluida la descarga que había fallado; no se cambió el código de certificados. La verificación visual cubrió las capturas completas de la página y el flujo en ambas orientaciones. No se realizó un despliegue.

Los certificados se visualizan y descargan desde archivos locales incluidos en el build. Agregar o cambiar certificados requiere actualizar sus datos y volver a generar el build. Supabase, autenticación, subida desde la web y panel privado quedan para una iteración posterior.

La configuración está preparada para Vercel con Node 24.x y salida `dist`. No se realizó ningún despliegue. El contacto abre la redacción de Gmail en una pestaña nueva con el destinatario precargado; también ofrece GitHub y LinkedIn, sin formulario ni backend.

### Publicación en el portfolio existente

El repositorio es `meligigena/portfolio_melina_gigena`, con rama principal `main` e integración de GitHub con el proyecto existente `meli-gigena/portfolio-melina-gigena` en Vercel. El dominio público es `https://portfolio-melina-gigena.vercel.app`. La publicación se realiza por commit y push a `main`; no requiere crear otro proyecto ni desplegar los sitios externos enlazados.

Antes de publicar se ejecutan build, lint, las pruebas unitarias de geometría y la suite completa de Playwright. Tras la publicación, `npm run test:e2e -- --config=playwright.production.config.js` verifica el dominio público en desktop y mobile: ruta directa y recarga del caso de estudio, navegación, galería, certificados, imágenes originales, secuencia de tres pasos, gestión de invitados, visor y movimiento reducido. Esta configuración no inicia servidores locales. Las pruebas de enlaces externos usan respuestas simuladas y no envían formularios ni modifican las herramientas de Google.

Validación previa a esta publicación (27 de octubre de 2026): build y lint correctos, 6 pruebas unitarias aprobadas y suite completa de Playwright con 87 casos aprobados y 12 omitidos por tamaño de pantalla, sin fallos (6,5 minutos). Se ejecutó con `npm run test:e2e -- --workers=1 --timeout=90000` sobre el build definitivo.
