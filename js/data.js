// Padmodaya Campus - database data layer
const DEFAULT_DATA = {
  site: {
    heroTagline: "Quality Education at Affordable Cost",
    heroDescription: "One and only a renowned public campus of Lumbini province providing Bachelor level faculties of Management (BBS) and Science (BSc) affiliated to Tribhuvan University, Nepal.",
    about: "Padmodaya Campus, established in 2013 AD (2070 BS), is a community campus located in Ghorahi-17, Dang, Lumbini Province, Nepal. It operates as a subsidiary institute of Padmodaya Public Secondary School Ghorahi and is affiliated with Tribhuvan University for bachelor-level academic programs.\n\nThe campus offers undergraduate study in Management and Science through Bachelor of Business Studies (BBS) and Bachelor of Science (BSc) programs. Its academic setting is built around morning-shift classes, science laboratory access, library book support, transportation, and scholarship provisions for selected student groups.",
    mission: "To provide accessible, affordable, and quality higher education in Management and Science to students of Dang and surrounding regions, empowering them with knowledge, skills, and values for personal and professional growth.",
    vision: "To become a leading community campus in Lumbini Province recognized for academic excellence, research-oriented learning, and holistic student development.",
    contact: { address: "Ghorahi-17, Chaughera, Dang, Lumbini Province, Nepal", phone: "082-590754", mobile1: "9857863574", mobile2: "9847857046", email: "padmodayacampus@gmail.com", facebook: "https://www.facebook.com/profile.php?id=100063941974490" }
  },
  sliders: [
    { id: 1, title: "Padmodaya Campus", subtitle: "पद्मोदय क्याम्पस, घोराही, दाङ", kicker: "🎓 Padmodaya Campus", button_text: "Apply for Admission", button_action: "admissions", image_url: null, sort_order: 1, active: true },
    { id: 2, title: "Quality Education at Affordable Cost", subtitle: "Padmodaya Campus provides quality higher education and a supportive learning environment for academic excellence.", kicker: "📚 Academic Programs", button_text: "View Programs", button_action: "programs", image_url: null, sort_order: 2, active: true },
    { id: 3, title: "BBS & BSc Programs", subtitle: "Two four-year full-time undergraduate programs affiliated with Tribhuvan University.", kicker: "🏆 TU Affiliated", button_text: "Contact Campus", button_action: "contact", image_url: null, sort_order: 3, active: true }
  ],
  downloads: [],
  notices: [
    { id: 1, title: "Admission Open for BBS and BSc 2083", content: "Padmodaya Campus announces admission open for Bachelor of Business Studies (BBS) and Bachelor of Science (BSc) for the academic session 2082/083. Interested students are requested to contact the campus administration office for application forms and detailed information.", date: "2026-08-09", priority: "urgent", active: true, image_url: null, file_url: null, file_name: null },
    { id: 2, title: "First Year Orientation Program 2082", content: "The first-year orientation program for newly admitted BBS and BSc students will be held on 2082/05/15 at the campus hall. All first-year students are required to attend. The program will include an introduction to faculty members, campus rules, and academic calendar.", date: "2026-08-01", priority: "important", active: true, image_url: null, file_url: null, file_name: null },
    { id: 3, title: "BSc Entrance Examination Notice", content: "Tribhuvan University has scheduled the BSc entrance examination for the upcoming academic session. Eligible candidates must fill the entrance form at the campus office within the deadline. Contact the administration for dates and further details.", date: "2026-07-20", priority: "important", active: true, image_url: null, file_url: null, file_name: null },
    { id: 4, title: "Scholarship Information for Female BSc Students", content: "Under the Provincial Government of Lumbini scholarship scheme, female students enrolled in BSc program at Padmodaya Campus are eligible for scholarship support. Interested students should submit their applications with required documents to the administration office.", date: "2026-07-15", priority: "normal", active: true, image_url: null, file_url: null, file_name: null },
    { id: 5, title: "Library Facility Notice", content: "All students are informed that the campus library and e-library facilities are now fully operational. Students can borrow books and access digital resources during campus hours. Library cards will be issued to all enrolled students.", date: "2026-07-01", priority: "normal", active: true, image_url: null, file_url: null, file_name: null }
  ]
};

function cloneDefaults() { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }

async function loadDataFromDB() {
  const client = await initSupabase();
  const [siteResult, noticeResult, sliderResult, downloadResult] = await Promise.all([
    client.from('site_settings').select('key,value'),
    client.from('notices').select('*').order('date', { ascending: false }).order('created_at', { ascending: false }),
    client.from('sliders').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: true }),
    client.from('downloads').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false })
  ]);
  if (siteResult.error) throw siteResult.error;
  if (noticeResult.error) throw noticeResult.error;
  if (sliderResult.error) throw sliderResult.error;
  if (downloadResult.error) throw downloadResult.error;

  const data = cloneDefaults();
  for (const row of (siteResult.data || [])) {
    if (row.key === 'site' && row.value) data.site = { ...data.site, ...row.value, contact: { ...data.site.contact, ...(row.value.contact || {}) } };
  }
  if (noticeResult.data && noticeResult.data.length) data.notices = noticeResult.data;
  if (sliderResult.data && sliderResult.data.length) data.sliders = sliderResult.data;
  if (downloadResult.data && downloadResult.data.length) data.downloads = downloadResult.data;
  return data;
}

async function saveSiteToDB(site) {
  const client = await initSupabase();
  const { error } = await client.from('site_settings').upsert({ key: 'site', value: site, updated_at: new Date().toISOString() });
  if (error) throw error;
}

async function loadData() {
  try { return await loadDataFromDB(); }
  catch (e) {
    console.warn('Database unavailable; using bundled defaults.', e);
    return cloneDefaults();
  }
}

function resetData() { /* Database is authoritative; reset is intentionally disabled. */ }
