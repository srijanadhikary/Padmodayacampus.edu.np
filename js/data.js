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
    { id: 1, title: "Campus facilities", subtitle: "Explore the campus library, laboratories and student services.", kicker: "Student resources", button_text: "View Campus Facilities", button_action: "facilities", image_url: null, sort_order: 1, active: true },
    { id: 2, title: "Quality Education at Affordable Cost", subtitle: "Padmodaya Campus provides quality higher education and a supportive learning environment for academic excellence.", kicker: "Academic programs", button_text: "View Programs", button_action: "programs", image_url: null, sort_order: 2, active: true },
    { id: 3, title: "Campus notices", subtitle: "Find announcements and updates from the campus office.", kicker: "Announcements", button_text: "View Notices", button_action: "notices", image_url: null, sort_order: 3, active: true }
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

const PROGRAM_CATALOG = {
  "bbs": {
    "name": "Bachelor of Business Studies (BBS)",
    "short": "BBS",
    "duration": "4 years",
    "admission": "D+ aggregate · Morning shift",
    "overview": "The BBS program builds a foundation in business, finance, accounting and management. It prepares students for entry-level roles in business, entrepreneurship and further study."
  },
  "bba": {
    "name": "Bachelor of Business Administration (BBA)",
    "short": "BBA",
    "duration": "4 years · 8 semesters",
    "overview": "BBA develops practical skills in business decision-making, communication and management. Students learn how organisations operate and how managers use financial and market information to make decisions.",
    "curriculum": "Core areas include accounting, finance, marketing, human resources, business communication and operations.",
    "careers": "Possible paths include management trainee roles, marketing, sales, operations, human resources and entrepreneurship.",
    "inquiry": true
  },
  "bsc": {
    "name": "Bachelor of Science (General)",
    "short": "BSc General",
    "duration": "4 years",
    "admission": "C aggregate + entrance examination · 48 seats · 6:00 AM",
    "overview": "The BSc program offers Physical and Biological groups and combines theory with practical laboratory work.",
    "curriculum": "Year 1 — Three core subjects and Scientific Communication.\nYear 2 — Continued core subjects and Applied Statistics.\nYear 3 — Two core subjects, Research Methodology and electives.\nYear 4 — Major subject, project or fieldwork, computational and interdisciplinary studies."
  },
  "csit": {
    "name": "Bachelor of Science in Computer Science and Information Technology (BSc CSIT)",
    "short": "BSc CSIT",
    "duration": "4 years · 8 semesters",
    "overview": "BSc CSIT combines the foundations of computer science with hands-on experience in designing, developing and testing software.",
    "features": "Laboratory assignments develop practical skills in designing and troubleshooting software.\nThe final-year project takes a software idea from planning through development, testing and presentation.\nA supervised internship gives students experience with professional technical requirements.\nElectives can include mobile development, cloud computing, data or network security, depending on availability.",
    "curriculum": "Years 1–2 — Programming, mathematics, statistics, computer systems, databases, networking and artificial intelligence.\nYear 3 — Algorithms, web technology, software engineering and electives.\nYear 4 — Advanced computing, electives, software project and industry internship.",
    "speciality": "Students learn to break down technical problems, compare possible solutions and explain and test their decisions. Lab work, the project and the internship give students practical experience to discuss in interviews or build on in further study.",
    "careers": "Software and web development · Mobile application development · Data analysis and database support · Software quality assurance · Networking and IT operations · Cybersecurity and cloud support\nGraduates can also pursue postgraduate study in computer science, information technology or related fields.",
    "inquiry": true
  }
};

const PROGRAM_FIELDS = {
  "duration": "Duration",
  "admission": "Admission Information",
  "overview": "Program Overview",
  "features": "Key Features",
  "speciality": "What Makes This Program Distinctive",
  "curriculum": "Course Content",
  "careers": "Career Opportunities"
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
  data.programs = getPrograms(siteResult.data);
  data.leadership = getLeadership(siteResult.data);
  for (const row of (siteResult.data || [])) {
    if (row.key === 'site' && row.value) data.site = { ...data.site, ...row.value, contact: { ...data.site.contact, ...(row.value.contact || {}) } };
  }
  if (noticeResult.data && noticeResult.data.length) data.notices = noticeResult.data;
  if (sliderResult.data && sliderResult.data.length) data.sliders = sliderResult.data;
  if (downloadResult.data && downloadResult.data.length) data.downloads = downloadResult.data;
  return data;
}

function getPrograms(rows = []) {
  const programs = JSON.parse(JSON.stringify(PROGRAM_CATALOG));
  for (const [id, program] of Object.entries(programs)) {
    const saved = rows.find(row => row.key === 'program-' + id)?.value;
    for (const field of Object.keys(PROGRAM_FIELDS)) {
      if (typeof saved?.[field] === 'string') program[field] = saved[field];
    }
  }
  return programs;
}

async function saveProgramToDB(id, values) {
  if (!Object.hasOwn(PROGRAM_CATALOG, id)) throw new Error('Unknown program.');
  const client = await initSupabase();
  const { error } = await client.from('site_settings').upsert({
    key: 'program-' + id,
    value: values,
    updated_at: new Date().toISOString()
  });
  if (error) throw error;
}

const DEFAULT_LEADERSHIP = [
  { id: 'chief', name: 'Yubraj Bhandari', role: 'Campus Chief', order: 10, active: true },
  { id: 'chairman', name: 'Tara Prasad Adhikari', role: 'Chairman', order: 20, active: true }
];

function getLeadership(rows = []) {
  const profiles = new Map(DEFAULT_LEADERSHIP.map(profile => [profile.id, { ...profile }]));
  for (const { key, value } of rows || []) {
    if (!key.startsWith('leadership-') || !value || typeof value !== 'object') continue;
    const id = key.slice('leadership-'.length);
    profiles.set(id, { ...profiles.get(id), ...value, id });
  }
  return [...profiles.values()].sort((a, b) => (a.order || 0) - (b.order || 0));
}

async function saveLeadershipProfile(profile) {
  const { id, ...value } = profile;
  const client = await initSupabase();
  const { error } = await client.from('site_settings').upsert({
    key: 'leadership-' + id, value, updated_at: new Date().toISOString()
  });
  if (error) throw error;
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
