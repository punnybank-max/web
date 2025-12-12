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
        document.querySelectorAll('.cloud, .pixelHorde, .cloud-emoji, .shotBox').forEach(el=>{
            el.style.animation = 'none';
            el.style.transition = 'none';
        });
    }
})();