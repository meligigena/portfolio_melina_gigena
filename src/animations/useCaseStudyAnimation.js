import { gsap, useGSAP } from './gsap';

export default function useCaseStudyAnimation(root) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.cs-hero-copy > *', { y: 24, opacity: 0, duration: 0.65, stagger: 0.07 })
        .from('.cs-hero-visual', { y: 36, rotation: 2, opacity: 0, duration: 0.9 }, 0.15);
      root.current.querySelectorAll('[data-case-reveal]').forEach((element) => {
        gsap.from(element, { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', once: true } });
      });
    });
    return () => media.revert();
  }, { scope: root });
}
