/* ============================================================
   📖 CONTROL DEL LIBRO Y ELEMENTOS DOM
============================================================ */

const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const book = document.getElementById("book");
const counter = document.getElementById("page-counter");

const music = document.getElementById("background-music");
const musicBtn = document.getElementById("music-btn");
const musicText = document.getElementById("music-text");

const welcomeScreen = document.getElementById("welcome-screen");
const startBtn = document.getElementById("start-btn");
const themeToggle = document.getElementById("theme-toggle");
const heartsContainer = document.getElementById("hearts-container");

if (music) {
    music.volume = 0.6;
}

const papers = [
    document.getElementById("p1"),
    document.getElementById("p2"),
    document.getElementById("p3"),
    document.getElementById("p4"),
    document.getElementById("p5"),
    document.getElementById("p6"),
    document.getElementById("p7"),
    document.getElementById("p8"),
    document.getElementById("p9"),
    document.getElementById("p10")
];

const TOTAL_PAGES = papers.length;
let currentLocation = 0;
let isAnimating = false;

/* =========================
   📖 PORTADA INICIAL
========================= */

function setInitialCover() {
    currentLocation = 0;
    isAnimating = false;

    papers.forEach((paper, index) => {
        if (!paper) return;

        paper.classList.remove("flipped");
        paper.style.zIndex = TOTAL_PAGES - index;
    });

    if (book) {
        book.style.transform = "translateX(0%)";
    }

    if (counter) {
        counter.textContent = `0 / ${TOTAL_PAGES}`;
    }

    if (prevBtn) {
        prevBtn.disabled = true;
    }

    if (nextBtn) {
        nextBtn.disabled = false;
    }
}

/* =========================
   🎵 MÚSICA CONTINUA
========================= */
function updateMusicUI() {
    if (!music || !musicBtn) return;
    if (!music.paused) {
        musicBtn.classList.add("playing");
        if (musicText) musicText.textContent = "Pausar";
    } else {
        musicBtn.classList.remove("playing");
        if (musicText) musicText.textContent = "Música";
    }
}

function toggleMusica() {
    if (!music) return;
    if (music.paused) {
        music.play().then(() => updateMusicUI()).catch(e => console.log(e));
    } else {
        music.pause();
        updateMusicUI();
    }
}

function asegurarMusica() {
    if (music && music.paused) {
        music.play().then(() => updateMusicUI()).catch(() => {});
    }
}
if (startBtn) {
    startBtn.addEventListener("click", () => {

        setInitialCover();

        asegurarMusica();

        if (welcomeScreen) {
            welcomeScreen.style.opacity = "0";
            welcomeScreen.style.pointerEvents = "none";

            setTimeout(() => {
                welcomeScreen.style.display = "none";
            }, 500);
        }
    });
}

if (musicBtn) {
    musicBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleMusica();
    });
}

/* =========================
   📖 CONTROL Y NAVEGACIÓN DE HOJAS
========================= */
function updatePages() {
    if (counter) {
        counter.textContent = `${currentLocation} / ${TOTAL_PAGES}`;
    }
    
    if (prevBtn) prevBtn.disabled = currentLocation === 0 || isAnimating;
    if (nextBtn) nextBtn.disabled = currentLocation === TOTAL_PAGES || isAnimating;

    papers.forEach((paper, index) => {
        if (!paper) return;
        if (index < currentLocation) {
            paper.classList.add("flipped");
            paper.style.zIndex = index + 1;
        } else {
            paper.classList.remove("flipped");
            paper.style.zIndex = TOTAL_PAGES - index;
        }
    });

    if (book) {
        if (currentLocation === 0) book.style.transform = "translateX(0%)";
        else if (currentLocation >= TOTAL_PAGES) book.style.transform = "translateX(50%)";
        else book.style.transform = "translateX(50%)";
    }
}

function finishAnimation() {
    isAnimating = false;
    updatePages();
}

function nextPage() {
    if (isAnimating || currentLocation >= TOTAL_PAGES) return;
    asegurarMusica();
    isAnimating = true;
    currentLocation++;
    updatePages();
    setTimeout(finishAnimation, 820);
}

function prevPage() {
    if (isAnimating || currentLocation <= 0) return;
    asegurarMusica();
    isAnimating = true;
    currentLocation--;
    updatePages();
    setTimeout(finishAnimation, 820);
}

if (nextBtn) nextBtn.addEventListener("click", nextPage);
if (prevBtn) prevBtn.addEventListener("click", prevPage);

// Navegación por clics directos y teclado
papers.forEach((paper, index) => {
    if (!paper) return;
    paper.addEventListener("click", (e) => {
        if (e.target.closest('.envelope') || 
            e.target.closest('.reason-heart') || 
            e.target.closest('.promise-card') || 
            e.target.closest('.interactable-photo') ||
            e.target.closest('.bucket-item') ||
            e.target.closest('.future-card') ||
            e.target.closest('.secret-element') ||
            e.target.closest('#easter-egg') ||
            e.target.closest('#final-surprise-btn') ||
            e.target.closest('.surprise-btn')) {
            return;
        }
        if (isAnimating) return;
        asegurarMusica();
        if (index === currentLocation) nextPage();
        else if (index === currentLocation - 1) prevPage();
    });
});

window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextPage();
    if (e.key === "ArrowLeft") prevPage();
});

/* =========================
   📱 SOPORTE DE GESTOS TÁCTILES (SWIPE EN MÓVIL)
========================= */
let touchStartX = 0;
let touchEndX = 0;

if (book) {
    book.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    book.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 45;
    if (touchStartX - touchEndX > swipeThreshold) {
        nextPage();
    } else if (touchEndX - touchStartX > swipeThreshold) {
        prevPage();
    }
}

/* =========================
   🌙 MODO NOCHE / DÍA
========================= */
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        themeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    });
}

/* =========================
   💕 CORAZONES FLOTANTES DE FONDO
========================= */
function createFloatingHeart() {
    if (!heartsContainer) return;
    const heart = document.createElement("div");
    heart.classList.add("floating-heart");
    
    const heartIcons = ["❤️", "💖", "🌸", "💕", "✨", "✈️", "📱"];
    heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = (Math.random() * 4 + 6) + "s";
    heart.style.fontSize = (Math.random() * 8 + 12) + "px";
    
    heartsContainer.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 9000);
}
setInterval(createFloatingHeart, 1100);

/* =========================
   💌 CARTA MÁQUINA DE ESCRIBIR (ENFOQUE DISTANCIA)
========================= */
const envelope = document.getElementById("envelope");
const typewriterText = document.getElementById("typewriter-text");
const cartaTexto = "Mi amor:\n\nAunque haya kilómetros de por medio, cada mensaje, llamada y palabra tuya me hace sentir que estás acá cerquita mío.\n\nLa distancia nos enseña el valor del tiempo y nos demuestra que lo que construimos es mucho más fuerte que cualquier mapa.\n\nGracias por elegirme todos los días. Te amo infinitamente. ❤️";
let hasTyped = false;

if (envelope) {
    envelope.addEventListener("click", (e) => {
        e.stopPropagation();
        envelope.classList.toggle("open");
        if (!hasTyped && envelope.classList.contains("open")) {
            hasTyped = true;
            let i = 0;
            typewriterText.textContent = "";
            function typeNextChar() {
                if (i < cartaTexto.length) {
                    typewriterText.textContent += cartaTexto.charAt(i);
                    i++;
                    setTimeout(typeNextChar, 35);
                }
            }
            setTimeout(typeNextChar, 400);
            for (let k = 0; k < 6; k++) setTimeout(createFloatingHeart, k * 120);
        }
    });
}

/* =========================
   📸 LIGHTBOX / AMPLIAR POLAROIDS
========================= */
const photoModal = document.getElementById("photo-modal");
const modalImg = document.getElementById("modal-img");
const modalCaption = document.getElementById("modal-caption");
const closePhotoModal = document.getElementById("close-photo-modal");

document.querySelectorAll(".interactable-photo").forEach(photo => {
    photo.addEventListener("click", (e) => {
        e.stopPropagation();
        const imgSrc = photo.getAttribute("data-img");
        const caption = photo.getAttribute("data-caption");
        if (imgSrc && photoModal) {
            modalImg.src = imgSrc;
            modalCaption.textContent = caption || "";
            photoModal.classList.add("show");
        }
    });
});

if (closePhotoModal && photoModal) {
    closePhotoModal.addEventListener("click", () => photoModal.classList.remove("show"));
}

/* =========================
   🥰 RAZONES Y PROMESAS
========================= */
document.querySelectorAll(".reason-heart").forEach(heart => {
    heart.addEventListener("click", (e) => {
        e.stopPropagation();
        const text = heart.nextElementSibling;
        if (text) text.classList.toggle("show");
    });
});

document.querySelectorAll(".promise-card").forEach(card => {
    card.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.toggle("revealed");
        createFloatingHeart();
    });
});

/* =========================
   ✈️ PLANES JUNTOS Y FUTURO (MODAL)
========================= */
const futureModal = document.getElementById("future-modal");
const futureModalIcon = document.getElementById("future-modal-icon");
const futureModalMsg = document.getElementById("future-modal-msg");
const closeFutureModal = document.getElementById("close-future-modal");

document.querySelectorAll(".future-card, .bucket-item").forEach(card => {
    card.addEventListener("click", (e) => {
        e.stopPropagation();
        const icon = card.querySelector(".future-icon, span")?.textContent || "✨";
        const msg = card.getAttribute("data-msg");
        if (futureModalIcon) futureModalIcon.textContent = icon;
        if (futureModalMsg) futureModalMsg.textContent = msg;
        if (futureModal) futureModal.classList.add("show");
    });
});

if (closeFutureModal && futureModal) {
    closeFutureModal.addEventListener("click", () => futureModal.classList.remove("show"));
}

/* =========================
   🔐 SISTEMA DE SECRETOS (PÁGINA 9)
========================= */
const foundSecrets = new Set();
const secretModal = document.getElementById("secret-modal");
const closeModal = document.getElementById("close-modal");
const easterEgg = document.getElementById("easter-egg");

document.querySelectorAll(".secret-element").forEach(el => {
    el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = el.getAttribute("data-secret");
        foundSecrets.add(`secret-${id}`);
        const badge = document.getElementById(`secret-badge-${id}`);
        if (badge) badge.classList.add("unlocked");
        for (let i = 0; i < 5; i++) setTimeout(createFloatingHeart, i * 100);
        checkAllSecrets();
    });
});

if (easterEgg) {
    easterEgg.addEventListener("click", (e) => {
        e.stopPropagation();
        foundSecrets.add("secret-4");
        const badge = document.getElementById("secret-badge-4");
        if (badge) badge.classList.add("unlocked");
        if (secretModal) secretModal.classList.add("show");
        for (let i = 0; i < 10; i++) setTimeout(createFloatingHeart, i * 100);
        checkAllSecrets();
    });
}

function checkAllSecrets() {
    if (foundSecrets.size >= 4) {
        setTimeout(() => {
            alert("✨ ¡Encontraste todos nuestros secretos ❤️! Se ha desbloqueado un rincón especial de recuerdos.");
        }, 400);
    }
}

if (closeModal && secretModal) {
    closeModal.addEventListener("click", () => secretModal.classList.remove("show"));
}

