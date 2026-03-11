// Content Details
const TEXT_HEADING = "Happy Birthday Manoj Prabahar 🎉";
const TEXT_SUBTITLE = "Celebrating an amazing day – 27 March 2026.";

// Initialization
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        startTypingEffect();
        initGallery();
    }, 2000); // 2 second digital glitch loader
});

// Dynamic Mouse Tracking
let mouse = { x: -1000, y: -1000 };
let isMouseMoving = false;
let mouseStopTimeout;

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    isMouseMoving = true;
    createMouseSpark(e.clientX, e.clientY);

    clearTimeout(mouseStopTimeout);
    mouseStopTimeout = setTimeout(() => {
        isMouseMoving = false;
    }, 100);
});

window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// 1. Matrix Rain Animation with Layers
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$+-*/=%""\'#&_(),.;:?!\\|{}<>[]^~ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ';

// Create 3 layers for depth parity
const layers = [
    { fontSize: 24, speed: 2.0, opacity: 1.0, drops: [] },    // Foreground: Fast & Bright
    { fontSize: 16, speed: 1.2, opacity: 0.6, drops: [] },    // Midground: Normal
    { fontSize: 10, speed: 0.6, opacity: 0.3, drops: [] }     // Background: Slow & Dim
];

function initMatrix() {
    layers.forEach(layer => {
        const columns = Math.ceil(canvas.width / layer.fontSize);
        layer.drops = [];
        for (let x = 0; x < columns; x++) {
            // Random start height to stagger initial drop
            layer.drops[x] = Math.random() * -100;
        }
    });
}
initMatrix();
window.addEventListener('resize', initMatrix);

function drawMatrix() {
    // Faint black background overlay to create trailing effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    layers.forEach(layer => {
        ctx.font = layer.fontSize + 'px monospace';

        for (let i = 0; i < layer.drops.length; i++) {
            const text = letters.charAt(Math.floor(Math.random() * letters.length));
            const x = i * layer.fontSize;
            const y = layer.drops[i] * layer.fontSize;

            // Distance from matrix character to mouse
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Interaction: if near mouse, character brightens up to white
            if (dist < 120 && isMouseMoving) {
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#0f0';
            } else {
                ctx.fillStyle = `rgba(0, 255, 0, ${layer.opacity})`;
                ctx.shadowBlur = 0;

                // Randomly highlight the "leading" character in the trail
                if (Math.random() > 0.95) {
                    ctx.fillStyle = `rgba(150, 255, 150, ${layer.opacity + 0.3})`;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#0f0';
                }
            }

            ctx.fillText(text, x, y);

            // Reset shadow to avoid bleed
            ctx.shadowBlur = 0;

            // Send drop back to top randomly after it crosses screen
            if (y > canvas.height && Math.random() > 0.98) {
                layer.drops[i] = 0;
            }
            layer.drops[i] += layer.speed;
        }
    });
    requestAnimationFrame(drawMatrix);
}
drawMatrix();

// 2. Extra Visuals: Floating Particles & Mouse Trails
const pCanvas = document.getElementById('particlesCanvas');
const pCtx = pCanvas.getContext('2d');

function resizePCanvas() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizePCanvas();
window.addEventListener('resize', resizePCanvas);

const backgroundParticles = [];
const mouseSparks = [];

class BackgroundParticle {
    constructor() {
        this.x = Math.random() * pCanvas.width;
        this.y = Math.random() * pCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * -1 - 0.2; // Float slowly upwards
        this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > pCanvas.width) this.x = 0;
        if (this.x < 0) this.x = pCanvas.width;
        if (this.y < 0) this.y = pCanvas.height;
    }
    draw() {
        pCtx.fillStyle = `rgba(0, 255, 0, ${this.opacity})`;
        pCtx.shadowBlur = 5;
        pCtx.shadowColor = '#0f0';
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.shadowBlur = 0;
    }
}

class MouseSpark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 4 - 2;
        this.speedY = Math.random() * 4 - 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.05 + 0.02;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.9; // Shrink
    }
    draw() {
        pCtx.fillStyle = `rgba(150, 255, 150, ${this.life})`;
        pCtx.shadowBlur = 10;
        pCtx.shadowColor = '#0f0';
        pCtx.beginPath();
        pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        pCtx.fill();
        pCtx.shadowBlur = 0;
    }
}

// Generate init background glowing particles
for (let i = 0; i < 40; i++) {
    backgroundParticles.push(new BackgroundParticle());
}

function createMouseSpark(x, y) {
    if (Math.random() > 0.4) { // Limit spark amount
        mouseSparks.push(new MouseSpark(x, y));
    }
}

function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    // BG Particles
    for (let i = 0; i < backgroundParticles.length; i++) {
        backgroundParticles[i].update();
        backgroundParticles[i].draw();
    }

    // Spark Trails
    for (let i = mouseSparks.length - 1; i >= 0; i--) {
        mouseSparks[i].update();
        mouseSparks[i].draw();
        if (mouseSparks[i].life <= 0) {
            mouseSparks.splice(i, 1);
        }
    }

    requestAnimationFrame(drawParticles);
}
drawParticles();

// 3. Typing Effect for Message & Subtitle
const typingElement = document.getElementById('typingText');
const subtitleElement = document.getElementById('subtitleText');
let typingIndex = 0;

function startTypingEffect() {
    typingElement.textContent = "";

    function typeChar() {
        if (typingIndex < TEXT_HEADING.length) {
            const currentString = TEXT_HEADING.substring(0, typingIndex + 1);
            typingElement.textContent = currentString;
            typingElement.setAttribute('data-text', currentString); // For glitch

            // Update Cursor
            let cursor = typingElement.querySelector('.typing-cursor');
            if (!cursor) {
                cursor = document.createElement("span");
                cursor.className = "typing-cursor";
                typingElement.appendChild(cursor);
            }

            const typingSpeed = Math.random() * 60 + 20; // Type fast
            typingIndex++;
            setTimeout(typeChar, typingSpeed);
        } else {
            // Typing done
            typingElement.innerHTML = TEXT_HEADING + '<span class="typing-cursor"></span>';
            typingElement.setAttribute('data-text', TEXT_HEADING);

            // Fade in Subtitle
            setTimeout(() => {
                subtitleElement.style.opacity = '1';
                subtitleElement.textContent = TEXT_SUBTITLE;
                subtitleElement.setAttribute('data-text', TEXT_SUBTITLE);
                createConfetti(); // Trigger burst
            }, 600);
        }
    }
    setTimeout(typeChar, 500);
}

// 4. Background Music with Smooth Fade-in
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon = document.getElementById('musicIcon');
const volumeSlider = document.getElementById('volumeSlider');
let isPlaying = false;
let audioFadeInterval;

bgMusic.volume = 0; // Starts silent

function updateIcon() {
    musicIcon.textContent = isPlaying ? '⏸' : '▶';
}

function fadeAudioIn() {
    if (isPlaying) return;

    bgMusic.play().then(() => {
        isPlaying = true;
        updateIcon();

        clearInterval(audioFadeInterval);
        const targetVolume = parseFloat(volumeSlider.value);
        let vol = bgMusic.volume;

        audioFadeInterval = setInterval(() => {
            if (vol < targetVolume) {
                vol = Math.min(vol + 0.05, targetVolume);
                bgMusic.volume = vol;
            } else {
                clearInterval(audioFadeInterval);
            }
        }, 150);
    }).catch(e => console.log('Audio error:', e));
}

function toggleAudio() {
    if (isPlaying) {
        clearInterval(audioFadeInterval);
        bgMusic.pause();
        isPlaying = false;
        updateIcon();
    } else {
        fadeAudioIn();
    }
}

musicToggle.addEventListener('click', toggleAudio);

volumeSlider.addEventListener('input', (e) => {
    bgMusic.volume = e.target.value;
    if (!isPlaying && e.target.value > 0) {
        fadeAudioIn();
    }
});

// Autoplay after initial interaction
document.body.addEventListener('click', function firstInteraction(e) {
    if (!isPlaying && e.target.id !== 'musicToggle' && e.target.id !== 'volumeSlider') {
        fadeAudioIn();
    }
    document.body.removeEventListener('click', firstInteraction);
}, { once: true });


// 5. Memory Gallery & Lightbox slideshow
let autoSlideInterval = null;
const images = document.querySelectorAll('.gallery-img');
let slideshowActive = false;
let slideIndex = 0;

function initGallery() {
    // Scroll reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    images.forEach((img, idx) => {
        img.dataset.index = idx;
        observer.observe(img);

        img.addEventListener('click', () => {
            // Stop slide when manually opening
            if (slideshowActive) stopSlideshow();
            openLightbox(idx);
        });
    });

    const autoSlideBtn = document.getElementById('autoSlideBtn');
    autoSlideBtn.addEventListener('click', () => {
        if (slideshowActive) {
            stopSlideshow();
        } else {
            startSlideshow();
        }
    });
}

function startSlideshow() {
    slideshowActive = true;
    document.getElementById('autoSlideBtn').textContent = 'Stop Slideshow';

    openLightbox(0); // Start at first
    autoSlideInterval = setInterval(() => {
        slideIndex = (slideIndex + 1) % images.length;
        lightboxImg.src = images[slideIndex].src;
    }, 3000); // 3 seconds per image
}

function stopSlideshow() {
    slideshowActive = false;
    document.getElementById('autoSlideBtn').textContent = 'Start Slideshow';
    clearInterval(autoSlideInterval);
    autoSlideInterval = null;
}

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.querySelector('.close-lightbox');

function openLightbox(index) {
    slideIndex = index;
    lightbox.style.display = 'block';
    lightboxImg.src = images[slideIndex].src;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    if (slideshowActive) stopSlideshow();
}

closeBtn.onclick = closeLightbox;
window.onclick = function (e) {
    if (e.target == lightbox) {
        closeLightbox();
    }
}

// 6. Confetti or spark animation on page load (Burst from Name Area)
function createConfetti() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < 90; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        const size = (Math.random() * 6 + 3);
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
        confetti.style.backgroundColor = Math.random() > 0.3 ? '#0f0' : '#fff';

        // Burst origin near middle screen
        confetti.style.left = (w / 2) + ((Math.random() - 0.5) * 50) + 'px';
        confetti.style.top = (h / 3) + 'px';

        confetti.style.zIndex = '999';
        confetti.style.boxShadow = '0 0 10px #0f0';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const duration = Math.random() * 2 + 1;

        // Explode outward
        confetti.animate([
            { transform: `translate3d(0,0,0) rotate(0deg) scale(1)`, opacity: 1 },
            { transform: `translate3d(${(Math.random() - 0.5) * w}px, ${(Math.random() - 0.5) * h + 300}px, 0) rotate(${Math.random() * 720}deg) scale(0)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(.17,.89,.32,1.28)',
            fill: 'forwards'
        });

        setTimeout(() => confetti.remove(), duration * 1000);
    }
}
