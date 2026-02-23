gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray(".panel");
const bgContainer = document.getElementById("bg-container");

// 1. DYNAMICALLY CREATE BACKGROUND LAYERS
panels.forEach((panel, i) => {
    let bgUrl = panel.getAttribute('data-bg');
    let bgLayer = document.createElement('div');
    bgLayer.className = 'bg-layer';
    bgLayer.style.backgroundImage = `url('${bgUrl}')`;
    bgLayer.style.zIndex = i; 
    
    if (i === 0) bgLayer.style.opacity = 1; 
    
    bgContainer.appendChild(bgLayer);
    panel.bgLayer = bgLayer; 
});

// 2. CREATE THE GSAP TIMELINE
let tl = gsap.timeline({
    scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: `+=${panels.length * 1200}`, // Slightly longer for smoother fades
        scrub: 1, 
        pin: true,
        pinSpacing: true,
        anticipatePin: 1
    }
});

// 3. ANIMATE PANELS (WITH FADE IN AND FADE OUT)
panels.forEach((panel, i) => {
    
    // --- FADE IN PHASE ---
    if (i !== 0) {
        // Fade background and content IN
        tl.to(panel.bgLayer, { opacity: 1, duration: 1, ease: "power2.inOut" }, ">-0.5");
        tl.to(panel, { opacity: 1, visibility: "visible", duration: 1, ease: "power2.inOut" }, "<");
    }
    
    // --- HOLD PHASE (Reading time) ---
    tl.to({}, { duration: 1.5 }); 
    
    // --- FADE OUT PHASE ---
    // We fade out every panel EXCEPT the last one (so it stays visible as you scroll to details)
    if (i !== panels.length - 1) {
        tl.to(panel, { 
            opacity: 0, 
            visibility: "hidden", 
            duration: 1, 
            ease: "power2.inOut" 
        });
        tl.to(panel.bgLayer, { 
            opacity: 0, 
            duration: 1, 
            ease: "power2.inOut" 
        }, "<"); // "<" means start at the same time as the panel fade
    }
});

// QUIZ LOGIC
function quizAnswer(isCorrect, btnElement) {
    const feedback = document.getElementById('quiz-feedback');
    document.querySelectorAll('.quiz-btn').forEach(btn => {
        btn.style.background = '';
        btn.style.color = '';
    });

    if(isCorrect) {
        feedback.innerHTML = "✨ Bravooo! Vidimo se na svadbi! ✨";
        feedback.style.color = "var(--accent-gold)";
        btnElement.style.background = "#4CAF50"; 
        btnElement.style.color = "white";
    } else {
        feedback.innerHTML = "Zar nas toliko slabo poznaješ? Pokušaj ponovno!";
        feedback.style.color = "#ff6b6b"; 
        btnElement.style.background = "#ff6b6b"; 
        btnElement.style.color = "white";
    }
}

// MUSIC LOGIC
const music = document.getElementById('bg-music');
const musicText = document.getElementById('music-text');
const musicBtn = document.querySelector('.music-control');

function toggleMusic() {
    if (music.paused) {
        music.play();
        musicText.innerText = "Stani Blaž!";
        musicBtn.classList.remove('pulse');
    } else {
        music.pause();
        musicText.innerText = "Vužgi ga Blaž!";
    }
}

function scrollToDetails() {
    document.getElementById('details').scrollIntoView({ behavior: 'smooth' });
}

// --- Timeline Animations ---
gsap.to(".timeline-line-progress", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: ".timeline-container",
        start: "top 70%",
        end: "bottom 70%",
        scrub: true
    }
});

const items = gsap.utils.toArray(".timeline-item");
items.forEach((item) => {
    gsap.to(item, {
        opacity: 1,
        y: -20,
        duration: 1,
        scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

// --- LOGISTICS SECTIONS BACKGROUNDS ---
const logisticsSections = gsap.utils.toArray(".logistics-section");

logisticsSections.forEach((section, i) => {
    let bgUrl = section.getAttribute('data-bg');
    if (bgUrl) {
        // Create background layer
        let bgLayer = document.createElement('div');
        bgLayer.className = 'bg-layer';
        bgLayer.style.backgroundImage = `url('${bgUrl}')`;
        
        // Ensure these are ON TOP of the previous layers
        // The panels.length gives us the count of previous layers (0-index based)
        // So start z-index from panels.length + 10 to be safe
        bgLayer.style.zIndex = panels.length + 10 + i; 
        bgLayer.style.opacity = 0; // Hidden by default
        
        bgContainer.appendChild(bgLayer);
        
        // Create ScrollTrigger to fade in/out
        ScrollTrigger.create({
            trigger: section,
            start: "top center", 
            end: "bottom center",
            onEnter: () => gsap.to(bgLayer, { opacity: 1, duration: 0.5 }),
            onLeave: () => gsap.to(bgLayer, { opacity: 0, duration: 0.5 }),
            onEnterBack: () => gsap.to(bgLayer, { opacity: 1, duration: 0.5 }),
            onLeaveBack: () => gsap.to(bgLayer, { opacity: 0, duration: 0.5 })
        });
    }
});