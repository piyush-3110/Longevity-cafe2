import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initHero } from './hero.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function initLoader() {
  const loader = document.querySelector('.loader');
  const loaderLine = document.querySelector('.loader__line');
  const loaderWord = document.querySelector('.loader__word');

  document.body.classList.add('is-loading');

  const tl = gsap.timeline({
    onComplete: () => {
      loader.classList.add('is-hidden');
      document.body.classList.remove('is-loading');
      initHero();
    },
  });

  if (prefersReducedMotion) {
    tl.set(loader, { autoAlpha: 0 });
    tl.call(initHero);
    return;
  }

  tl.from(loaderWord, {
    opacity: 0,
    y: 12,
    duration: 0.8,
    ease: 'power2.out',
  })
    .from(loaderLine, {
      scaleX: 0,
      duration: 0.6,
      ease: 'power2.inOut',
    })
    .to(loaderLine, {
      scaleX: 1,
      duration: 0.4,
      ease: 'power2.inOut',
    })
    .to(loader, {
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.inOut',
    });
}

function initNavigation() {
  const nav = document.querySelector('.nav');

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
      nav.classList.toggle('is-scrolled', self.scroll() > 40);
    },
  });
}

function initOriginReveal() {
  const section = document.querySelector('.origin');
  if (!section) return;

  if (prefersReducedMotion) {
    gsap.set(['.origin__image', '.origin__content > *'], { clearProps: 'all' });
    return;
  }

  gsap.from('.origin__image', {
    scale: 1.15,
    scrollTrigger: {
      trigger: '.origin__mask',
      start: 'top 80%',
      end: 'top 20%',
      scrub: 1,
    },
  });

  gsap.from('.origin__mask', {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1.2,
    ease: 'power3.inOut',
    scrollTrigger: {
      trigger: '.origin',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.origin__content > *', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.origin__content',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initBenefitsReveal() {
  if (prefersReducedMotion) return;

  gsap.from('.benefits__header > *', {
    y: 32,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.benefits__header',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.benefit-card', {
    y: 48,
    opacity: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.benefits__cards',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initProductsReveal() {
  if (prefersReducedMotion) return;

  gsap.from('.products__header > *', {
    y: 32,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.products__header',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.product-card', {
    y: 56,
    opacity: 0,
    duration: 1,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.products__grid',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initProcessTimeline() {
  const lineFill = document.querySelector('.process__line-fill');
  const steps = document.querySelectorAll('.process-step');
  if (!lineFill || !steps.length) return;

  if (prefersReducedMotion) {
    gsap.set(steps, { opacity: 1, y: 0 });
    gsap.set(lineFill, { strokeDashoffset: 0 });
    return;
  }

  gsap.from('.process__header > *', {
    y: 32,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.process__header',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.process__timeline',
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: 0.8,
    },
  });

  tl.to(lineFill, {
    strokeDashoffset: 0,
    ease: 'none',
  }).to(
    steps,
    {
      opacity: 1,
      y: 0,
      stagger: 0.2,
      ease: 'power2.out',
    },
    0
  );
}

function initTestimonialReveal() {
  if (prefersReducedMotion) return;

  gsap.from('.testimonial__content > *', {
    opacity: 0,
    y: 32,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonial',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.testimonial__image', {
    opacity: 0,
    scale: 1.05,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.testimonial__visual',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initNewsletterReveal() {
  if (prefersReducedMotion) return;

  gsap.from('.newsletter__inner > *', {
    y: 32,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.newsletter',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
  });
}

function initMagneticButtons() {
  if (prefersReducedMotion) return;

  document.querySelectorAll('.btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.4,
        ease: 'power2.out',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      });
    });
  });
}

function initFooterReveal() {
  if (prefersReducedMotion) return;

  gsap.from('.footer__inner > *, .footer__bottom', {
    y: 24,
    opacity: 0,
    duration: 0.8,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.footer',
      start: 'top 90%',
      toggleActions: 'play none none none',
    },
  });
}

function init() {
  initLoader();
  initNavigation();
  initMagneticButtons();
  initOriginReveal();
  initBenefitsReveal();
  initProductsReveal();
  initProcessTimeline();
  initTestimonialReveal();
  initNewsletterReveal();
  initFooterReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
