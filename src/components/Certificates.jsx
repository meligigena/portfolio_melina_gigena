import { useRef } from 'react';
import { certificates } from '../content/certificates';
import useCertificateReveal from '../animations/useCertificateReveal';
import Icon from './Icon';

export default function Certificates() {
  const root = useRef(null);
  useCertificateReveal(root);
  if (!certificates.length) return null;

  return <section className="certificates page-width" id="certificados" ref={root} aria-labelledby="certificates-title">
    <div className="section-heading"><div><p className="section-kicker">Formación que acompaña</p><h2 id="certificates-title">Aprender para construir.</h2></div></div>
    <div className="certificate-grid">
      {certificates.map((certificate) => <article className="certificate-card" key={certificate.id}>
        <a className="certificate-preview" href={certificate.file} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${certificate.title} (PDF, nueva pestaña)`}><img src={certificate.preview} alt={`Primera página: ${certificate.title}`} width={certificate.previewWidth} height={certificate.previewHeight} loading="lazy" /><span>PDF <Icon name="diagonal" /></span></a>
        <div className="certificate-copy"><p className="certificate-kind">{certificate.kind}</p><h3>{certificate.title}</h3><p className="certificate-issuer">{certificate.issuer}</p><p className="certificate-date">{certificate.date}</p>
          <a className="certificate-download" href={certificate.file} download={certificate.filename} aria-label={`Descargar ${certificate.title}`}>Descargar PDF <Icon name="download" /></a>
        </div>
      </article>)}
    </div>
  </section>;
}
