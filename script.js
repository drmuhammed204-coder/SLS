// script.js

// Stats Counter Animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  // تحسين 3: لو مفيش عناصر إحصائية خروج فوري
  if (statNumbers.length === 0) return;

  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);

    // تحسين 2: حماية من NaN لو data-target فاضي أو غلط
    if (isNaN(target)) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.floor((target * step) / steps);

      if (step >= steps) {
        stat.textContent = '+' + target.toLocaleString('ar-EG');
        clearInterval(timer);
      } else {
        stat.textContent = '+' + current.toLocaleString('ar-EG');
      }
    }, stepDuration);
  });
}

// تحسين 3: دمج scroll listeners في واحد بدل اثنين
window.addEventListener('scroll', () => {
  // Navbar shadow
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-2xl');
    } else {
      navbar.classList.remove('shadow-2xl');
    }
  }

  // Back to Top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('opacity-0', 'invisible');
      backToTopBtn.classList.add('opacity-100', 'visible');
    } else {
      backToTopBtn.classList.add('opacity-0', 'invisible');
      backToTopBtn.classList.remove('opacity-100', 'visible');
    }
  }
});

// Mobile Menu Toggle
function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.classList.toggle('hidden');
  }
}

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  animateStats();

  // Form Submission Logic
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const button = form.querySelector('button[type="submit"]');

      // تحسين 1: حماية لو الزر مش موجود
      if (!button) return;

      const originalText = button.innerHTML;

      button.innerHTML = '<span>جاري الإرسال...</span>';
      button.disabled = true;

      try {
        const response = await fetch('https://formspree.io/f/mgonnrdk', {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          window.location.href = 'thank-you.html';
        } else {
          alert('حدث خطأ أثناء الإرسال. برجاء المحاولة مرة أخرى.');
          button.innerHTML = originalText;
          button.disabled = false;
        }
      } catch (error) {
        alert('حدث خطأ في الاتصال بالإنترنت.');
        button.innerHTML = originalText;
        button.disabled = false;
      }
    });
  }

  // Back to Top click handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
