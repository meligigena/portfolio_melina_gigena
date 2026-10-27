import { useEffect, useRef } from 'react';
import Header from '../components/Header';
import Icon from '../components/Icon';
import CaseStudyFigure from '../components/CaseStudyFigure';
import IntegrationFlow from '../components/IntegrationFlow';
import CaseStudySequence from '../components/CaseStudySequence';
import useCaseStudyAnimation from '../animations/useCaseStudyAnimation';
import { invitation, demoCaptures, workspaceCaptures, formFeatures, messageSteps, guestActions } from '../content/invitationCaseStudy';
import '../styles/project-detail.css';

function DemoLink() {
  return <a className="button button-dark" href={invitation.demoURL} target="_blank" rel="noopener noreferrer">Ver demo <Icon name="diagonal" /></a>;
}

export default function InvitationCaseStudy() {
  const root = useRef(null);
  useCaseStudyAnimation(root);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = 'XV Mía Jazmín — Caso de estudio | Melina Gigena';
    if (description) description.content = invitation.description;
    return () => {
      document.title = previousTitle;
      if (description) description.content = previousDescription;
    };
  }, []);

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Header anchorBase="/" />
    <main id="contenido" className="case-study" ref={root}>
      <section className="cs-hero page-width" aria-labelledby="case-title">
        <div className="cs-hero-copy">
          <a className="text-link cs-back" href="/#proyectos"><Icon name="arrow" /> Volver al portfolio</a>
          <p className="cs-availability"><span /> Demo disponible</p>
          <h1 id="case-title">{invitation.title}</h1>
          <p className="cs-lead">Una invitación que conecta diseño, personas y datos.</p>
          <p className="cs-introduction">Desarrollé una experiencia web a medida y conecté las confirmaciones con herramientas para organizar invitados y transformar sus mensajes en una presentación.</p>
          <div className="cs-hero-actions"><DemoLink /><a className="text-link" href="#integracion">Explorar la integración <Icon name="down" /></a></div>
          <p className="cs-demo-note">Demostración pública del proyecto. Los datos e importes de la demo son ilustrativos.</p>
        </div>
        <div className="cs-hero-visual"><CaseStudyFigure capture={demoCaptures.desktop} priority /><span className="cs-visual-note"><Icon name="spark" /> Una experiencia hecha a medida</span></div>
        <div className="cs-project-facts">
          <dl><div><dt>Mi participación</dt><dd>Diseño visual, frontend e integraciones</dd></div><div><dt>El desafío</dt><dd>Conectar la experiencia del invitado con la gestión del evento</dd></div></dl>
          <ul className="project-technologies" aria-label="Tecnologías del proyecto">{invitation.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        </div>
      </section>

      <section className="cs-integration" id="integracion" aria-labelledby="integration-title">
        <div className="page-width"><div className="cs-section-intro"><h2 id="integration-title">Una respuesta.<br />Todo un recorrido.</h2><p>El frontend es el punto de entrada. Apps Script conecta la información con la gestión y con un resultado listo para compartir.</p></div><IntegrationFlow /></div>
      </section>

      <nav className="cs-section-nav page-width" aria-label="Contenido del caso de estudio"><a href="#experiencia">La experiencia</a><a href="#confirmacion">El formulario</a><a href="#gestion">Los datos</a><a href="#mensajes">La automatización</a></nav>

      <section className="cs-experience page-width cs-section" id="experiencia" aria-labelledby="experience-title">
        <div className="cs-section-intro"><h2 id="experience-title">El diseño también<br />cuenta una historia.</h2><p>Negro, plata, brillos y tipografía expresiva: una identidad construida alrededor de la estética solicitada por la clienta.</p></div>
        <div className="cs-experience-layout">
          <div className="cs-experience-main" data-case-reveal><CaseStudyFigure capture={demoCaptures.music} /><div className="cs-experience-notes"><div><Icon name="spark" /><h3>Una entrada con intención</h3><p>El sobre se abre al tocarlo y da paso al recorrido de la invitación.</p></div><div><Icon name="layers" /><h3>Interacción y movimiento</h3><p>Un vinilo para reproducir música, brillos animados y elementos que aparecen durante la navegación.</p></div></div></div>
          <div className="cs-mobile-pair" data-case-reveal><CaseStudyFigure capture={demoCaptures.mobile} className="cs-phone" /><CaseStudyFigure capture={demoCaptures.calendar} className="cs-phone cs-phone-offset" /><p>La composición se adapta al teléfono y conserva un recorrido vertical.</p></div>
        </div>
      </section>

      <section className="cs-form-section" id="confirmacion" aria-labelledby="form-title"><div className="page-width cs-form-layout">
        <div className="cs-form-copy"><p className="section-kicker">Lógica detrás de la experiencia</p><h2 id="form-title">Confirmar también<br />es organizar.</h2><p className="cs-section-summary">Un formulario dinámico reúne lo que hace falta para preparar el evento.</p><ul className="cs-form-features">{formFeatures.map((feature) => <li key={feature.title}><Icon name={feature.icon} /><div><h3>{feature.title}</h3><p>{feature.text}</p></div></li>)}</ul><p className="cs-validation-note"><Icon name="code" /> Campos obligatorios y validaciones antes del envío.</p></div>
        <div className="cs-form-image" data-case-reveal><CaseStudyFigure capture={demoCaptures.form} /></div>
      </div></section>

      <section className="cs-management page-width cs-section" id="gestion" aria-labelledby="management-title">
        <div className="cs-section-intro"><h2 id="management-title">Los datos,<br />en su lugar.</h2><p>Google Apps Script recibe las confirmaciones de la web y las registra en Google Sheets para facilitar la administración.</p></div>
        <p className="cs-workspace-note">Capturas de una demostración con datos ficticios.</p>
        <div className="cs-management-grid">
          <article className="cs-management-block" data-case-reveal>
            <div className="cs-management-copy">
              <div><span className="cs-tool-label"><Icon name="database" /> Google Sheets</span><h3>Registro centralizado</h3></div>
              <div className="cs-management-details"><p>Invitados y grupos en una misma planilla, con la información necesaria para dar seguimiento a cada confirmación.</p><ul className="cs-field-tags"><li>Grupos</li><li>Generales y cortesías</li><li>Estados de pago</li><li>Precios</li><li>Bajas</li><li>Alimentación</li><li>Canciones</li></ul></div>
            </div>
            <CaseStudyFigure capture={workspaceCaptures.confirmations} />
          </article>
          <article className="cs-guest-management" aria-labelledby="guest-management-title" data-case-reveal>
            <div className="cs-guest-heading"><div><span className="cs-tool-label"><Icon name="branch" /> Google Sheets + Apps Script</span><h3 id="guest-management-title">Gestión de invitados</h3></div><p>Además del registro automático, desarrollé herramientas para administrar invitados, controlar estados y mantener la información organizada desde la planilla.</p></div>
            <CaseStudySequence label="Explorar la gestión de invitados" steps={guestActions} numbered={false} />
            <p className="cs-sequence-note">“Restablecer orden por grupo” permite volver a organizar la lista. Estas acciones se realizan desde el menú de la planilla.</p>
          </article>
          <article className="cs-management-block" data-case-reveal>
            <div className="cs-management-copy">
              <div><span className="cs-tool-label"><Icon name="chart" /> Resumen de la información</span><h3>Una lectura del conjunto</h3></div>
              <div className="cs-management-details"><p>Un panel reúne los totales y distribuciones para consultar el estado de la organización.</p><ul className="cs-indicator-list"><li><Icon name="layers" /><span>Confirmaciones y asistentes</span></li><li><Icon name="chart" /><span>Pagos y tipos de invitación</span></li><li><Icon name="database" /><span>Requerimientos alimentarios</span></li></ul></div>
            </div>
            <CaseStudyFigure capture={workspaceCaptures.statistics} />
          </article>
        </div>
      </section>

      <section className="cs-messages" id="mensajes" aria-labelledby="messages-title"><div className="page-width">
        <div className="cs-section-intro"><h2 id="messages-title">De los mensajes<br />a las diapositivas.</h2><p>Lo que los invitados escriben en la web puede convertirse en una presentación para proyectar durante el evento.</p></div>
        <CaseStudySequence label="Explorar la generación de la presentación" steps={messageSteps} />
        <p className="cs-demo-controls-note">Recorrido demostrativo del proceso: selección en Sheets, automatización con Apps Script y resultado en Slides.</p>
      </div></section>

      <section className="cs-closing page-width" id="cierre" aria-labelledby="closing-title"><Icon name="asterisk" /><div><h2 id="closing-title">Diseño que se conecta<br />con una solución.</h2><p>Este proyecto me permitió integrar frontend, lógica de negocio, manejo de datos y automatización: una experiencia para los invitados y herramientas prácticas para organizar el evento.</p><div className="cs-closing-skills"><span>Experiencia de usuario</span><span>Lógica funcional</span><span>Integración de herramientas</span></div><div className="cs-closing-actions"><DemoLink /><a className="text-link" href="/#proyectos">Volver a mis proyectos <Icon name="arrow" /></a></div></div></section>
    </main>
    <footer className="cs-footer page-width"><a className="wordmark" href="/#inicio" aria-label="Melina Gigena, inicio">meli<span>.</span></a><p>Diseño y desarrollo por Melina Gigena.</p><a className="text-link" href="/#contacto">Contactame <Icon name="diagonal" /></a></footer>
  </>;
}
