import { gsap, useGSAP } from './gsap';

export default function useContactAnimation(root) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({
        defaults: { duration: 0.75, ease: 'power3.out' },
        scrollTrigger: { trigger: root.current, start: 'top 86%', once: true },
      }).from('.contact-content > .section-kicker', { x: -24, opacity: 0 })
        .from('.contact-heading', { y: 36, opacity: 0 }, '-=0.5')
        .from('.contact-email', { x: -30, opacity: 0 }, '-=0.45')
        .from('.contact-bottom > *, .site-footer > *', { y: 16, opacity: 0, stagger: 0.09, duration: 0.55 }, '-=0.4');

      const star = root.current.querySelector('.contact-spark');
      gsap.set(star, { rotation: 10, scale: 1, filter: 'drop-shadow(0 0 0px rgba(168,33,82,0))' });
      const flare = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 5.1, delay: 0.35 })
        .to(star, { scale: 1.14, rotation: 18, filter: 'drop-shadow(0 0 7px rgba(168,33,82,0.45))', duration: 0.32, ease: 'power2.out' })
        .to(star, { scale: 0.98, rotation: 7, filter: 'drop-shadow(0 0 2px rgba(168,33,82,0.1))', duration: 0.28, ease: 'sine.inOut' })
        .to(star, { scale: 1, rotation: 10, filter: 'drop-shadow(0 0 0px rgba(168,33,82,0))', duration: 0.4, ease: 'sine.out' });
      let visible = false;
      const sync = () => {
        if (visible && !document.hidden) flare.resume();
        else flare.pause();
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !document.hidden) flare.restart(true);
        else flare.pause(0);
      }, { threshold: 0.25 });
      observer.observe(star);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
      };
    });
    return () => media.revert();
  }, { scope: root });
}
