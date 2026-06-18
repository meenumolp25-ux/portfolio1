// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavbar();
    initMobileNav();
    initScrollReveal();
    initCounters();
    initParticles();
    initContactForm();
    initSmoothScroll();
    initScrollProgress();
    initMouseTracking();
});

// ===== THEME TOGGLE =====
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    
    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    toggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

// ===== NAVBAR SCROLL EFFECT =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    // Check initial scroll position (especially important for subpages where navbar starts as .scrolled)
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    }

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // If it's a subpage with .scrolled initially, only remove it if we go back to the very top.
        // Or, more simply, just re-apply the logic: > 50 adds it, < 50 removes it.
        // This makes sure it behaves consistently.
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            // For subpages where we might want it always dark, you could check for a specific class like 'navbar-always-dark'
            // but for this design, getting slightly transparent at the very top is fine.
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== MOBILE NAVIGATION =====
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
        document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !links.contains(e.target)) {
            toggle.classList.remove('active');
            links.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ===== SMOOTH SCROLL =====
// Only smooth scroll if the target is an anchor on the current page.
function initSmoothScroll() {
    document.querySelectorAll('a[href*="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Check if it's an anchor link on the *same* page
            // e.g., "#contact" or "about.html#contact" if we are already on about.html
            const isLocalAnchor = href.startsWith('#') || 
                (href.includes(window.location.pathname.split('/').pop()) && href.includes('#'));

            if (isLocalAnchor) {
                const targetId = href.substring(href.indexOf('#'));
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    
    // Handle scrolling to hash on page load (if navigated from another page)
    if (window.location.hash) {
        setTimeout(() => {
            const target = document.querySelector(window.location.hash);
            if(target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 100);
    }
}


// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    // Add reveal class to animatable elements
    const revealSelectors = [
        '.vikas-card',
        '.vikas-hero-card',
        '.vikas-impact',
        '.about-image-card',
        '.about-content-col',
        '.highlight-item',
        '.contact-card',
        '.contact-form',
        '.impact-item',
        '.role-card',
        '.timeline-item',
        '.page-nav-card'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, index) => {
            el.classList.add('reveal');
            // Stagger animations slightly based on DOM order for elements of the same type nearby
            el.style.transitionDelay = `${(index % 4) * 0.1}s`; 
        });
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ===== ANIMATED COUNTERS =====
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.round(easedProgress * target);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===== FLOATING PARTICLES (HERO ONLY) =====
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;
    const colors = [
        'hsla(260, 67%, 55%, 0.3)',
        'hsla(25, 95%, 55%, 0.2)',
        'hsla(260, 67%, 70%, 0.15)',
        'hsla(200, 80%, 60%, 0.15)'
    ];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const delay = Math.random() * 15;
        const duration = Math.random() * 15 + 10;

        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            background: color,
            borderRadius: '50%',
            left: `${left}%`,
            bottom: '-10px',
            animation: `particleFloat ${duration}s ${delay}s linear infinite`,
            pointerEvents: 'none',
            filter: `blur(${size > 4 ? 1 : 0}px)`
        });

        container.appendChild(particle);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Disable button and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span>Sending...</span>
            <svg width="20" height="20" viewBox="0 0 24 24" class="spin">
                <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="30 70" stroke-linecap="round"/>
            </svg>
        `;
        submitBtn.style.opacity = '0.7';

        // Simulate form submission
        setTimeout(() => {
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <span>Send Message</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
            `;
            submitBtn.style.opacity = '1';

            success.classList.add('show');

            setTimeout(() => {
                success.classList.remove('show');
            }, 5000);
        }, 1500);
    });

    // Floating label effect on focus
    form.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('focus', () => {
            field.parentElement.classList.add('focused');
        });
        field.addEventListener('blur', () => {
            field.parentElement.classList.remove('focused');
        });
    });
}

// ===== SPIN ANIMATION for loading =====
if(!document.getElementById('spin-style')) {
    const style = document.createElement('style');
    style.id = 'spin-style';
    style.textContent = `
        .spin {
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
    let progressBar = document.getElementById('scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'scroll-progress';
        document.body.prepend(progressBar);
    }
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// ===== MOUSE TRACKING GLOW EFFECT =====
function initMouseTracking() {
    document.addEventListener('mousemove', e => {
        const cards = document.querySelectorAll('.bento-card');
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });
}
