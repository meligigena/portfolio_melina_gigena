import { gsap, useGSAP } from './gsap';

export default function useCertificateReveal(root) {
  useGSAP(() => {
    if (!root.current) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: root.current, start: 'top 88%', once: true },
      }).from('.section-heading', { x: -28, opacity: 0, duration: 0.65 })
        .from('.certificate-card', { y: 32, scale: 0.96, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.35');
    });
    return () => media.revert();
  }, { scope: root });
}
