function login() {
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;

  if (!email.endsWith("@company.com")) {
    document.getElementById("msg").innerText =
      "Only official email IDs allowed";
    return;
  }

  sessionStorage.setItem("user", JSON.stringify({ email, role }));
  window.location.href = "dashboard.html";
}

function requireAuth() {
  const u = sessionStorage.getItem("user");
  if (!u) window.location.href = "index.html";
  return JSON.parse(u);
}

function getRole() {
  return JSON.parse(sessionStorage.getItem("user")).role;
}

function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}
