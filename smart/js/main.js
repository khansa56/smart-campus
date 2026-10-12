// Shared JavaScript: navigation, theme, dashboard and announcements.
const announcements = [
  { title: "Web Technology lab prototype", description: "Students should test all interactive features before submitting their front-end project.", date: "11 Oct 2026", category: "Academic" },
  { title: "Midterm examination schedule", description: "Review your department notice board for the confirmed examination timetable.", date: "10 Oct 2026", category: "Examination" },
  { title: "Tech Innovation Meetup", description: "Join fellow students to share ideas, projects and practical technology skills.", date: "09 Oct 2026", category: "Event" },
  { title: "Library hours reminder", description: "Please return borrowed books on time and keep your student card available.", date: "08 Oct 2026", category: "General" },
  { title: "Course registration check", description: "Review your registered courses and contact your academic office if corrections are needed.", date: "07 Oct 2026", category: "Academic" }
];
const dashboardData = [
  { icon: "▤", value: "06", label: "Registered courses", note: "Across this semester" },
  { icon: "✓", value: "12", label: "Completed courses", note: "Academic progress" },
  { icon: "◷", value: "4th", label: "Current semester", note: "BS Computer Science" },
  { icon: "↗", value: "92%", label: "Attendance", note: "Sample overview" }
];
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));

function renderDashboard() {
  const target = document.getElementById("dashboardStats");
  if (target) target.innerHTML = dashboardData.map(item => `<article class="stat-card"><span class="stat-icon">${item.icon}</span><strong>${item.value}</strong><p>${item.label}</p><p>${item.note}</p></article>`).join("");
}
function renderAnnouncementList() {
  const target = document.getElementById("homeAnnouncements");
  if (target) target.innerHTML = announcements.slice(0, 3).map(item => `<article class="announcement-row"><span class="announcement-icon">✦</span><div><span class="category-tag">${escapeHTML(item.category)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><span class="meta-line">${escapeHTML(item.date)}</span></div></article>`).join("");
}
function renderAnnouncementGrid(category = "All") {
  const target = document.getElementById("announcementGrid");
  if (!target) return;
  const filtered = category === "All" ? announcements : announcements.filter(item => item.category === category);
  target.innerHTML = filtered.map(item => `<article class="announcement-card"><span class="category-tag">${escapeHTML(item.category)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p><span class="meta-line">${escapeHTML(item.date)}</span></article>`).join("");
  if (!filtered.length) target.innerHTML = '<p class="empty-state">No announcements in this category.</p>';
}
function setupTheme() {
  const savedTheme = localStorage.getItem("smartCampusTheme");
  if (savedTheme === "dark") document.body.classList.add("dark-mode");
  const button = document.getElementById("themeToggle");
  const updateLabel = () => { if (button) button.textContent = document.body.classList.contains("dark-mode") ? "☀ Light mode" : "☾ Dark mode"; };
  updateLabel();
  if (button) button.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("smartCampusTheme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    updateLabel();
  });
}
function setupNavigation() {
  const toggle = document.getElementById("navToggle"), links = document.getElementById("navLinks");
  if (toggle && links) toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}
function setupProfileForm() {
  const form = document.getElementById("profileForm");
  if (!form) return;
  const fields = ["fullName", "regNo", "email", "phone", "department", "semester", "password", "confirmPassword"];
  const error = (id, message) => {
    const input = document.getElementById(id), errorNode = document.getElementById(id + "Error");
    if (errorNode) errorNode.textContent = message;
    if (input) { input.classList.toggle("invalid-input", Boolean(message)); input.classList.toggle("valid-input", !message && Boolean(input.value)); }
  };
  const validate = () => {
    let valid = true;
    const value = id => document.getElementById(id).value.trim();
    const checks = {
      fullName: value("fullName").length >= 3 ? "" : "Please enter your full name (at least 3 characters).",
      regNo: /^[A-Za-z]{2,6}[-/]?\d{2,4}[-/]?\d{2,6}$/.test(value("regNo")) ? "" : "Use a format like IST-2026-0123.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value("email")) ? "" : "Please enter a valid email address.",
      phone: /^\+?\d[\d\s-]{8,14}$/.test(value("phone")) ? "" : "Enter a valid phone number.",
      department: value("department") ? "" : "Please select a department.",
      semester: value("semester") ? "" : "Please select a semester.",
      password: value("password").length >= 8 ? "" : "Password must contain at least 8 characters.",
      confirmPassword: value("confirmPassword") && value("confirmPassword") === value("password") ? "" : "Passwords must match."
    };
    fields.forEach(id => { error(id, checks[id]); if (checks[id]) valid = false; });
    return valid;
  };
  fields.forEach(id => document.getElementById(id).addEventListener("input", () => {
    const message = document.getElementById("profileMessage");
    message.textContent = ""; message.className = "form-message";
    if (document.getElementById(id + "Error").textContent) validate();
  }));
  form.addEventListener("submit", event => {
    event.preventDefault();
    const message = document.getElementById("profileMessage");
    if (validate()) { message.textContent = "Validation successful! This demo does not send or save your personal information."; message.className = "form-message success"; }
    else { message.textContent = "Please correct the highlighted fields."; message.className = "form-message error"; }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  setupTheme(); setupNavigation(); renderDashboard(); renderAnnouncementList(); renderAnnouncementGrid();
  const filter = document.getElementById("announcementFilter");
  if (filter) filter.addEventListener("change", event => renderAnnouncementGrid(event.target.value));
  setupProfileForm();
});
