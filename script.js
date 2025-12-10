// ======================================
// STARFIELD BACKGROUND ANIMATION
// ======================================
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Star class
class Star {
    constructor() {
        this.reset();
    }
    
    reset() {
        // Random position
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        
        // Random size (smaller = further away)
        this.size = Math.random() * 2 + 0.5;
        
        // Speed based on size (parallax effect - bigger stars move faster)
        this.speed = this.size * 0.15;
        
        // Random direction
        this.angle = Math.random() * Math.PI * 2;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        
        // Opacity based on size
        this.opacity = Math.random() * 0.5 + 0.3;
        
        // Twinkle effect
        this.twinkleSpeed = Math.random() * 0.02 + 0.01;
        this.twinkleOffset = Math.random() * Math.PI * 2;
    }
    
    update(time) {
        // Move star
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap around screen
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        // Twinkle effect
        this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(time * this.twinkleSpeed + this.twinkleOffset));
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
        ctx.fill();
        
        // Add glow effect for larger stars
        if (this.size > 1.5) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(59, 130, 246, ${this.currentOpacity * 0.2})`;
            ctx.fill();
        }
    }
}

// Create stars
const stars = [];
const numStars = 150; // Number of stars

for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

// Add some colored accent stars
class AccentStar extends Star {
    constructor(color) {
        super();
        this.color = color;
        this.size = Math.random() * 1.5 + 1;
    }
    
    draw() {
        // Main star
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity})`;
        ctx.fill();
        
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.currentOpacity * 0.15})`;
        ctx.fill();
    }
}

// Add accent stars (blue and purple)
for (let i = 0; i < 10; i++) {
    stars.push(new AccentStar('59, 130, 246')); // Blue
}
for (let i = 0; i < 8; i++) {
    stars.push(new AccentStar('139, 92, 246')); // Purple
}

// Shooting star class
class ShootingStar {
    constructor() {
        this.reset();
        this.active = false;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height * 0.5; // Upper half
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 10 + 15;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // Diagonal
        this.opacity = 1;
        this.active = true;
    }
    
    update() {
        if (!this.active) return;
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.02;
        
        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
            this.active = false;
        }
    }
    
    draw() {
        if (!this.active) return;
        
        const tailX = this.x - Math.cos(this.angle) * this.length;
        const tailY = this.y - Math.sin(this.angle) * this.length;
        
        const gradient = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${this.opacity})`);
        
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Head glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

const shootingStar = new ShootingStar();

// Random shooting stars
setInterval(() => {
    if (!shootingStar.active && Math.random() < 0.3) {
        shootingStar.reset();
    }
}, 3000);

// Animation loop
let animationTime = 0;
function animate() {
    // Clear canvas with background color
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw stars
    animationTime++;
    stars.forEach(star => {
        star.update(animationTime);
        star.draw();
    });
    
    // Update and draw shooting star
    shootingStar.update();
    shootingStar.draw();
    
    requestAnimationFrame(animate);
}

animate();

// ======================================
// END STARFIELD
// ======================================

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
    '.section-title, .about-grid, .project-card, .course-card, .skills-container, .timeline-item, .education-header, .leadership-block, .press-link'
);

animatedElements.forEach(el => {
    // Ensure initial state is hidden (handled in CSS but good practice)
    observer.observe(el);
});

// Enhanced Parallax Effect for Floating Shapes
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            
            // Apply subtle parallax to floating shapes
            document.querySelectorAll('.floating-shape').forEach((shape, index) => {
                const speed = 0.02 + (index * 0.01);
                const yOffset = scrollY * speed;
                shape.style.transform = `translateY(${yOffset}px)`;
            });
            
            ticking = false;
        });
        ticking = true;
    }
});

// Add active class to navbar links on scroll
const sections = document.querySelectorAll('section[id]');
const navLinksItems = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinksItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNav);
highlightNav(); // Run on load
