import { useEffect, useId, useRef, useState } from 'react';
import Icon from './Icon';

export default function CaseStudyFigure({ capture, className = '', priority = false }) {
  const dialog = useRef(null);
  const imageViewport = useRef(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [fit, setFit] = useState(true);
  const sourceWidth = capture.width / (capture.pixelRatio || 1);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  useEffect(() => {
    if (!open || fit || capture.focusX === undefined) return;
    const viewport = imageViewport.current;
    viewport.scrollLeft = (viewport.scrollWidth - viewport.clientWidth) * capture.focusX;
  }, [open, fit, capture.focusX]);

  const expand = () => {
    setFit(true);
    dialog.current.showModal();
    setOpen(true);
  };

  return <figure className={`cs-figure ${className}`} style={{ '--capture-width': `${sourceWidth}px` }}>
    <button type="button" className="cs-figure-trigger" onClick={expand} aria-label={`Ampliar ${capture.title}`} aria-haspopup="dialog">
      <img src={capture.src} alt={capture.alt} width={capture.width} height={capture.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />
      <span className="cs-expand" aria-hidden="true"><Icon name="diagonal" /> Ampliar</span>
    </button>
    <figcaption>{capture.caption}</figcaption>
    <dialog ref={dialog} className="cs-image-dialog" aria-labelledby={titleId} onClose={() => setOpen(false)} onClick={(event) => {
      if (event.target === event.currentTarget) dialog.current.close();
    }}>
      <div className="cs-dialog-heading"><h2 id={titleId}>{capture.title}</h2><button className="cs-dialog-close" type="button" onClick={() => dialog.current.close()} autoFocus>Cerrar <span aria-hidden="true">×</span></button></div>
      <div className="cs-dialog-toolbar" role="group" aria-label="Tamaño de la imagen"><button type="button" aria-pressed={fit} onClick={() => setFit(true)}>Ajustar a pantalla</button><button type="button" aria-pressed={!fit} onClick={() => setFit(false)}>Ver detalles</button><span>Desplazá la imagen para explorarla.</span></div>
      <div ref={imageViewport} className={`cs-dialog-image ${fit ? 'is-fitted' : ''}`} tabIndex="0" aria-label="Imagen ampliada. Desplazá para explorar los detalles."><img src={capture.src} alt={capture.alt} width={capture.width} height={capture.height} /></div>
      <p>{capture.caption}</p>
    </dialog>
  </figure>;
}
