function loginUser(email, role) {
  sessionStorage.setItem("user", JSON.stringify({
    email,
    role,
    time: new Date().toISOString()
  }));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    alert("Session expired");
    window.location.href = "index.html";
  }
  return user;
}

function canEdit() {
  const role = getCurrentUser().role;
  return ["DataEntry","CRC","Phlebotomist","OA"].includes(role);
}

function canDelete() {
  const role = getCurrentUser().role;
  return ["QC","QA","PI"].includes(role);
}

function logoutUser() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
