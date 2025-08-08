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



















// -------------------------------------STORY--------------------------------------

// Heart-touching flower shop interactive effects
document.addEventListener('DOMContentLoaded', function() {
    
    // Create floating petals dynamically
    function createFloatingPetals() {
        const petalsContainer = document.querySelector('.floating-petals');
        // const petalEmojis = ['🌸', '🌺', '🌼', '🌻', '🌷', '💐', '🌹', '🪻', '🍀', '🌿', '🍃', '💮', '🏵️'];
        
        function addPetal() {
            const petal = document.createElement('div');
            petal.className = 'floating-petal';
            petal.innerHTML = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
            
            // Random starting position
            petal.style.position = 'absolute';
            petal.style.left = Math.random() * 100 + '%';
            petal.style.top = '-50px';
            petal.style.fontSize = (Math.random() * 20 + 15) + 'px';
            petal.style.opacity = Math.random() * 0.7 + 0.3;
            petal.style.pointerEvents = 'none';
            petal.style.zIndex = '1';
            
            // Animation properties
            const duration = Math.random() * 8000 + 12000; // 12-20 seconds
            const drift = (Math.random() - 0.5) * 200; // Side drift
            
            petalsContainer.appendChild(petal);
            
            // Animate the petal falling
            petal.animate([
                {
                    transform: `translateY(0px) translateX(0px) rotate(0deg)`,
                    opacity: petal.style.opacity
                },
                {
                    transform: `translateY(${window.innerHeight + 100}px) translateX(${drift}px) rotate(360deg)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'ease-in-out'
            }).addEventListener('finish', () => {
                petal.remove();
            });
        }
        
        // Add petals periodically
        setInterval(addPetal, 3000);
        
        // Add initial petals
        for(let i = 0; i < 3; i++) {
            setTimeout(addPetal, i * 1000);
        }
    }
    
    // Parallax scroll effect
    function initParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.main-image, .flower-item');
            
            parallaxElements.forEach((element, index) => {
                const rate = scrolled * -0.3 * (index + 1);
                element.style.transform += ` translateY(${rate}px)`;
            });
        });
    }
    
    // Typewriter effect for the quote
    function typewriterEffect() {
        const quote = document.querySelector('.quote p');
        const text = quote.textContent;
        quote.textContent = '';
        quote.style.opacity = '1';
        
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                quote.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, 30);
    }
    
    // Heart beat animation for images on hover
    function initHeartbeatEffect() {
        const images = document.querySelectorAll('.flower-item, .main-image');
        
        images.forEach(img => {
            img.addEventListener('mouseenter', () => {
                img.style.animation = 'heartbeat 0.6s ease-in-out';
            });
            
            img.addEventListener('animationend', () => {
                img.style.animation = '';
            });
        });
    }
    
    // Add heartbeat keyframes dynamically
    function addHeartbeatAnimation() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes heartbeat {
                0% { transform: scale(1); }
                25% { transform: scale(1.05); }
                50% { transform: scale(1.1); }
                75% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Intersection Observer for scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    
                    // Special effect for quote
                    if (entry.target.classList.contains('quote')) {
                        setTimeout(() => {
                            typewriterEffect();
                        }, 600);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements
        document.querySelectorAll('.story-text p, .quote, .flower-item, .main-image').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Color shifting effect for the header
    function initColorShift() {
        const header = document.querySelector('.section-header h2');
        const colors = [
            'linear-gradient(45deg, #ff6b9d, #ff8da1)',
        ];
        
        let colorIndex = 0;
        setInterval(() => {
            header.style.background = colors[colorIndex];
            colorIndex = (colorIndex + 1) % colors.length;
        }, 40);
    }
    
    // Mouse trail effect
    function initMouseTrail() {
        const trail = [];
        const maxTrailLength = 10;
        
        document.addEventListener('mousemove', (e) => {
            const flower = document.createElement('div');
            // flower.innerHTML = '🌸';
            flower.style.position = 'fixed';
            flower.style.left = e.clientX + 'px';
            flower.style.top = e.clientY + 'px';
            flower.style.pointerEvents = 'none';
            flower.style.zIndex = '9999';
            flower.style.fontSize = '12px';
            flower.style.opacity = '0.6';
            flower.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
            
            document.body.appendChild(flower);
            trail.push(flower);
            
            // Fade out and remove
            setTimeout(() => {
                flower.style.opacity = '0';
                flower.style.transform = 'scale(0.5) rotate(180deg)';
            }, 100);
            
            setTimeout(() => {
                flower.remove();
            }, 1100);
            
            // Limit trail length
            if (trail.length > maxTrailLength) {
                const oldFlower = trail.shift();
                if (oldFlower && oldFlower.parentNode) {
                    oldFlower.remove();
                }
            }
        });
    }
    
    // Background gradient animation
    // function initBackgroundAnimation() {
    //     const body = document.body;
    //     const gradients = [
    //         'linear-gradient(135deg, #ffeef0 0%, #f9f2f4 50%, #fff5f7 100%)',
    //         'linear-gradient(135deg, #f0f8ff 0%, #f4f9ff 50%, #f7faff 100%)',
    //         'linear-gradient(135deg, #fff0f5 0%, #fff4f8 50%, #fff7fb 100%)',
    //         'linear-gradient(135deg, #f5f0ff 0%, #f8f4ff 50%, #fbf7ff 100%)'
    //     ];
        
    //     let gradientIndex = 0;
    //     setInterval(() => {
    //         body.style.background = gradients[gradientIndex];
    //         gradientIndex = (gradientIndex + 1) % gradients.length;
    //     }, 10000);
    // }
    
    // Initialize all effects
    createFloatingPetals();
    addHeartbeatAnimation();
    initHeartbeatEffect();
    initScrollAnimations();
    initColorShift();
    initMouseTrail();
    // initBackgroundAnimation();
    
    // Delayed initialization for smooth loading
    setTimeout(() => {
        initParallaxEffect();
    }, 1000);
    
    console.log('🌸 Petals & Dreams: Where every flower tells a story of love 🌸');
});

// Additional utility functions
function showLoveMessage() {
    const messages = [
        "Every flower blooms in its own time 🌸",
        "Love planted a rose, and the world turned sweet 🌹",
        "Where flowers bloom, so does hope 🌺",
        "In every walk with nature, one receives far more than they seek 🌼",
        "Let your dreams blossom like a garden in full bloom 🌼",
        "Even the tiniest flower can crack concrete with its will to grow 🌱",
        "Grow through what you go through 🌻",
        "The rain may fall, but flowers still rise ☔🌸",
        "You are rooted with strength and meant to bloom with grace 🌹",
        "Some days you're the flower, some days you're the rain — both are essential 🌿",
        "Like a flower in the desert, bloom anyway 🌵🌼",
        "Every petal tells a story of growth, courage, and light 🌷",
        "Nature doesn’t rush, yet everything blooms in its season 🍃",
        "Beauty begins the moment you decide to bloom 🌸"
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    // Create floating message
    const messageEl = document.createElement('div');
    messageEl.textContent = randomMessage;
    messageEl.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 107, 157, 0.95);
        color: white;
        padding: 20px 30px;
        border-radius: 30px;
        font-family: Georgia, serif;
        font-size: 18px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    // Fade in
    setTimeout(() => {
        messageEl.style.opacity = '1';
    }, 100);
    
    // Fade out and remove
    setTimeout(() => {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.remove();
        }, 500);
    }, 3000);
}

// Easter egg - click on main image for surprise
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const mainImage = document.querySelector('.main-image');
        if (mainImage) {
            mainImage.addEventListener('click', showLoveMessage);
            mainImage.style.cursor = 'pointer';
            mainImage.title = 'Click for a special message 🌸';
        }
    }, 2000);
});








// -------------------------------MEMBERS---------------------------------------------------


/*------------------------------------------------MEMBER----------------------------------------------------------*/
// Image data with names and simplified titles
const images = [
    { 
        src: '/assests/aboutus/7.png',
        name: 'Donald Griffin',
        title: 'CEO',
        alt: 'Professional portrait 1'
    },
    { 
        src: '/assests/aboutus/5.jpg',
        name: 'Sarah Johnson',
        title: 'Creative Director',
        alt: 'Professional portrait 2'
    },
    { 
        src: '/assests/aboutus/4.jpg',
        name: 'Michael Chen',
        title: 'Photographer',
        alt: 'Professional portrait 3'
    },
    { 
        src: '/assests/aboutus/6.png',
        name: 'Emma Wilson',
        title: 'Art Director',
        alt: 'Professional portrait 4'
    },
    { 
        src: '/assests/aboutus/3.jpg',
        name: 'James Rodriguez',
        title: 'Designer',
        alt: 'Professional portrait 5'
    },
    { 
        src: '/assests/aboutus/2.jpg',
        name: 'Lisa Anderson',
        title: 'Manager',
        alt: 'Professional portrait 6'
    },
    { 
        src: '/assests/aboutus/1.jpg',
        name: 'David Park',
        title: 'Tech Lead',
        alt: 'Professional portrait 7'
    }
];

class ImageGallery {
    constructor() {
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.swipeThreshold = 50;
        
        this.carousel = document.getElementById('carousel');
        this.nameEl = document.getElementById('imageName');
        this.titleEl = document.getElementById('imageTitle');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }

    init() {
        this.createImageElements();
        this.bindEvents();
        this.updateCarousel();
        this.preloadImages();
    }

    createImageElements() {
        // Clear existing content
        this.carousel.innerHTML = '';

        images.forEach((image, index) => {
            const container = document.createElement('div');
            container.className = 'image-container';
            container.dataset.index = index;

            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.alt;
            img.className = 'carousel-image';
            img.loading = 'lazy';

            const viewBtn = document.createElement('button');
            viewBtn.className = 'view-button';
            viewBtn.textContent = 'VIEW';
            viewBtn.setAttribute('aria-label', `View ${image.name}'s profile`);

            // Add event listeners
            container.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateToImage(index);
            });

            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.navigateToImage(index);
            });

            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            container.appendChild(img);
            container.appendChild(viewBtn);
            this.carousel.appendChild(container);
        });
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevImage());
        this.nextBtn.addEventListener('click', () => this.nextImage());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isTransitioning) return;

            switch(e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.prevImage();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.nextImage();
                    break;
            }
        });

        // Touch/swipe support
        let startX = 0;
        let startTime = 0;

        this.carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startTime = Date.now();
        }, { passive: true });

        this.carousel.addEventListener('touchmove', (e) => {
            if (e.touches.length > 1) return;
            // Prevent scrolling on swipe
            e.preventDefault();
        }, { passive: false });

        this.carousel.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endTime = Date.now();
            const timeDiff = endTime - startTime;
            const distance = Math.abs(startX - endX);

            // Only trigger swipe if it was quick and long enough
            if (timeDiff < 300 && distance > this.swipeThreshold) {
                if (startX > endX) {
                    this.nextImage(); // Swipe left - next image
                } else {
                    this.prevImage(); // Swipe right - previous image
                }
            }
        }, { passive: true });
    }

    updateCarousel() {
        const containers = this.carousel.querySelectorAll('.image-container');
        
        containers.forEach((container, index) => {
            // Reset all classes
            container.className = 'image-container';
            
            // Calculate relative position from center
            let relativePos = index - this.currentIndex;
            
            // Handle wrap-around for smooth circular navigation
            const halfLength = Math.floor(images.length / 2);
            if (relativePos > halfLength) {
                relativePos -= images.length;
            } else if (relativePos < -halfLength) {
                relativePos += images.length;
            }
            
            // Apply position classes
            const positionClasses = {
                0: 'center',
                [-1]: 'left-1',
                1: 'right-1',
                [-2]: 'left-2',
                2: 'right-2',
                [-3]: 'left-3',
                3: 'right-3'
            };

            const className = positionClasses[relativePos] || 'hidden';
            container.classList.add(className);
        });

        // Update info display
        const currentImage = images[this.currentIndex];
        this.nameEl.textContent = currentImage.name;
        this.titleEl.textContent = currentImage.title;
    }

    navigateToImage(index) {
        if (this.isTransitioning || index === this.currentIndex) return;
        
        this.isTransitioning = true;
        this.currentIndex = index;
        this.updateCarousel();
        
        // Reset transition lock after animation completes
        setTimeout(() => {
            this.isTransitioning = false;
        }, 700);
    }

    nextImage() {
        const nextIndex = (this.currentIndex + 1) % images.length;
        this.navigateToImage(nextIndex);
    }

    prevImage() {
        const prevIndex = (this.currentIndex - 1 + images.length) % images.length;
        this.navigateToImage(prevIndex);
    }

    preloadImages() {
        // Preload adjacent images for better performance
        images.forEach((image, index) => {
            if (Math.abs(index - this.currentIndex) <= 2) {
                const img = new Image();
                img.src = image.src;
            }
        });
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageGallery();
});

// Add some global performance optimizations
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Optional: Register service worker for caching
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Intersection Observer for performance optimization
const observerOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
}, observerOptions);