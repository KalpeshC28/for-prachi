(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('progress');
  const revealItems = document.querySelectorAll('.reveal');
  const audio = document.getElementById('ourSong');
  const playButton = document.getElementById('playSong');
  const playIcon = document.getElementById('playIcon');
  const playText = document.getElementById('playText');
  const record = document.querySelector('.record');
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');

  // Reveal each element once. No observers are kept running for completed sections.
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px 40px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  // Keep scroll work to one tiny progress-bar update per animation frame.
  let scrollQueued = false;
  const updateProgress = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const amount = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
    if (progress) progress.style.transform = 'scaleX(' + amount + ')';
    scrollQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateProgress);
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // Defer image decoding until needed; never force eager downloads.
  document.querySelectorAll('img').forEach((img) => {
    if (!img.hasAttribute('decoding')) img.decoding = 'async';
  });

  const updateAudioUI = () => {
    const playing = Boolean(audio && !audio.paused);
    if (playIcon) playIcon.textContent = playing ? 'Ⅱ' : '▶';
    if (playText) playText.textContent = playing ? 'pause our song' : 'play our song';
    if (record) record.classList.toggle('playing', playing);
    if (soundToggle) soundToggle.setAttribute('aria-pressed', String(playing));
    if (soundLabel) soundLabel.textContent = playing ? 'sound on' : 'sound off';
  };

  const toggleAudio = async () => {
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch (error) {
        if (playText) playText.textContent = 'tap to try again';
      }
    } else {
      audio.pause();
    }
    updateAudioUI();
  };

  if (playButton && audio) playButton.addEventListener('click', toggleAudio);
  if (soundToggle && audio) soundToggle.addEventListener('click', toggleAudio);
  if (audio) {
    audio.addEventListener('play', updateAudioUI);
    audio.addEventListener('pause', updateAudioUI);
    audio.addEventListener('ended', updateAudioUI);
  }

  const lastButton = document.getElementById('lastButton');
  const lastMessage = document.getElementById('lastMessage');
  if (lastButton && lastMessage) {
    lastButton.addEventListener('click', () => {
      const opened = lastMessage.classList.toggle('show');
      lastButton.textContent = opened ? 'keep this little promise ♡' : "there's one more thing ♡";
    });
  }
})();