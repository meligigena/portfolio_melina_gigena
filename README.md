# Portfolio de Melina Gigena

Portfolio personal de una sola página, en español. React 19.3.1, Vite 8.3.4, JavaScript, CSS y GSAP 3.15.0 con ScrollTrigger y `@gsap/react` 2.1.2.

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
- Portada de la invitación: composición de CSS y tipografía cursiva negra sobre fondo plateado claro; identificada como concepto visual.
- Certificados: los cuatro PDF de `assets/certificados`, importados individualmente. Las miniaturas WebP provienen de sus primeras páginas, renderizadas con herramientas ya disponibles en el entorno; no requieren un visor PDF en la aplicación.
- Fuentes: Google Fonts. Manrope se obtiene de `fonts.gstatic.com` y su licencia de `google/fonts`, directorio `ofl/manrope`. Sus licencias están junto a los WOFF2. No se solicitan fuentes externas durante la navegación.

El archivo de Cambridge es una constancia de resultados (Statement of Results), por lo que se identifica así. AWS Essentials se presenta como curso finalizado. Power BI sigue identificado como estudio en curso. Codex está finalizado en octubre de 2026.

Los CV y las skills se conservan como fuentes de solo lectura. Los CV no se copian a `public`, no se ofrecen para descarga y no se incluyen en `dist`.

## Alcance actual y siguiente iteración

Los certificados se visualizan y descargan desde archivos locales incluidos en el build. Agregar o cambiar certificados requiere actualizar sus datos y volver a generar el build. Supabase, autenticación, subida desde la web y panel privado quedan para una iteración posterior.

La configuración está preparada para Vercel con Node 24.x y salida `dist`. No se realizó ningún despliegue. El contacto abre la redacción de Gmail en una pestaña nueva con el destinatario precargado; también ofrece GitHub y LinkedIn, sin formulario ni backend.
