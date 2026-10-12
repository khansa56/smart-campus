// Course objects are rendered dynamically; cards are not hard-coded in HTML.
const courses = [
  { code: "CS-401", name: "Web Technology", instructor: "Ms. Ayesha", credits: 3, semester: 4, status: "Registered" },
  { code: "CS-402", name: "Database Systems", instructor: "Dr. Shahid", credits: 3, semester: 4, status: "Registered" },
  { code: "CS-403", name: "Computer Architecture", instructor: "Mr. Hamza", credits: 3, semester: 4, status: "Registered" },
  { code: "CS-404", name: "Artificial Intelligence", instructor: "Ms. Sana", credits: 3, semester: 4, status: "Registered" },
  { code: "CS-305", name: "Data Structures", instructor: "Dr. Bilal", credits: 4, semester: 3, status: "Completed" },
  { code: "CS-204", name: "Object-Oriented Programming", instructor: "Mr. Usman", credits: 4, semester: 2, status: "Completed" }
];
const safeText = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
function renderCourses() {
  const query = document.getElementById("courseSearch").value.trim().toLowerCase();
  const semester = document.getElementById("semesterFilter").value;
  const status = document.getElementById("statusFilter").value;
  const filtered = courses.filter(course => {
    const matchesQuery = course.name.toLowerCase().includes(query) || course.code.toLowerCase().includes(query);
    const matchesSemester = semester === "All" || String(course.semester) === semester;
    const matchesStatus = status === "All" || course.status === status;
    return matchesQuery && matchesSemester && matchesStatus;
  });
  document.getElementById("courseGrid").innerHTML = filtered.map(course => `<article class="course-card"><div class="course-card-top"><span class="course-code">${safeText(course.code)}</span><span class="status-tag ${course.status === "Completed" ? "completed" : ""}">${safeText(course.status)}</span></div><h3>${safeText(course.name)}</h3><p>${safeText(course.instructor)}</p><div class="course-details"><div><small>Credit hours</small><strong>${course.credits} credits</strong></div><div><small>Semester</small><strong>Semester ${course.semester}</strong></div></div></article>`).join("");
  document.getElementById("courseCount").textContent = `${filtered.length} course${filtered.length === 1 ? "" : "s"}`;
  document.getElementById("courseEmpty").classList.toggle("hidden", filtered.length !== 0);
}
document.addEventListener("DOMContentLoaded", () => {
  ["courseSearch", "semesterFilter", "statusFilter"].forEach(id => document.getElementById(id).addEventListener(id === "courseSearch" ? "input" : "change", renderCourses));
  renderCourses();
});
