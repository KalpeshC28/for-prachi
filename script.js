(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);

  function startCountdown() {
    const note = $('countdown-note');
    if (!note) return;
    const update = () => {
      const now = new Date();
      const thisBirthday = new Date(now.getFullYear(), 10, 28, 0, 0, 0);
      const isBirthday = now.getMonth() === 10 && now.getDate() === 28;
      const target = now < thisBirthday ? thisBirthday : new Date(now.getFullYear() + 1, 10, 28, 0, 0, 0);
      const remaining = isBirthday ? 0 : Math.max(0, target.getTime() - now.getTime());
      const values = {
        days: Math.floor(remaining / 86400000),
        hours: Math.floor((remaining % 86400000) / 3600000),
        minutes: Math.floor((remaining % 3600000) / 60000),
        seconds: Math.floor((remaining % 60000) / 1000)
      };
      Object.entries(values).forEach(([id, value]) => {
        const node = $(id);
        if (node) node.textContent = String(value).padStart(2, '0');
      });
      note.textContent = isBirthday ? "it's our day. happy birthday to us ♡" : 'counting down to 28 November';
    };
    update();
    window.setInterval(update, 1000);
  }

  function startReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach((item) => item.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    items.forEach((item) => observer.observe(item));
  }

  function startProgress() {
    const bar = $('reading-progress');
    if (!bar) return;
    let queued = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
      bar.style.width = progress + '%';
      queued = false;
    };
    window.addEventListener('scroll', () => {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  function startInteractions() {
    document.addEventListener('click', (event) => {
      const wish = event.target.closest('.wish-card');
      if (wish) {
        document.querySelectorAll('.wish-card').forEach((card) => {
          const active = card === wish;
          card.classList.toggle('active', active);
          card.setAttribute('aria-pressed', String(active));
        });
        const panel = $('wish-reveal');
        const paragraph = panel && panel.querySelector('p');
        const icon = panel && panel.querySelector('span');
        const wishIcon = wish.querySelector('.wish-icon');
        if (paragraph) paragraph.textContent = wish.dataset.wish || '';
        if (icon) icon.textContent = wishIcon ? wishIcon.textContent : '✦';
        if (panel) panel.classList.add('open');
        return;
      }

      if (event.target.closest('#candles')) {
        const stage = document.querySelector('.cake-stage');
        const button = $('candles');
        if (stage && !stage.classList.contains('blown')) {
          stage.classList.add('blown');
          if (button) button.setAttribute('aria-pressed', 'true');
          const instruction = $('cake-instruction');
          if (instruction) instruction.textContent = 'wish made';
        }
        return;
      }

      const signal = event.target.closest('#signal-button');
      if (signal) {
        const signature = $('signature');
        if (!signature) return;
        const open = signature.classList.toggle('show');
        signal.setAttribute('aria-expanded', String(open));
        signal.textContent = open ? 'keep this little signal ♡' : "there's one more thing for you ♡";
      }
    });
  }

  function init() {
    startCountdown();
    startReveals();
    startProgress();
    startInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();