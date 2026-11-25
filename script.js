(() => {
  'use strict';

  const byId = (id) => document.getElementById(id);

  function initCountdown() {
    const note = byId('countdown-note');
    if (!note) return;
    function update() {
      const now = new Date();
      const today = new Date(now.getFullYear(), 10, 28);
      const isBirthday = now.getMonth() === 10 && now.getDate() === 28;
      const target = now < today ? today : new Date(now.getFullYear() + 1, 10, 28);
      const left = isBirthday ? 0 : Math.max(0, target - now);
      const values = {
        days: Math.floor(left / 86400000),
        hours: Math.floor((left % 86400000) / 3600000),
        minutes: Math.floor((left % 3600000) / 60000),
        seconds: Math.floor((left % 60000) / 1000)
      };
      Object.entries(values).forEach(([id, value]) => {
        const node = byId(id);
        if (node) node.textContent = String(value).padStart(2, '0');
      });
      note.textContent = isBirthday ? 'it is our day. happy birthday to us ♡' : 'counting down to 28 November';
    }
    update();
    window.setInterval(update, 1000);
  }

  function initInteractions() {
    // One delegated click handler keeps every interaction reliable on mobile.
    document.addEventListener('click', (event) => {
      const wish = event.target.closest('.wish-card');
      if (wish) {
        document.querySelectorAll('.wish-card').forEach((card) => card.classList.toggle('active', card === wish));
        const panel = byId('wish-reveal');
        const text = panel && panel.querySelector('p');
        const icon = panel && panel.querySelector('span');
        if (text) text.textContent = wish.dataset.wish || '';
        if (icon) {
          const wishIcon = wish.querySelector('.wish-icon');
          icon.textContent = wishIcon ? wishIcon.textContent : '✦';
        }
        if (panel) panel.classList.add('open');
        return;
      }

      if (event.target.closest('#candles')) {
        const stage = document.querySelector('.cake-stage');
        if (stage && !stage.classList.contains('blown')) {
          stage.classList.add('blown');
          const instruction = byId('cake-instruction');
          if (instruction) instruction.textContent = 'wish made';
        }
        return;
      }

      const signal = event.target.closest('#signal-button');
      if (signal) {
        const signature = byId('signature');
        if (!signature) return;
        const open = signature.classList.toggle('show');
        signal.textContent = open ? 'keep this little signal ♡' : "there's one more thing for you ♡";
      }
    });

    const candles = byId('candles');
    if (candles) {
      candles.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          candles.click();
        }
      });
    }
  }

  function start() {
    initCountdown();
    initInteractions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();