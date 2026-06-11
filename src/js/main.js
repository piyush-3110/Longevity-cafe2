import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.querySelector('.nav__toggle');
  const mobile = document.querySelector('.nav__mobile');

  const syncNavScrolled = () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  // jnsdfns

  syncNavScrolled();

  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 40),
  });

  ScrollTrigger.addEventListener('refreshInit', syncNavScrolled);

  if (toggle && mobile) {
    const setMenuOpen = (open) => {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      mobile.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(mobile.getAttribute('aria-hidden') === 'true');
    });

    mobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        setMenuOpen(false);
      });
    });
  }
}

function initHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  gsap.set('.hero__img', { scale: 1.15 });

  tl.to('.hero__img', { scale: 1, duration: 2, ease: 'power2.out' }, 0)
    .from('.hero__tag', { opacity: 0, y: 20, duration: 0.8 }, 0.3)
    .from('.hero__line', { y: '110%', duration: 1, stagger: 0.12, ease: 'power4.out' }, 0.4)
    .from('.hero__subtitle', { opacity: 0, y: 24, duration: 0.9 }, 0.9)
    .from('.hero__actions', { opacity: 0, y: 20, duration: 0.8 }, 1.1)
    .from('.hero__stats', { opacity: 0, y: 20, duration: 0.8 }, 1.25)
    .from('.hero__side--left', { opacity: 0, x: -24, duration: 1 }, 1.3)
    .from('.hero__side--right', { opacity: 0, x: 24, duration: 1 }, 1.3)
    .from('.hero__scroll', { opacity: 0, y: 16, duration: 0.7 }, 1.5);

  gsap.to('.hero__side--left', {
    y: -10,
    duration: 3.5,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 2.5,
  });

  gsap.to('.hero__side--right', {
    y: 8,
    duration: 4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: 3,
  });

  gsap.to('.hero__scroll-bar span', {
    scaleY: 1,
    duration: 1.4,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
    delay: 2,
  });

  gsap.to('.hero__img', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}

function initScrollReveals() {
  const reveals = gsap.utils.toArray('[data-reveal]');

  ScrollTrigger.batch(reveals, {
    onEnter: (batch) => {
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        overwrite: true,
      });
    },
    start: 'top 88%',
    once: true,
  });
}

function initImageReveals() {
  gsap.utils.toArray('.about__img img, .gallery__item img, .packaging__visual img').forEach((img) => {
    gsap.from(img, {
      scale: 1.15,
      duration: 1.4,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: img.parentElement,
        start: 'top 85%',
        once: true,
      },
    });
  });
}

function initBannerParallax() {
  const bannerMedia = document.querySelector('.banner__media');
  if (!bannerMedia) return;

  gsap.to(bannerMedia, {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.banner',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

function initPillarHover() {
  document.querySelectorAll('.pillar').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -4, duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.45, ease: 'power2.out' });
    });
  });
}

function initProductHover() {
  document.querySelectorAll('.product').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -4, duration: 0.35, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, duration: 0.45, ease: 'power2.out' });
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  const messageEl = document.getElementById('form-message');
  const submitBtn = document.getElementById('submit-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    messageEl.hidden = true;
    messageEl.className = 'form-message';

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      inquiryType: formData.get('inquiryType'),
      message: formData.get('message'),
      gdprConsent: formData.get('gdprConsent') === 'on',
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      messageEl.textContent = data.message;
      messageEl.classList.add('is-success');
      messageEl.hidden = false;
      form.reset();
    } catch (err) {
      messageEl.textContent = err.message || 'Something went wrong. Please try again.';
      messageEl.classList.add('is-error');
      messageEl.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Inquiry';
    }
  });
}

function init() {
  mm.add(
    {
      isDesktop: '(min-width: 900px)',
      isMobile: '(max-width: 899px)',
      reduceMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { reduceMotion } = context.conditions;

      initNav();
      initContactForm();

      if (reduceMotion) return;

      initHero();
      initScrollReveals();
      initImageReveals();
      initBannerParallax();
      initPillarHover();
      initProductHover();
    }
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
