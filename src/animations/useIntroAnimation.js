import { gsap, useGSAP } from './gsap';

export default function useIntroAnimation(root) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({ defaults: { duration: 0.65, ease: 'power3.out' } });
      timeline.addLabel('entrance', 0)
        .from('.intro-copy > *', { y: 18, stagger: 0.045 }, 'entrance')
        .from('.portrait-frame', { y: 26, rotation: 3, scale: 0.97, duration: 2.3, ease: 'power2.out' }, 'entrance')
        .from('.portrait-note', { x: 12, y: 14, rotation: 2 }, 'entrance+=0.12')
        .from('.academic-strip > div', { y: 14, stagger: 0.09, duration: 0.65 }, 'entrance+=0.2');
    });
    return () => media.revert();
  }, { scope: root });
}
