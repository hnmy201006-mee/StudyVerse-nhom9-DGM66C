# StudyVerse
Website quản lý nhiệm vụ cho sinh viên (HTML/CSS/JS thuần, lưu bằng localStorage).

## Chạy
Mở thư mục bằng Live Server, vào `index.html`. Tài khoản demo: `demo@studyverse.vn` / `123456`.

## Ảnh cần thay bằng ảnh thật (assets/images)
logo.png, background.png, avatar.png, qr-zalo.png (hiện là ảnh tạm).

## Hàm dùng chung trong js/storage.js
getTasks/saveTasks, getProjects/saveProjects, getUsers/saveUsers, getCurrentUser/setCurrentUser/clearCurrentUser, clearDemoData,
formatDate, formatTaskDeadline, getTaskDateTime, isOverdue, getTaskState, getProjectProgress, fillSelect, applyProgress, esc, newId.

## Sửa lỗi: ngày/giờ deadline khi bấm Sửa nhiệm vụ
- Dữ liệu cũ lưu deadline dạng `YYYY-MM-DDTHH:mm` làm ô ngày trong form Sửa bị trống, nên không lưu được. Nay form luôn điền ngày chuẩn hóa và `storage.js` tự chuyển dữ liệu cũ về `deadline` (ngày) + `deadlineTime` (giờ) khi mở trang.
- Cột "Ngày deadline" hiển thị thêm giờ bên dưới ngày để thấy ngay khi sửa giờ.
- Nếu không tìm thấy id khi lưu thì thêm mới thay vì bỏ qua âm thầm.
