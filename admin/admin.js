// Padmodaya Campus — Supabase Admin Dashboard
const PRIORITY_COLORS = {
  urgent: { bg: '#FF6B6B', text: '#DC2626', label: 'badge-coral' },
  important: { bg: '#F5A623', text: '#92400E', label: 'badge-amber' },
  normal: { bg: '#4ECDC4', text: '#115E59', label: 'badge-teal' }
};
let DATA = { site: {}, notices: [] };
let ADMIN_FILTER = 'all';
let EDITING_ID = null;
let CLIENT = null;

function escapeHTML(str) { return String(str ?? '').replace(/[&<>"']/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m])); }

async function checkAuth() {
  try {
    CLIENT = await initSupabase();
    const { data: { session } } = await CLIENT.auth.getSession();
    if (!session) return showLogin();
    const { data: admin, error } = await CLIENT.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle();
    if (error || !admin) { await CLIENT.auth.signOut(); return showLogin('❌ This account is not authorized as an administrator.'); }
    await loadDashboardData();
    showDashboard();
  } catch (e) { console.error(e); showLogin('❌ Unable to connect to the database. Check your Vercel/Supabase configuration.'); }
}
async function loadDashboardData() {
  DATA = await loadDataFromDB();
}
function showLogin(error='') {
  document.getElementById('loginScreen').style.display='flex'; document.getElementById('dashboard').style.display='none';
  const el=document.getElementById('loginError'); el.textContent=error; el.style.display=error?'block':'none';
}
function showDashboard() {
  document.getElementById('loginScreen').style.display='none'; document.getElementById('dashboard').style.display='block';
  renderOverview(); renderAdminNotices(); loadSiteForm(); loadContactForm();
}
async function logout(){ await CLIENT.auth.signOut(); showLogin(); }
function showAdminTab(tab){ document.querySelectorAll('.admin-panel').forEach(p=>p.classList.remove('active')); document.querySelectorAll('.admin-tab').forEach(t=>t.classList.remove('active')); document.getElementById('tab-'+tab).classList.add('active'); document.querySelector(`.admin-tab[data-tab="${tab}"]`).classList.add('active'); if(tab==='overview')renderOverview(); if(tab==='notices')renderAdminNotices(); window.scrollTo({top:0,behavior:'smooth'}); }

function renderOverview(){
  const notices=DATA.notices||[], activeCount=notices.filter(n=>n.active!==false).length, urgentCount=notices.filter(n=>n.priority==='urgent').length, importantCount=notices.filter(n=>n.priority==='important').length;
  const stats=[['Total Notices',notices.length,'All notices','🔔','#B8A9E8'],['Active',activeCount,'Visible on site','✓','#4ADE80'],['Urgent',urgentCount,'Priority alerts','⚠️','#FF6B6B'],['Important',importantCount,'Highlighted','📈','#F5A623']];
  document.getElementById('overviewStats').innerHTML=stats.map(s=>`<div class="stat-card"><div class="stat-icon" style="background:${s[4]}15;color:${s[4]}">${s[3]}</div><div class="stat-value">${s[1]}</div><div class="stat-label">${s[0]}</div><div class="stat-sub">${s[2]}</div></div>`).join('');
  const recent=[...notices].sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))).slice(0,5);
  document.getElementById('overviewRecent').innerHTML=recent.length?recent.map(n=>{const p=PRIORITY_COLORS[n.priority]||PRIORITY_COLORS.normal;return `<div class="notice-item" style="cursor:default"><span class="notice-dot" style="background:${p.bg}"></span><div class="notice-body"><div class="notice-title">${escapeHTML(n.title)}</div><div class="notice-date">${escapeHTML(n.date)}</div></div><span class="badge ${p.label}">${escapeHTML(n.priority)}</span></div>`}).join(''):`<div class="empty">🔔<br/><br/>No notices yet</div>`;
}
function renderAdminNotices(){
  const search=(document.getElementById('noticeSearch')?.value||'').toLowerCase().trim(); let list=[...DATA.notices];
  if(ADMIN_FILTER!=='all')list=list.filter(n=>n.priority===ADMIN_FILTER); if(search)list=list.filter(n=>(n.title||'').toLowerCase().includes(search)||(n.content||'').toLowerCase().includes(search)); list.sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
  const c=document.getElementById('adminNoticeList'); if(!list.length){c.innerHTML='<div class="empty">🔔<br/><br/>No notices match your filters</div>';return;}
  c.innerHTML=list.map(n=>{const p=PRIORITY_COLORS[n.priority]||PRIORITY_COLORS.normal,active=n.active!==false;return `<div class="notice-item" style="cursor:default"><div class="notice-icon-wrap" style="background:${p.bg}15;color:${p.bg}">🔔</div><div class="notice-body"><div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap"><div class="notice-title">${escapeHTML(n.title)}</div><span class="badge ${p.label}">${escapeHTML(n.priority)}</span>${!active?'<span class="badge badge-hidden">Hidden</span>':''}</div><div class="notice-content">${escapeHTML(n.content)}</div><div class="notice-date">📅 ${escapeHTML(n.date)}</div>${n.image_url?'<div class="form-help">🖼️ Image attached</div>':''}${n.file_url?`<div class="form-help">📄 ${escapeHTML(n.file_name||'Document attached')}</div>`:''}</div><div class="notice-actions"><button class="notice-action-btn" title="${active?'Hide':'Show'}" onclick="toggleActive('${n.id}')">${active?'👁️':'🚫'}</button><button class="notice-action-btn" title="Edit" onclick="openNoticeForm('${n.id}')">✏️</button><button class="notice-action-btn" title="Delete" onclick="deleteNotice('${n.id}')">🗑️</button></div></div>`}).join('');
}
function filterAdminNotices(f){ADMIN_FILTER=f;document.querySelectorAll('#tab-notices .filter-tab').forEach(t=>t.classList.toggle('active',t.dataset.priority===f));renderAdminNotices();}
async function toggleActive(id){try{const n=DATA.notices.find(x=>String(x.id)===String(id));if(!n)return;const {error}=await CLIENT.from('notices').update({active:!n.active}).eq('id',id);if(error)throw error;await refresh();toast(n.active?'✓ Notice activated':'✓ Notice hidden');}catch(e){toast('❌ '+e.message,'error');}}
async function deleteNotice(id){if(!confirm('Delete this notice? This cannot be undone.'))return;try{const n=DATA.notices.find(x=>String(x.id)===String(id));const {error}=await CLIENT.from('notices').delete().eq('id',id);if(error)throw error;for(const url of [n?.image_url,n?.file_url])await removeStorageFile(url);await refresh();toast('✓ Notice deleted');}catch(e){toast('❌ '+e.message,'error');}}

function openNoticeForm(id){
  EDITING_ID=id||null; const modal=document.getElementById('noticeFormModal'),form=document.getElementById('noticeForm'); form.reset(); document.getElementById('noticeFormError').style.display='none';
  const n=id?DATA.notices.find(x=>String(x.id)===String(id)):null; document.getElementById('noticeFormTitle').textContent=n?'Edit Notice':'Add Notice';
  document.getElementById('noticeId').value=n?.id||''; document.getElementById('noticeTitle').value=n?.title||''; document.getElementById('noticeContent').value=n?.content||''; document.getElementById('noticeDate').value=n?.date||new Date().toISOString().slice(0,10); document.getElementById('noticePriority').value=n?.priority||'normal'; document.getElementById('noticeActive').checked=n?.active!==false; modal.classList.add('open');
}
function closeNoticeForm(e){if(e&&e.target&&e.target.closest('.modal'))return;document.getElementById('noticeFormModal').classList.remove('open');}

async function uploadFile(file, folder){
  if(!file)return null; if(file.size>10*1024*1024)throw new Error('Each upload must be 10 MB or smaller.');
  const ext=(file.name.split('.').pop()||'bin').toLowerCase(); const path=`${folder}/${crypto.randomUUID()}.${ext}`;
  const {error}=await CLIENT.storage.from('notices').upload(path,file,{cacheControl:'3600',upsert:false,contentType:file.type||undefined}); if(error)throw error;
  const {data}=CLIENT.storage.from('notices').getPublicUrl(path); return {url:data.publicUrl,path,name:file.name};
}
async function removeStorageFile(url){
  if(!url) return; try{const u=new URL(url);const marker='/storage/v1/object/public/notices/';const i=u.pathname.indexOf(marker);if(i>=0){const path=u.pathname.slice(i+marker.length);await CLIENT.storage.from('notices').remove([decodeURIComponent(path)]);}}catch(e){console.warn('File cleanup failed',e);}
}
async function refresh(){DATA=await loadDataFromDB();renderAdminNotices();renderOverview();loadSiteForm();loadContactForm();}

function loadSiteForm(){const s=DATA.site||{};document.getElementById('siteHeroTagline').value=s.heroTagline||'';document.getElementById('siteHeroDescription').value=s.heroDescription||'';document.getElementById('siteAbout').value=s.about||'';document.getElementById('siteMission').value=s.mission||'';document.getElementById('siteVision').value=s.vision||'';}
async function saveSiteContent(){try{DATA.site.heroTagline=document.getElementById('siteHeroTagline').value;DATA.site.heroDescription=document.getElementById('siteHeroDescription').value;DATA.site.about=document.getElementById('siteAbout').value;DATA.site.mission=document.getElementById('siteMission').value;DATA.site.vision=document.getElementById('siteVision').value;await saveSiteToDB(DATA.site);toast('✓ Site content saved');}catch(e){toast('❌ '+e.message,'error');}}
function loadContactForm(){const c=DATA.site.contact||{};document.getElementById('contactAddress').value=c.address||'';document.getElementById('contactPhone').value=c.phone||'';document.getElementById('contactMobile1').value=c.mobile1||'';document.getElementById('contactMobile2').value=c.mobile2||'';document.getElementById('contactEmail').value=c.email||'';document.getElementById('contactFacebook').value=c.facebook||'';}
async function saveContact(){try{DATA.site.contact={...DATA.site.contact,address:document.getElementById('contactAddress').value,phone:document.getElementById('contactPhone').value,mobile1:document.getElementById('contactMobile1').value,mobile2:document.getElementById('contactMobile2').value,email:document.getElementById('contactEmail').value,facebook:document.getElementById('contactFacebook').value};await saveSiteToDB(DATA.site);toast('✓ Contact info saved');}catch(e){toast('❌ '+e.message,'error');}}

function exportData(){const blob=new Blob([JSON.stringify(DATA,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`padmodaya-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url);toast('✓ Backup downloaded');}
async function resetAll(){if(!confirm('This will delete all notices and restore the bundled defaults. Continue?'))return;try{const {error}=await CLIENT.from('notices').delete().neq('id','00000000-0000-0000-0000-000000000000');if(error)throw error;for(const n of DEFAULT_DATA.notices){const {error:e}=await CLIENT.from('notices').insert({title:n.title,content:n.content,date:n.date,priority:n.priority,active:n.active});if(e)throw e;}await saveSiteToDB(DEFAULT_DATA.site);await refresh();toast('✓ Database restored to defaults');}catch(e){toast('❌ '+e.message,'error');}}

let toastTimer=null;function toast(msg,kind='success'){const el=document.getElementById('toast');el.textContent=msg;el.classList.remove('error');if(kind==='error')el.classList.add('error');el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3000);}

document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('loginForm').addEventListener('submit',async e=>{e.preventDefault();const err=document.getElementById('loginError');err.style.display='none';try{CLIENT=await initSupabase();const email=document.getElementById('emailInput').value.trim();const password=document.getElementById('passwordInput').value;const {error}=await CLIENT.auth.signInWithPassword({email,password});if(error)throw error;await checkAuth();}catch(x){err.textContent='❌ '+(x.message||'Login failed.');err.style.display='block';}});
  document.getElementById('togglePw').addEventListener('click',()=>{const i=document.getElementById('passwordInput');i.type=i.type==='password'?'text':'password';});
  document.getElementById('noticeForm').addEventListener('submit',async e=>{e.preventDefault();const err=document.getElementById('noticeFormError');err.style.display='none';try{const title=document.getElementById('noticeTitle').value.trim(),content=document.getElementById('noticeContent').value.trim();if(!title||!content)throw new Error('Title and content are required.');const old=EDITING_ID?DATA.notices.find(x=>String(x.id)===String(EDITING_ID)):null;let image=old?.image_url?{url:old.image_url}:null,file=old?.file_url?{url:old.file_url,name:old.file_name}:null;const imageInput=document.getElementById('noticeImage'),fileInput=document.getElementById('noticeFile');if(imageInput.files[0]){const up=await uploadFile(imageInput.files[0],'images');if(old?.image_url)await removeStorageFile(old.image_url);image=up;}if(fileInput.files[0]){const up=await uploadFile(fileInput.files[0],'documents');if(old?.file_url)await removeStorageFile(old.file_url);file=up;}const row={title,content,date:document.getElementById('noticeDate').value,priority:document.getElementById('noticePriority').value,active:document.getElementById('noticeActive').checked,image_url:image?.url||null,file_url:file?.url||null,file_name:file?.name||null};let result;if(EDITING_ID)result=await CLIENT.from('notices').update(row).eq('id',EDITING_ID);else result=await CLIENT.from('notices').insert(row);if(result.error)throw result.error;closeNoticeForm();await refresh();toast(EDITING_ID?'✓ Notice updated':'✓ Notice added');}catch(x){console.error(x);err.textContent='❌ '+x.message;err.style.display='block';}});
  checkAuth();
});
