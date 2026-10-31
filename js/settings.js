(function () {
  const user = getCurrentUser();
  if (!user) return;
  const $ = id => document.getElementById(id);
  const DEFAULT_AVATAR = '../assets/images/avatar.png';

  $('fullNameInput').value = user.fullName || '';
  $('usernameInput').value = user.username || '';
  $('avatarPreview').src = user.avatar || DEFAULT_AVATAR;

  function showMsg(id, text, ok) {
    const message = $(id);
    message.textContent = text;
    message.hidden = false;
    message.dataset.state = ok ? 'success' : 'error';
  }

  $('settingsForm').addEventListener('submit', e => {
    e.preventDefault();
    const fullName = $('fullNameInput').value.trim();
    const username = $('usernameInput').value.trim();
    if (!fullName) return showMsg('settingsMsg', 'Họ và tên không được để trống.', false);
    if (!username) return showMsg('settingsMsg', 'Tên tài khoản không được để trống.', false);
    const users = getUsers();
    if (users.some(u => u.email !== user.email && (u.username || '').toLowerCase() === username.toLowerCase())) {
      return showMsg('settingsMsg', 'Tên tài khoản này đã được sử dụng.', false);
    }
    const index = users.findIndex(u => u.email === user.email);
    if (index < 0) return showMsg('settingsMsg', 'Không tìm thấy tài khoản.', false);
    users[index].fullName = fullName;
    users[index].username = username;
    saveUsers(users);
    user.fullName = fullName;
    user.username = username;
    setCurrentUser(user);
    showMsg('settingsMsg', 'Đã lưu thông tin cá nhân.', true);
  });

  $('avatarInput').addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      showMsg('settingsMsg', 'Vui lòng chọn ảnh PNG, JPG hoặc WEBP.', false);
      e.target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMsg('settingsMsg', 'Ảnh gốc cần nhỏ hơn 5 MB.', false);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const crop = Math.min(img.width, img.height);
        const sx = (img.width - crop) / 2;
        const sy = (img.height - crop) / 2;
        ctx.drawImage(img, sx, sy, crop, crop, 0, 0, size, size);
        const avatar = canvas.toDataURL('image/jpeg', 0.86);
        const users = getUsers();
        const index = users.findIndex(u => u.email === user.email);
        if (index < 0) return showMsg('settingsMsg', 'Không tìm thấy tài khoản.', false);
        users[index].avatar = avatar;
        saveUsers(users);
        user.avatar = avatar;
        setCurrentUser(user);
        $('avatarPreview').src = avatar;
        showMsg('settingsMsg', 'Đã cập nhật ảnh đại diện.', true);
      };
      img.onerror = () => showMsg('settingsMsg', 'Không thể đọc ảnh này. Vui lòng chọn ảnh khác.', false);
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

  $('passwordForm').addEventListener('submit', e => {
    e.preventDefault();
    const currentPassword = $('currentPasswordInput').value;
    const newPassword = $('newPasswordInput').value;
    const confirmPassword = $('confirmPasswordInput').value;
    const users = getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index < 0) return showMsg('passwordMsg', 'Không tìm thấy tài khoản.', false);
    if (users[index].password !== currentPassword) return showMsg('passwordMsg', 'Mật khẩu hiện tại không đúng.', false);
    if (newPassword.length < 6) return showMsg('passwordMsg', 'Mật khẩu mới cần ít nhất 6 ký tự.', false);
    if (newPassword === currentPassword) return showMsg('passwordMsg', 'Mật khẩu mới phải khác mật khẩu hiện tại.', false);
    if (newPassword !== confirmPassword) return showMsg('passwordMsg', 'Mật khẩu xác nhận không khớp.', false);
    users[index].password = newPassword;
    saveUsers(users);
    $('passwordForm').reset();
    showMsg('passwordMsg', 'Đổi mật khẩu thành công.', true);
  });

  $('clearDemoBtn').addEventListener('click', () => { $('clearModal').hidden = false; });
  $('clearCancelBtn').addEventListener('click', () => { $('clearModal').hidden = true; });
  $('clearConfirmBtn').addEventListener('click', () => {
    clearDemoData();
    $('clearModal').hidden = true;
    showMsg('settingsMsg', 'Đã xóa toàn bộ nhiệm vụ và dự án.', true);
  });

  const openDelete = () => { $('deletePasswordInput').value = ''; $('deleteError').hidden = true; $('deleteModal').hidden = false; $('deletePasswordInput').focus(); };
  $('deleteAccountBtn').addEventListener('click', openDelete);
  $('deleteCancelBtn').addEventListener('click', () => { $('deleteModal').hidden = true; });
  $('deleteForm').addEventListener('submit', e => {
    e.preventDefault();
    const users = getUsers(), acc = users.find(u => u.email === user.email);
    if (!acc || acc.password !== $('deletePasswordInput').value) {
      $('deleteError').textContent = 'Mật khẩu không đúng.'; $('deleteError').hidden = false; return;
    }
    saveUsers(users.filter(u => u.email !== user.email));
    clearDemoData();
    clearCurrentUser();
    location.href = 'login.html';
  });
})();
