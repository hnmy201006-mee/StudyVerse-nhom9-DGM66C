const authForm = document.getElementById('authForm');
const authError = document.getElementById('authError');
const isRegister = document.body.dataset.page === 'register';
if (getCurrentUser()) location.replace('dashboard.html');
if (new URLSearchParams(location.search).get('registered')) {
  const ok = document.getElementById('authOk'); if (ok) ok.hidden = false;
}
document.querySelectorAll('.eye').forEach(btn => btn.addEventListener('click', () => {
  const input = document.getElementById(btn.dataset.target);
  input.type = input.type === 'password' ? 'text' : 'password';
}));
function showError(msg) { authError.textContent = msg; authError.hidden = false; }

authForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const password = document.getElementById('passwordInput').value;
  const users = getUsers();
  if (!/^\S+@\S+\.\S+$/.test(email)) return showError('Email không hợp lệ.');
  if (!isRegister) {
    const u = users.find(x => x.email === email && x.password === password);
    if (!u) return showError('Email hoặc mật khẩu không đúng.');
    setCurrentUser({ email: u.email, fullName: u.fullName, username: u.username, avatar: u.avatar || null });
    location.href = 'dashboard.html';
    return;
  }
  const fullName = document.getElementById('fullNameInput').value.trim();
  const username = document.getElementById('usernameInput').value.trim();
  if (!fullName) return showError('Vui lòng nhập họ và tên.');
  if (!username) return showError('Vui lòng nhập tên tài khoản.');
  if (users.some(x => (x.username || '').toLowerCase() === username.toLowerCase())) return showError('Tên tài khoản này đã được sử dụng.');
  if (password.length < 6) return showError('Mật khẩu cần ít nhất 6 ký tự.');
  if (password !== document.getElementById('confirmInput').value) return showError('Mật khẩu nhập lại không khớp.');
  if (users.some(x => x.email === email)) return showError('Email này đã được đăng ký.');
  users.push({ email: email, password: password, fullName: fullName, username: username, avatar: null });
  saveUsers(users);
  location.href = 'login.html?registered=1';
});
