// script.js

// Stats Counter Animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);
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

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) { // Check if element exists
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-2xl');
    } else {
      navbar.classList.remove('shadow-2xl');
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
  
  // Form Submission Logic (Only runs if form exists on the page)
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
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
          alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
          form.reset();
          // Optional: redirect to home
          // window.location.href = 'index.html'; 
        } else {
          alert('حدث خطأ أثناء الإرسال. برجاء المحاولة مرة أخرى.');
        }
      } catch (error) {
        alert('حدث خطأ في الاتصال بالإنترنت.');
      }

      button.innerHTML = originalText;
      button.disabled = false;
    });
  }
});