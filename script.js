/**
 * PORTFOLIO MAIN SCRIPT - OPTIMIZED VERSION
 * Includes all features with better organization and error handling
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initTechCanvas();
  initScrollAnimations();
  initSlider();
  initMotivasiSlider();
  initPreloader();
  initShakeFeedback();
  initSmoothScrolling();
});

// ==================== MOBILE MENU ====================
function initMobileMenu() {
  try {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('navLinks');
    const navOverlay = document.getElementById('navOverlay');

    if (!navToggle || !navLinks || !navOverlay) return;

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('show');
      navOverlay.classList.toggle('show');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      
      // Animate hamburger icon
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-times', isOpen);
      }
    };

    const closeMenu = () => {
      navLinks.classList.remove('show');
      navOverlay.classList.remove('show');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      
      const icon = navToggle.querySelector('i');
      if (icon) icon.classList.replace('fa-times', 'fa-bars');
    };

    // Event listeners
    navToggle.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('show')) {
        closeMenu();
      }
    });
  } catch (error) {
    console.error('Mobile Menu Error:', error);
  }
}

// ==================== TECH CANVAS BACKGROUND ====================
function initTechCanvas() {
  try {
    const canvas = document.getElementById('techCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let dots = [];

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const gridSize = Math.max(30, Math.min(50, window.innerWidth / 20));
      
      dots = Array.from({ length: Math.ceil(canvas.width / gridSize) }, (_, i) =>
        Array.from({ length: Math.ceil(canvas.height / gridSize) }, (_, j) => ({
          x: i * gridSize,
          y: j * gridSize,
          size: 1,
          alpha: 0.1
        }))
      );
    };

    const animateGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections
      ctx.strokeStyle = "rgba(56, 189, 248, 0.1)";
      ctx.lineWidth = 0.5;
      
      dots.forEach((col, i) => {
        col.forEach((dot, j) => {
          // Draw dot
          ctx.fillStyle = `rgba(56, 189, 248, ${dot.alpha})`;
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
          ctx.fill();

          // Random connections
          if (i < dots.length - 1 && j < col.length - 1 && Math.random() > 0.7) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(
              Math.random() > 0.5 ? dots[i+1][j].x : dots[i][j+1].x,
              Math.random() > 0.5 ? dots[i+1][j].y : dots[i][j+1].y
            );
            ctx.stroke();
          }
        });
      });

      // Random pulse effect
      if (Math.random() > 0.95) {
        const randomCol = Math.floor(Math.random() * dots.length);
        const randomRow = Math.floor(Math.random() * dots[0].length);
        animatePulse(randomCol, randomRow);
      }

      animationId = requestAnimationFrame(animateGrid);
    };

    const animatePulse = (col, row) => {
      const dot = dots[col][row];
      let size = 5;
      const maxSize = 3;

      const update = () => {
        size += 0.1;
        dot.size = size;
        dot.alpha = 0.1 + (size / maxSize) * 0.2;
        
        if (size < maxSize) {
          requestAnimationFrame(update);
        } else {
          animateShrink(col, row);
        }
      };
      
      update();
    };

    const animateShrink = (col, row) => {
      const dot = dots[col][row];
      let size = dot.size;

      const update = () => {
        size -= 0.1;
        dot.size = size;
        dot.alpha = 0.1 + (size / 3) * 0.2;
        
        if (size > 1) {
          requestAnimationFrame(update);
        } else {
          dot.size = 1;
          dot.alpha = 0.1;
        }
      };
      
      update();
    };

    // Initialize
    setupCanvas();
    animateGrid();

    // Responsive handling
    const resizeHandler = debounce(() => {
      cancelAnimationFrame(animationId);
      setupCanvas();
      animateGrid();
    }, 200);

    window.addEventListener('resize', resizeHandler);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeHandler);
    };
  } catch (error) {
    console.error('Tech Canvas Error:', error);
  }
}

// ==================== IMAGE SLIDER ====================
function initSlider() {
  try {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    // Lazy load images
    const lazyLoadImages = () => {
      const images = document.querySelectorAll('.slide-img[data-src]');
      if (!images.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.onload = () => {
              img.classList.add('loaded');
              img.removeAttribute('data-src');
            };
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px', threshold: 0.1 });

      images.forEach(img => observer.observe(img));
    };

    // Horizontal scroll with mouse wheel
    const enableHorizontalScroll = () => {
      slider.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          slider.scrollLeft += e.deltaY;
        }
      }, { passive: false });
    };

    lazyLoadImages();
    enableHorizontalScroll();
  } catch (error) {
    console.error('Slider Error:', error);
  }
}

// ==================== MOTIVASI SLIDER ====================
function initMotivasiSlider() {
  try {
    const slider = document.getElementById('motivasiSlider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const progress = document.querySelector('.scroll-progress');

    if (!slider || !prevBtn || !nextBtn) return;

    const updateProgress = () => {
      if (!progress) return;
      const scrollWidth = slider.scrollWidth - slider.clientWidth;
      progress.style.width = `${(slider.scrollLeft / scrollWidth) * 100}%`;
    };

    const scrollToPosition = (position) => {
      slider.scrollTo({
        left: position,
        behavior: 'smooth'
      });
    };

    nextBtn.addEventListener('click', () => {
      const card = slider.querySelector('.motivasi-card');
      if (card) {
        scrollToPosition(slider.scrollLeft + card.offsetWidth + 24);
      }
    });

    prevBtn.addEventListener('click', () => {
      const card = slider.querySelector('.motivasi-card');
      if (card) {
        scrollToPosition(slider.scrollLeft - card.offsetWidth - 24);
      }
    });

    slider.addEventListener('scroll', updateProgress);
    updateProgress();

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft') prevBtn.click();
    });
  } catch (error) {
    console.error('Motivasi Slider Error:', error);
  }
}

// ==================== SCROLL ANIMATIONS ====================
function initScrollAnimations() {
  try {
    const sections = document.querySelectorAll('section:not(.hero)');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          
          // Animate child elements
          const content = entry.target.querySelector('.skills, .projects, .platform-grid, .motivasi-slider');
          if (content) content.classList.add('animated');
        }
      });
    }, { threshold: 0.1 });

    sections.forEach(section => observer.observe(section));
  } catch (error) {
    console.error('Scroll Animations Error:', error);
  }
}

// ==================== SHAKE FEEDBACK ====================
function initShakeFeedback() {
  try {
    const popup = document.getElementById('popupAduan');
    if (!popup) return;

    let lastShake = 0;
    let shakeCount = 0;

    const showPopup = () => popup.style.display = 'flex';
    const hidePopup = () => popup.style.display = 'none';

    const sendFeedback = () => {
      const feedbackText = document.getElementById('aduanText').value.trim();
      if (!feedbackText) {
        alert('Please enter your feedback');
        return;
      }

      const message = encodeURIComponent(`User Feedback:\n${feedbackText}`);
      window.open(`https://wa.me/6282326744030?text=${message}`, '_blank');
      document.getElementById('aduanText').value = '';
      hidePopup();
    };

    // Event listeners
    popup.addEventListener('click', (e) => e.target === popup && hidePopup());
    document.querySelector('.popup-buttons button:nth-child(1)').addEventListener('click', sendFeedback);
    document.querySelector('.popup-buttons button:nth-child(2)').addEventListener('click', hidePopup);

    // Shake detection
    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity;
        const totalShake = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
        const now = Date.now();

        if (totalShake > 25 && now - lastShake > 1000) {
          shakeCount++;
          lastShake = now;

          if (shakeCount >= 3) {
            showPopup();
            shakeCount = 0;
          }
        }
      });
    }
  } catch (error) {
    console.error('Shake Feedback Error:', error);
  }
}

// ==================== PRELOADER ====================
function initPreloader() {
  try {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('preloader-hide');
      }, 4500);
    });
  } catch (error) {
    console.error('Preloader Error:', error);
  }
}

// ==================== SMOOTH SCROLLING ====================
function initSmoothScrolling() {
  try {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  } catch (error) {
    console.error('Smooth Scrolling Error:', error);
  }
}

// ==================== UTILITY FUNCTIONS ====================
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}