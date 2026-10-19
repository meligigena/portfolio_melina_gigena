import { gsap, ScrollTrigger, useGSAP } from './gsap';

export default function useProfileReveal(root) {
  useGSAP((_context, contextSafe) => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const intro = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.75 },
        scrollTrigger: { trigger: '.profile-intro', start: 'top 86%', once: true },
      });
      intro.from('.profile-intro > .section-kicker, .profile-intro h2', { x: -38, opacity: 0, stagger: 0.1 })
        .from('.profile-description', { y: 25, opacity: 0 }, '-=0.45')
        .from('.strengths li', { y: 14, opacity: 0, stagger: 0.065, duration: 0.45 }, '-=0.45')
        .from('.current-study', { x: -20, opacity: 0, duration: 0.6 }, '-=0.3');
      gsap.from('.skill-area', {
        x: 38, opacity: 0, duration: 0.65, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.skills', start: 'top 88%', once: true },
      });
      gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.7 },
        scrollTrigger: { trigger: '.experience', start: 'top 88%', once: true },
      }).from('.experience-heading', { y: 28, opacity: 0 })
        .from('.experience-item', { y: 32, rotation: 1, opacity: 0, stagger: 0.12 }, '-=0.4');
      const onToggle = contextSafe((event) => {
        if (!event.target.matches('.skill-area')) return;
        if (event.target.open) gsap.fromTo(event.target.querySelectorAll('.skill-tags li'),
          { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.025, overwrite: true });
        ScrollTrigger.refresh();
      });
      root.current.addEventListener('toggle', onToggle, true);
      const element = root.current;
      return () => element.removeEventListener('toggle', onToggle, true);
    });
    return () => media.revert();
  }, { scope: root });
}
