// script.js

// Stats Counter Animation
function animateStats() {
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length === 0) return;

  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target);

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

// تحسين: دمج scroll listeners في واحد بدل اثنين
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    if (window.scrollY > 20) {
      navbar.classList.add('shadow-2xl');
    } else {
      navbar.classList.remove('shadow-2xl');
    }
  }

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

// ==========================================
// Initialize on Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. تحريك الأرقام (هيشتغل فوراً)
  animateStats();

  // ==========================================
  // 2. كود فيرسل والفورم (هيشتغل في صفحة التواصل بس)
  // ==========================================
  const form = document.getElementById('contact-form');
  
  if (form) {
    // بيانات الاتصال بفيرسيل
    const firebaseConfig = {
      apiKey: "AIzaSyBJ2meQFZuZYeZH7Ie8CQseBjwEV2Phg_4",
      authDomain: "sls-admin-panel.firebaseapp.com",
      databaseURL: "https://sls-admin-panel-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "sls-admin-panel",
      storageBucket: "sls-admin-panel.firebasestorage.app",
      messagingSenderId: "545641823357",
      appId: "1:545641823357:web:e0a0ee7f62205156850514",
      measurementId: "G-9YX9L874BR"
    };
    
    firebase.initializeApp(firebaseConfig);
    const db = firebase.database();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const button = form.querySelector('button[type="submit"]');
      if (!button) return;

      const originalText = button.innerHTML;
      button.innerHTML = '<span>جاري الإرسال...</span>';
      button.disabled = true;

      const name = form.querySelector('[name="name"]').value;
      const phone = form.querySelector('[name="phone"]').value;
      const email = form.querySelector('[name="email"]').value;
      const message = form.querySelector('[name="message"]').value;

      const messageId = db.ref('messages').push().key;

      db.ref('messages/' + messageId).set({
        id: messageId,
        name: name,
        phone: phone,
        email: email,
        message: message,
        time: new Date().toLocaleString('ar-EG')
      }).then(() => {
        window.location.href = 'thank-you.html';
      }).catch((error) => {
        console.error("خطأ في الإرسال:", error);
        alert('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
        button.innerHTML = originalText;
        button.disabled = false;
      });

    });
  }

  // 3. Back to Top click handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});