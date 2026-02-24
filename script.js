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
const questions = [
    {
        question: "Od kad su Petra i Luka zajedno?",
        options: ["2010", "2013", "2011"],
        correctIndex: 2
    },
    {
        question: "Gdje su se upoznali?",
        options: ["Gardaland", "MIOC", "Dublin pub"],
        correctIndex: 0
    },
    {
        question: "Gdje im je bilo prvo zajedničko putovanje?",
        options: ["Ljubljana", "Pariz", "Tanzanija"],
        correctIndex: 1
    },
    {
        question: "Petra i Luka od 2016. godine volontiraju u jednoj humanitarnoj udruzi, kako se ona zove?",
        options: ["Krug ljubavi", "Kolajna ljubavi", "Zajedno za Afriku"],
        correctIndex: 1
    }
];

let currentQuestionIndex = 0;
const questionEl = document.getElementById('quiz-question');
const optionsEl = document.getElementById('quiz-options');
const feedbackEl = document.getElementById('quiz-feedback');

function loadQuestion() {
    // Reset state
    feedbackEl.innerHTML = "";
    optionsEl.innerHTML = "";
    
    if (currentQuestionIndex >= questions.length) {
        // Quiz finished
        questionEl.style.display = 'none';
        feedbackEl.innerHTML = "✨ Bravooo! Vidimo se na svadbi! ✨";
        feedbackEl.style.color = "var(--accent-gold)";
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionEl.innerText = currentQuestion.question;
    questionEl.style.display = 'block';

    currentQuestion.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'btn quiz-btn';
        btn.innerText = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsEl.appendChild(btn);
    });
}

function checkAnswer(selectedIndex, btnElement) {
    const currentQuestion = questions[currentQuestionIndex];
    
    // Disable all buttons to prevent multiple clicks
    const allBtns = optionsEl.querySelectorAll('.quiz-btn');
    allBtns.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentQuestion.correctIndex) {
        btnElement.style.background = "#4CAF50"; 
        btnElement.style.color = "white";
        feedbackEl.innerHTML = "Točno!";
        feedbackEl.style.color = "#4CAF50";
        
        // Wait 1.5 seconds then go to next question
        setTimeout(() => {
            currentQuestionIndex++;
            loadQuestion();
        }, 1500);

    } else {
        btnElement.style.background = "#ff6b6b"; 
        btnElement.style.color = "white";
        feedbackEl.innerHTML = "Razmislit ćemo ponovo jesi pozvan/a 😅";
        feedbackEl.style.color = "#ff6b6b";
        
        // Re-enable buttons to try again
        setTimeout(() => {
            allBtns.forEach(btn => btn.disabled = false);
            btnElement.style.background = ""; 
            btnElement.style.color = "";
        }, 1500);
    }
}

// Initialize quiz
document.addEventListener('DOMContentLoaded', loadQuestion);


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