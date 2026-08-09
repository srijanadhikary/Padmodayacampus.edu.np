// Padmodaya Campus — Main App Logic

const PRIORITY_COLORS = {
  urgent: { bg: '#FF6B6B', text: '#DC2626', label: 'badge-coral' },
  important: { bg: '#F5A623', text: '#92400E', label: 'badge-amber' },
  normal: { bg: '#4ECDC4', text: '#115E59', label: 'badge-teal' }
};

let DATA = loadData();
let CURRENT_FILTER = 'all';

// ===== NAVIGATION =====
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  const link = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (link) link.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Close mobile menu
  document.getElementById('navLinks').classList.remove('open');
}

function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ===== RENDER CONTENT =====
function renderSiteContent() {
  const s = DATA.site;
  // Hero
  const heroTag = document.querySelector('.hero-tagline');
  const heroDesc = document.querySelector('.hero-desc');
  if (heroTag) heroTag.textContent = s.heroTagline;
  if (heroDesc) heroDesc.textContent = s.heroDescription;

  // About
  const aboutText = document.getElementById('aboutText');
  const missionText = document.getElementById('missionText');
  const visionText = document.getElementById('visionText');
  if (aboutText) aboutText.textContent = s.about;
  if (missionText) missionText.textContent = s.mission;
  if (visionText) visionText.textContent = s.vision;

  // Contact rows on the contact page
  const c = s.contact || {};
  const setText = (selector, val) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = val || '';
  };
  const setHref = (selector, val) => {
    const el = document.querySelector(selector);
    if (el && val) el.setAttribute('href', val);
  };
  // Contact page
  const rows = document.querySelectorAll('#page-contact .contact-row .contact-value');
  if (rows.length >= 6) {
    rows[0].textContent = c.address || '';
    rows[1].textContent = c.phone || '';
    rows[2].textContent = c.mobile1 || '';
    rows[3].textContent = c.mobile2 || '';
    rows[4].textContent = c.email || '';
  }
  const contactLinks = document.querySelectorAll('#page-contact a.contact-row');
  if (contactLinks.length >= 5) {
    if (c.phone) contactLinks[0].href = 'tel:' + c.phone.replace(/[^0-9+]/g, '');
    if (c.mobile1) contactLinks[1].href = 'tel:+977' + c.mobile1.replace(/[^0-9]/g, '');
    if (c.mobile2) contactLinks[2].href = 'tel:+977' + c.mobile2.replace(/[^0-9]/g, '');
    if (c.email) contactLinks[3].href = 'mailto:' + c.email;
    if (c.facebook) contactLinks[4].href = c.facebook;
  }
}

function renderNotices() {
  // Sort by priority then date
  const priorityOrder = { urgent: 3, important: 2, normal: 1 };
  const activeNotices = [...DATA.notices].filter(n => n.active !== false).sort((a, b) => {
    const pa = priorityOrder[a.priority] || 0;
    const pb = priorityOrder[b.priority] || 0;
    if (pa !== pb) return pb - pa;
    return String(b.date || '').localeCompare(String(a.date || ''));
  });

  // Home page — top 4
  const homeList = document.getElementById('homeNoticeList');
  if (homeList) {
    homeList.innerHTML = activeNotices.slice(0, 4).map(noticeItemHTML).join('') || emptyHTML('No notices yet');
    attachNoticeClickHandlers(homeList, activeNotices);
  }

  // Notices page — filtered
  const allList = document.getElementById('allNoticeList');
  if (allList) {
    const filtered = CURRENT_FILTER === 'all' ? activeNotices : activeNotices.filter(n => n.priority === CURRENT_FILTER);
    allList.innerHTML = filtered.map(noticeItemHTML).join('') || emptyHTML('No notices in this category');
    attachNoticeClickHandlers(allList, filtered);
  }
}

function noticeItemHTML(n) {
  const p = PRIORITY_COLORS[n.priority] || PRIORITY_COLORS.normal;
  return `
    <button class="notice-item" data-id="${n.id}">
      <div class="notice-icon-wrap" style="background:${p.bg}15;color:${p.bg}">🔔</div>
      <div class="notice-body">
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
          <div class="notice-title">${escapeHTML(n.title)}</div>
          <span class="badge ${p.label}">${n.priority}</span>
        </div>
        <div class="notice-content">${escapeHTML(n.content)}</div>
        <div class="notice-date">📅 ${escapeHTML(n.date)}</div>
      </div>
      <div class="notice-chevron">›</div>
    </button>
  `;
}

function attachNoticeClickHandlers(container, notices) {
  container.querySelectorAll('.notice-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.id);
      const notice = notices.find(x => x.id === id);
      if (notice) openNoticeDetail(notice);
    });
  });
}

function emptyHTML(msg) {
  return `<div class="empty">🔔<br/><br/>${msg}</div>`;
}

function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function filterNotices(filter) {
  CURRENT_FILTER = filter;
  document.querySelectorAll('.filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.filter === filter);
  });
  renderNotices();
}

// ===== NOTICE POPUP =====
function showLatestNoticePopup() {
  if (sessionStorage.getItem('notice_dismissed') === '1') return;
  const priorityOrder = { urgent: 3, important: 2, normal: 1 };
  const active = DATA.notices.filter(n => n.active !== false);
  if (!active.length) return;
  const latest = [...active].sort((a, b) => {
    const pa = priorityOrder[a.priority] || 0;
    const pb = priorityOrder[b.priority] || 0;
    if (pa !== pb) return pb - pa;
    return String(b.date || '').localeCompare(String(a.date || ''));
  })[0];

  const popup = document.getElementById('noticePopup');
  const p = PRIORITY_COLORS[latest.priority] || PRIORITY_COLORS.normal;
  document.getElementById('popupHeader').style.background = p.bg + '10';
  document.querySelector('.modal-header-icon').style.background = p.bg + '20';
  document.getElementById('popupDate').textContent = latest.date;
  document.getElementById('popupTitle').textContent = latest.title;
  document.getElementById('popupContent').textContent = latest.content;
  const priorityBadge = document.getElementById('popupPriority');
  priorityBadge.className = 'badge ' + p.label;
  priorityBadge.textContent = latest.priority;
  priorityBadge.style.display = latest.priority === 'normal' ? 'none' : 'inline-flex';

  setTimeout(() => popup.classList.add('open'), 800);
}

function dismissPopup(e) {
  if (e && e.target && e.target.closest('.modal')) return;
  document.getElementById('noticePopup').classList.remove('open');
  sessionStorage.setItem('notice_dismissed', '1');
}

// ===== NOTICE DETAIL MODAL =====
function openNoticeDetail(notice) {
  const p = PRIORITY_COLORS[notice.priority] || PRIORITY_COLORS.normal;
  document.getElementById('detailDate').textContent = notice.date;
  document.getElementById('detailTitle').textContent = notice.title;
  document.getElementById('detailContent').textContent = notice.content;
  const badge = document.getElementById('detailPriority');
  badge.className = 'badge ' + p.label;
  badge.textContent = notice.priority;
  document.getElementById('noticeDetail').classList.add('open');
}

function closeNoticeDetail(e) {
  if (e && e.target && e.target.closest('.modal')) return;
  document.getElementById('noticeDetail').classList.remove('open');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  renderSiteContent();
  renderNotices();
  showLatestNoticePopup();

  // Handle hash-based routing
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('page-' + hash)) {
    showPage(hash);
  }

  // Re-load data when returning from admin (storage change)
  window.addEventListener('storage', (e) => {
    if (e.key === 'padmodaya_data') {
      DATA = loadData();
      renderSiteContent();
      renderNotices();
    }
  });
});
