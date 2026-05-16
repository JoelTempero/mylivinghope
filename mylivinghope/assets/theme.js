/**
 * My Living Hope - Theme JavaScript
 */

(function() {
  'use strict';

  // =============================================
  // DOM Ready
  // =============================================
  document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollReveal();
    initSmoothScroll();
  });

  // =============================================
  // Navigation
  // =============================================
  function initNavigation() {
    const nav = document.querySelector('.header');
    const navToggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    // Scroll effect
    let lastScrollY = 0;
    let ticking = false;

    function updateNav() {
      if (window.scrollY > 50) {
        nav.classList.add('header--scrolled');
      } else {
        nav.classList.remove('header--scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function() {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    // Mobile menu toggle
    if (navToggle && mobileMenu) {
      navToggle.addEventListener('click', function() {
        const isOpen = mobileMenu.classList.contains('mobile-menu--open');
        
        if (isOpen) {
          mobileMenu.classList.remove('mobile-menu--open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        } else {
          mobileMenu.classList.add('mobile-menu--open');
          navToggle.setAttribute('aria-expanded', 'true');
          document.body.style.overflow = 'hidden';
        }
      });

      // Close on link click
      mobileLinks.forEach(function(link) {
        link.addEventListener('click', function() {
          mobileMenu.classList.remove('mobile-menu--open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        });
      });

      // Close on escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
          mobileMenu.classList.remove('mobile-menu--open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // =============================================
  // Scroll Reveal
  // =============================================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    
    if (!elements.length) return;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '-50px 0px',
      threshold: 0.1
    });

    elements.forEach(function(el) {
      observer.observe(el);
    });
  }

  // =============================================
  // Smooth Scroll
  // =============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          history.pushState(null, null, href);
        }
      });
    });
  }

  // =============================================
  // Reduced Motion Check
  // =============================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  
  if (prefersReducedMotion.matches) {
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('reveal--active');
    });
  }

})();
