// Custom Cursor Effect
const cursor = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Typing Effect
const heroTitle = document.querySelector('.glitch');
const textToType = heroTitle.getAttribute('data-text') || "Daniel Korkevados";
heroTitle.textContent = ''; // Clear initial text

let charIndex = 0;
function typeText() {
    if (charIndex < textToType.length) {
        heroTitle.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 100); // Typing speed
    } else {
        // Add blinking cursor span
        const cursorSpan = document.createElement('span');
        cursorSpan.className = 'typing-cursor';
        heroTitle.appendChild(cursorSpan);
    }
}
// Start typing after a short delay
setTimeout(typeText, 500);


// Staggered Reveal Animations on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            // Check if it has an index for staggering
            const index = el.style.getPropertyValue('--i') || 0;
            const delay = index * 0.1; // 100ms delay per item
            
            el.style.transitionDelay = `${delay}s`;
            el.classList.add('visible');
            
            observer.unobserve(el); // Only animate once
        }
    });
}, observerOptions);

// Select elements to animate
const animatedElements = document.querySelectorAll(
    '.section-title, .about-grid, .project-card, .course-card, .skills-container'
);

animatedElements.forEach(el => {
    // Ensure initial state is hidden (handled in CSS but good practice)
    observer.observe(el);
});
