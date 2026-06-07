import gsap from 'gsap';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHero() {
  if (prefersReducedMotion) {
    revealHeroInstant();
    return;
  }

  initHeroLoadAnimation();
  initHeroParallax();
  initHeroSteam();
  initHeroScrollIndicator();
  initHeroButtonHover();
}

function revealHeroInstant() {
  gsap.set('.nav', { opacity: 1, y: 0 });
  gsap.set(
    [
      '.hero__eyebrow',
      '.hero__desc',
      '.hero__actions .btn-magnetic',
      '.hero__visual',
      '.hero__badge',
      '.hero__card',
      '.hero__origin-pill',
      '.hero__scroll',
      '.hero__bean',
    ],
    { opacity: 1, clearProps: 'transform' }
  );
  gsap.set('.hero__line span', { y: 0 });
  gsap.set('.hero__image', { scale: 1 });
  gsap.set('.hero__scroll-line span', { scaleX: 1 });
}

function initHeroLoadAnimation() {
  gsap.set('.nav', { opacity: 0, y: -24 });
  gsap.set('.hero__mask-inner', { scale: 1.04, transformOrigin: 'center center' });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.nav', {
    y: 0,
    opacity: 1,
    duration: 0.7,
  })
    .from(
      '.hero__eyebrow',
      { opacity: 0, y: 16, duration: 0.6 },
      '-=0.3'
    )
    .to(
      '.hero__line span',
      { y: 0, duration: 0.95, stagger: 0.14, ease: 'power4.out' },
      '-=0.2'
    )
    .from(
      '.hero__desc',
      { opacity: 0, y: 24, duration: 0.75 },
      '-=0.45'
    )
    .from(
      '.hero__actions .btn-magnetic',
      { opacity: 0, y: 20, duration: 0.65, stagger: 0.1 },
      '-=0.5'
    )
    .to(
      '.hero__visual',
      { opacity: 1, duration: 0.3 },
      '-=0.7'
    )
    .from(
      '.hero__mask-inner',
      { scale: 1.12, opacity: 0.6, duration: 1.4, ease: 'power4.inOut' },
      '-=0.5'
    )
    .to(
      '.hero__mask-inner',
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' },
      '-=0.6'
    )
    .to(
      '.hero__image',
      { scale: 1, duration: 1.6, ease: 'power2.out' },
      '-=1.2'
    )
    .from(
      '.hero__bloom',
      { opacity: 0, scale: 0.85, duration: 1.2 },
      '-=1.4'
    )
    .from(
      '.hero__bean',
      { opacity: 0, scale: 0.6, duration: 0.7, stagger: 0.08, ease: 'power2.out' },
      '-=0.8'
    )
    .from(
      ['.hero__badge', '.hero__card', '.hero__origin-pill'],
      { opacity: 0, y: 16, duration: 0.65, stagger: 0.12 },
      '-=0.5'
    )
    .from(
      '.hero__scroll',
      { opacity: 0, y: 10, duration: 0.5 },
      '-=0.2'
    )
    .add(startHeroAmbientMotion, '-=0.3');
}

function startHeroAmbientMotion() {
  gsap.to('.hero__bean', {
    y: '+=12',
    rotation: '+=6',
    duration: 3.5,
    ease: 'sine.inOut',
    stagger: { each: 0.4, from: 'random' },
    yoyo: true,
    repeat: -1,
  });

  gsap.to('.hero__card', {
    y: -6,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: 0.5,
  });
}

function initHeroSteam() {
  const wisps = document.querySelectorAll('.hero__steam-wisp');
  if (!wisps.length) return;

  wisps.forEach((wisp, i) => {
    gsap.fromTo(
      wisp,
      { y: 0, opacity: 0, scale: 0.6 },
      {
        y: -40 - i * 12,
        opacity: 0.5,
        scale: 1.2,
        duration: 2.8 + i * 0.4,
        ease: 'sine.out',
        repeat: -1,
        delay: i * 0.6,
        onRepeat: () => gsap.set(wisp, { y: 0, opacity: 0, scale: 0.6 }),
      }
    );
  });
}

function initHeroParallax() {
  if (window.matchMedia('(max-width: 1023px)').matches) return;

  const hero = document.querySelector('.hero');
  if (!hero) return;

  const layers = {
    bloom: hero.querySelector('.hero__bloom'),
    imageWrap: hero.querySelector('.hero__image-layer'),
    light: hero.querySelector('.hero__light-shift'),
    beans: hero.querySelectorAll('.hero__bean'),
    cards: hero.querySelectorAll('.hero__card, .hero__badge, .hero__origin-pill'),
  };

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(layers.bloom, {
      x: x * 30,
      y: y * 20,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(layers.imageWrap, {
      x: x * -18,
      y: y * -12,
      duration: 1.4,
      ease: 'power2.out',
    });

    gsap.to(layers.light, {
      x: x * 40,
      y: y * 25,
      opacity: 0.55 + Math.abs(x) * 0.15,
      duration: 1,
      ease: 'power2.out',
    });

    layers.beans.forEach((bean, i) => {
      gsap.to(bean, {
        x: x * (25 + i * 8),
        y: y * (18 + i * 6),
        duration: 1.5 + i * 0.1,
        ease: 'power2.out',
      });
    });

    layers.cards.forEach((card, i) => {
      gsap.to(card, {
        x: x * (8 + i * 4),
        y: y * (6 + i * 3),
        duration: 1.6,
        ease: 'power2.out',
      });
    });
  });

  hero.addEventListener('mouseleave', () => {
    gsap.to([layers.bloom, layers.imageWrap, layers.light, ...layers.beans, ...layers.cards], {
      x: 0,
      y: 0,
      duration: 1.8,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    gsap.to(layers.light, { opacity: 0.4, duration: 1.2 });
  });
}

function initHeroScrollIndicator() {
  const line = document.querySelector('.hero__scroll-line span');
  if (!line) return;

  gsap.to(line, {
    scaleX: 1,
    duration: 1.8,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
    transformOrigin: 'left center',
  });
}

function initHeroButtonHover() {
  document.querySelectorAll('.hero__actions .btn-magnetic').forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      gsap.to(btn, { scale: 1.04, duration: 0.35, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { scale: 1, duration: 0.45, ease: 'power2.out' });
    });
  });
}
