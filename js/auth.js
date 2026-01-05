function loginUser(role) {
  sessionStorage.setItem("user", JSON.stringify({ role }));
}

function getUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function requireAuth() {
  const u = getUser();
  if (!u) location.href = "index.html";
  return u;
}

function logout() {
  sessionStorage.clear();
  location.href = "index.html";
}
