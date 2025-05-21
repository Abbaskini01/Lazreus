/**
 * Main JavaScript file for Lazreus Tech website
 *
 * This file handles:
 * 1. Navbar functionality (toggle, dropdown, responsive behavior)
 * 2. Smart navbar behavior (expand/collapse on scroll)
 * 3. Background animation effects
 * 4. Smooth scrolling for anchor links
 * 5. Section reveal animations
 *
 * Note for backend developers:
 * - This file is primarily for frontend UI interactions
 * - Any API calls or data fetching should be added in the appropriate sections below
 * - Form submissions and AJAX requests should be implemented with proper error handling
 */

// Execute all code when DOM is fully loaded to ensure all elements are available
document.addEventListener('DOMContentLoaded', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navbar = document.querySelector('.navbar');

    /**
     * Background animation elements
     * These elements create the space-themed parallax effect when scrolling
     */
    const stars = document.querySelectorAll('.stars');
    const nebulas = document.querySelectorAll('.nebula');

    /**
     * Smart navbar scroll behavior variables
     * These control how the navbar responds to scrolling actions
     */
    let lastScrollTop = 0;                // Tracks the previous scroll position
    const scrollThreshold = 10;           // Minimum scroll amount to trigger navbar change
    let isScrollingNavbar = false;        // Flag to throttle navbar scroll events for performance

    // Initialize navbar with expanded state by default
    navbar.classList.add('navbar-expanded');

    /**
     * Navbar functionality
     *
     * Handles all interactive elements of the navigation bar:
     * - Mobile menu toggle
     * - Dropdown menus
     * - Responsive behavior
     * - Accessibility attributes
     */
    if (navbarToggler && navbarCollapse) {
        /**
         * Mobile menu toggle handler
         *
         * Shows/hides the mobile navigation menu when the hamburger icon is clicked
         * Also updates ARIA attributes for accessibility compliance
         */
        navbarToggler.addEventListener('click', function(e) {
            e.preventDefault();
            navbarCollapse.classList.toggle('show');

            // Update ARIA expanded attribute for screen readers
            const expanded = navbarCollapse.classList.contains('show');
            navbarToggler.setAttribute('aria-expanded', expanded);
        });

        /**
         * Dropdown menu handling
         *
         * Controls the behavior of dropdown menus in the navigation
         * Different behavior on mobile vs desktop
         */
        const dropdownItems = document.querySelectorAll('.nav-item.dropdown');

        // Mobile-specific dropdown toggle behavior
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

        /**
         * Auto-close menu when regular nav links are clicked
         *
         * Improves UX by automatically closing the mobile menu
         * when a user clicks on a navigation link
         */
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

        /**
         * Auto-close menu when dropdown items are clicked
         *
         * Similar to nav links, closes the mobile menu when
         * a user selects an item from a dropdown menu
         */
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

        /**
         * Close menu when clicking outside the navbar
         *
         * Improves UX by closing the menu when a user
         * clicks anywhere else on the page
         */
        document.addEventListener('click', function(e) {
            if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
                navbarToggler.setAttribute('aria-expanded', 'false');
            }
        });

        /**
         * Handle window resize events
         *
         * Ensures proper menu state when switching between
         * mobile and desktop viewport sizes
         */
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

    /**
     * Smart Navbar Scroll Behavior
     *
     * Creates a dynamic navbar that responds to scroll direction:
     * - Expands when scrolling up (showing full navbar)
     * - Collapses when scrolling down (showing minimal navbar)
     * - Always expands at the top of the page
     *
     * This improves UX by providing more screen space when reading content
     * while keeping navigation accessible when needed.
     *
     * Note: The navbar remains fixed at all times, only its height changes.
     */
    function handleNavbarScroll() {
        // Get current scroll position using cross-browser compatible approach
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

        // Special case: Always show expanded navbar at the top of the page
        if (currentScrollTop <= 10) {
            navbar.classList.remove('navbar-collapsed');
            navbar.classList.add('navbar-expanded');

            // Adjust content wrapper padding for larger navbar at the top
            if (window.innerWidth > 991) {
                document.querySelector('.content-wrapper').style.paddingTop = '70px';
            } else {
                document.querySelector('.content-wrapper').style.paddingTop = '60px';
            }

            lastScrollTop = currentScrollTop;
            return;
        }

        // Only trigger navbar state change if we've scrolled enough
        // This prevents rapid toggling when scroll amount is minimal
        if (Math.abs(lastScrollTop - currentScrollTop) <= scrollThreshold) {
            return;
        }

        // Determine scroll direction and update navbar accordingly
        if (currentScrollTop > lastScrollTop) {
            // Scrolling DOWN - collapse navbar to maximize content space
            navbar.classList.remove('navbar-expanded');
            navbar.classList.add('navbar-collapsed');

            // Adjust content wrapper padding for smaller navbar
            if (window.innerWidth > 991) {
                document.querySelector('.content-wrapper').style.paddingTop = '50px';
            } else {
                document.querySelector('.content-wrapper').style.paddingTop = '45px';
            }
        } else {
            // Scrolling UP - expand navbar to make navigation accessible
            navbar.classList.remove('navbar-collapsed');
            navbar.classList.add('navbar-expanded');

            // Adjust content wrapper padding for larger navbar
            if (window.innerWidth > 991) {
                document.querySelector('.content-wrapper').style.paddingTop = '70px';
            } else {
                document.querySelector('.content-wrapper').style.paddingTop = '60px';
            }
        }

        // Store current position for next comparison
        lastScrollTop = currentScrollTop;
    }

    /**
     * Performance-optimized scroll event handler
     *
     * Uses requestAnimationFrame to throttle scroll events
     * This significantly improves performance by limiting
     * how often the scroll handler executes
     */
    window.addEventListener('scroll', function() {
        if (!isScrollingNavbar) {
            window.requestAnimationFrame(function() {
                handleNavbarScroll();
                isScrollingNavbar = false;
            });
            isScrollingNavbar = true;
        }
    }, { passive: true });

    /**
     * Active Navigation Highlighting
     *
     * Automatically highlights the current section in the navigation menu
     * as the user scrolls through the page. This provides visual feedback
     * about the user's current position on the page.
     *
     * @integration-point Backend developers can extend this to work with
     * dynamically loaded sections or content from APIs
     */
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

    /**
     * Enhanced Parallax Background Animation
     *
     * Creates a depth effect by moving background elements at different speeds
     * as the user scrolls. This creates an immersive space-themed experience.
     *
     * Improvements:
     * - Uses requestAnimationFrame for smoother animation
     * - Implements hardware acceleration with transform3d
     * - Adds subtle rotation effects for more dynamic movement
     * - Optimizes performance with throttling and efficient transforms
     * - Scales animation intensity based on device capabilities
     */

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

            // Animate stars with parallax effect - each star layer moves at different speed
            stars.forEach((star, index) => {
                // Calculate depth factor - each star layer has increasing depth
                const depth = 0.5 + (index * 0.25);

                // Calculate subtle rotation based on scroll position
                const rotation = scrollY * 0.005 * (index % 2 === 0 ? 1 : -1) * animationIntensity;

                // Apply vertical translation based on scroll position and depth
                // Using transform3d for hardware acceleration
                star.style.transform = `translate3d(0, ${scrollY * 0.05 * depth * animationIntensity}px, 0) rotate(${rotation}deg)`;

                // Apply subtle opacity variation for twinkling effect
                const opacityVariation = 0.8 + (Math.sin(scrollY * 0.001 + index) * 0.1);
                star.style.opacity = opacityVariation;
            });

            // Animate nebulas with parallax effect - move in different directions
            nebulas.forEach((nebula, index) => {
                // Alternate between left/right movement for varied effect
                const direction = index % 2 === 0 ? 1 : -1;

                // Each nebula moves at slightly different speed
                const speed = 0.02 + (index * 0.01);

                // Calculate subtle scale effect based on scroll position
                const scale = 1 + (Math.sin(scrollY * 0.001 + index) * 0.05);

                // Apply diagonal translation and scale for more dynamic movement
                // Using transform3d for hardware acceleration
                nebula.style.transform = `translate3d(${scrollY * speed * direction * animationIntensity}px, ${scrollY * speed * animationIntensity}px, 0) scale(${scale})`;

                // Apply subtle opacity variation
                const opacityVariation = 0.3 + (Math.sin(scrollY * 0.0005 + index) * 0.05);
                nebula.style.opacity = opacityVariation;
            });

            // Add subtle rotation to shooting stars based on scroll position
            const shootingStars = document.querySelectorAll('.shooting-star');
            shootingStars.forEach((star, index) => {
                const rotationAngle = 20 + (scrollProgress * 5 * (index % 2 === 0 ? 1 : -1));
                star.style.transform = `rotate(${rotationAngle}deg)`;
            });

            // Clear the animation frame ID since the animation is complete
            animationFrameId = null;
        });
    }

    /**
     * Enhanced Smooth Scrolling for Anchor Links
     *
     * Provides smooth scrolling animation when clicking on any link
     * that points to an anchor/section on the same page.
     *
     * Features:
     * - Custom easing function for more natural movement
     * - Adjustable speed based on scroll distance
     * - Responsive navbar offset calculation
     * - Prevents multiple scroll animations from running simultaneously
     */
    let isScrolling = false;
    const scrollDuration = 1000; // Base duration in milliseconds

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
            const adjustedDuration = Math.min(
                scrollDuration,
                scrollDuration * Math.abs(distance) / 1000
            );

            // Set flag to prevent multiple simultaneous scroll animations
            isScrolling = true;

            // Timestamp of when the animation started
            let startTime = null;

            /**
             * Easing function for smoother acceleration/deceleration
             * Uses easeInOutQuart for a natural feel
             */
            function easeInOutQuart(t) {
                return t < 0.5
                    ? 8 * t * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 4) / 2;
            }

            /**
             * Scroll animation frame
             * Uses requestAnimationFrame for smoother performance
             */
            function scrollAnimation(currentTime) {
                if (startTime === null) startTime = currentTime;

                // Calculate time elapsed
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / adjustedDuration, 1);
                const easedProgress = easeInOutQuart(progress);

                // Apply the scroll
                window.scrollTo(0, startPosition + distance * easedProgress);

                // Continue animation if not complete
                if (timeElapsed < adjustedDuration) {
                    requestAnimationFrame(scrollAnimation);
                } else {
                    // Ensure we land exactly on target
                    window.scrollTo(0, targetPosition);
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

    /**
     * Enhanced Section Reveal Animation
     *
     * Adds sophisticated reveal animations to sections as they
     * enter the viewport while scrolling. This creates a more
     * engaging and dynamic page experience.
     *
     * Improvements:
     * - Staggered animations for child elements
     * - Different animation styles for different section types
     * - Smoother transitions with cubic-bezier easing
     * - Progressive loading effect for list items
     * - Optimized for performance with IntersectionObserver
     *
     * @integration-point Backend developers can use this pattern
     * for animating dynamically loaded content from APIs
     */
    const allSections = document.querySelectorAll('section');

    /**
     * Create and inject enhanced CSS animations
     *
     * This approach allows us to keep the animation logic together
     * rather than splitting between JS and CSS files
     */
    const style = document.createElement('style');
    style.textContent = `
        /* Base section animation - initial state */
        section {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.9s cubic-bezier(0.25, 0.1, 0.25, 1),
                        transform 0.9s cubic-bezier(0.25, 0.1, 0.25, 1);
            will-change: opacity, transform;
        }

        /* Active state - visible and in final position */
        section.active-section {
            opacity: 1;
            transform: translateY(0);
        }

        /* Staggered animations for child elements */
        section.active-section h1 {
            animation: fadeSlideIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
            animation-delay: 0.1s;
        }

        section.active-section h2 {
            animation: fadeSlideIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
            animation-delay: 0.2s;
        }

        section.active-section p {
            animation: fadeSlideIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
            animation-delay: 0.3s;
        }

        section.active-section button {
            animation: fadeSlideIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
            animation-delay: 0.4s;
        }

        /* Progressive loading for list items */
        section.active-section li {
            animation: fadeSlideIn 0.6s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
            opacity: 0;
        }

        section.active-section li:nth-child(1) { animation-delay: 0.3s; }
        section.active-section li:nth-child(2) { animation-delay: 0.4s; }
        section.active-section li:nth-child(3) { animation-delay: 0.5s; }
        section.active-section li:nth-child(4) { animation-delay: 0.6s; }
        section.active-section li:nth-child(5) { animation-delay: 0.7s; }
        section.active-section li:nth-child(n+6) { animation-delay: 0.8s; }

        /* Service cards staggered animation */
        section.active-section .service-card {
            animation: fadeScaleIn 0.8s cubic-bezier(0.25, 0.1, 0.25, 1.4) forwards;
            opacity: 0;
            transform: scale(0.95);
        }

        section.active-section .service-card:nth-child(1) { animation-delay: 0.1s; }
        section.active-section .service-card:nth-child(2) { animation-delay: 0.2s; }
        section.active-section .service-card:nth-child(3) { animation-delay: 0.3s; }
        section.active-section .service-card:nth-child(4) { animation-delay: 0.4s; }
        section.active-section .service-card:nth-child(5) { animation-delay: 0.5s; }
        section.active-section .service-card:nth-child(6) { animation-delay: 0.6s; }
        section.active-section .service-card:nth-child(n+7) { animation-delay: 0.7s; }

        /* Animation keyframes */
        @keyframes fadeSlideIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeScaleIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        /* Ensure elements are hidden before animation */
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

    /**
     * Use IntersectionObserver for more efficient section reveal
     * This is more performant than checking positions on every scroll
     */
    const sectionObserver = new IntersectionObserver((entries, observer) => {
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
    }, {
        root: null, // Use viewport as root
        threshold: 0.15, // Trigger when 15% of the section is visible
        rootMargin: '-100px 0px' // Offset trigger point by 100px
    });

    // Start observing all sections
    allSections.forEach(section => {
        sectionObserver.observe(section);
    });

    /**
     * Legacy fallback for browsers that don't support IntersectionObserver
     * This ensures the animation works on all browsers
     */
    function revealSections() {
        // Skip if IntersectionObserver is supported
        if ('IntersectionObserver' in window) return;

        const windowHeight = window.innerHeight;
        const revealPoint = 150; // Trigger animation 150px before section enters viewport

        allSections.forEach(section => {
            // Get section's position relative to the viewport
            const sectionTop = section.getBoundingClientRect().top;

            // Check if section has entered the reveal threshold
            if (sectionTop < windowHeight - revealPoint) {
                section.classList.add('active-section');
            }
        });
    }

    /**
     * Optimized Scroll Event Handler
     *
     * Centralized scroll event handler that triggers all scroll-based
     * functions with performance optimizations:
     * - Uses requestAnimationFrame for smoother animations
     * - Throttles execution to prevent performance issues
     * - Prioritizes critical animations
     * - Debounces expensive operations
     *
     * @performance Using these techniques significantly improves page performance
     */

    // Throttle variables to prevent too many scroll events
    let scrollTimeout;
    let lastScrollTime = 0;
    const scrollThrottleDelay = 10; // ms between scroll processing

    // Track if the page is visible to pause animations when tab is inactive
    let pageIsVisible = true;

    // Listen for visibility changes to pause/resume animations
    document.addEventListener('visibilitychange', () => {
        pageIsVisible = document.visibilityState === 'visible';
    });

    // Main scroll handler with throttling
    window.addEventListener('scroll', function() {
        // Skip processing if page is not visible
        if (!pageIsVisible) return;

        // Get current time for throttling
        const now = performance.now();

        // Process critical animations immediately (navbar)
        handleNavbarScroll();

        // Throttle other animations for performance
        if (now - lastScrollTime > scrollThrottleDelay) {
            lastScrollTime = now;

            // Use requestAnimationFrame to sync with browser refresh
            cancelAnimationFrame(scrollTimeout);
            scrollTimeout = requestAnimationFrame(() => {
                // Process in order of visual importance
                highlightNavOnScroll();  // Update active navigation links
                animateBackground();     // Animate parallax background elements

                // Only run the legacy reveal if IntersectionObserver is not supported
                if (!('IntersectionObserver' in window)) {
                    revealSections();    // Reveal sections as they enter viewport
                }
            });
        }
    }, { passive: true }); // Use passive listener for better scroll performance

    /**
     * Resize Handler
     *
     * Handle window resize events with debouncing
     * This ensures animations adapt to new viewport dimensions
     */
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

    /**
     * Initialize Page State
     *
     * Call all functions once on page load to set up initial state
     * This ensures everything is properly set up before user interaction
     */
    /**
     * Page Loading Animation and Enhanced UI Effects
     *
     * Creates a smooth fade-in effect when the page loads and adds
     * interactive UI enhancements like custom cursor effects.
     *
     * This improves perceived performance and provides a more polished experience.
     */
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
        let cursorEnlarged = false;

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
                    cursorEnlarged = true;
                    cursorEffect.classList.add('hover');
                });

                el.addEventListener('mouseout', () => {
                    cursorEnlarged = false;
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

    /**
     * Scroll-to-Top Button
     *
     * Adds a button that appears when the user scrolls down
     * and allows them to smoothly scroll back to the top of the page.
     *
     * Features:
     * - Appears/disappears based on scroll position
     * - Smooth animation when scrolling to top
     * - Accessible with keyboard navigation
     * - Responsive design that works on all devices
     */
    function addScrollToTopButton() {
        // Create the button element
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'scroll-top-btn';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
        scrollTopBtn.setAttribute('title', 'Scroll to top');
        scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';

        // Add the button to the document
        document.body.appendChild(scrollTopBtn);

        // Function to toggle button visibility
        function toggleScrollTopButton() {
            if (window.pageYOffset > 300) {
                if (!scrollTopBtn.classList.contains('visible')) {
                    scrollTopBtn.classList.add('visible');
                }
            } else {
                if (scrollTopBtn.classList.contains('visible')) {
                    scrollTopBtn.classList.remove('visible');
                }
            }
        }

        // Add scroll event listener to toggle button visibility
        window.addEventListener('scroll', function() {
            // Use requestAnimationFrame for better performance
            requestAnimationFrame(toggleScrollTopButton);
        });

        // Add click event listener to scroll to top
        scrollTopBtn.addEventListener('click', function(e) {
            e.preventDefault();

            // Use the enhanced smooth scrolling function
            const startPosition = window.pageYOffset;
            const duration = 800; // ms
            let startTime = null;

            function scrollAnimation(currentTime) {
                if (startTime === null) startTime = currentTime;

                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);

                // Use easeInOutQuart easing function for natural feel
                const easedProgress = progress < 0.5
                    ? 8 * progress * progress * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 4) / 2;

                window.scrollTo(0, startPosition * (1 - easedProgress));

                if (timeElapsed < duration) {
                    requestAnimationFrame(scrollAnimation);
                }
            }

            requestAnimationFrame(scrollAnimation);
        });
    }

    // Initialize scroll-to-top button
    addScrollToTopButton();

    /**
     * Form Submission Handler
     *
     * @todo Implement form submission handler for contact forms
     * This should include:
     * - Form validation
     * - AJAX submission to backend API
     * - Success/error handling
     * - User feedback (loading indicators, success/error messages)
     *
     * Example implementation:
     *
     * document.querySelector('#contact-form').addEventListener('submit', function(e) {
     *     e.preventDefault();
     *
     *     // Validate form
     *     const isValid = validateForm(this);
     *     if (!isValid) return;
     *
     *     // Show loading indicator
     *     showLoadingIndicator();
     *
     *     // Collect form data
     *     const formData = new FormData(this);
     *
     *     // Submit to backend API
     *     fetch('/api/contact', {
     *         method: 'POST',
     *         body: formData
     *     })
     *     .then(response => response.json())
     *     .then(data => {
     *         // Handle success
     *         hideLoadingIndicator();
     *         showSuccessMessage(data.message);
     *         resetForm(this);
     *     })
     *     .catch(error => {
     *         // Handle error
     *         hideLoadingIndicator();
     *         showErrorMessage(error.message);
     *     });
     * });
     */
});