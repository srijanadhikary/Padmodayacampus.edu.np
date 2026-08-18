// Padmodaya Campus — Default Data
// This file provides seed content. All edits from the admin dashboard are saved
// to browser localStorage under the key "padmodaya_data".

const DEFAULT_DATA = {
  site: {
    heroTagline: "Quality Education at Affordable Cost",
    heroDescription: "One and only a renowned public campus of Lumbini province providing Bachelor level faculties of Management (BBS) and Science (BSc) affiliated to Tribhuvan University, Nepal.",
    about: "Padmodaya Campus, established in 2013 AD (2070 BS), is a community campus located in Ghorahi-17, Dang, Lumbini Province, Nepal. It operates as a subsidiary institute of Padmodaya Public Secondary School Ghorahi and is affiliated with Tribhuvan University for bachelor-level academic programs.\n\nThe campus offers undergraduate study in Management and Science through Bachelor of Business Studies (BBS) and Bachelor of Science (BSc) programs. Its academic setting is built around morning-shift classes, science laboratory access, library book support, transportation, and scholarship provisions for selected student groups.",
    mission: "To provide accessible, affordable, and quality higher education in Management and Science to students of Dang and surrounding regions, empowering them with knowledge, skills, and values for personal and professional growth.",
    vision: "To become a leading community campus in Lumbini Province recognized for academic excellence, research-oriented learning, and holistic student development.",
    contact: {
      address: "Ghorahi-17, Chaughera, Dang, Lumbini Province, Nepal",
      phone: "082-590754",
      mobile1: "9857863574",
      mobile2: "9847857046",
      email: "padmodayacampus@gmail.com",
      facebook: "https://www.facebook.com/profile.php?id=100063941974490"
    }
  },
  notices: [
    { 
  id: 1, 
  title: "Admission Open for BBS and BSc 2083", 
  content: "Padmodaya Campus announces admission open for Bachelor of Business Studies (BBS) and Bachelor of Science (BSc) for the academic session 2082/083. Interested students are requested to contact the campus administration office for application forms and detailed information.", 
  date: "2026-08-09", 
  priority: "urgent", 
  active: true,
  link: "https://forms.gle/wuwFLQTBqitLK4ab6" // <-- Add your form link here
},
    { id: 2, title: "First Year Orientation Program 2082", content: "The first-year orientation program for newly admitted BBS and BSc students will be held on 2082/05/15 at the campus hall. All first-year students are required to attend. The program will include an introduction to faculty members, campus rules, and academic calendar.", date: "2026-08-01", priority: "important", active: true },
    { id: 3, title: "BSc Entrance Examination Notice", content: "Tribhuvan University has scheduled the BSc entrance examination for the upcoming academic session. Eligible candidates must fill the entrance form at the campus office within the deadline. Contact the administration for dates and further details.", date: "2026-07-20", priority: "important", active: true },
    { id: 4, title: "Scholarship Information for Female BSc Students", content: "Under the Provincial Government of Lumbini scholarship scheme, female students enrolled in BSc program at Padmodaya Campus are eligible for scholarship support. Interested students should submit their applications with required documents to the administration office.", date: "2026-07-15", priority: "normal", active: true },
    { id: 5, title: "Library Facility Notice", content: "All students are informed that the campus library and e-library facilities are now fully operational. Students can borrow books and access digital resources during campus hours. Library cards will be issued to all enrolled students.", date: "2026-07-01", priority: "normal", active: true }
  ]
};

// Storage helpers
function loadData() {
  try {
    const raw = localStorage.getItem('padmodaya_data');
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const parsed = JSON.parse(raw);
    // Merge with defaults to handle missing fields
    return {
      site: { ...DEFAULT_DATA.site, ...(parsed.site || {}), contact: { ...DEFAULT_DATA.site.contact, ...((parsed.site && parsed.site.contact) || {}) } },
      notices: Array.isArray(parsed.notices) ? parsed.notices : DEFAULT_DATA.notices
    };
  } catch (e) {
    console.error('Failed to load data:', e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  try {
    localStorage.setItem('padmodaya_data', JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save data:', e);
    return false;
  }
}

function resetData() {
  localStorage.removeItem('padmodaya_data');
}
