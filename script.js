/**
 * Main JS for Lazreus Tech website
 *
 * Features:
 * - Navbar: toggle, dropdown, scroll-based resize
 * - Animations: background parallax, section reveals
 * - Navigation: smooth scrolling, active link highlighting
 * - UI: page loader, custom cursor, scroll-to-top button
 */

// Performance monitoring
if (window.performance && window.performance.mark) {
    // Mark the start of script execution
    window.performance.mark('script-start');
}

// Execute all code when DOM is fully loaded to ensure all elements are available
document.addEventListener('DOMContentLoaded', function() {
    // Mark DOM content loaded for performance measurement
    if (window.performance && window.performance.mark) {
        window.performance.mark('dom-content-loaded');
        window.performance.measure('script-to-dom-ready', 'script-start', 'dom-content-loaded');
    }
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbar = document.querySelector('.navbar');

    // Background animation elements for parallax effect
    const stars = document.querySelectorAll('.stars');
    const nebulas = document.querySelectorAll('.nebula');

    // Navbar scroll behavior variables
    let isScrollingNavbar = false;        // Throttle flag for performance

    // Set up navbar as expanded by default
    // The fixed position and other properties are now handled in CSS
    navbar.classList.add('navbar-expanded');

    // Navbar interactive elements setup
    if (navbarToggler && navbarCollapse) {
        // Mobile menu toggle - show/hide menu on hamburger click
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            navbarCollapse.classList.toggle('show');

            // Update ARIA expanded attribute for screen readers
            const expanded = navbarCollapse.classList.contains('show');
            navbarToggler.setAttribute('aria-expanded', expanded);
        });

        // Dropdown menu handling - different behavior on mobile vs desktop
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');
        dropdownItems.forEach(dropdown => {
            const dropdownLink = dropdown.querySelector('.nav-link');

            dropdownLink.addEventListener('click', function(e) {
                // Only apply this behavior on mobile viewports
                if (window.innerWidth <= 991) {
                    e.preventDefault();

                    // Close any other open dropdowns first (accordion-like behavior)
                    dropdownItems.forEach(item => {
                        if (item !== dropdown && item.classList.contains('show')) {
                            item.classList.remove('show');
                        }
                    });

                    // Toggle the clicked dropdown
                    dropdown.classList.toggle('show');
                }
            });
        });

        // Auto-close menu when regular nav links are clicked
        const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Close the mobile menu
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');

                // Also close any open dropdowns
                dropdownItems.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            });
        });

        // Auto-close menu when dropdown items are clicked
        const dropdownMenuItems = document.querySelectorAll('.dropdown-item');
        dropdownMenuItems.forEach(item => {
            item.addEventListener('click', function() {
                // Close the mobile menu
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');

                // Also close any open dropdowns
                dropdownItems.forEach(dropdown => {
                    dropdown.classList.remove('show');
                });
            });
        });

        // Close menu when clicking outside the navbar
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle window resize - close mobile menu when switching to desktop
        let resizeTimer;
        window.addEventListener('resize', function() {
            // Debounce the resize event for better performance
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                // If viewport switches to desktop while mobile menu is open, close it
                if (window.innerWidth > 991 && navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                    navbarToggler.setAttribute('aria-expanded', 'false');
                }
            }, 250); // 250ms debounce delay
        });
    }

    // Smart Navbar Scroll Behavior
    // Always visible while scrolling throughout the webpage
    function handleNavbarScroll() {
        // Always keep navbar expanded and visible
        navbar.classList.remove('navbar-collapsed');
        navbar.classList.add('navbar-expanded');
    }

    // Performance-optimized scroll event handler using requestAnimationFrame
    // Using passive event listener for better performance
    window.addEventListener('scroll', function() {
        // Skip if we're already processing a scroll event
        if (isScrollingNavbar) return;

        isScrollingNavbar = true;

        // Process the scroll event in the next animation frame for smoother performance
        requestAnimationFrame(function() {
            handleNavbarScroll();
            isScrollingNavbar = false;
        });
    }, { passive: true });

    // Active Navigation Highlighting - shows current section in menu
    const sections = document.querySelectorAll('section[id]');

    function highlightNavOnScroll() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            // Calculate section boundaries with offset to trigger highlight slightly before reaching section
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100; // 100px offset for earlier highlight
            const sectionId = section.getAttribute('id');

            // Check if current scroll position is within this section
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                // Find and highlight the corresponding nav link
                const activeLink = document.querySelector('.navbar-nav a[href*=' + sectionId + ']');
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            } else {
                // Remove highlight if we're not in this section
                const link = document.querySelector('.navbar-nav a[href*=' + sectionId + ']');
                if (link) {
                    link.classList.remove('active');
                }
            }
        });
    }

    // Parallax Background Animation - creates depth effect while scrolling

    // Track last animation frame request to avoid redundant animations
    let animationFrameId = null;

    // Detect if device is low-powered (mobile/tablet) to adjust animation intensity
    const isLowPoweredDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // Reduce animation intensity on low-powered devices
    const animationIntensity = isLowPoweredDevice ? 0.5 : 1;

    function animateBackground() {
        // Cancel any pending animation frame to prevent multiple animations
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        // Request a new animation frame
        animationFrameId = requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const scrollProgress = scrollY / (document.body.scrollHeight - viewportHeight);

            // Performance optimization: Only animate elements that are in or near the viewport
            const viewportTop = scrollY;
            const viewportBottom = scrollY + viewportHeight;

            // Further reduce animation intensity for better performance
            const optimizedIntensity = animationIntensity * 0.8;

            // Animate stars with parallax effect - each star layer moves at different speed
            // Simplified calculations for better performance
            stars.forEach((star, index) => {
                // Calculate depth factor - each star layer has increasing depth
                const depth = 0.5 + (index * 0.25);

                // Simplified rotation calculation
                const rotation = Math.round(scrollY * 0.003 * (index % 2 === 0 ? 1 : -1) * optimizedIntensity);

                // Apply vertical translation based on scroll position and depth
                // Using translate3d for hardware acceleration
                // Rounded values for better performance
                const translateY = Math.round(scrollY * 0.04 * depth * optimizedIntensity);
                star.style.transform = `translate3d(0, ${translateY}px, 0) rotate(${rotation}deg)`;

                // Simplified opacity calculation - less frequent updates
                if (scrollY % 5 === 0) {
                    const opacityVariation = 0.8 + (Math.sin(scrollY * 0.0005 + index) * 0.1);
                    star.style.opacity = opacityVariation.toFixed(2); // Limit decimal precision
                }
            });

            // Animate nebulas with parallax effect - only if they're near the viewport
            nebulas.forEach((nebula, index) => {
                const nebulaBounds = nebula.getBoundingClientRect();
                const nebulaTop = nebulaBounds.top + scrollY;
                const nebulaBottom = nebulaBounds.bottom + scrollY;

                // Only animate if near viewport (with buffer)
                if (nebulaBottom + 300 >= viewportTop && nebulaTop - 300 <= viewportBottom) {
                    // Alternate between left/right movement for varied effect
                    const direction = index % 2 === 0 ? 1 : -1;

                    // Each nebula moves at slightly different speed - simplified calculation
                    const speed = 0.015 + (index * 0.005);

                    // Simplified scale calculation
                    const scale = 1 + (Math.sin(scrollY * 0.0005 + index) * 0.03);

                    // Apply diagonal translation and scale for more dynamic movement
                    // Using translate3d for hardware acceleration
                    // Rounded values for better performance
                    const translateX = Math.round(scrollY * speed * direction * optimizedIntensity);
                    const translateY = Math.round(scrollY * speed * optimizedIntensity);
                    nebula.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale.toFixed(2)})`;

                    // Apply subtle opacity variation - less frequent updates
                    if (scrollY % 5 === 0) {
                        const opacityVariation = 0.3 + (Math.sin(scrollY * 0.0003 + index) * 0.05);
                        nebula.style.opacity = opacityVariation.toFixed(2); // Limit decimal precision
                    }
                }
            });

            // Add subtle rotation to shooting stars based on scroll position
            // Only update every few frames for better performance
            if (scrollY % 3 === 0) {
                const shootingStars = document.querySelectorAll('.shooting-star');
                shootingStars.forEach((star, index) => {
                    const rotationAngle = 20 + Math.round(scrollProgress * 5 * (index % 2 === 0 ? 1 : -1));
                    star.style.transform = `rotate(${rotationAngle}deg)`;
                });
            }

            // Clear the animation frame ID since the animation is complete
            animationFrameId = null;
        });
    }

    // Enhanced Smooth Scrolling for Anchor Links - optimized for performance
    let isScrolling = false;
    const scrollDuration = 800; // Reduced base duration for snappier feel (ms)

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            // Don't start a new scroll animation if one is already in progress
            if (isScrolling) return;

            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href');

            // Skip empty anchors
            if (targetId === '#') return;

            // Find the target element in the DOM
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            // Calculate navbar height dynamically to account for collapsed/expanded states
            const navbarHeight = document.querySelector('.navbar').offsetHeight;

            // Calculate start and end positions
            const startPosition = window.pageYOffset;
            const targetPosition = targetElement.getBoundingClientRect().top + startPosition - navbarHeight - 10;

            // Calculate distance to scroll
            const distance = targetPosition - startPosition;

            // Skip if already at the target (within a small threshold)
            if (Math.abs(distance) < 5) return;

            // Adjust duration based on distance (faster for shorter distances)
            // Using a more responsive curve for duration adjustment
            const adjustedDuration = Math.min(
                scrollDuration,
                scrollDuration * (0.5 + Math.abs(distance) / 2000)
            );

            // Set flag to prevent multiple simultaneous scroll animations
            isScrolling = true;

            // Timestamp of when the animation started
            let startTime = null;

            // Optimized easing function - cubic-bezier approximation for smoother motion
            // This provides a more natural feel with better performance
            function easeOutQuint(t) {
                return 1 - Math.pow(1 - t, 5);
            }

            // Scroll animation frame using requestAnimationFrame
            function scrollAnimation(currentTime) {
                if (startTime === null) startTime = currentTime;

                // Calculate time elapsed
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / adjustedDuration, 1);
                const easedProgress = easeOutQuint(progress);

                // Apply the scroll with hardware acceleration hint
                window.scrollTo({
                    top: startPosition + distance * easedProgress,
                    behavior: 'auto' // We're handling the animation ourselves
                });

                // Continue animation if not complete
                if (timeElapsed < adjustedDuration) {
                    requestAnimationFrame(scrollAnimation);
                } else {
                    // Ensure we land exactly on target
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'auto'
                    });
                    isScrolling = false;

                    // Set focus to the target for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus({ preventScroll: true });
                }
            }

            // Start the animation
            requestAnimationFrame(scrollAnimation);
        });
    });

    // Section Reveal Animation - fade in sections as they enter viewport
    const allSections = document.querySelectorAll('section');

    // Create and inject optimized CSS animations directly in JS
    const style = document.createElement('style');
    style.textContent = `
        /* Base section animation - initial state */
        section {
            opacity: 0;
            transform: translateY(20px); /* Reduced distance for smoother animation */
            transition:
                opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), /* Optimized timing function */
                transform 0.7s cubic-bezier(0.4, 0, 0.2, 1); /* Reduced duration */
            will-change: opacity, transform;
        }

        /* Active state - visible and in final position */
        section.active-section {
            opacity: 1;
            transform: translateY(0);
        }

        /* Staggered animations for child elements - optimized for performance */
        section.active-section h1 {
            animation: fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards; /* Faster animation */
            animation-delay: 0.1s;
        }

        section.active-section h2 {
            animation: fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.15s; /* Reduced delay between elements */
        }

        section.active-section p {
            animation: fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.2s;
        }

        section.active-section button {
            animation: fadeSlideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            animation-delay: 0.25s;
        }

        /* Progressive loading for list items - simplified for better performance */
        section.active-section li {
            animation: fadeSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
        }

        /* Reduced number of specific selectors for better performance */
        section.active-section li:nth-child(1) { animation-delay: 0.2s; }
        section.active-section li:nth-child(2) { animation-delay: 0.25s; }
        section.active-section li:nth-child(3) { animation-delay: 0.3s; }
        section.active-section li:nth-child(n+4) { animation-delay: 0.35s; } /* Group remaining items */

        /* Service cards staggered animation - optimized for performance */
        section.active-section .service-card {
            animation: fadeScaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            opacity: 0;
            transform: scale(0.98); /* Less dramatic scale for smoother animation */
        }

        /* Reduced number of specific selectors for better performance */
        section.active-section .service-card:nth-child(1) { animation-delay: 0.1s; }
        section.active-section .service-card:nth-child(2) { animation-delay: 0.15s; }
        section.active-section .service-card:nth-child(3) { animation-delay: 0.2s; }
        section.active-section .service-card:nth-child(4) { animation-delay: 0.25s; }
        section.active-section .service-card:nth-child(n+5) { animation-delay: 0.3s; } /* Group remaining items */

        /* Optimized animation keyframes - smaller transforms for better performance */
        @keyframes fadeSlideIn {
            from {
                opacity: 0;
                transform: translateY(15px); /* Reduced distance */
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeScaleIn {
            from {
                opacity: 0;
                transform: scale(0.98); /* Less dramatic scale */
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Simplified selector for hidden elements - better performance */
        section:not(.active-section) h1,
        section:not(.active-section) h2,
        section:not(.active-section) p,
        section:not(.active-section) button,
        section:not(.active-section) li,
        section:not(.active-section) .service-card {
            opacity: 0;
        }
    `;
    document.head.appendChild(style);

    // Use IntersectionObserver to efficiently detect when sections enter viewport
    // This is more performant than scroll event based detection
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        // Process all entries in a single animation frame for better performance
        requestAnimationFrame(() => {
            entries.forEach(entry => {
                // Only reveal section when it enters the viewport
                if (entry.isIntersecting) {
                    const section = entry.target;
                    section.classList.add('active-section');

                    // Stop observing once the section is revealed
                    // This prevents unnecessary processing
                    observer.unobserve(section);
                }
            });
        });
    }, {
        root: null, // Use viewport as root
        threshold: 0.1, // Reduced threshold for earlier triggering (10% visibility)
        rootMargin: '-80px 0px' // Adjusted offset for better timing
    });

    // Start observing all sections - batch in chunks for better performance
    // This prevents too many simultaneous calculations
    const observeSections = (index = 0, batchSize = 5) => {
        const end = Math.min(index + batchSize, allSections.length);

        for (let i = index; i < end; i++) {
            sectionObserver.observe(allSections[i]);
        }

        if (end < allSections.length) {
            // Schedule next batch in next animation frame
            requestAnimationFrame(() => {
                observeSections(end, batchSize);
            });
        }
    };

    // Start the batched observation process
    observeSections();

    // Optimized fallback for browsers without IntersectionObserver support
    function revealSections() {
        // Skip if IntersectionObserver is supported
        if ('IntersectionObserver' in window) return;

        const windowHeight = window.innerHeight;
        const revealPoint = 120; // Reduced trigger point for better performance

        // Use a more efficient loop with caching
        const sectionsLength = allSections.length;

        // Process sections in batches for better performance
        let processedCount = 0;

        // Process a batch of sections
        function processBatch(startIndex, count) {
            const endIndex = Math.min(startIndex + count, sectionsLength);

            for (let i = startIndex; i < endIndex; i++) {
                const section = allSections[i];

                // Skip sections that are already active
                if (section.classList.contains('active-section')) {
                    continue;
                }

                // Get section's position relative to the viewport
                const sectionTop = section.getBoundingClientRect().top;

                // Check if section has entered the reveal threshold
                if (sectionTop < windowHeight - revealPoint) {
                    section.classList.add('active-section');
                }
            }

            // Update processed count
            processedCount = endIndex;

            // If there are more sections to process, schedule next batch
            if (processedCount < sectionsLength) {
                setTimeout(() => {
                    processBatch(processedCount, 3); // Process 3 sections at a time
                }, 16); // Roughly one frame at 60fps
            }
        }

        // Start processing sections in batches
        processBatch(0, 3);
    }

    // Main scroll event handler - optimized for performance

    // Throttle variables to prevent too many scroll events
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollThrottleDelay = 16; // ms between scroll processing (roughly 60fps)

    // Track if the page is visible to pause animations when tab is inactive
    let pageIsVisible = true;

    // Listen for visibility changes to pause/resume animations
    document.addEventListener('visibilitychange', () => {
        pageIsVisible = document.visibilityState === 'visible';
    });

    // Highly optimized main scroll handler with improved throttling
    window.addEventListener('scroll', function() {
        // Skip processing if page is not visible
        if (!pageIsVisible) return;

        // Get current time for throttling
        const now = performance.now();

        // Process navbar immediately for responsiveness
        handleNavbarScroll();

        // Throttle other animations for better performance
        // Increased throttle delay for smoother performance
        if (now - lastScrollTime > scrollThrottleDelay) {
            lastScrollTime = now;

            // Use requestAnimationFrame to sync with browser refresh cycle
            cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                // Process in order of visual importance and performance impact

                // 1. Update active navigation links - lightweight operation
                highlightNavOnScroll();

                // 2. Conditionally animate background with reduced intensity
                // Only animate background if not on a mobile device and if the function exists
                if (!isLowPoweredDevice && typeof animateBackground === 'function') {
                    // Reduce animation frequency for better performance
                    if (now % 3 === 0) { // Only run every 3rd frame approximately
                        animateBackground();
                    }
                }

                // 3. Only run the legacy reveal as fallback
                // Only run if IntersectionObserver is not supported and if the function exists
                if (!('IntersectionObserver' in window) && typeof revealSections === 'function') {
                    revealSections();
                }
            });
        }
    }, { passive: true }); // Use passive listener for better scroll performance

    // Resize Handler - updates animations when window size changes
    let resizeTimeout;
    window.addEventListener('resize', function() {
        // Clear previous timeout
        clearTimeout(resizeTimeout);

        // Set new timeout to debounce the resize event
        resizeTimeout = setTimeout(() => {
            // Recalculate animations after resize
            animateBackground();

            // Only run the legacy reveal if IntersectionObserver is not supported
            if (!('IntersectionObserver' in window)) {
                revealSections();
            }
        }, 150);
    }, { passive: true });

    // Page Loading Animation and UI Effects
    document.addEventListener('DOMContentLoaded', () => {
        // Create and add page loader overlay
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading Lazreus Tech</div>
            </div>
        `;
        document.body.appendChild(loader);

        // Create custom cursor effect
        const cursorEffect = document.createElement('div');
        cursorEffect.className = 'cursor-effect';
        document.body.appendChild(cursorEffect);

        // Variables for cursor effect
        let cursorVisible = false;

        // Mouse position with smoothing
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        // Set up cursor effect
        const initCursor = () => {
            // Add listener for mouse movement
            document.addEventListener('mousemove', e => {
                mouseX = e.clientX;
                mouseY = e.clientY;

                // Show cursor
                if (!cursorVisible) {
                    cursorEffect.classList.add('active');
                    cursorVisible = true;
                }

                // Position cursor initially
                cursorEffect.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
            });

            // Hide cursor when leaving window
            document.addEventListener('mouseout', () => {
                cursorEffect.classList.remove('active');
                cursorVisible = false;
            });

            // Add hover effect to interactive elements
            const interactiveElements = document.querySelectorAll('a, button, .btn, .nav-link, .service-card, .footer-links a');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseover', () => {
                    cursorEffect.classList.add('hover');
                });

                el.addEventListener('mouseout', () => {
                    cursorEffect.classList.remove('hover');
                });
            });

            // Animate cursor with smooth movement
            const animateCursor = () => {
                // Smooth transition with easing
                const easeFactor = 8;

                // Calculate smooth position
                cursorX += (mouseX - cursorX) / easeFactor;
                cursorY += (mouseY - cursorY) / easeFactor;

                // Apply position if cursor is visible
                if (cursorVisible) {
                    cursorEffect.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                }

                // Continue animation
                requestAnimationFrame(animateCursor);
            };

            // Start cursor animation
            animateCursor();
        };

        // Only initialize cursor effect on non-touch devices
        if (!('ontouchstart' in window)) {
            initCursor();
        }

        // Hide loader and show content when page is ready
        window.addEventListener('load', () => {
            // Initial setup
            highlightNavOnScroll();
            animateBackground();

            // Fade out loader
            loader.style.opacity = '0';

            // Add a small delay before revealing sections for smoother initial load
            setTimeout(() => {
                // If IntersectionObserver is not supported, run the legacy reveal
                if (!('IntersectionObserver' in window)) {
                    revealSections();
                }

                // Add a class to the body to enable transitions after initial load
                document.body.classList.add('page-loaded');

                // Remove loader from DOM after animation completes
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 300);
        });

        // Fallback to remove loader if load event doesn't fire
        setTimeout(() => {
            if (document.body.contains(loader)) {
                loader.style.opacity = '0';
                document.body.classList.add('page-loaded');

                setTimeout(() => {
                    loader.remove();
                }, 500);
            }
        }, 3000);
    });

    // Scroll-to-Top Button - appears when scrolling down
    function addScrollToTopButton() {
        // Create the button element
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.setAttribute('title', 'Scroll to top');
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';

        // Add the button to the document
        document.body.appendChild(scrollTopBtn);

        // Optimized function to toggle button visibility
        // Using throttling to prevent excessive updates
        let isTogglingButton = false;
        let lastScrollY = 0;
        const scrollThreshold = 300;

        function toggleScrollTopButton() {
            // Skip if already processing
            if (isTogglingButton) return;

            isTogglingButton = true;

            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                const currentScrollY = window.pageYOffset;

                // Only update if scroll position changed significantly
                if (Math.abs(currentScrollY - lastScrollY) > 50) {
                    if (currentScrollY > scrollThreshold) {
                        if (!scrollTopBtn.classList.contains('visible')) {
                            scrollTopBtn.classList.add('visible');
                        }
                    } else {
                        if (scrollTopBtn.classList.contains('visible')) {
                            scrollTopBtn.classList.remove('visible');
                        }
                    }

                    lastScrollY = currentScrollY;
                }

                isTogglingButton = false;
            });
        }

        // Add scroll event listener to toggle button visibility
        // Using passive event for better performance
        window.addEventListener('scroll', toggleScrollTopButton, { passive: true });

        // Add click event listener to scroll to top
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Use the enhanced smooth scrolling function
            const startPosition = window.pageYOffset;
            const duration = 600; // Reduced duration for snappier feel
            let startTime = null;

            // Optimized easing function - cubic-bezier approximation
            function easeOutQuint(t) {
                return 1 - Math.pow(1 - t, 5);
            }

            function scrollAnimation(currentTime) {
                if (startTime === null) startTime = currentTime;

                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const easedProgress = easeOutQuint(progress);

                // Use object syntax for better browser compatibility
                window.scrollTo({
                    top: startPosition * (1 - easedProgress),
                    behavior: 'auto' // We're handling the animation ourselves
                });

                if (timeElapsed < duration) {
                    requestAnimationFrame(scrollAnimation);
                }
            }

            requestAnimationFrame(scrollAnimation);
        });
    }

    // Initialize scroll-to-top button
    addScrollToTopButton();

    // TODO: Implement form submission handler for contact forms

    // Mark the end of DOM content initialization
    if (window.performance && window.performance.mark) {
        window.performance.mark('dom-init-complete');
        window.performance.measure('dom-content-to-init', 'dom-content-loaded', 'dom-init-complete');
    }
});

// Window load event - all resources loaded
window.addEventListener('load', function() {
    // Mark window load complete for performance measurement
    if (window.performance && window.performance.mark) {
        window.performance.mark('window-load-complete');
        window.performance.measure('init-to-load', 'dom-init-complete', 'window-load-complete');
        window.performance.measure('total-page-load', 'page-start', 'window-load-complete');

        // Log performance metrics to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const perfEntries = performance.getEntriesByType('measure');
            console.group('Performance Metrics:');
            perfEntries.forEach(measure => {
                console.log(`${measure.name}: ${Math.round(measure.duration)}ms`);
            });
            console.groupEnd();
        }
    }
});