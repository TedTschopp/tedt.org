/**
 * Homepage Experimental Designs - Animation & Interaction Handler
 * Supports 5 alternative homepage layouts with scroll triggers, parallax, 3D effects
 *
 * Designs: 1) Split-Screen Discovery, 2) Infinite Waterfall, 3) Hero Morph Reveal,
 *          4) Vertical Timeline, 5) 3D Card Stack
 */

(function () {
  'use strict';

  // ============================================================================
  // UTILITY: Check if element is in viewport
  // ============================================================================

  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }

  // ============================================================================
  // DESIGN 3: HERO MORPH REVEAL - Sticky hero shrink effect
  // ============================================================================

  function initHeroMorph() {
    const morphSection = document.querySelector('.homepage--hero-morph');
    if (!morphSection) return;

    const heroContainer = document.querySelector('.hero-morph-container');
    const heroOverlay = document.querySelector('.hero-morph-overlay');
    const originalHeight = heroContainer.offsetHeight;
    let hasScrolledPast = false;

    window.addEventListener('scroll', debounce(() => {
      const scrollY = window.scrollY;
      const triggerPoint = originalHeight * 0.5;

      if (scrollY > triggerPoint && !hasScrolledPast) {
        heroContainer.classList.add('morphed');
        if (heroOverlay) heroOverlay.classList.add('morphed');
        hasScrolledPast = true;
      } else if (scrollY <= triggerPoint && hasScrolledPast) {
        heroContainer.classList.remove('morphed');
        if (heroOverlay) heroOverlay.classList.remove('morphed');
        hasScrolledPast = false;
      }
    }, 50));
  }

  // ============================================================================
  // DESIGN 4: VERTICAL TIMELINE - Enhanced timeline styling
  // ============================================================================

  function initTimeline() {
    const timelineItems = document.querySelectorAll('.homepage--timeline .timeline-item');
    if (timelineItems.length === 0) return;

    // Intersection Observer for staggered animation on scroll into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    timelineItems.forEach((item) => {
      item.style.animationPlayState = 'paused';
      observer.observe(item);
    });
  }

  // ============================================================================
  // DESIGN 5: 3D CARD STACK - Rotation and perspective effects
  // ============================================================================

  function init3DStack() {
    const stackContainer = document.querySelector('.homepage--3d-stack .card-stack');
    if (!stackContainer) return;

    const cards = stackContainer.querySelectorAll('.stack-card');
    if (cards.length === 0) return;

    let currentIndex = 0;

    // Button controls
    const prevBtn = document.querySelector('.stack-container .stack-button[data-direction="prev"]');
    const nextBtn = document.querySelector('.stack-container .stack-button[data-direction="next"]');

    function updateCardPositions() {
      cards.forEach((card, index) => {
        card.classList.remove('rotate-front', 'rotate-next', 'rotate-back', 'hide');

        const position = (index - currentIndex + cards.length) % cards.length;

        if (position === 0) {
          card.classList.add('rotate-front');
        } else if (position === 1) {
          card.classList.add('rotate-next');
        } else if (position === 2) {
          card.classList.add('rotate-back');
        } else {
          card.classList.add('hide');
        }
      });
    }

    function rotateNext() {
      currentIndex = (currentIndex + 1) % cards.length;
      updateCardPositions();
    }

    function rotatePrev() {
      currentIndex = (currentIndex - 1 + cards.length) % cards.length;
      updateCardPositions();
    }

    if (nextBtn) nextBtn.addEventListener('click', rotateNext);
    if (prevBtn) prevBtn.addEventListener('click', rotatePrev);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!stackContainer) return;
      if (isInViewport(stackContainer)) {
        if (e.key === 'ArrowRight') rotateNext();
        if (e.key === 'ArrowLeft') rotatePrev();
      }
    });

    // Auto-rotate on scroll (optional - slow, smooth rotation as user scrolls past container)
    let lastScrollTop = 0;
    const autoRotateSpeed = 0.5; // cards per 1000px scrolled

    window.addEventListener('scroll', debounce(() => {
      if (!isInViewport(stackContainer)) return;

      const scrollY = window.scrollY;
      const scrollDelta = Math.abs(scrollY - lastScrollTop);

      if (scrollDelta > 10) {
        const cardRotations = Math.floor((scrollDelta * autoRotateSpeed) / 100);
        if (scrollY > lastScrollTop) {
          for (let i = 0; i < cardRotations; i++) rotateNext();
        }
        lastScrollTop = scrollY;
      }
    }, 50));

    // Initialize positions
    updateCardPositions();
  }

  // ============================================================================
  // PARALLAX EFFECTS - Apply to hero images and background elements
  // ============================================================================

  function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', debounce(() => {
      parallaxElements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
        const yOffset = window.scrollY * speed;
        el.style.transform = `translateY(${yOffset}px)`;
      });
    }, 10));
  }

  // ============================================================================
  // DESIGN 2: INFINITE WATERFALL - Lazy load and expand cards
  // ============================================================================

  function initWaterfall() {
    const expandButtons = document.querySelectorAll('.homepage--waterfall .expand-button');
    if (expandButtons.length === 0) return;

    expandButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.waterfall-card');
        const content = card.querySelector('.card-content');

        if (content.classList.contains('expanded')) {
          content.style.maxHeight = '100px';
          content.classList.remove('expanded');
          btn.textContent = 'Read More';
        } else {
          content.style.maxHeight = 'none';
          content.classList.add('expanded');
          btn.textContent = 'Show Less';
        }
      });
    });

    // Lazy load images when cards come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('.card-image');
          if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.homepage--waterfall .waterfall-card').forEach((card) => {
      observer.observe(card);
    });
  }

  // ============================================================================
  // DESIGN 1: SPLIT-SCREEN DISCOVERY - Category card hover interactions
  // ============================================================================

  function initSplitScreen() {
    const categoryCards = document.querySelectorAll('.homepage--split-screen .category-peek-card');
    if (categoryCards.length === 0) return;

    categoryCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        // Highlight this card, slightly dim others
        categoryCards.forEach((c) => {
          if (c !== card) {
            c.style.opacity = '0.6';
          }
        });
        card.style.opacity = '1';
      });

      card.addEventListener('mouseleave', () => {
        // Reset opacity for all cards
        categoryCards.forEach((c) => {
          c.style.opacity = '1';
        });
      });

      // Click to navigate to category page
      card.addEventListener('click', () => {
        const href = card.dataset.href;
        if (href) window.location.href = href;
      });
    });
  }

  // ============================================================================
  // INTERSECTION OBSERVER - Trigger animations when elements come into view
  // ============================================================================

  function initIntersectionObserver() {
    const animatedElements = document.querySelectorAll(
      '.homepage--waterfall .waterfall-card, ' +
      '.homepage--hero-morph .category-morph-card, ' +
      '.homepage--timeline .timeline-item'
    );

    if (animatedElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger animation by setting a flag (CSS-driven animations activate via animation-play-state)
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, { threshold: 0.1 });

    animatedElements.forEach((el) => {
      el.style.animationPlayState = 'paused';
      observer.observe(el);
    });
  }

  // ============================================================================
  // UTILITY: Debounce function for scroll/resize events
  // ============================================================================

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

  // ============================================================================
  // INITIALIZATION - Run all setup functions
  // ============================================================================

  function init() {
    // Detect which homepage variant is loaded
    const htmlElement = document.documentElement;

    // Run design-specific initializers
    initHeroMorph();       // Design 3
    init3DStack();         // Design 5
    initTimeline();        // Design 4
    initWaterfall();       // Design 2
    initSplitScreen();     // Design 1

    // Global utilities
    initParallax();
    initIntersectionObserver();
  }

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
