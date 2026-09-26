/**
 * Portfolio JavaScript - Scroll Navigation & Cinematic Intro
 * Single-Page Scroll Layout: Home → Portfolio → Contact
 */

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const navIndicator = document.querySelector('.nav-indicator');
  const navList = document.querySelector('.nav-list');
  const siteHeader = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');

  // ==========================================================================
  // Nav Indicator Positioning
  // ==========================================================================

  function updateIndicator(targetLink, animate = true) {
    if (!targetLink || !navIndicator || !navList) return;

    navIndicator.style.transition = animate
      ? 'left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease'
      : 'none';

    const navRect = navList.getBoundingClientRect();
    const linkRect = targetLink.getBoundingClientRect();

    navIndicator.style.left  = `${linkRect.left - navRect.left}px`;
    navIndicator.style.width = `${linkRect.width}px`;
    navIndicator.style.opacity = '1';
  }

  // Initial indicator position
  setTimeout(() => {
    const initial = document.querySelector('.nav-link.active');
    if (initial) updateIndicator(initial, false);
    setTimeout(() => {
      if (navIndicator) {
        navIndicator.style.transition = 'left 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.25s ease';
      }
    }, 50);
  }, 100);

  // Hover effect: indicator glides to hovered item then returns
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (window.innerWidth > 768) updateIndicator(link, true);
    });
    link.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        const active = document.querySelector('.nav-link.active');
        if (active) updateIndicator(active, true);
      }
    });
  });

  // ==========================================================================
  // Smooth Scroll Navigation
  // ==========================================================================

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mainNav && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        mobileToggle?.classList.remove('active');
      }
    });
  });

  // ==========================================================================
  // Header Scroll Backdrop Effect + Home Glow Fade
  // ==========================================================================

  window.addEventListener('scroll', () => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 40);

  }, { passive: true });

  // Re-position indicator on resize
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active && window.innerWidth > 768) updateIndicator(active, false);
  });

  // ==========================================================================
  // Mobile Menu Toggle
  // ==========================================================================

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (mainNav.classList.contains('open') &&
          !mainNav.contains(e.target) &&
          !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('open');
        mobileToggle.classList.remove('active');
      }
    });
  }

  // ==========================================================================
  // Cinematic Intro Animation Sequence
  // Phrases:
  // 1. "ผมไม่เคยชนะอะไรเลย" (2s)
  // 2. "แต่ผมก็ได้เรียนรู้จากความพ่ายแพ้อยู่เสมอ" (2s)
  // 3. "เพื่อที่สักวันผมจะเป็น ผู้ชนะ" (2.5s)
  // -> Fade to main website
  // ==========================================================================

  const introOverlay       = document.getElementById('introOverlay');
  const introSkipBtn       = document.getElementById('introSkipBtn');
  const introFloatingGallery = document.getElementById('introFloatingGallery');
  const heroContent        = document.getElementById('heroContent');
  const heroMedia          = document.querySelector('.hero-media');
  const phrase1            = document.getElementById('introPhrase1');
  const phrase2            = document.getElementById('introPhrase2');
  const phrase3            = document.getElementById('introPhrase3');

  function triggerHeroEntrance() {
    heroContent?.classList.add('hero-visible');
    heroMedia?.classList.add('hero-visible');
  }

  function finishIntro() {
    if (!introOverlay) { triggerHeroEntrance(); return; }
    introFloatingGallery?.classList.remove('active');
    introOverlay.classList.add('fade-out');
    triggerHeroEntrance();
    setTimeout(() => { introOverlay.style.display = 'none'; }, 900);
  }

  if (introOverlay) {
    let introCancelled = false;
    const timeouts = [];

    const safeTimeout = (fn, delay) => {
      const id = setTimeout(() => { if (!introCancelled) fn(); }, delay);
      timeouts.push(id);
      return id;
    };

    const cancelIntro = () => {
      if (introCancelled) return;
      introCancelled = true;
      timeouts.forEach(clearTimeout);
      finishIntro();
    };

    introSkipBtn?.addEventListener('click', cancelIntro);

    // Step 1: Show Phrase 1 ("ผมไม่เคยชนะอะไรเลย")
    safeTimeout(() => { phrase1?.classList.add('show'); }, 300);

    // Phrase 1 disappears
    safeTimeout(() => {
      phrase1?.classList.remove('show');
      phrase1?.classList.add('exit');
    }, 2300);

    // Step 2: Show Phrase 2 ("แต่ผมก็ได้เรียนรู้จากความพ่ายแพ้อยู่เสมอ")
    safeTimeout(() => { phrase2?.classList.add('show'); }, 2850);

    // Phrase 2 disappears
    safeTimeout(() => {
      phrase2?.classList.remove('show');
      phrase2?.classList.add('exit');
    }, 4850);

    // Step 3: Show Phrase 3 ("เพื่อที่สักวันผมจะเป็น ผู้ชนะ") + Floating Game Cards
    safeTimeout(() => {
      phrase3?.classList.add('show');
      introFloatingGallery?.classList.add('active');
    }, 5400);

    // Phrase 3 and floating game cards disappear
    safeTimeout(() => {
      phrase3?.classList.remove('show');
      phrase3?.classList.add('exit');
      introFloatingGallery?.classList.remove('active');
      introFloatingGallery?.classList.add('exit');
    }, 7900);

    // Step 4: Intro fades out and main page is revealed
    safeTimeout(finishIntro, 8450);

  } else {
    triggerHeroEntrance();
  }
});
