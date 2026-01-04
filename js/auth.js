// js/auth.js

function loginUser(email, role) {
  sessionStorage.setItem("user", JSON.stringify({ email, role }));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function requireAuth() {
  const user = getCurrentUser();
  if (!user) location.href = "index.html";
  return user;
}

function logoutUser() {
  sessionStorage.clear();
  location.href = "index.html";
}
