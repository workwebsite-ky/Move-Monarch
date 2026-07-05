/* ============================================
   MOVE MONARCH — script.js
   Handles: Loader, Nav, Animations, Counters,
   Testimonials, FAQ, Back-to-Top
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ====== LOADER ====== */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 2200);
    });
  }

  /* ====== STICKY NAV ====== */
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ====== HAMBURGER / MOBILE MENU ====== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu?.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger?.classList.remove('open');
      mobileMenu?.classList.remove('open');
    });
  });

  /* ====== SCROLL ANIMATIONS ====== */
  const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = parseFloat(getComputedStyle(entry.target).getPropertyValue('--delay')) || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animEls.forEach(el => observer.observe(el));

  /* ====== ANIMATED COUNTERS ====== */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ====== TESTIMONIAL SLIDER ====== */
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('testimonialDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    const perView = window.innerWidth > 1024 ? 4 : window.innerWidth > 768 ? 2 : 1;

    // Create dots based on actual cards
    const numSlides = cards.length;
    cards.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer?.appendChild(dot);
    });

    const dots = dotsContainer?.querySelectorAll('.dot');

    function goTo(index) {
      // On mobile, show one at a time
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;

      cards.forEach((card, i) => {
        if (isMobile) {
          card.style.display = i === index ? 'block' : 'none';
        } else if (isTablet) {
          card.style.display = (i === index || i === index + 1) ? 'block' : 'none';
        } else {
          card.style.display = 'block';
        }
      });

      dots?.forEach((d, i) => d.classList.toggle('active', i === index));
      current = index;
    }

    // Only enable mobile slider behavior
    function initSlider() {
      const isMobile = window.innerWidth <= 768;
      const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
      if (isMobile || isTablet) {
        goTo(0);
      } else {
        cards.forEach(c => c.style.display = 'block');
        dots?.forEach((d, i) => d.classList.toggle('active', i === current));
      }
    }

    initSlider();
    window.addEventListener('resize', initSlider);

    prevBtn?.addEventListener('click', () => {
      current = (current - 1 + numSlides) % numSlides;
      goTo(current);
    });

    nextBtn?.addEventListener('click', () => {
      current = (current + 1) % numSlides;
      goTo(current);
    });

    // Auto-advance
    setInterval(() => {
      if (window.innerWidth <= 1024) {
        current = (current + 1) % numSlides;
        goTo(current);
      }
    }, 5000);
  }

  /* ====== FAQ ACCORDION ====== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-q');
    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(fi => fi.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ====== BACK TO TOP ====== */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ====== PARALLAX HERO ====== */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
    }, { passive: true });
  }

  /* ====== CONTACT FORM FEEDBACK ====== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Sending...';
        btn.style.opacity = '0.7';
        setTimeout(() => {
          btn.innerHTML = 'Message Sent <i class="fas fa-check"></i>';
          btn.style.opacity = '1';
          btn.style.background = '#2a7a3b';
          btn.style.borderColor = '#2a7a3b';
        }, 800);
      }
    });
  }

});
