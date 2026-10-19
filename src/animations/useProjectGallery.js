import { gsap, ScrollTrigger, useGSAP } from './gsap';
import { getGalleryLayout, getGalleryX, getProjectState, getProjectScroll } from './projectGalleryGeometry';

export default function useProjectGallery(rootRef, controlsRef, onActiveChange, items) {
  useGSAP((_context, contextSafe) => {
    const section = rootRef.current;
    const viewport = section.querySelector('.projects-viewport');
    const track = section.querySelector('.projects-track');
    const slots = track ? [...track.children] : [];
    if (!slots.length) {
      section.dataset.mode = 'empty';
      controlsRef.current = null;
      return () => { delete section.dataset.mode; };
    }
    const cards = slots.map((slot) => slot.querySelector('.project-card'));
    const media = gsap.matchMedia();

    media.add({
      desktop: '(min-width: 1024px) and (min-height: 700px)',
      reduced: '(prefers-reduced-motion: reduce)',
      normal: '(prefers-reduced-motion: no-preference)',
    }, (context) => {
      const { desktop, reduced } = context.conditions;
      const pinned = desktop && !reduced && slots.length > 1;
      section.dataset.mode = reduced ? 'reduced' : pinned ? 'pinned' : 'native';
      gsap.set([track, ...cards], { clearProps: 'transform,translate,rotate,scale,opacity,visibility' });
      viewport.scrollLeft = 0;
      let active = -1;
      let updateFrame = 0;
      let refreshFrame = 0;
      let disposed = false;
      let tween;
      let navigation;
      let layout;
      const driver = { progress: 0 };
      const setX = gsap.quickSetter(track, 'x', 'px');
      const setters = cards.map((card) => ({
        scaleX: gsap.quickSetter(card, 'scaleX'),
        scaleY: gsap.quickSetter(card, 'scaleY'),
        y: gsap.quickSetter(card, 'y', 'px'),
        rotation: gsap.quickSetter(card, 'rotationY', 'deg'),
      }));
      const centerOf = (slot) => slot.offsetLeft + slot.offsetWidth / 2;
      const measure = () => {
        layout = getGalleryLayout(slots.map(centerOf), viewport.clientWidth / 2);
      };

      const updateCards = () => {
        if (disposed) return;
        let nearest = 0;
        let smallest = Infinity;
        const x = pinned ? getGalleryX(layout, driver.progress) : -viewport.scrollLeft;
        if (pinned) setX(x);
        slots.forEach((slot, index) => {
          const distance = centerOf(slot) + x - viewport.clientWidth / 2;
          if (Math.abs(distance) < smallest) {
            smallest = Math.abs(distance);
            nearest = index;
          }
          if (pinned) {
            const state = getProjectState(distance, slot.offsetWidth);
            setters[index].scaleX(state.scale);
            setters[index].scaleY(state.scale);
            setters[index].y(state.y);
            setters[index].rotation(state.rotation);
          }
        });
        if (nearest !== active) {
          active = nearest;
          onActiveChange(nearest);
        }
      };

      const select = contextSafe((index, behavior = 'smooth') => {
        if (index < 0 || index >= slots.length || reduced) return;
        navigation?.kill();
        if (pinned && tween) {
          const target = tween.scrollTrigger.start + getProjectScroll(layout, index);
          if (behavior !== 'smooth') window.scrollTo({ top: target, behavior: 'instant' });
          else {
            const position = { y: window.scrollY };
            navigation = gsap.to(position, {
              y: target, duration: 0.55, ease: 'power2.inOut',
              onUpdate: () => window.scrollTo({ top: position.y, behavior: 'instant' }),
            });
          }
        } else {
          viewport.scrollTo({ left: centerOf(slots[index]) - viewport.clientWidth / 2, behavior });
        }
      });
      controlsRef.current = { select };
      measure();
      if (pinned) {
        tween = gsap.to(driver, {
          progress: 1,
          ease: 'none',
          onUpdate: updateCards,
          scrollTrigger: {
            id: 'projects',
            trigger: section,
            start: 'top top',
            end: () => '+=' + layout.distance,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
            onRefresh: updateCards,
          },
        });
      }
      const scheduleUpdate = () => {
        cancelAnimationFrame(updateFrame);
        updateFrame = requestAnimationFrame(updateCards);
      };
      const scheduleRefresh = () => {
        cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          if (disposed) return;
          measure();
          ScrollTrigger.refresh();
          updateCards();
        });
      };
      const onFocus = (event) => {
        const slot = event.target.closest('.project-slot');
        if (slot && !reduced && (!pinned || event.target.matches(':focus-visible'))) select(Number(slot.dataset.index), 'instant');
      };
      const cancelNavigation = () => navigation?.kill();
      const onKeyDown = (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || reduced) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? slots.length - 1 : active + (event.key === 'ArrowRight' ? 1 : -1);
        select(next);
      };
      const observer = new ResizeObserver(scheduleRefresh);
      observer.observe(viewport);
      slots.forEach((slot) => observer.observe(slot));
      const images = [...section.querySelectorAll('img')];
      images.forEach((image) => image.addEventListener('load', scheduleRefresh));
      viewport.addEventListener('scroll', scheduleUpdate, { passive: true });
      viewport.addEventListener('keydown', onKeyDown);
      track.addEventListener('focusin', onFocus);
      window.addEventListener('wheel', cancelNavigation, { passive: true });
      window.addEventListener('touchstart', cancelNavigation, { passive: true });
      document.fonts.ready.then(() => { if (!disposed) scheduleRefresh(); });
      updateCards();

      return () => {
        disposed = true;
        cancelAnimationFrame(updateFrame);
        cancelAnimationFrame(refreshFrame);
        observer.disconnect();
        navigation?.kill();
        images.forEach((image) => image.removeEventListener('load', scheduleRefresh));
        viewport.removeEventListener('scroll', scheduleUpdate);
        viewport.removeEventListener('keydown', onKeyDown);
        track.removeEventListener('focusin', onFocus);
        window.removeEventListener('wheel', cancelNavigation);
        window.removeEventListener('touchstart', cancelNavigation);
        cards.forEach((card) => ['transform', 'opacity', 'visibility'].forEach((property) => card.style.removeProperty(property)));
        track.style.removeProperty('transform');
        delete section.dataset.mode;
        controlsRef.current = null;
      };
    });
    const refresh = contextSafe(() => ScrollTrigger.refresh());
    const frame = requestAnimationFrame(refresh);
    return () => { cancelAnimationFrame(frame); media.revert(); };
  }, { scope: rootRef, dependencies: [onActiveChange, items], revertOnUpdate: true });
}
