(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const countdownNote = $('countdown-note');
  const targetForThisYear = new Date(2026, 10, 28, 0, 0, 0);
  const birthdayToday = () => {
    const now = new Date();
    return now.getMonth() === 10 && now.getDate() === 28;
  };

  function updateCountdown() {
    const now = new Date();
    let target = new Date(now.getFullYear(), 10, 28, 0, 0, 0);
    if (now >= target) target = new Date(now.getFullYear() + 1, 10, 28, 0, 0, 0);
    if (birthdayToday()) {
      $('days').textContent = '00';
      $('hours').textContent = '00';
      $('minutes').textContent = '00';
      $('seconds').textContent = '00';
      countdownNote.textContent = 'it is our day. happy birthday to us ♡';
      return;
    }
    const remaining = Math.max(0, target - now);
    const units = {
      days: Math.floor(remaining / 86400000),
      hours: Math.floor((remaining % 86400000) / 3600000),
      minutes: Math.floor((remaining % 3600000) / 60000),
      seconds: Math.floor((remaining % 60000) / 1000)
    };
    Object.entries(units).forEach(([key, value]) => { $(key).textContent = String(value).padStart(2, '0'); });
    countdownNote.textContent = 'counting down to 28 November';
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  document.querySelectorAll('.wish-card').forEach((card) => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.wish-card').forEach((item) => item.classList.remove('active'));
      card.classList.add('active');
      const panel = $('wish-reveal');
      panel.querySelector('p').textContent = card.dataset.wish;
      panel.querySelector('span').textContent = card.querySelector('.wish-icon').textContent;
      panel.classList.add('open');
    });
  });

  const cake = document.querySelector('.cake-stage');
  const candles = $('candles');
  const blowCandles = () => {
    if (!cake || cake.classList.contains('blown')) return;
    cake.classList.add('blown');
    $('cake-instruction').textContent = 'wish made';
  };
  if (candles) {
    candles.addEventListener('click', blowCandles);
    candles.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        blowCandles();
      }
    });
  }

  const signalButton = $('signal-button');
  const signature = $('signature');
  if (signalButton && signature) {
    signalButton.addEventListener('click', () => {
      const isOpen = signature.classList.toggle('show');
      signalButton.textContent = isOpen ? 'keep this little signal ♡' : 'open your final birthday signal ♡';
    });
  }
})();