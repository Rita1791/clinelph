function loginUser(email, role) {
  sessionStorage.setItem("user", JSON.stringify({
    email: email,
    role: role,
    loginTime: new Date().toISOString()
  }));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

function logoutUser() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
