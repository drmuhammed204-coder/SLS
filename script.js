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
  const overlay = document.getElementById('mobile-menu-overlay');
  if (!menu) return;
  const isOpen = menu.classList.contains('menu-open');
  if (isOpen) {
    menu.classList.remove('menu-open');
    if (overlay) overlay.classList.remove('show');
    document.body.style.overflow = '';
  } else {
    menu.classList.add('menu-open');
    if (overlay) overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  if (menu) menu.classList.remove('menu-open');
  if (overlay) overlay.classList.remove('show');
  document.body.style.overflow = '';
}

// ==========================================
// أدوات مشتركة (Global)
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

var defaultImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Crect width='400' height='250' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='50%25' fill='%2393c5fd' font-size='40' text-anchor='middle' dy='.3em'%3E🏥%3C/text%3E%3C/svg%3E";

// تنسيق المقال
function formatArticle(text, imageUrl, imageTitle) {
  if (!text) return '';
  var safe = safeText(text);
  var lines = safe.split('\n');
  var html = '';
  var keywords = ['محافظ', 'بمشاركة', 'برعاية', 'ب حضور', 'حضور'];
  var paragraphCount = 0;
  var imageInserted = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();

    if (line === '') {
      html += '<div style="height: 8px;"></div>';
      continue;
    }

    var isSpecial = false;
    for (var j = 0; j < keywords.length; j++) {
      if (line.indexOf(keywords[j]) !== -1) { isSpecial = true; break; }
    }

    if (isSpecial) {
      html += '<div class="convoy-highlight">' + line + '</div>';
    } else {
      paragraphCount++;
      if (!imageInserted && paragraphCount === 2 && imageUrl) {
        html += '<p style="margin-bottom: 1.2rem;">' + line + '</p>';
        html += '<figure class="article-inline-image">';
        html += '<img src="' + safeText(imageUrl) + '" alt="' + safeText(imageTitle || 'صورة من القافلة') + '" onerror="this.parentElement.style.display=\'none\'">';
        html += '<figcaption>📷 ' + safeText(imageTitle || 'صورة من القافلة') + '</figcaption>';
        html += '</figure>';
        imageInserted = true;
        continue;
      }
      html += '<p style="margin-bottom: 1.2rem;">' + line + '</p>';
    }
  }

  return html;
}

// مودال القافلة
function openConvoyModal(id) {
  if (!id) return;
  var modal = document.getElementById('convoy-modal');
  var content = document.getElementById('convoy-modal-content');
  if (!modal || !content) return;

  content.innerHTML =
    '<div class="modal-inner-enter">' +
      '<div class="p-6 sm:p-10">' +
        '<div class="max-w-3xl mx-auto">' +
          '<div class="flex gap-3 mb-6"><div class="h-8 bg-gray-200 rounded-full w-28 animate-pulse"></div><div class="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div></div>' +
          '<div class="h-10 bg-gray-200 rounded-xl mb-4 w-3/4 animate-pulse"></div>' +
          '<div class="h-64 bg-gray-200 rounded-2xl animate-pulse"></div>' +
        '</div>' +
      '</div>' +
    '</div>';

  modal.classList.remove('hidden');
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      modal.classList.add('modal-open');
    });
  });
  document.body.style.overflow = 'hidden';

  var convoyDb = firebase.database();
  convoyDb.ref('convoys/' + id).once('value', function(snapshot) {
    var c = snapshot.val();
    if (!c) {
      content.innerHTML = '<div class="modal-inner-enter p-20 text-center"><span class="text-6xl block mb-6">😕</span><h3 class="text-2xl font-bold text-gray-700 mb-2">القافلة غير موجودة</h3><p class="text-gray-400">ربما تم حذفها من لوحة التحكم</p></div>';
      return;
    }

    var icon = typeIcons[c.type] || '🏥';
    var img = c.image || defaultImg;
    var imgExists = c.image && c.image.length > 0;
    var imgCaption = 'صورة من ' + safeText(c.type) + ' — ' + safeText(c.location);

    content.innerHTML =
      '<div class="modal-inner-enter">' +
        '<div class="bg-gradient-to-br from-sls-blue-50 to-white border-b border-sls-blue-100">' +
          '<div class="max-w-3xl mx-auto px-6 sm:px-10 pt-8 sm:pt-10 pb-6">' +
            '<div class="flex flex-wrap items-center gap-2 mb-5">' +
              '<span class="bg-sls-blue-100 text-sls-blue-800 px-4 py-1.5 rounded-full text-sm font-bold">' + icon + ' ' + safeText(c.type) + '</span>' +
              (c.featured ? '<span class="bg-sls-gold-400 text-sls-blue-900 px-4 py-1.5 rounded-full text-sm font-bold">⭐ قافلة رئيسية</span>' : '') +
            '</div>' +
            '<h2 class="text-2xl sm:text-3xl md:text-4xl font-black text-sls-blue-900 leading-snug">' + safeText(c.title) + '</h2>' +
          '</div>' +
        '</div>' +
        (imgExists ?
          '<div class="max-w-3xl mx-auto px-6 sm:px-10 py-6">' +
            '<div class="rounded-2xl overflow-hidden shadow-lg border border-sls-blue-100">' +
              '<img src="' + safeText(img) + '" alt="' + safeText(c.title) + '" class="w-full h-auto max-h-80 object-contain bg-sls-blue-50 rounded-2xl">' +
            '</div>' +
          '</div>'
        : '') +
        '<div class="max-w-3xl mx-auto px-6 sm:px-10">' +
          '<div class="flex flex-wrap items-center gap-3">' +
            '<span class="convoy-meta-label"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' + safeText(c.location) + '</span>' +
            '<span class="convoy-meta-label"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>' + safeText(c.date) + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="max-w-3xl mx-auto px-6 sm:px-10 pt-6 pb-24 sm:pb-28">' +
          '<p class="convoy-desc">' + safeText(c.desc) + '</p>' +
          (c.article ?
            '<hr class="convoy-separator">' +
            '<div class="mt-8">' +
              '<h4 class="text-lg font-bold text-sls-blue-900 mb-6 flex items-center gap-2"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> تفاصيل القافلة</h4>' +
              '<div class="convoy-article">' + formatArticle(c.article, imgExists ? img : null, imgCaption) + '</div>' +
            '</div>'
          : '') +
        '</div>' +
      '</div>';
  });
}

function closeConvoyModal() {
  var modal = document.getElementById('convoy-modal');
  if (!modal) return;
  modal.classList.remove('modal-open');
  setTimeout(function() {
    modal.classList.add('hidden');
    document.getElementById('convoy-modal-content').innerHTML = '';
    document.body.style.overflow = '';
  }, 400);
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
        closeMobileMenu();
      });
    });
  }

  // ==========================================
  // 3. فورم التواصل (صفحة التواصل فقط)
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
      appId: "1:545641823357:web:e0a0ee7f62205156850514"
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
  }

  // ==========================================
  // 4. عرض القوافل (صفحة الخدمات فقط)
  // ==========================================
  var convoysSection = document.getElementById('all-convoys');
  var featuredSection = document.getElementById('featured-convoys');
  var noConvoysEl = document.getElementById('no-convoys');

  if (!firebase.apps.length) {
    firebase.initializeApp(SLS_FIREBASE_CONFIG);
  }

    var convoyDb = firebase.database();

    function buildConvoyCard(c) {
      var icon = typeIcons[c.type] || '🏥';
      var dIcon = dateIcons[c.dateType] || '📅';

      return '<div class="bg-white rounded-3xl overflow-hidden shadow-xl shadow-sls-blue-50 border-2 border-transparent hover:border-sls-blue-200 transition-all group cursor-pointer gradient-border card-hover" onclick="openConvoyModal(\'' + (c.id || '') + '\')">' +
        '<div class="h-48 bg-sls-blue-100 overflow-hidden relative">' +
          '<img src="' + safeText(c.image) + '" alt="' + safeText(c.title) + '" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" onerror="this.src=\'' + defaultImg + '\'">' +
          '<div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-sls-blue-900 shadow-sm">' + icon + ' ' + safeText(c.type) + '</div>' +
          (c.featured ? '<div class="absolute top-3 left-3 bg-sls-gold-400 px-3 py-1 rounded-full text-sm font-bold text-sls-blue-900 shadow-sm">⭐ رئيسية</div>' : '') +
        '</div>' +
        '<div class="p-6">' +
          '<h3 class="text-lg font-bold text-sls-blue-900 mb-2 group-hover:text-sls-blue-700 transition-colors line-clamp-2">' + safeText(c.title) + '</h3>' +
          '<p class="text-gray-500 text-sm mb-4 line-clamp-2">' + safeText(c.desc) + '</p>' +
          '<div class="flex items-center justify-between text-sm">' +
            '<span class="text-sls-blue-700 font-medium">' + dIcon + ' ' + safeText(c.date) + '</span>' +
            '<span class="text-gray-400">📍 ' + safeText(c.location) + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function buildFeaturedConvoyCard(c) {
      var icon = typeIcons[c.type] || '🏥';

      return '<div class="bg-white rounded-3xl overflow-hidden shadow-2xl shadow-sls-blue-100 border-2 border-sls-gold-400 cursor-pointer group" onclick="openConvoyModal(\'' + (c.id || '') + '\')">' +
        '<div class="grid md:grid-cols-2">' +
          '<div class="h-64 md:h-full bg-sls-blue-100 overflow-hidden">' +
            '<img src="' + safeText(c.image) + '" alt="' + safeText(c.title) + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src=\'' + defaultImg + '\'">' +
          '</div>' +
          '<div class="p-6 sm:p-8 flex flex-col justify-center">' +
            '<div class="flex flex-wrap items-center gap-2 mb-4">' +
              '<span class="bg-sls-gold-400 text-sls-blue-900 text-xs px-3 py-1 rounded-full font-bold">⭐ قافلة رئيسية</span>' +
              '<span class="bg-sls-blue-100 text-sls-blue-700 text-xs px-3 py-1 rounded-full font-bold">' + icon + ' ' + safeText(c.type) + '</span>' +
            '</div>' +
            '<h3 class="text-xl sm:text-2xl font-black text-sls-blue-900 mb-3">' + safeText(c.title) + '</h3>' +
            '<p class="text-gray-600 mb-4 leading-relaxed line-clamp-3">' + safeText(c.desc) + '</p>' +
            '<div class="flex flex-wrap items-center gap-4 text-sm text-gray-500">' +
              '<span>📍 ' + safeText(c.location) + '</span>' +
              '<span>📅 ' + safeText(c.date) + '</span>' +
            '</div>' +
            '<div class="mt-5">' +
              '<span class="inline-flex items-center gap-2 text-sls-blue-700 font-bold group-hover:gap-3 transition-all">اقرأ التفاصيل <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></span>' +
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
        featuredSection.innerHTML = '<h3 class="text-xl font-bold text-sls-blue-900 mb-5 flex items-center gap-2"><span class="text-sls-gold-400">⭐</span> قافلة مميزة</h3>' +
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
  }

  // ==========================================
  // 5. صفحة التبرع (نسخ + FAQ)
  // ==========================================

  function copyText(btn, text) {
    navigator.clipboard.writeText(text).then(function() {
      btn.classList.add('copied');
      var originalHtml = btn.innerHTML;
      btn.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg> تم النسخ';
      setTimeout(function() {
        btn.classList.remove('copied');
        btn.innerHTML = originalHtml;
      }, 2000);
    });
  }

  function toggleFaq(btn) {
    var item = btn.parentElement;
    var body = item.querySelector('.faq-body');
    var isActive = item.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(function(el) {
      el.classList.remove('active');
      el.querySelector('.faq-body').classList.add('hidden');
    });

    if (!isActive) {
      item.classList.add('active');
      body.classList.remove('hidden');
    }
  }

  // Back to Top
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 6. زرار "ساهم معنا" العائم
  // ==========================================
  (function() {
    if (window.location.pathname.indexOf('donate') !== -1) return;

    var btn = document.createElement('a');
    btn.href = 'donate.html';
    btn.className = 'fixed bottom-6 left-6 z-50 flex items-center gap-2 bg-sls-gold-400 text-sls-blue-900 font-bold px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-sm';
    btn.innerHTML = '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> ساهم معنا';
    btn.setAttribute('aria-label', 'ساهم معنا');
    document.body.appendChild(btn);
  })();
});