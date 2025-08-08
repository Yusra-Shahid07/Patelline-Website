// home.js
document.addEventListener('DOMContentLoaded', function () {
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// home.js
window.addEventListener('scroll', function () {
  const btn = document.getElementById('backToTop');
  if (window.scrollY > 300) {
    btn.style.display = 'block';
  } else {
    btn.style.display = 'none';
  }
});

document.querySelector('.subscribe button').addEventListener('click', function () {
  const email = document.querySelector('.subscribe input').value;
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!pattern.test(email)) {
    alert('Please enter a valid email address.');
  } else {
    alert('Subscribed!');
  }
});


// MAIN












// Flower Shop Website JavaScript

// DOM Elements
const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('.hero h1');
const ctaButton = document.querySelector('.cta-button');
const statNumbers = document.querySelectorAll('.stat-number');
const faqItems = document.querySelectorAll('.faq-item');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const serviceItems = document.querySelectorAll('.service-item');
const sections = document.querySelectorAll('section');

// Statistics Counter Animation
function animateCounters() {
    const counters = [
        { element: statNumbers[0], target: 15, suffix: '+' },
        { element: statNumbers[1], target: 50, suffix: 'K+' },
        { element: statNumbers[2], target: 79, suffix: 'K+' },
        { element: statNumbers[3], target: 180, suffix: '+' }
    ];
    
    counters.forEach((counter, index) => {
        let current = 0;
        const increment = counter.target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= counter.target) {
                current = counter.target;
                clearInterval(timer);
            }
            counter.element.textContent = Math.floor(current) + counter.suffix;
        }, 30);
    });
}

// FAQ Toggle Functionality
function initFAQ() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        question.addEventListener('click', () => {
            const isActive = answer.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.querySelector('.faq-answer').classList.remove('active');
                faqItem.querySelector('.faq-toggle').textContent = '+';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                answer.classList.add('active');
                toggle.textContent = '—';
            }
        });
    });
}

// Smooth Scrolling
function initSmoothScrolling() {
    // CTA Button smooth scroll
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#services');
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // All anchor links smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger specific animations based on section
                if (entry.target.classList.contains('stats')) {
                    setTimeout(() => animateCounters(), 500);
                }
                
                if (entry.target.classList.contains('testimonials')) {
                    animateTestimonials();
                }
                
                if (entry.target.classList.contains('services')) {
                    animateServices();
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Testimonial Cards Animation
function animateTestimonials() {
    testimonialCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
        }, index * 150);
    });
}

// Services Animation
function animateServices() {
    serviceItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Parallax Effect
function initParallax() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Service Item Hover Effects
function initServiceHover() {
    serviceItems.forEach(item => {
        const image = item.querySelector('.service-image');
        const content = item.querySelector('.service-content');
        
        item.addEventListener('mouseenter', () => {
            image.style.transform = 'scale(1.05) rotate(2deg)';
            content.style.transform = 'translateX(10px)';
        });
        
        item.addEventListener('mouseleave', () => {
            image.style.transform = 'scale(1) rotate(0deg)';
            content.style.transform = 'translateX(0)';
        });
    });
}

// Testimonial Card Hover Effects
function initTestimonialHover() {
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) rotateX(5deg)';
            card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0deg)';
            card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        });
    });
}

// Floating Animation for Elements
function initFloatingAnimation() {
    const floatingElements = document.querySelectorAll('.service-image img');
    
    floatingElements.forEach((element, index) => {
        let start = Date.now();
        
        function animate() {
            const elapsed = Date.now() - start;
            const y = Math.sin(elapsed * 0.001 + index) * 3;
            element.style.transform = `translateY(${y}px)`;
            requestAnimationFrame(animate);
        }
        
        animate();
    });
}

// Page Loading Animation
function initPageLoad() {
    // Hide page initially
    document.body.style.opacity = '0';
    
    // Fade in page
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
    
    // Hero elements entrance animation
    setTimeout(() => {
        if (heroTitle) {
            heroTitle.style.animation = 'slideInUp 1s ease forwards';
        }
        if (ctaButton) {
            ctaButton.style.animation = 'slideInUp 1s ease 0.3s forwards';
        }
    }, 500);
}

// Keyboard Navigation for FAQ
function initKeyboardNavigation() {
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = faqItems[index + 1];
                if (nextItem) {
                    nextItem.querySelector('.faq-question').focus();
                }
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = faqItems[index - 1];
                if (prevItem) {
                    prevItem.querySelector('.faq-question').focus();
                }
            }
        });
    });
}

// Mobile Touch Interactions
function initTouchInteractions() {
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;
        
        // Add subtle parallax on mobile
        if (hero) {
            hero.style.transform = `translateY(${diff * 0.1}px)`;
        }
    });
}

// Easter Egg: Triple Click Hero Title
function initEasterEgg() {
    let clickCount = 0;
    let clickTimer = null;
    
    if (heroTitle) {
        heroTitle.addEventListener('click', () => {
            clickCount++;
            
            if (clickTimer) {
                clearTimeout(clickTimer);
            }
            
            clickTimer = setTimeout(() => {
                if (clickCount === 3) {
                    createFlowerExplosion();
                }
                clickCount = 0;
            }, 500);
        });
    }
}

// Create Flower Explosion Effect
// function createFlowerExplosion() {
//     const flowers = ['🌸', '🌺', '🌻', '🌹', '🌷', '🌼', '💐'];
    
//     for (let i = 0; i < 15; i++) {
//         setTimeout(() => {
//             const flower = document.createElement('div');
//             flower.innerHTML = flowers[Math.floor(Math.random() * flowers.length)];
//             flower.style.cssText = `
//                 position: fixed;
//                 left: ${Math.random() * window.innerWidth}px;
//                 top: ${window.innerHeight}px;
//                 font-size: ${20 + Math.random() * 20}px;
//                 z-index: 9999;
//                 pointer-events: none;
//                 animation: floatUp 3s ease-out forwards;
//             `;
            
//             document.body.appendChild(flower);
            
//             setTimeout(() => {
//                 flower.remove();
//             }, 3000);
//         }, i * 100);
//     }
// }

// Form Validation (if contact form exists)
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ff6b6b';
                    isValid = false;
                } else {
                    input.style.borderColor = '#4ecdc4';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you! Your message has been sent.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields.', 'error');
            }
        });
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4ecdc4' : type === 'error' ? '#ff6b6b' : '#f39c12'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle Function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Initialize All Functions
function init() {
    // Core functionality
    initFAQ();
    initSmoothScrolling();
    initScrollAnimations();
    initKeyboardNavigation();
    
    // Visual effects
    initParallax();
    initServiceHover();
    initTestimonialHover();
    initFloatingAnimation();
    
    // Page interactions
    initPageLoad();
    initTouchInteractions();
    initEasterEgg();
    initFormValidation();
    
    console.log('🌸 Flower Shop website initialized successfully!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is visible
        document.body.style.animationPlayState = 'running';
    }
});

// Performance optimization: Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Cancel any ongoing animations
    const animatedElements = document.querySelectorAll('*');
    animatedElements.forEach(element => {
        element.style.animation = 'none';
    });
});