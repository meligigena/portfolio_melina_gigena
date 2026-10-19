import { gsap, useGSAP } from './gsap';

export default function useSpecialtyRotation(root) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const labels = [...root.current.querySelectorAll('.specialty-text')];
      gsap.set(labels, { autoAlpha: 0, yPercent: 60 });
      gsap.set(labels[0], { autoAlpha: 1, yPercent: 0 });
      const timeline = gsap.timeline({ paused: true, repeat: -1 });
      labels.forEach((label, index) => {
        timeline.to({}, { duration: 2.45 })
          .to(label, { yPercent: -60, autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' })
          .fromTo(labels[(index + 1) % labels.length],
            { yPercent: 60, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'power2.inOut', immediateRender: false }, '<')
          .set(label, { yPercent: 60 });
      });
      let visible = false;
      const sync = () => timeline.paused(!visible || document.hidden);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      observer.observe(root.current);
      document.addEventListener('visibilitychange', sync);
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
      };
    });
    return () => media.revert();
  }, { scope: root });
}
