// Padmodaya Campus — Admin Dashboard Logic

const ADMIN_PASSWORD = 'padmodaya2082';
const PRIORITY_COLORS = {
  urgent: { bg: '#FF6B6B', text: '#DC2626', label: 'badge-coral' },
  important: { bg: '#F5A623', text: '#92400E', label: 'badge-amber' },
  normal: { bg: '#4ECDC4', text: '#115E59', label: 'badge-teal' }
};

let DATA = loadData();
let ADMIN_FILTER = 'all';
let EDITING_ID = null;

// ===== AUTH =====
function checkAuth() {
  if (sessionStorage.getItem('padmodaya_admin') === '1') {
    showDashboard();
  } else {
    showLogin();
  }
}
function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').style.display = 'none';
}
function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').style.display = 'block';
  renderOverview();
  renderAdminNotices();
  loadSiteForm();
  loadContactForm();
}
function logout() {
  sessionStorage.removeItem('padmodaya_admin');
  showLogin();
}

// ===== TABS =====
function showAdminTab(tab) {
  document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.admin-tab[data-tab="${tab}"]`).classList.add('active');
  if (tab === 'overview') renderOverview();
  if (tab === 'notices') renderAdminNotices();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== ESCAPE =====
function escapeHTML(str) {
  return String(str ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// ===== OVERVIEW =====
function renderOverview() {
  const notices = DATA.notices || [];
  const activeCount = notices.filter(n => n.active !== false).length;
  const urgentCount = notices.filter(n => n.priority === 'urgent').length;
  const importantCount = notices.filter(n => n.priority === 'important').length;

  const stats = [
    { l: 'Total Notices', v: notices.length, s: 'All published', i: '🔔', c: '#B8A9E8' },
    { l: 'Active', v: activeCount, s: 'Visible on site', i: '✓', c: '#4ADE80' },
    { l: 'Urgent', v: urgentCount, s: 'Priority alerts', i: '⚠️', c: '#FF6B6B' },
    { l: 'Important', v: importantCount, s: 'Highlighted', i: '📈', c: '#F5A623' }
  ];

  document.getElementById('overviewStats').innerHTML = stats.map(s => `
    <div class="stat-card">
      <div class="stat-icon" style="background:${s.c}15;color:${s.c}">${s.i}</div>
      <div class="stat-value">${s.v}</div>
      <div class="stat-label">${s.l}</div>
      <div class="stat-sub">${s.s}</div>
    </div>
  `).join('');

  const recent = [...notices].sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))).slice(0, 5);
  document.getElementById('overviewRecent').innerHTML = recent.length ? recent.map(n => {
    const p = PRIORITY_COLORS[n.priority] || PRIORITY_COLORS.normal;
    return `
      <div class="notice-item" style="cursor:default">
        <span class="notice-dot" style="background:${p.bg}"></span>
        <div class="notice-body">
          <div class="notice-title">${escapeHTML(n.title)}</div>
          <div class="notice-date">${escapeHTML(n.date)}</div>
        </div>
        <span class="badge ${p.label}">${n.priority}</span>
      </div>
    `;
  }).join('') : `<div class="empty">🔔<br/><br/>No notices yet</div>`;
}

// ===== NOTICES =====
function renderAdminNotices() {
  const search = (document.getElementById('noticeSearch')?.value || '').toLowerCase().trim();
  let list = [...DATA.notices];
  if (ADMIN_FILTER !== 'all') list = list.filter(n => n.priority === ADMIN_FILTER);
  if (search) list = list.filter(n => (n.title || '').toLowerCase().includes(search) || (n.content || '').toLowerCase().includes(search));
  list.sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));

  const container = document.getElementById('adminNoticeList');
  if (!list.length) {
    container.innerHTML = `<div class="empty">🔔<br/><br/>No notices match your filters</div>`;
    return;
  }
  container.innerHTML = list.map(n => {
    const p = PRIORITY_COLORS[n.priority] || PRIORITY_COLORS.normal;
    const active = n.active !== false;
    return `
      <div class="notice-item" style="cursor:default">
        <div class="notice-icon-wrap" style="background:${p.bg}15;color:${p.bg}">🔔</div>
        <div class="notice-body">
          <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap">
            <div class="notice-title">${escapeHTML(n.title)}</div>
            <span class="badge ${p.label}">${n.priority}</span>
            ${!active ? '<span class="badge badge-hidden">Hidden</span>' : ''}
          </div>
          <div class="notice-content">${escapeHTML(n.content)}</div>
          <div class="notice-date">📅 ${escapeHTML(n.date)}</div>
        </div>
        <div class="notice-actions">
          <button class="notice-action-btn" title="${active ? 'Hide' : 'Show'}" onclick="toggleActive(${n.id})">${active ? '👁️' : '🚫'}</button>
          <button class="notice-action-btn" title="Edit" onclick="openNoticeForm(${n.id})">✏️</button>
          <button class="notice-action-btn" title="Delete" onclick="deleteNotice(${n.id})">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function filterAdminNotices(f) {
  ADMIN_FILTER = f;
  document.querySelectorAll('#tab-notices .filter-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.priority === f);
  });
  renderAdminNotices();
}

function toggleActive(id) {
  const n = DATA.notices.find(x => x.id === id);
  if (!n) return;
  n.active = !n.active;
  saveData(DATA);
  renderAdminNotices();
  renderOverview();
  toast(n.active ? '✓ Notice activated' : '✓ Notice hidden');
}

function deleteNotice(id) {
  if (!confirm('Delete this notice? This cannot be undone.')) return;
  DATA.notices = DATA.notices.filter(n => n.id !== id);
  saveData(DATA);
  renderAdminNotices();
  renderOverview();
  toast('✓ Notice deleted');
}

// ===== NOTICE FORM =====
function openNoticeForm(id) {
  EDITING_ID = id || null;
  const modal = document.getElementById('noticeFormModal');
  const title = document.getElementById('noticeFormTitle');
  const form = document.getElementById('noticeForm');
  form.reset();
  document.getElementById('noticeFormError').style.display = 'none';

  if (id) {
    const n = DATA.notices.find(x => x.id === id);
    if (!n) return;
    title.textContent = 'Edit Notice';
    document.getElementById('noticeId').value = n.id;
    document.getElementById('noticeTitle').value = n.title || '';
    document.getElementById('noticeContent').value = n.content || '';
    document.getElementById('noticeDate').value = n.date || '';
    document.getElementById('noticePriority').value = n.priority || 'normal';
    document.getElementById('noticeActive').checked = n.active !== false;
  } else {
    title.textContent = 'Add Notice';
    document.getElementById('noticeId').value = '';
    document.getElementById('noticeDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('noticePriority').value = 'normal';
    document.getElementById('noticeActive').checked = true;
  }
  modal.classList.add('open');
}
function closeNoticeForm(e) {
  if (e && e.target && e.target.closest('.modal')) return;
  document.getElementById('noticeFormModal').classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  // LOGIN FORM
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const pw = document.getElementById('passwordInput').value;
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('padmodaya_admin', '1');
      showDashboard();
    } else {
      document.getElementById('loginError').style.display = 'block';
    }
  });
  document.getElementById('togglePw').addEventListener('click', () => {
    const inp = document.getElementById('passwordInput');
    inp.type = inp.type === 'password' ? 'text' : 'password';
  });

  // NOTICE FORM
  document.getElementById('noticeForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const err = document.getElementById('noticeFormError');
    const title = document.getElementById('noticeTitle').value.trim();
    const content = document.getElementById('noticeContent').value.trim();
    if (!title || !content) {
      err.textContent = '❌ Title and content are required.';
      err.style.display = 'block';
      return;
    }
    const data = {
      title,
      content,
      date: document.getElementById('noticeDate').value,
      priority: document.getElementById('noticePriority').value,
      active: document.getElementById('noticeActive').checked
    };
    if (EDITING_ID) {
      const n = DATA.notices.find(x => x.id === EDITING_ID);
      Object.assign(n, data);
      toast('✓ Notice updated');
    } else {
      const nextId = Math.max(0, ...DATA.notices.map(x => Number(x.id) || 0)) + 1;
      DATA.notices.unshift({ id: nextId, ...data });
      toast('✓ Notice added');
    }
    saveData(DATA);
    closeNoticeForm();
    renderAdminNotices();
    renderOverview();
  });

  checkAuth();
});

// ===== SITE CONTENT FORM =====
function loadSiteForm() {
  const s = DATA.site;
  document.getElementById('siteHeroTagline').value = s.heroTagline || '';
  document.getElementById('siteHeroDescription').value = s.heroDescription || '';
  document.getElementById('siteAbout').value = s.about || '';
  document.getElementById('siteMission').value = s.mission || '';
  document.getElementById('siteVision').value = s.vision || '';
}
function saveSiteContent() {
  DATA.site.heroTagline = document.getElementById('siteHeroTagline').value;
  DATA.site.heroDescription = document.getElementById('siteHeroDescription').value;
  DATA.site.about = document.getElementById('siteAbout').value;
  DATA.site.mission = document.getElementById('siteMission').value;
  DATA.site.vision = document.getElementById('siteVision').value;
  saveData(DATA);
  toast('✓ Site content saved');
}

// ===== CONTACT FORM =====
function loadContactForm() {
  const c = DATA.site.contact;
  document.getElementById('contactAddress').value = c.address || '';
  document.getElementById('contactPhone').value = c.phone || '';
  document.getElementById('contactMobile1').value = c.mobile1 || '';
  document.getElementById('contactMobile2').value = c.mobile2 || '';
  document.getElementById('contactEmail').value = c.email || '';
  document.getElementById('contactFacebook').value = c.facebook || '';
}
function saveContact() {
  DATA.site.contact.address = document.getElementById('contactAddress').value;
  DATA.site.contact.phone = document.getElementById('contactPhone').value;
  DATA.site.contact.mobile1 = document.getElementById('contactMobile1').value;
  DATA.site.contact.mobile2 = document.getElementById('contactMobile2').value;
  DATA.site.contact.email = document.getElementById('contactEmail').value;
  DATA.site.contact.facebook = document.getElementById('contactFacebook').value;
  saveData(DATA);
  toast('✓ Contact info saved');
}

// ===== SETTINGS =====
function exportData() {
  const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `padmodaya-backup-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast('✓ Backup downloaded');
}
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported.site || !Array.isArray(imported.notices)) throw new Error('Invalid backup file');
      if (!confirm('Replace current data with imported backup? This cannot be undone.')) return;
      DATA = imported;
      saveData(DATA);
      loadSiteForm();
      loadContactForm();
      renderOverview();
      renderAdminNotices();
      toast('✓ Data imported successfully');
    } catch (err) {
      toast('❌ Invalid backup file', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}
function resetAll() {
  if (!confirm('Reset ALL data to defaults? This cannot be undone.')) return;
  if (!confirm('Are you absolutely sure? All your changes will be lost.')) return;
  resetData();
  DATA = loadData();
  loadSiteForm();
  loadContactForm();
  renderOverview();
  renderAdminNotices();
  toast('✓ Data reset to defaults');
}

// ===== TOAST =====
let toastTimer = null;
function toast(msg, kind = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.remove('error');
  if (kind === 'error') el.classList.add('error');
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}
