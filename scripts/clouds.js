/* Generate randomized clouds (no emojis) */
(function(){
    function rand(min,max){ return Math.random()*(max-min)+min; }
    // emoji set removed — not used

    // Remove any existing static clouds so we can regenerate
    document.querySelectorAll('.cloud').forEach(c=>c.remove());

    const cloudCount = Math.floor(rand(4,7));
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    for(let i=0;i<cloudCount;i++){
        const depthIdx = Math.floor(rand(0,3));
        const cls = ['c1','c2','c3'][depthIdx];
        const el = document.createElement('div');
        el.className = 'cloud ' + cls;

        // Position & sizing
        el.style.top = Math.floor(rand(140,360)) + 'px';
        el.style.width = Math.floor(rand(120,260)) + 'px';
        el.style.height = Math.floor(rand(40,80)) + 'px';
        el.style.opacity = (0.78 + Math.random()*0.22).toFixed(2);
        el.style.transform = 'scale(' + (rand(0.85,1.15)).toFixed(2) + ')';

        // Animation timing (vary per depth). Start with a negative delay
        // so clouds are already partway across the screen on load.
        const baseDur = cls === 'c1' ? 48 : cls === 'c2' ? 72 : 36;
        const dur = baseDur + rand(-12,12);
        el.style.animationDuration = dur.toFixed(2) + 's';
        // negative delay makes the animation appear already in progress
        const initialProgress = rand(0, Math.max(0.5, dur));
        el.style.animationDelay = (-initialProgress).toFixed(2) + 's';

        // Emoji generation removed — clouds are visual only

        document.body.appendChild(el);
    }
})();