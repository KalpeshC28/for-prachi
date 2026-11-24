(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('progress');
  const revealItems = document.querySelectorAll('.reveal');
  const stops = document.querySelectorAll('.story-stop');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));

  const stopObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
      else entry.target.classList.remove('in-view');
    });
  }, { threshold: 0.42 });
  stops.forEach((stop) => stopObserver.observe(stop));

  let ticking = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + '%';
    const parallaxImage = document.querySelector('.intro-image-wrap img');
    if (parallaxImage && !reduceMotion) {
      const rect = parallaxImage.parentElement.getBoundingClientRect();
      const shift = (rect.top / window.innerHeight) * -22;
      parallaxImage.style.transform = 'scale(1.08) translateY(' + shift + 'px)';
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { window.requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();

  const audio = document.getElementById('ourSong');
  const playButton = document.getElementById('playSong');
  const playIcon = document.getElementById('playIcon');
  const playText = document.getElementById('playText');
  const record = document.querySelector('.record');
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');

  const updateAudioUI = () => {
    const playing = audio && !audio.paused;
    if (playIcon) playIcon.textContent = playing ? 'Ⅱ' : '▶';
    if (playText) playText.textContent = playing ? 'pause our song' : 'play our song';
    if (record) record.classList.toggle('playing', Boolean(playing));
    if (soundToggle) soundToggle.setAttribute('aria-pressed', String(Boolean(playing)));
    if (soundLabel) soundLabel.textContent = playing ? 'sound on' : 'sound off';
  };
  if (playButton && audio) {
    playButton.addEventListener('click', async () => {
      if (audio.paused) {
        try { await audio.play(); } catch (error) {
          if (playText) playText.textContent = 'tap to try again';
        }
      } else audio.pause();
      updateAudioUI();
    });
    audio.addEventListener('play', updateAudioUI);
    audio.addEventListener('pause', updateAudioUI);
    audio.addEventListener('ended', updateAudioUI);
  }
  if (soundToggle && audio) {
    soundToggle.addEventListener('click', async () => {
      if (audio.paused) {
        try { await audio.play(); } catch (error) { /* browser may block playback */ }
      } else audio.pause();
      updateAudioUI();
    });
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