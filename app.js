document.addEventListener('DOMContentLoaded', () => {

  const postits = document.querySelectorAll('.postit-window');
  const badge = document.getElementById('floating-badge');

  // ─── MASTER TIMELINE ───────────────────────────────────────────────

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('#hero-workspace', { opacity: 0 }, { opacity: 1, duration: 0.6 });

  // ─── POST-ITS: SPRING FROM CENTER ─────────────────────────────────

  gsap.set(postits, {
    scale: 0,
    opacity: 0,
    rotation: 0,
  });

  tl.to(postits, {
    scale: 1,
    opacity: 1,
    duration: 1.2,
    ease: 'back.out(2)',
    stagger: { each: 0.15, from: 'center' },
    onComplete: () => {
      const rots = [-3, 1.5, 4, -2];
      postits.forEach((el, i) => gsap.set(el, { rotation: rots[i] || 0 }));
    },
  }, 0.8);

  // ─── GLITCH TEXT REVEAL ─────────────────────────────────────────

  const headlineEl = document.getElementById('glitch-text');
  if (headlineEl) {
    const SYS_CHARS = '!@#$%&?+*={}[]<>/\\|~:;01';
    const lines = headlineEl.querySelectorAll('.glitch-line');

    lines.forEach((line) => {
      const text = line.getAttribute('data-text') || line.textContent;
      let html = '';
      text.split('').forEach((ch) => {
        html += ch === ' '
          ? '<span class="g-char" data-c=" ">&nbsp;</span>'
          : `<span class="g-char" data-c="${ch}">${ch}</span>`;
      });
      line.innerHTML = html;
    });

    const allChars = headlineEl.querySelectorAll('.g-char');

    allChars.forEach((span) => {
      if (span.dataset.c !== ' ') {
        span.textContent = SYS_CHARS[Math.floor(Math.random() * SYS_CHARS.length)];
        span.style.opacity = '0';
      }
    });

    tl.to(allChars, {
      opacity: 1,
      duration: 0.001,
      ease: 'none',
      stagger: { each: 0.008, from: 'start' },
    }, '-=0.4');

    allChars.forEach((span) => {
      if (span.dataset.c === ' ') return;
      const real = span.dataset.c;
      const cycles = 3 + Math.floor(Math.random() * 3);
      let step = 0;

      tl.to(span, {
        duration: 0.03,
        repeat: cycles,
        repeatDelay: 0.008,
        onRepeat: () => {
          step++;
          span.textContent = step < cycles
            ? SYS_CHARS[Math.floor(Math.random() * SYS_CHARS.length)]
            : real;
        },
        onComplete: () => { span.textContent = real; },
      }, `-=${0.01 * allChars.length}`);
    });
  }

  // ─── CONTINUOUS FLOATING DRIFT ──────────────────────────────────

  postits.forEach((el) => {
    gsap.to(el, {
      y: 4 + Math.random() * 10,
      x: -3 + Math.random() * 6,
      rotation: `+=${(Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.5)}`,
      duration: 3.2 + Math.random() * 1.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: Math.random() * 2.5,
    });
  });

  // ─── FLOATING BADGE ─────────────────────────────────────────────

  if (badge) {
    tl.fromTo(badge,
      { opacity: 0, scale: 0.5 },
      { opacity: 0.45, scale: 1, duration: 1.6, ease: 'back.out(1.4)' },
      '-=0.4'
    );

    gsap.to(badge, {
      y: 10,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
  }

  // ─── SCREEN FRAME ELASTIC POP ──────────────────────────────────────

  gsap.from(".screen-frame-wrapper", {
    scale: 0,
    duration: 0.6,
    ease: "elastic.out(1, 0.75)",
  });

  // ─── NETWORK GLOBE ENTRANCE + ROTATION ────────────────────────────

  function startGlobeRotation() {
    gsap.to(".internet-logo-wrapper", {
      rotate: 360,
      duration: 20,
      repeat: -1,
      ease: "linear",
    });
  }

  gsap.from(".internet-logo-wrapper", {
    scale: 0,
    duration: 0.7,
    ease: "back.out(1.8)",
    delay: 0.2,
    onComplete: startGlobeRotation,
  });

  // ─── SCROLL HINT ────────────────────────────────────────────────

  const hint = document.createElement('div');
  hint.textContent = 'SCROLL  \u2193';
  Object.assign(hint.style, {
    position: 'fixed',
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '0.5rem',
    letterSpacing: '0.35em',
    color: 'rgba(16,232,246,0.15)',
    zIndex: '100',
    opacity: '0',
    transition: 'opacity 0.8s ease',
  });
  document.body.appendChild(hint);
  tl.to(hint, { opacity: 1, duration: 1.2 });

  gsap.to(hint, {
    y: -6,
    duration: 1.8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 2.5,
  });

  // ─── GLITCH PULSES ─────────────────────────────────────────────

  function glitchPulse() {
    const chars = document.querySelectorAll('.g-char');
    const subset = Array.from(chars).filter(() => Math.random() > 0.88);

    subset.forEach((ch) => {
      if (ch.dataset.c === ' ') return;
      const orig = ch.dataset.c;
      gsap.to(ch, {
        duration: 0.06 + Math.random() * 0.08,
        ease: 'steps(1)',
        repeat: 1,
        yoyo: true,
        onStart: () => { ch.textContent = SYS_CHARS[Math.floor(Math.random() * SYS_CHARS.length)]; },
        onRepeat: () => { ch.textContent = orig; },
      });
    });
  }

  function scheduleGlitch() {
    setTimeout(() => {
      glitchPulse();
      scheduleGlitch();
    }, 2500 + Math.random() * 5000);
  }
  scheduleGlitch();

});
