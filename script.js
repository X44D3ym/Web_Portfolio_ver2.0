/**
 * This script handles:
 * 1.  Theme Toggling (Light/Dark Mode)
 * 2.  Mobile Menu (Hamburger, Overlay, Links)
 * 3.  Smooth Scrolling for anchor links
 * 4.  Intersection Observer for scroll-in animations
 * 5.  Contact Form (Formspree) submission
 * 6.  Hero section text animations (Magnetic Text, Typewriter)
 * 7.  Magnetic Buttons
 * 8.  Skills section infinite scroll
 * 9.  Hero section canvas animation
 * 10. Lightbox for certificate images
 */

// Wait for the DOM to be fully loaded before running any scripts
document.addEventListener('DOMContentLoaded', () => {

    // --- GLOBAL STATE --- //
    const body = document.body;

    // --- 1. THEME TOGGLE --- //

    /**
     * @summary Initializes theme toggling functionality.
     * @description Binds event listeners to both desktop and mobile theme toggles.
     * Applies the 'light-mode' class to the body and ensures
     * both toggles are in sync with the current theme.
     */
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const mobileThemeToggle = document.getElementById('mobileThemeToggle');

        /**
         * Updates the checked state of both toggles based on the body class.
         */
        function updateToggleState() {
            const isLightMode = body.classList.contains('light-mode');
            if (themeToggle) themeToggle.checked = isLightMode;
            if (mobileThemeToggle) mobileThemeToggle.checked = isLightMode;
        }

        /**
         * Toggles the 'light-mode' class on the body and updates toggle states.
         * Also triggers an update for the canvas star colors.
         */
        function toggleTheme() {
            body.classList.toggle('light-mode');
            updateToggleState();
            // Defined in the canvas animation section, but called here
            if (window.updateStarColors) {
                window.updateStarColors();
            }
        }

        if (themeToggle) {
            themeToggle.addEventListener('change', toggleTheme);
        }
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('change', toggleTheme);
        }

        // Set initial state on load
        updateToggleState();
    }

    // --- 2. MOBILE MENU --- //

    /**
     * @summary Initializes the mobile navigation menu.
     * @description Handles opening/closing the menu via the hamburger icon,
     * clicking the overlay, or clicking a menu link.
     * Toggles 'no-scroll' on the body to prevent background scrolling.
     */
    function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        const mobileLinks = document.querySelectorAll('.mobile-link');

        if (!hamburger || !mobileMenu || !menuOverlay) return;

        /**
         * Toggles all 'active' classes for menu elements and the 'no-scroll' class on the body.
         */
        function toggleMenu() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            body.classList.toggle('no-scroll', mobileMenu.classList.contains('active'));
        }

        hamburger.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);

        // Add listener to each link to close the menu on navigation
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });

        // Ensure menu is closed if window is resized to desktop width
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    }

    // --- 3. SMOOTH SCROLLING --- //

    /**
     * @summary Initializes smooth scrolling for all anchor links.
     * @description Attaches a click listener to all `a[href^="#"]` links
     * and smoothly scrolls to the target element.
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // --- 4. SCROLL ANIMATIONS (INTERSECTION OBSERVER) --- //

    /**
     * @summary Initializes fade-up animations on scroll.
     * @description Uses IntersectionObserver to add a 'show' class
     * (which triggers a CSS transition) to elements
     * like project and certificate cards when they enter the viewport.
     */
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: '0px 0px -100px 0px' // Start 100px before it enters the screen
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate by setting opacity and transform directly
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Select all cards to observe
        document.querySelectorAll('.project-card, .certificate-card').forEach(el => {
            // Set initial (pre-animation) state
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }

    // --- 5. CONTACT FORM --- //

    /**
     * @summary Initializes the contact form submission handler.
     * @description Uses async/await to send form data to Formspree.
     * Displays status messages (sending, success, error) to the user.
     */
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        const formStatus = document.getElementById('formStatus');

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const form = e.target;
            const data = new FormData(form);

            formStatus.textContent = 'Sending...';
            formStatus.style.color = '#a5b4fc';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    contactForm.reset();
                    formStatus.textContent = 'Message sent!';
                    formStatus.style.color = '#4ade80';
                } else {
                    formStatus.textContent = 'Error. Please try again.';
                    formStatus.style.color = '#f87171';
                }
            } catch (error) {
                formStatus.textContent = 'Network error. Please try again.';
                formStatus.style.color = '#f87171';
            }

            // Clear status message after 5 seconds
            setTimeout(() => {
                formStatus.textContent = '';
            }, 5000);
        });
    }

    // --- 6. HERO TEXT ANIMATIONS --- //

    /**
     * @summary Initializes all text animations in the hero section.
     * @description This function serves as a container for two sub-initializers:
     * one for the magnetic text and one for the typewriter effect.
     */
    function initHeroTextAnimations() {

        /**
         * @summary Initializes the "magnetic" hover effect on the main heading.
         * @description Splits the heading text into individual <span> elements for each
         * character. Then, on mousemove, calculates the distance and
         * direction from the cursor to each char and applies a CSS
         * transform (translate, rotate, scale) to create a "magnetic" pull.
         */
        function initMagneticText() {
            const magneticText = document.getElementById('magneticText');
            if (!magneticText) return;

            const words = magneticText.querySelectorAll('.word');

            // Split each word into character spans
            words.forEach(word => {
                const text = word.getAttribute('data-word');
                word.innerHTML = ''; // Clear existing content
                for (let char of text) {
                    const span = document.createElement('span');
                    span.className = 'char';
                    span.textContent = char;
                    word.appendChild(span);
                }
            });

            const chars = magneticText.querySelectorAll('.char');
            const maxDistance = 200; // Radius of the magnetic effect
            const moveStrength = 30; // How far the chars move
            const rotateStrength = 10; // How much the chars rotate
            const scaleStrength = 0.3; // How much the chars scale up

            // Apply effect on mousemove
            magneticText.addEventListener('mousemove', (e) => {
                chars.forEach(char => {
                    const rect = char.getBoundingClientRect();
                    const charCenterX = rect.left + rect.width / 2;
                    const charCenterY = rect.top + rect.height / 2;

                    const deltaX = e.clientX - charCenterX;
                    const deltaY = e.clientY - charCenterY;
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                    // Calculate strength (0 to 1) based on distance
                    const strength = Math.max(0, 1 - distance / maxDistance);

                    // Calculate transforms based on strength
                    const moveX = (deltaX / distance) * strength * moveStrength;
                    const moveY = (deltaY / distance) * strength * moveStrength;
                    const rotateZ = (deltaX / distance) * strength * rotateStrength;
                    const scale = 1 + strength * scaleStrength;

                    // Apply the transform
                    // Check for NaN if distance is 0 (cursor is exactly on char)
                    if (!isNaN(moveX)) {
                        char.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotateZ}deg) scale(${scale})`;
                    }
                });
            });

            // Reset transforms on mouseleave
            magneticText.addEventListener('mouseleave', () => {
                chars.forEach(char => {
                    char.style.transform = 'translate(0, 0) rotate(0deg) scale(1)';
                });
            });
        }

        /**
         * @summary Initializes the typewriter and text scramble effect.
         * @description Cycles through a list of roles, "typing" them out with a
         * scramble effect, pausing, and then "deleting" them with a
         * scramble effect before moving to the next.
         */
        function initTypewriter() {
            const typewriterElement = document.getElementById('typewriter');
            if (!typewriterElement) return;

            const roles = [
                'Web Developer',
                'UI/UX Designer',
                'Mobile App Developer',
                'Creative Coder',
                'Problem Solver'
            ];
            const scrambleChars = '!<>-_\\/[]{}—=+*^?#';
            const revealSpeed = 60; // Time (ms) between revealing chars
            const scrambleSpeed = 30; // Time (ms) between "deleting" chars
            const pauseAtEnd = 2500; // Pause (ms) when word is fully typed
            const pauseBeforeNew = 500; // Pause (ms) before typing new word

            let roleIndex = 0;
            let charIndex = 0;
            let isRevealing = true; // true = typing, false = deleting

            function getRandomChar() {
                return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
            }

            function textScrambleEffect() {
                const currentRole = roles[roleIndex];

                if (isRevealing) {
                    // --- REVEALING / TYPING ---
                    if (charIndex < currentRole.length) {
                        const revealedText = currentRole.substring(0, charIndex + 1);
                        
                        // Create a scrambled part for the rest of the word
                        let scrambledPart = '';
                        for (let i = charIndex + 1; i < currentRole.length; i++) {
                            scrambledPart += getRandomChar();
                        }

                        typewriterElement.innerHTML = `<span class="typewriter-revealed">${revealedText}</span><span class="typewriter-scramble">${scrambledPart}</span>`;
                        
                        charIndex++;
                        setTimeout(textScrambleEffect, revealSpeed);
                    } else {
                        // Word is fully revealed, pause at the end
                        typewriterElement.innerHTML = `<span class="typewriter-revealed">${currentRole}</span>`;
                        isRevealing = false;
                        setTimeout(textScrambleEffect, pauseAtEnd);
                    }
                } else {
                    // --- HIDING / DELETING ---
                    if (charIndex > 0) {
                        const revealedText = currentRole.substring(0, charIndex - 1);
                        
                        // Scramble the rest of the word
                        let scrambledPart = '';
                        for (let i = charIndex - 1; i < currentRole.length; i++) {
                            scrambledPart += getRandomChar();
                        }

                        typewriterElement.innerHTML = `<span class="typewriter-revealed">${revealedText}</span><span class="typewriter-scramble">${scrambledPart}</span>`;

                        charIndex--;
                        setTimeout(textScrambleEffect, scrambleSpeed);
                    } else {
                        // Word is fully hidden, pause and move to next role
                        isRevealing = true;
                        roleIndex = (roleIndex + 1) % roles.length;
                        typewriterElement.innerHTML = `<span class="typewriter-scramble"></span>`;
                        setTimeout(textScrambleEffect, pauseBeforeNew);
                    }
                }
            }
            
            // Start the effect
            textScrambleEffect();
        }

        // Call the sub-initializers
        initMagneticText();
        initTypewriter();
    }

    // --- 7. MAGNETIC BUTTONS --- //

    /**
     * @summary Initializes a subtle magnetic effect for designated buttons.
     * @description On mousemove, moves the button slightly towards the cursor.
     * On mouseleave, snaps it back to its original position.
     */
    function initMagneticButtons() {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', function(e) {
                const rect = btn.getBoundingClientRect();
                // Calculate cursor position relative to the button's center
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                // Apply a fraction of the distance as a transform
                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', function() {
                // Reset on leave
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // --- 8. SKILLS SCROLL --- //

    /**
     * @summary Initializes the infinite horizontal scroll for the skills section.
     * @description Pauses the CSS animation on mouseenter and resumes it on mouseleave.
     */
    function initSkillsScroll() {
        document.querySelectorAll('.skills-scroll-wrapper').forEach(container => {
            container.addEventListener('mouseenter', () => {
                container.style.animationPlayState = 'paused';
            });

            container.addEventListener('mouseleave', () => {
                container.style.animationPlayState = 'running';
            });
        });
    }

    // --- 9. CANVAS ANIMATION --- //

    /**
     * @summary Initializes the "hyperspeed" canvas animation in the hero section.
     * @description Creates a starfield effect with stars moving from the center
     * outwards. Handles resizing and theme changes.
     */
    function initCanvasAnimation() {
        const canvas = document.getElementById('hyperspeed-canvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let stars = [];
        const speed = 15; // Speed of the stars
        const starCount = 800; // Number of stars

        // Define star colors for both themes
        const starColorsDark = ['#FFFFFF', '#6366f1', '#ec4899', '#8b5cf6'];
        const starColorsLight = ['#1e293b', '#6366f1', '#4f46e5', '#7c3aed'];
        let currentStarColors = [];

        function getRandom(min, max) {
            return Math.random() * (max - min) + min;
        }

        /**
         * @summary Updates the star color palette based on the current theme.
         * @description Exposed globally as `window.updateStarColors` so the
         * theme toggle can call it.
         */
        window.updateStarColors = function() {
            const isLightMode = body.classList.contains('light-mode');
            currentStarColors = isLightMode ? starColorsLight : starColorsDark;
            // Recolor existing stars if they exist
            if (stars.length > 0) {
                for (let star of stars) {
                    star.color = currentStarColors[Math.floor(Math.random() * currentStarColors.length)];
                }
            }
        }

        /**
         * @summary (Re)populates the stars array.
         * @description Called on init and on resize.
         */
        function initStars() {
            stars = [];
            for (let i = 0; i < starCount; i++) {
                stars.push({
                    x: getRandom(-canvas.width, canvas.width),
                    y: getRandom(-canvas.height, canvas.height),
                    z: getRandom(1, canvas.width), // Z-depth
                    color: currentStarColors[Math.floor(Math.random() * currentStarColors.length)]
                });
            }
        }

        /**
         * @summary Draws all stars on the canvas.
         * @description Projects the 3D star coordinates (x, y, z) onto the 2D
         * canvas and draws a small line to simulate motion blur.
         */
        function drawStars() {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2); // Center origin

            for (let star of stars) {
                // 3D projection
                let k = canvas.width / star.z;
                let px = star.x * k;
                let py = star.y * k;

                // Calculate size and a "tail" for motion blur
                let size = (1 - star.z / canvas.width) * 4 + 1;
                let px_end = star.x * k * 1.025; // Tail end x
                let py_end = star.y * k * 1.025; // Tail end y

                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(px_end, py_end);
                ctx.lineWidth = size;
                ctx.strokeStyle = star.color;
                ctx.stroke();
            }
            ctx.restore();
        }

        /**
         * @summary Updates star positions for the next frame.
         */
        function updateStars() {
            for (let star of stars) {
                star.z -= speed;
                // If star is behind the "camera", reset it
                if (star.z <= 0) {
                    star.x = getRandom(-canvas.width, canvas.width);
                    star.y = getRandom(-canvas.height, canvas.height);
                    star.z = canvas.width;
                    star.color = currentStarColors[Math.floor(Math.random() * currentStarColors.length)];
                }
            }
        }

        /**
         * @summary The main animation loop.
         */
        function animate() {
            updateStars();
            drawStars();
            requestAnimationFrame(animate);
        }

        /**
         * @summary Handles window resize events.
         */
        function onResize() {
            if (!canvas) return;
            // Set canvas to the size of its parent (#home)
            canvas.width = document.getElementById('home').offsetWidth;
            canvas.height = document.getElementById('home').offsetHeight;
            initStars(); // Re-init stars for new dimensions
        }

        // --- Start Canvas ---
        window.addEventListener('resize', onResize);
        updateStarColors(); // Set initial colors
        onResize(); // Set initial size
        animate(); // Start the loop
    }

    // --- 10. LIGHTBOX --- //

    /**
     * @summary Initializes the lightbox modal for certificate images.
     * @description Attaches click listeners to all gallery links.
     * Handles opening, closing (via button, overlay click, or Esc key),
     * and populating the lightbox with the correct image and caption.
     */
    function initLightbox() {
        const lightboxOverlay = document.getElementById('lightboxOverlay');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');
        const lightboxClose = document.getElementById('lightboxClose');

        if (!lightboxOverlay || !lightboxImage || !lightboxCaption || !lightboxClose) return;

        // Open lightbox
        document.querySelectorAll('[data-lightbox="certificate-gallery"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const imageSrc = this.getAttribute('href');
                const imageCaption = this.getAttribute('data-title') || this.querySelector('img').alt;

                lightboxImage.src = imageSrc;
                lightboxCaption.textContent = imageCaption;
                lightboxOverlay.classList.add('active');
                body.classList.add('no-scroll');
            });
        });

        /**
         * @summary Closes the lightbox and resets its content.
         */
        function closeLightbox() {
            lightboxOverlay.classList.remove('active');
            body.classList.remove('no-scroll');
            // Delay resetting src to allow for fade-out transition
            setTimeout(() => {
                lightboxImage.src = '';
                lightboxCaption.textContent = '';
            }, 300);
        }

        // Close triggers
        lightboxClose.addEventListener('click', closeLightbox);
        
        lightboxOverlay.addEventListener('click', function(e) {
            // Only close if clicking the overlay itself, not the content
            if (e.target === this) {
                closeLightbox();
            }
        });

        document.addEventListener('keydown', function(e) {
            // Close on 'Escape' key
            if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
                closeLightbox();
            }
        });
    }


    // --- SCRIPT INITIALIZATION --- //

    /**
     * @summary Main initialization function.
     * @description Calls all the individual `init...()` functions
     * to start the script.
     */
    function init() {
        initThemeToggle();
        initMobileMenu();
        initSmoothScroll();
        initScrollAnimations();
        initContactForm();
        initHeroTextAnimations();
        initMagneticButtons();
        initSkillsScroll();
        initCanvasAnimation();
        initLightbox();
    }

    // Run the main initialization function
    init();

});