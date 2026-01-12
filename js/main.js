/**
 * My Living Hope - Main JavaScript
 * Handles navigation, scroll effects, animations, and Shopify integration
 */

(function() {
    'use strict';

    // =============================================
    // DOM Elements
    // =============================================
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
    const revealElements = document.querySelectorAll('.reveal');

    // =============================================
    // Navigation Scroll Effect
    // =============================================
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
        if (window.scrollY > 50) {
            nav.classList.add('nav--scrolled');
        } else {
            nav.classList.remove('nav--scrolled');
        }
        ticking = false;
    }

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(updateNav);
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // =============================================
    // Mobile Menu Toggle
    // =============================================
    function toggleMobileMenu() {
        const isOpen = mobileMenu.classList.contains('mobile-menu--open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.add('mobile-menu--open');
        navToggle.classList.add('nav__toggle--active');
        navToggle.setAttribute('aria-expanded', 'true');
        mobileMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('mobile-menu--open');
        navToggle.classList.remove('nav__toggle--active');
        navToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking a link
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
            closeMobileMenu();
        }
    });

    // =============================================
    // Smooth Scroll for Anchor Links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const navHeight = nav.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });

    // =============================================
    // Scroll Reveal Animation
    // =============================================
    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        const revealPoint = 100;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('reveal--active');
            }
        });
    }

    // Throttled scroll handler for reveal
    let revealTicking = false;
    
    function handleRevealScroll() {
        if (!revealTicking) {
            window.requestAnimationFrame(() => {
                revealOnScroll();
                revealTicking = false;
            });
            revealTicking = true;
        }
    }

    window.addEventListener('scroll', handleRevealScroll, { passive: true });
    
    // Initial check for elements already in view
    revealOnScroll();

    // =============================================
    // Active Navigation Link
    // =============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    function updateActiveNavLink() {
        const scrollY = window.scrollY;
        const navHeight = nav.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('nav__link--active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('nav__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });

    // =============================================
    // Form Handling
    // =============================================
    const contactForm = document.querySelector('.contact__form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('.form__submit');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Note: For actual deployment, you'll want to handle the form submission
            // via Formspree, Netlify Forms, or your own backend
            
            // If using native form submission, the page will redirect
            // If you want to handle via AJAX, prevent default and add your logic:
            /*
            e.preventDefault();
            
            const formData = new FormData(this);
            
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    submitBtn.textContent = 'Sent!';
                    this.reset();
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                submitBtn.textContent = 'Error - Try Again';
                submitBtn.disabled = false;
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                }, 3000);
            });
            */
        });
    }

    // =============================================
    // Shopify Buy Button Integration
    // =============================================
    // This integrates with Shopify's Buy Button SDK for embedded purchasing
    // To enable this, you need to:
    // 1. Get your Storefront Access Token from Shopify Admin
    // 2. Replace 'your-storefront-access-token' below
    // 3. Uncomment the initialization code

    /*
    (function() {
        const scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        
        function loadShopify() {
            const script = document.createElement('script');
            script.async = true;
            script.src = scriptURL;
            script.onload = ShopifyBuyInit;
            document.head.appendChild(script);
        }

        function ShopifyBuyInit() {
            const client = ShopifyBuy.buildClient({
                domain: 'mylivinghope.org.nz',
                storefrontAccessToken: 'your-storefront-access-token'
            });

            ShopifyBuy.UI.onReady(client).then(function(ui) {
                // Store UI instance globally for later use
                window.shopifyUI = ui;

                // Create buy buttons for each product
                createBuyButton(ui, '45789688955011', 'product-buy-button-1'); // Feelings & Needs
                createBuyButton(ui, '45789697540227', 'product-buy-button-2'); // Images & Colours
                createBuyButton(ui, '45676430131331', 'product-buy-button-3'); // Full Set
            });
        }

        function createBuyButton(ui, variantId, containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            ui.createComponent('product', {
                id: variantId,
                node: container,
                moneyFormat: '%24%7B%7Bamount%7D%7D',
                options: {
                    product: {
                        styles: {
                            product: {
                                '@media (min-width: 601px)': {
                                    'max-width': '100%',
                                    'margin-left': '0',
                                    'margin-bottom': '0'
                                }
                            },
                            button: {
                                'font-family': 'Montserrat, sans-serif',
                                'font-weight': '600',
                                'font-size': '15px',
                                'padding-top': '16px',
                                'padding-bottom': '16px',
                                'color': '#ffffff',
                                ':hover': {
                                    'background-color': '#265438'
                                },
                                'background-color': '#336f49',
                                ':focus': {
                                    'background-color': '#265438'
                                },
                                'border-radius': '50px'
                            }
                        },
                        contents: {
                            img: false,
                            title: false,
                            price: false
                        },
                        text: {
                            button: 'Add to Cart'
                        }
                    },
                    cart: {
                        styles: {
                            button: {
                                'font-family': 'Montserrat, sans-serif',
                                'font-weight': '600',
                                'color': '#ffffff',
                                ':hover': {
                                    'background-color': '#265438'
                                },
                                'background-color': '#336f49',
                                ':focus': {
                                    'background-color': '#265438'
                                },
                                'border-radius': '50px'
                            }
                        },
                        text: {
                            total: 'Subtotal',
                            button: 'Checkout'
                        }
                    },
                    toggle: {
                        styles: {
                            toggle: {
                                'font-family': 'Montserrat, sans-serif',
                                'background-color': '#336f49',
                                ':hover': {
                                    'background-color': '#265438'
                                },
                                ':focus': {
                                    'background-color': '#265438'
                                }
                            }
                        }
                    }
                }
            });
        }

        if (window.ShopifyBuy) {
            if (window.ShopifyBuy.UI) {
                ShopifyBuyInit();
            } else {
                loadShopify();
            }
        } else {
            loadShopify();
        }
    })();
    */

    // =============================================
    // Intersection Observer for Performance
    // =============================================
    // Lazy load images that are off-screen
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // =============================================
    // Prefers Reduced Motion
    // =============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    function handleReducedMotion() {
        if (prefersReducedMotion.matches) {
            // Disable animations for users who prefer reduced motion
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-base', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
            
            // Immediately reveal all elements
            revealElements.forEach(el => el.classList.add('reveal--active'));
        }
    }
    
    handleReducedMotion();
    prefersReducedMotion.addEventListener('change', handleReducedMotion);

    // =============================================
    // Console Welcome Message
    // =============================================
    console.log('%c🕯️ My Living Hope', 'font-size: 24px; font-weight: bold; color: #336F49;');
    console.log('%cLight in the Darkness', 'font-size: 14px; color: #212021;');
    console.log('%cBuilt with ♥ in New Zealand', 'font-size: 12px; color: #8a8788;');

})();
