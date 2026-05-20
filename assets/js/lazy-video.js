const heroVideo = document.querySelector('.hero-video video[data-src]');

function activarHeroVideo() {
    if (!heroVideo || heroVideo.dataset.loaded === 'true') return;

    const source = document.createElement('source');
    source.src = heroVideo.dataset.src;
    source.type = 'video/mp4';
    heroVideo.appendChild(source);
    heroVideo.dataset.loaded = 'true';
    heroVideo.load();

    heroVideo.play().catch(() => {
        heroVideo.controls = true;
    });
}

if (heroVideo && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ['pointerdown', 'keydown', 'scroll'].forEach(eventName => {
        window.addEventListener(eventName, activarHeroVideo, { once: true, passive: true });
    });
}
