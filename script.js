(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (id) => document.getElementById(id);

  function startBirthdayMode() {
    // Use India Standard Time so the surprise begins on 28 November in India.
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata', day: '2-digit', month: '2-digit'
    }).formatToParts(new Date());
    const day = parts.find(part => part.type === 'day')?.value;
    const month = parts.find(part => part.type === 'month')?.value;
    const previewMode = new URLSearchParams(window.location.search).get('birthday-preview') === '1';
    if (!previewMode && (day !== '28' || month !== '11')) return;

    const greeting = $('birthday-greeting');
    if (!greeting) return;
    greeting.classList.add('show');
    greeting.setAttribute('aria-hidden', 'false');
    document.body.classList.add('birthday-mode');
    const enter = $('enter-birthday');
    if (enter) enter.addEventListener('click', () => {
      greeting.classList.remove('show');
      greeting.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('birthday-mode');
    });
  }

  function startCountdown() {
    const note = $('countdown-note');
    if (!note) return;
    const update = () => {
      const now = new Date();
      const birthday = new Date(now.getFullYear(), 10, 28, 0, 0, 0);
      const isBirthday = now.getMonth() === 10 && now.getDate() === 28;
      const target = now < birthday ? birthday : new Date(now.getFullYear() + 1, 10, 28, 0, 0, 0);
      const left = isBirthday ? 0 : Math.max(0, target.getTime() - now.getTime());
      const values = {days:Math.floor(left/86400000),hours:Math.floor(left%86400000/3600000),minutes:Math.floor(left%3600000/60000),seconds:Math.floor(left%60000/1000)};
      Object.entries(values).forEach(([id,value]) => { const node=$(id); if(node) node.textContent=String(value).padStart(2,'0'); });
      note.textContent = isBirthday ? "it's our day. happy birthday to us ♡" : 'counting down to 28 November';
    };
    update();
    window.setInterval(update,1000);
  }

  function startReveals() {
    const items=document.querySelectorAll('.reveal');
    if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){items.forEach(item=>item.classList.add('visible'));return;}
    const observer=new IntersectionObserver((entries,current)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');current.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -35px 0px'});
    items.forEach(item=>observer.observe(item));
  }

  function startProgress() {
    const bar=$('reading-progress');if(!bar)return;
    let queued=false;
    const update=()=>{const max=document.documentElement.scrollHeight-window.innerHeight;bar.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+'%';queued=false;};
    window.addEventListener('scroll',()=>{if(!queued){queued=true;window.requestAnimationFrame(update);}},{passive:true});update();
  }

  function startInteractions() {
    document.addEventListener('click',event=>{
      const wish=event.target.closest('.wish-card');
      if(wish){
        document.querySelectorAll('.wish-card').forEach(card=>{const active=card===wish;card.classList.toggle('active',active);card.setAttribute('aria-pressed',String(active));});
        const panel=$('wish-reveal'),paragraph=panel&&panel.querySelector('p'),icon=panel&&panel.querySelector('span'),wishIcon=wish.querySelector('.wish-icon');
        if(paragraph)paragraph.textContent=wish.dataset.wish||'';if(icon)icon.textContent=wishIcon?wishIcon.textContent:'✦';if(panel)panel.classList.add('open');return;
      }
      if(event.target.closest('#candles')){
        const stage=document.querySelector('.cake-stage'),button=$('candles');
        if(stage&&!stage.classList.contains('blown')){
          stage.classList.add('blown');
          if(button)button.setAttribute('aria-pressed','true');
          const instruction=$('cake-instruction'),done=$('cake-done');
          if(instruction)instruction.textContent='wish made';
          if(done)done.textContent='✨ your wish is on its way ✨';
          const burst=document.createElement('div');
          burst.className='cake-confetti';
          burst.setAttribute('aria-hidden','true');
          for(let i=0;i<28;i++){
            const piece=document.createElement('span');
            piece.textContent=i%3===0?'✦':(i%3===1?'✧':'•');
            piece.style.setProperty('--x',((i*37)%100)+'%');
            piece.style.setProperty('--delay',((i%7)*0.045)+'s');
            piece.style.setProperty('--drift',(((i*17)%120)-60)+'px');
            burst.appendChild(piece);
          }
          stage.appendChild(burst);
          window.setTimeout(()=>{
            const finalSection=$('final');
            if(finalSection)finalSection.scrollIntoView({behavior:'smooth',block:'start'});
          },1900);
        }
        return;
      }
      const signal=event.target.closest('#signal-button');
      if(signal){const signature=$('signature');if(!signature)return;const open=signature.classList.toggle('show');signal.setAttribute('aria-expanded',String(open));signal.textContent=open?'keep this little signal ♡':"there's one more thing for you ♡";}
    });
  }

  function init(){startBirthdayMode();startCountdown();startReveals();startProgress();startInteractions();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();