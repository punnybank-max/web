/* -------------------------
   Shots grid auto-advance & manual controls (old grid style with preview highlight)
   ------------------------- */
(function(){
    const boxes = Array.from(document.querySelectorAll('.shotBox'));
    const prevBtn = document.getElementById('prevShot');
    const nextBtn = document.getElementById('nextShot');
    const container = document.getElementById('shotsContainer');
    let idx = 0;
    const total = boxes.length;
    const INTERVAL_MS = 3500;
    let timer = null;

    function setHighlight(i){
        idx = (i + total) % total;
        boxes.forEach((b, j) => b.classList.toggle('highlight', j === idx));
    }

    function next(){ setHighlight(idx + 1); }
    function prev(){ setHighlight(idx - 1); }

    nextBtn.addEventListener('click', ()=> { next(); resetTimer(); });
    prevBtn.addEventListener('click', ()=> { prev(); resetTimer(); });

    function startTimer(){
        stopTimer();
        timer = setInterval(()=> next(), INTERVAL_MS);
    }
    function stopTimer(){ if(timer){ clearInterval(timer); timer = null; } }
    function resetTimer(){ startTimer(); }

    container.addEventListener('mouseenter', ()=> stopTimer());
    container.addEventListener('mouseleave', ()=> startTimer());

    setHighlight(0);
    startTimer();

    // Respect prefers-reduced-motion: don't auto-advance if user prefers reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(mq.matches) stopTimer();
})();

/* -------------------------
   Accessibility: if prefers-reduced-motion, disable animations via inline styles (extra safety)
   ------------------------- */
(function(){
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(mq.matches){
        document.querySelectorAll('.cloud, .pixelHorde, .shotBox').forEach(el=>{
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
})();

/* -------------------------
   Title VFX: random glitch bursts and hover shake boosts
   ------------------------- */
(function(){
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if(mq.matches) return; // respect user preference

    const superEl = document.querySelector('.title .super.glitch');
    const hordeEl = document.querySelector('.title .horde.pixel');
    if(!superEl && !hordeEl) return;

    // Super (red) — fast, frequent glitch bursts
    if(superEl){
        function triggerSuper(){
            superEl.classList.add('glitch-on');
            setTimeout(()=> superEl.classList.remove('glitch-on'), 160);
            if(Math.random() < 0.35){
                setTimeout(()=> superEl.classList.add('glitch-on'), 90);
                setTimeout(()=> superEl.classList.remove('glitch-on'), 260);
            }
            // brief dramatic boost and sparks
            superEl.classList.add('drama');
            setTimeout(()=> superEl.classList.remove('drama'), 220);
            spawnSparks(superEl, 5);
        }
        function scheduleSuper(){
            const delay = 600 + Math.random()*600; // 0.6 - 1.2s
            setTimeout(()=>{ triggerSuper(); scheduleSuper(); }, delay);
        }
        scheduleSuper();

        function boostSuper(){
            superEl.classList.remove('glitch-on'); void superEl.offsetWidth; superEl.classList.add('glitch-on');
            // stronger visual feedback on hover/tap
            superEl.classList.add('drama');
            setTimeout(()=> superEl.classList.remove('drama'), 260);
            spawnSparks(superEl, 10);
        }
        superEl.addEventListener('mouseenter', boostSuper);
        superEl.addEventListener('touchstart', boostSuper, {passive:true});
    }

    // Spark helper: spawn small particles around element
    function spawnSparks(el, count){
        if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = el.getBoundingClientRect();
        for(let i=0;i<count;i++){
            const s = document.createElement('span');
            s.className = 'spark';
            const size = 6 + Math.round(Math.random()*8);
            s.style.width = size + 'px'; s.style.height = size + 'px';
            // spawn position roughly within element
            const x = rect.left + (Math.random()*rect.width);
            const y = rect.top + (Math.random()*rect.height);
            // random direction/velocity
            const dx = (Math.random()*80 - 40) + (Math.random()*40);
            const dy = -20 - Math.random()*80;
            s.style.left = Math.round(x) + 'px';
            s.style.top = Math.round(y) + 'px';
            s.style.setProperty('--dx', Math.round(dx) + 'px');
            s.style.setProperty('--dy', Math.round(dy) + 'px');
            document.body.appendChild(s);
            // remove after animation finishes
            s.addEventListener('animationend', ()=> s.remove());
        }
    }

    // Horde (yellow) — pixel flicker + short jitter, slightly less frequent
    if(hordeEl){
        function triggerHorde(){
            hordeEl.classList.add('flicker-on');
            hordeEl.style.animation = 'horde-flicker 600ms steps(2, end)';
            hordeEl.style.animationIterationCount = 3;
            hordeEl.style.animationPlayState = 'running';
            hordeEl.style.willChange = 'transform, opacity';
            hordeEl.style.transform = 'translateY(-1px)';
            setTimeout(()=>{
                hordeEl.style.transform = '';
                hordeEl.style.animation = '';
                hordeEl.classList.remove('flicker-on');
            }, 700);
            // quick jitter
            hordeEl.style.animation = 'horde-jitter 240ms steps(1)';
            setTimeout(()=> hordeEl.style.animation = '', 260);
            // brief drama + occasional yellow glitch
            hordeEl.classList.add('drama');
            setTimeout(()=> hordeEl.classList.remove('drama'), 420);
            if(Math.random() < 0.5){
                hordeEl.classList.add('glitch-on');
                setTimeout(()=> hordeEl.classList.remove('glitch-on'), 140);
            }
        }
        function scheduleHorde(){
            const delay = 900 + Math.random()*1800; // 0.9 - 2.7s
            setTimeout(()=>{ triggerHorde(); scheduleHorde(); }, delay);
        }
        scheduleHorde();

        function boostHorde(){
            triggerHorde();
        }
        hordeEl.addEventListener('mouseenter', boostHorde);
        hordeEl.addEventListener('touchstart', boostHorde, {passive:true});
    }

    // spawnFire removed per user request (no fire VFX)
})();