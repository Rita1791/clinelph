// js/auth.js

function loginUser(email, role) {
  const user = {
    email: email,
    role: role,
    loginTime: new Date().toISOString()
  };

  sessionStorage.setItem("user", JSON.stringify(user));
}

/**
 * Safely get logged-in user
 */
function getCurrentUser() {
  const user = sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

/**
 * Protect pages that require login
 * Call this at top of dashboard, patient, patient-card pages
 */
function requireAuth() {
  const user = getCurrentUser();
  if (!user) {
    alert("Session expired or not logged in");
    window.location.href = "index.html";
  }
  return user;
}

function logoutUser() {
  sessionStorage.clear();

  // Works on localhost and GitHub Pages
  window.location.href = "index.html";
}
// ---- ROLE PERMISSIONS ----

function canEditData() {
  const role = getCurrentUser()?.role;
  return ["DataEntry", "CRC", "Phlebotomist", "OA"].includes(role);
}

function canDeletePatient() {
  const role = getCurrentUser()?.role;
  return ["QC", "QA", "PI"].includes(role);
}

function canCommentOnly() {
  const role = getCurrentUser()?.role;
  return ["QC", "QA", "Sponsor"].includes(role);
}

