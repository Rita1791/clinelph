function loginUser(email, role) {
  sessionStorage.setItem("user", JSON.stringify({ email, role }));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function requireAuth() {
  const u = getCurrentUser();
  if (!u) location.href = "index.html";
  return u;
}

function canEdit() {
  return ["DataEntry","CRC","Phlebotomist","OA"].includes(getCurrentUser().role);
}

function canDelete() {
  return ["QC","QA","PI"].includes(getCurrentUser().role);
}

function logoutUser() {
  sessionStorage.clear();
  location.href = "index.html";
}
