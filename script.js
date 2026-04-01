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

// Scroll listeners
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
// أدوات مشتركة (Global — عشان المودال يوصلها)
// ==========================================
var typeIcons = {
  'قافلة طبية': '🏥',
  'مبادرة إنسانية': '🧥',
  'تبرع بالدم': '🩸',
  'نشاط توعوي': '📢'
};

var dateIcons = { 'single': '📅', 'range': '🗓️' };

function safeText(str) {
  if (!str) return '';
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

var defaultImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect width='400' height='250' fill='%230e4a5c'/%3E%3Ctext x='50%25' y='50%25' fill='%23a5f3fc' font-size='40' text-anchor='middle' dy='.3em'%3E🏥%3C/text%3E%3C/svg%3E";

// المودال (Global عشان الـ onclick في HTML يوصلهم)
function openConvoyModal(id) {
  if (!id) return;
  var modal = document.getElementById('convoy-modal');
  var content = document.getElementById('convoy-modal-content');
  if (!modal || !content) return;

  content.innerHTML = '<div class="h-64 bg-gray-200 animate-pulse"></div><div class="p-8"><div class="h-8 bg-gray-200 rounded-lg mb-4 w-3/4 animate-pulse"></div><div class="h-4 bg-gray-200 rounded-lg mb-2 w-full animate-pulse"></div><div class="h-4 bg-gray-200 rounded-lg mb-2 w-5/6 animate-pulse"></div><div class="h-4 bg-gray-200 rounded-lg w-2/3 animate-pulse"></div></div>';

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  var convoyDb = firebase.database();
  convoyDb.ref('convoys/' + id).once('value', function(snapshot) {
    var c = snapshot.val();
    if (!c) {
      content.innerHTML = '<div class="p-12 text-center"><span class="text-5xl block mb-4">😕</span><h3 class="text-xl font-bold text-gray-700">القافلة غير موجودة</h3></div>';
      return;
    }

    var icon = typeIcons[c.type] || '🏥';
    var img = c.image || defaultImg;

    content.innerHTML =
      '<div class="h-64 sm:h-80 bg-sls-cyan-100 overflow-hidden relative">' +
        '<img src="' + safeText(img) + '" alt="' + safeText(c.title) + '" class="w-full h-full object-cover" onerror="this.src=\'' + defaultImg + '\'">' +
        '<div class="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6">' +
          '<div class="flex flex-wrap items-center gap-2">' +
            '<span class="bg-white/95 px-3 py-1 rounded-full text-sm font-bold text-sls-cyan-900">' + icon + ' ' + safeText(c.type) + '</span>' +
            (c.featured ? '<span class="bg-sls-gold-400 px-3 py-1 rounded-full text-sm font-bold text-sls-cyan-900">⭐ رئيسية</span>' : '') +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="p-6 sm:p-8">' +
        '<h2 class="text-2xl sm:text-3xl font-black text-sls-cyan-900 mb-4">' + safeText(c.title) + '</h2>' +
        '<div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">' +
          '<span>📍 ' + safeText(c.location) + '</span>' +
          '<span>📅 ' + safeText(c.date) + '</span>' +
        '</div>' +
        '<p class="text-gray-600 leading-relaxed text-lg mb-6 font-medium">' + safeText(c.desc) + '</p>' +
        (c.article ? '<div class="border-t-2 border-sls-cyan-100 pt-6"><p class="text-gray-700 leading-loose whitespace-pre-wrap">' + safeText(c.article) + '</p></div>' : '') +
      '</div>';
  });
}

function closeConvoyModal() {
  var modal = document.getElementById('convoy-modal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

// إغلاق المودال بـ Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeConvoyModal();
});

// ==========================================
// Initialize on Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

  // 1. تحريك الأرقام
  animateStats();

  // 2. إغلاق المنيو عند الضغط على رابط (موبايل)
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // ==========================================
  // 3. كود فيرسل والفورم (صفحة التواصل فقط)
  // ==========================================
  const form = document.getElementById('contact-form');

  if (form) {
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

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

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
  } // ← قفل if (form) هنا

  // ==========================================
  // 4. عرض القوافل ديناميكياً (صفحة الخدمات فقط)
  // ==========================================
  var convoysSection = document.getElementById('all-convoys');
  var featuredSection = document.getElementById('featured-convoys');
  var noConvoysEl = document.getElementById('no-convoys');

  if (convoysSection) {

    var fbConfig = {
      apiKey: "AIzaSyBJ2meQFZuZYeZH7Ie8CQseBjwEV2Phg_4",
      authDomain: "sls-admin-panel.firebaseapp.com",
      databaseURL: "https://sls-admin-panel-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "sls-admin-panel",
      storageBucket: "sls-admin-panel.firebasestorage.app",
      messagingSenderId: "545641823357",
      appId: "1:545641823357:web:e0a0ee7f62205156850514"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(fbConfig);
    }

    var convoyDb = firebase.database();

    function buildConvoyCard(c) {
      var icon = typeIcons[c.type] || '🏥';
      var dIcon = dateIcons[c.dateType] || '📅';

      return '<div class="bg-white rounded-3xl overflow-hidden shadow-xl shadow-sls-cyan-50 border-2 border-transparent hover:border-sls-cyan-200 transition-all group cursor-pointer gradient-border card-hover" onclick="openConvoyModal(\'' + (c.id || '') + '\')">' +
        '<div class="h-48 bg-sls-cyan-100 overflow-hidden relative">' +
          '<img src="' + safeText(c.image) + '" alt="' + safeText(c.title) + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src=\'' + defaultImg + '\'">' +
          '<div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sls-cyan-900 shadow-sm">' + icon + ' ' + safeText(c.type) + '</div>' +
          (c.featured ? '<div class="absolute top-3 left-3 bg-sls-gold-400 px-3 py-1 rounded-full text-sm font-bold text-sls-cyan-900 shadow-sm">⭐ رئيسية</div>' : '') +
        '</div>' +
        '<div class="p-6">' +
          '<h3 class="text-lg font-bold text-sls-cyan-900 mb-2 group-hover:text-sls-cyan-700 transition-colors line-clamp-2">' + safeText(c.title) + '</h3>' +
          '<p class="text-gray-500 text-sm mb-4 line-clamp-2">' + safeText(c.desc) + '</p>' +
          '<div class="flex items-center justify-between text-sm">' +
            '<span class="text-sls-cyan-700 font-medium">' + dIcon + ' ' + safeText(c.date) + '</span>' +
            '<span class="text-gray-400">📍 ' + safeText(c.location) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function buildFeaturedConvoyCard(c) {
      var icon = typeIcons[c.type] || '🏥';

      return '<div class="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-sls-cyan-100 border-2 border-sls-gold-400 cursor-pointer group" onclick="openConvoyModal(\'' + (c.id || '') + '\')">' +
        '<div class="grid md:grid-cols-2">' +
          '<div class="h-64 md:h-full bg-sls-cyan-100 overflow-hidden">' +
            '<img src="' + safeText(c.image) + '" alt="' + safeText(c.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src=\'' + defaultImg + '\'">' +
          '</div>' +
          '<div class="p-6 sm:p-8 flex flex-col justify-center">' +
            '<div class="flex flex-wrap items-center gap-2 mb-4">' +
              '<span class="bg-sls-gold-400 text-sls-cyan-900 text-xs px-3 py-1 rounded-full font-bold">⭐ قافلة رئيسية</span>' +
              '<span class="bg-sls-cyan-100 text-sls-cyan-700 text-xs px-3 py-1 rounded-full font-bold">' + icon + ' ' + safeText(c.type) + '</span>' +
            '</div>' +
            '<h3 class="text-xl sm:text-2xl font-black text-sls-cyan-900 mb-3">' + safeText(c.title) + '</h3>' +
            '<p class="text-gray-600 mb-4 leading-relaxed line-clamp-3">' + safeText(c.desc) + '</p>' +
            '<div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">' +
              '<span>📍 ' + safeText(c.location) + '</span>' +
              '<span>📅 ' + safeText(c.date) + '</span>' +
            '</div>' +
            '<div class="mt-5">' +
              '<span class="inline-flex items-center gap-2 text-sls-cyan-700 font-bold group-hover:gap-3 transition-all">اقرأ التفاصيل <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    convoyDb.ref('convoys').on('value', function(snapshot) {
      var data = snapshot.val();

      if (!data) {
        convoysSection.classList.add('hidden');
        noConvoysEl.classList.remove('hidden');
        return;
      }

      noConvoysEl.classList.add('hidden');
      convoysSection.classList.remove('hidden');

      var allConvoys = Object.values(data).reverse();
      var featured = allConvoys.filter(function(c) { return c.featured === true; });
      var normal = allConvoys.filter(function(c) { return c.featured !== true; });

      if (featured.length > 0) {
        featuredSection.innerHTML = '<h3 class="text-xl font-bold text-sls-cyan-900 mb-5 flex items-center gap-2"><span class="text-sls-gold-400">⭐</span> قافلة مميزة</h3>' +
          featured.slice(0, 1).map(buildFeaturedConvoyCard).join('');
      } else {
        featuredSection.innerHTML = '';
      }

      if (normal.length > 0) {
        convoysSection.innerHTML = normal.slice(0, 6).map(buildConvoyCard).join('');
      } else if (featured.length === 0) {
        convoysSection.innerHTML = '';
        convoysSection.classList.add('hidden');
      }
    });
  } // ← قفل if (convoysSection) هنا

  // 5. Back to Top click handler
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}); // ← قفل DOMContentLoaded هنا