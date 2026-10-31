(function () {
  const user = getCurrentUser();
  if (!user) { location.replace('login.html'); return; }
  const page = document.body.dataset.page;
  const items = [
    ['tasks', 'Quản lý nhiệm vụ', 'tasks.svg'],
    ['projects', 'Dự án cá nhân', 'projects.svg']
  ];
  const links = items.map(i =>
    '<a class="nav-link' + (page === i[0] ? ' active' : '') + '" href="' + i[0] + '.html">' +
    '<img src="../assets/icons/' + i[2] + '" alt="">' + i[1] + '</a>').join('');
  const name = esc(getDisplayName(user));
  document.getElementById('navbar').innerHTML =
    '<a class="nav-logo" href="dashboard.html"><img src="../assets/images/logo.png" alt="StudyVerse"></a>' +
    '<nav class="nav-menu">' + links + '</nav>' +
    '<div class="nav-user">' +
      '<button type="button" class="nav-avatar-btn" id="userBtn" aria-haspopup="true" aria-expanded="false" title="' + name + '">' +
        '<img class="nav-avatar" src="' + esc(user.avatar || '../assets/images/avatar.png') + '" alt="Avatar"></button>' +
      '<div class="user-menu" id="userMenu" hidden>' +
        '<div class="user-menu-head"><strong>' + name + '</strong><span>' + esc(user.email) + '</span></div>' +
        '<a class="user-menu-item" href="settings.html"><img src="../assets/icons/settings.svg" alt="">Cài đặt</a>' +
        '<button type="button" class="user-menu-item" id="logoutBtn"><span class="user-menu-icon">🚪</span>Đăng xuất</button>' +
      '</div></div>';

  const btn = document.getElementById('userBtn'), menu = document.getElementById('userMenu');
  const setMenu = open => { menu.hidden = !open; btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', e => { e.stopPropagation(); setMenu(menu.hidden); });
  document.addEventListener('click', e => { if (!menu.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  document.getElementById('logoutBtn').addEventListener('click', () => { clearCurrentUser(); location.href = 'login.html'; });

  document.body.insertAdjacentHTML('beforeend',
    '<footer class="footer"><span>© 2026 StudyVerse</span><a href="support.html"><img src="../assets/icons/support-blue.svg" alt="">Liên hệ &amp; Hỗ trợ</a></footer>');
})();
