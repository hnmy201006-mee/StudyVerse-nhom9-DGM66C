# StudyVerse

Website quản lý nhiệm vụ dành cho học sinh, sinh viên, xây dựng bằng **HTML, CSS và JavaScript thuần**. Dữ liệu được lưu trong `localStorage` của trình duyệt, không cần backend hoặc cơ sở dữ liệu riêng.

StudyVerse hỗ trợ người dùng theo dõi nhiệm vụ học tập, công việc và hoạt động cá nhân; tổ chức nhiệm vụ theo dự án; quản lý deadline và xem tiến độ hoàn thành.

## Mục lục

- [1. Tính năng chính](#1-tính-năng-chính)
- [2. Công nghệ sử dụng](#2-công-nghệ-sử-dụng)
- [3. Cấu trúc thư mục](#3-cấu-trúc-thư-mục)
- [4. Cách chạy website](#4-cách-chạy-website)
- [5. Tài khoản demo](#5-tài-khoản-demo)
- [6. Quy ước dữ liệu](#6-quy-ước-dữ-liệu)
- [7. Các hàm dùng chung trong storagejs](#7-các-hàm-dùng-chung-trong-storagejs)
- [8. Quy tắc deadline và tiến độ](#8-quy-tắc-deadline-và-tiến-độ)
- [9. Hình ảnh và tài nguyên](#9-hình-ảnh-và-tài-nguyên)
- [10. Kiểm thử đề xuất](#10-kiểm-thử-đề-xuất)
- [11. Giới hạn của phiên bản](#11-giới-hạn-của-phiên-bản)

## 1. Tính năng chính

### 1.1. Điều hướng và tài khoản

- `index.html` kiểm tra phiên đăng nhập và chuyển người dùng đến Dashboard hoặc trang đăng nhập.
- Đăng nhập bằng tài khoản đã lưu trong trình duyệt.
- Đăng ký tài khoản demo với họ tên, tên tài khoản, email và mật khẩu.
- Hiện/ẩn mật khẩu trong biểu mẫu xác thực.
- Đăng xuất và xóa phiên đăng nhập hiện tại.
- Trang Cài đặt cho phép sửa họ tên, tên tài khoản, ảnh đại diện và mật khẩu.
- Có thể xóa dữ liệu nhiệm vụ/dự án demo hoặc xóa tài khoản hiện tại.

### 1.2. Dashboard

- Hiển thị lời chào theo thông tin tài khoản.
- Thống kê tổng số nhiệm vụ, nhiệm vụ chưa hoàn thành và nhiệm vụ quá hạn.
- Hiển thị tổng quan tiến độ và danh sách nhiệm vụ cần chú ý.
- Dữ liệu thống kê được lấy từ các nhiệm vụ đang lưu trong `localStorage`.

### 1.3. Quản lý nhiệm vụ

- Thêm, sửa và xóa nhiệm vụ.
- Cập nhật trạng thái nhiệm vụ.
- Tìm kiếm theo tên nhiệm vụ.
- Lọc theo trạng thái, mức ưu tiên, loại nhiệm vụ và dự án.
- Thiết lập ngày deadline và giờ deadline riêng.
- Hiển thị ngày deadline theo định dạng `dd/mm/yyyy`, kèm giờ; hiển thị thời gian còn lại hoặc trạng thái quá hạn.
- Liên kết nhiệm vụ với một dự án hoặc để nhiệm vụ độc lập.

### 1.4. Quản lý dự án cá nhân

- Thêm, sửa và xóa dự án.
- Thiết lập tên, mức ưu tiên và deadline của dự án.
- Tính tiến độ dự án từ số nhiệm vụ đã hoàn thành trên tổng số nhiệm vụ được liên kết.
- Hiển thị số nhiệm vụ đã hoàn thành, tiến độ và thời gian còn lại.
- Mở danh sách nhiệm vụ đã lọc theo dự án.
- Khi xóa dự án, các nhiệm vụ liên kết được giữ lại và chuyển thành nhiệm vụ độc lập.

### 1.5. Liên hệ & Hỗ trợ

- Hiển thị mã QR và hướng dẫn liên hệ qua Zalo.
- Đây là trang hướng dẫn tĩnh; không có chức năng trò chuyện trực tiếp trong website.

## 2. Công nghệ sử dụng

- **HTML5:** cấu trúc và nội dung các trang.
- **CSS3:** bố cục, thành phần giao diện, biến CSS dùng chung và responsive.
- **JavaScript thuần:** thao tác DOM, xử lý biểu mẫu, tìm kiếm/lọc, tính toán thống kê và điều hướng.
- **localStorage:** lưu tài khoản demo, phiên đăng nhập, nhiệm vụ và dự án trên trình duyệt.
- **Google Fonts – Inter:** font chữ giao diện; cần kết nối Internet để tải font từ Google Fonts. Nếu không tải được, website sử dụng font dự phòng sans-serif.

Dự án không sử dụng framework JavaScript hoặc backend. Có thể đọc và chạy trực tiếp các file HTML/CSS/JS trong thư mục.

## 3. Cấu trúc thư mục

```text
StudyVerse/
├── index.html
├── README.md
├── assets/
│   ├── icons/
│   │   ├── projects.svg
│   │   ├── robot.svg
│   │   ├── settings-big.svg
│   │   ├── settings.svg
│   │   ├── stat-open.svg
│   │   ├── stat-overdue.svg
│   │   ├── stat-total.svg
│   │   ├── support-blue.svg
│   │   ├── support.svg
│   │   └── tasks.svg
│   └── images/
│       ├── avatar.png
│       ├── background.png
│       ├── logo.png
│       └── qr-zalo.png
├── css/
│   ├── style.css
│   ├── auth.css
│   ├── dashboard.css
│   ├── tasks.css
│   └── projects.css
├── js/
│   ├── storage.js
│   ├── main.js
│   ├── auth.js
│   ├── dashboard.js
│   ├── tasks.js
│   ├── projects.js
│   └── settings.js
└── pages/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── tasks.html
    ├── projects.html
    ├── settings.html
    └── support.html
```

### Trách nhiệm của các file chính

| File | Trách nhiệm |
|---|---|
| `index.html` | Kiểm tra phiên và điều hướng đến trang phù hợp |
| `css/style.css` | Biến CSS, reset, khung giao diện, navbar, thành phần dùng chung và responsive |
| `css/auth.css` | Giao diện đăng nhập và đăng ký |
| `css/dashboard.css` | Giao diện Dashboard |
| `css/tasks.css` | Giao diện quản lý nhiệm vụ |
| `css/projects.css` | Giao diện quản lý dự án |
| `js/storage.js` | Hằng số dùng chung, đọc/ghi `localStorage`, chuẩn hóa deadline và các hàm hỗ trợ |
| `js/main.js` | Dựng thanh điều hướng, cập nhật thông tin người dùng và xử lý điều hướng/đăng xuất |
| `js/auth.js` | Xử lý đăng nhập, đăng ký và kiểm tra dữ liệu xác thực |
| `js/dashboard.js` | Tính và hiển thị số liệu Dashboard |
| `js/tasks.js` | CRUD nhiệm vụ, tìm kiếm, lọc, deadline và trạng thái |
| `js/projects.js` | CRUD dự án, tiến độ và liên kết đến nhiệm vụ |
| `js/settings.js` | Cập nhật hồ sơ, avatar, mật khẩu và thao tác dữ liệu/tài khoản |

### Thứ tự nạp JavaScript

| Trang | Thứ tự |
|---|---|
| `index.html` | `js/storage.js`, sau đó điều hướng |
| Đăng nhập/Đăng ký | `js/storage.js` → `js/auth.js` |
| Dashboard | `js/storage.js` → `js/main.js` → `js/dashboard.js` |
| Nhiệm vụ | `js/storage.js` → `js/main.js` → `js/tasks.js` |
| Dự án | `js/storage.js` → `js/main.js` → `js/projects.js` |
| Cài đặt | `js/storage.js` → `js/main.js` → `js/settings.js` |
| Liên hệ & Hỗ trợ | `js/storage.js` → `js/main.js` |

## 4. Cách chạy website

### Cách khuyến nghị: Visual Studio Code + Live Server

1. Giải nén thư mục dự án.
2. Mở thư mục chứa `index.html` bằng Visual Studio Code.
3. Cài extension **Live Server** nếu máy chưa có.
4. Nhấn chuột phải vào `index.html` và chọn **Open with Live Server**.
5. Website sẽ mở trong trình duyệt. Đăng nhập bằng tài khoản demo hoặc đăng ký tài khoản mới.

Nên chạy qua Live Server thay vì mở file HTML trực tiếp để việc điều hướng và kiểm tra tài nguyên nhất quán hơn.

## 5. Tài khoản demo

- **Email:** `demo@studyverse.vn`
- **Mật khẩu:** `123456`

Tài khoản và dữ liệu mẫu được khởi tạo lần đầu trong trình duyệt. Cờ khởi tạo `studyVerseInitialized` giúp website không tự tạo lại dữ liệu demo mỗi lần tải trang sau khi người dùng đã xóa dữ liệu.

Nếu cần kiểm tra lại từ trạng thái ban đầu, có thể xóa dữ liệu website trong phần lưu trữ của trình duyệt rồi tải lại trang. Thao tác này sẽ xóa dữ liệu StudyVerse đang lưu trên trình duyệt đó.

## 6. Quy ước dữ liệu

### 6.1. Các khóa `localStorage`

| Khóa | Nội dung |
|---|---|
| `users` | Danh sách tài khoản demo |
| `currentUser` | Thông tin phiên đăng nhập hiện tại |
| `tasks` | Danh sách nhiệm vụ |
| `projects` | Danh sách dự án |
| `studyVerseInitialized` | Đánh dấu dữ liệu demo đã được khởi tạo |

### 6.2. Nhiệm vụ

Một nhiệm vụ có cấu trúc tương tự:

```js
{
  id: "task_001",
  title: "Hoàn thành bài tập JavaScript",
  category: "study",
  priority: "high",
  status: "doing",
  deadline: "2026-10-30",
  deadlineTime: "14:30",
  projectId: "project_001"
}
```

- `id`: mã định danh nhiệm vụ.
- `title`: tên nhiệm vụ.
- `category`: loại nhiệm vụ (`study`, `work`, `personal`).
- `priority`: mức ưu tiên (`high`, `medium`, `low`).
- `status`: trạng thái (`todo`, `doing`, `done`).
- `deadline`: ngày theo định dạng `YYYY-MM-DD`.
- `deadlineTime`: giờ theo định dạng `HH:mm`.
- `projectId`: ID dự án liên kết; dùng `null` nếu là nhiệm vụ độc lập.

### 6.3. Dự án

```js
{
  id: "project_001",
  name: "Website StudyVerse",
  priority: "high",
  deadline: "2026-11-08"
}
```

Tiến độ dự án được tính từ các nhiệm vụ có `projectId` trùng ID dự án, không lưu phần trăm tiến độ riêng vào `localStorage`.

### 6.4. Giá trị dùng chung

Các hằng số trong `js/storage.js`:

```js
const CATEGORIES = {
  study: "Học tập",
  work: "Công việc",
  personal: "Cá nhân"
};

const STATUSES = {
  todo: "Chưa triển khai",
  doing: "Đang triển khai",
  done: "Hoàn thành"
};

const PRIORITIES = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp"
};
```

Khi lưu dữ liệu, dùng giá trị mã hóa không dấu như `study`, `todo`, `high`; khi hiển thị, lấy nhãn từ các hằng số này.

## 7. Các hàm dùng chung trong `storage.js`

| Hàm | Công dụng |
|---|---|
| `getTasks()` / `saveTasks(tasks)` | Đọc/lưu danh sách nhiệm vụ |
| `getProjects()` / `saveProjects(projects)` | Đọc/lưu danh sách dự án |
| `getUsers()` / `saveUsers(users)` | Đọc/lưu danh sách tài khoản |
| `getCurrentUser()` | Lấy người dùng đang đăng nhập |
| `setCurrentUser(user)` | Lưu phiên người dùng |
| `clearCurrentUser()` | Xóa phiên đăng nhập |
| `clearDemoData()` | Xóa danh sách nhiệm vụ và dự án, không xóa tài khoản |
| `formatDate(iso)` | Đổi ngày `YYYY-MM-DD` thành `dd/mm/yyyy` |
| `formatTaskDeadline(iso, time)` | Định dạng deadline nhiệm vụ, gồm giờ và ngày |
| `getTaskDateTime(task)` | Lấy chuỗi ngày-giờ của nhiệm vụ để so sánh |
| `isOverdue(task)` | Kiểm tra nhiệm vụ đã quá hạn hay chưa |
| `getTaskState(task)` | Trả về trạng thái hiển thị, có xét quá hạn |
| `getProjectProgress(project, tasks)` | Tính số nhiệm vụ hoàn thành và phần trăm tiến độ dự án |
| `getTimeRemaining(deadline, time, completed)` | Tính thời gian còn lại hoặc thời gian quá hạn |
| `getProjectTimeRemaining(project)` | Tính thời gian còn lại đến deadline dự án |
| `fillSelect(select, values, emptyLabel)` | Tạo các lựa chọn trong thẻ `<select>` từ object giá trị |
| `applyProgress(root)` | Áp dụng phần trăm tiến độ cho các phần tử có `data-progress` |
| `esc(value)` | Escape ký tự HTML đặc biệt trước khi đưa dữ liệu vào HTML |
| `newId(prefix)` | Tạo ID mới cho dữ liệu |
| `getDisplayName(user)` | Lấy tên hiển thị của người dùng |

Ngoài ra, `storage.js` có chức năng `migrateDeadlines()` để chuẩn hóa dữ liệu deadline cũ.

## 8. Quy tắc deadline và tiến độ

- Ngày lưu trong dữ liệu sử dụng `YYYY-MM-DD`; giờ sử dụng `HH:mm`.
- Deadline nhiệm vụ được lưu tách thành `deadline` và `deadlineTime`.
- Nếu dữ liệu cũ có dạng `YYYY-MM-DDTHH:mm`, `storage.js` sẽ cố gắng tách ngày và giờ khi khởi tạo.
- Nếu nhiệm vụ cũ không có giờ deadline, giờ mặc định là `23:59`.
- Nhiệm vụ quá hạn khi thời điểm deadline đã qua và trạng thái không phải `done`.
- Nhiệm vụ hoàn thành không được xem là nhiệm vụ quá hạn.
- Thời gian còn lại được tính tại thời điểm trang thực hiện tính toán.
- Tiến độ tổng được tính bằng số nhiệm vụ hoàn thành chia tổng số nhiệm vụ.
- Tiến độ dự án được tính bằng số nhiệm vụ hoàn thành thuộc dự án chia tổng số nhiệm vụ thuộc dự án.
- Dự án chưa có nhiệm vụ có tiến độ `0%`.
- Xóa dự án không xóa nhiệm vụ liên kết; trường `projectId` của các nhiệm vụ đó được đặt thành `null`.
- Xóa dữ liệu demo chỉ xóa `tasks` và `projects`, không tự đăng xuất người dùng.

### Lưu ý khi sửa nhiệm vụ cũ

Form sửa nhiệm vụ cần điền ngày đã chuẩn hóa vào trường ngày và giờ vào trường giờ riêng. Khi lưu, cần giữ đúng hai thuộc tính `deadline` và `deadlineTime`; không ghép chuỗi ngày-giờ vào `deadline`.

## 9. Hình ảnh và tài nguyên

Các hình ảnh được lưu tại `assets/images/`:

| File | Công dụng |
|---|---|
| `logo.png` | Logo StudyVerse |
| `background.png` | Ảnh nền |
| `avatar.png` | Avatar mặc định |
| `qr-zalo.png` | Mã QR trên trang hỗ trợ |

Các biểu tượng SVG dùng trong giao diện được lưu tại `assets/icons/`.

Nếu các ảnh hiện tại chỉ là ảnh tạm, hãy thay bằng tài nguyên chính thức trước khi nộp bài. Giữ nguyên tên file và đường dẫn để không phải sửa các tham chiếu trong HTML/CSS. Đặc biệt, cần thay `qr-zalo.png` bằng mã QR Zalo thực tế nếu trang hỗ trợ được sử dụng để liên hệ.

## 10. Kiểm thử đề xuất

Trước khi xác nhận hoàn thành, hãy chạy website bằng Live Server và kiểm tra:

- [ ] `index.html` chuyển đến trang đăng nhập khi chưa có phiên và đến Dashboard khi đã đăng nhập.
- [ ] Đăng nhập sai hiển thị thông báo lỗi; đăng nhập đúng mở Dashboard.
- [ ] Đăng ký kiểm tra các trường bắt buộc và mật khẩu xác nhận.
- [ ] Tải lại trang không làm mất dữ liệu đã lưu.
- [ ] Thêm, sửa, xóa nhiệm vụ hoạt động đúng.
- [ ] Tìm kiếm và các bộ lọc nhiệm vụ hoạt động đúng.
- [ ] Ngày và giờ deadline được điền đúng khi mở form sửa; dữ liệu cũ không làm trống ô ngày.
- [ ] Nhiệm vụ quá hạn, nhiệm vụ hoàn thành và thời gian còn lại được hiển thị phù hợp.
- [ ] Thêm/sửa/xóa dự án và tiến độ dự án hoạt động đúng.
- [ ] Tạo nhiệm vụ thuộc dự án, hoàn thành nhiệm vụ và kiểm tra tiến độ dự án được cập nhật.
- [ ] Xóa dự án không xóa các nhiệm vụ đã liên kết.
- [ ] Sửa họ tên, tên tài khoản, thay avatar và đổi mật khẩu hoạt động đúng.
- [ ] Xóa dữ liệu demo không đăng xuất người dùng.
- [ ] Đăng xuất trở về trang đăng nhập.
- [ ] Không có lỗi JavaScript nghiêm trọng trong Console; các đường dẫn CSS, JS, ảnh đều đúng.
- [ ] Kiểm tra giao diện ở khoảng rộng 1280px, 768px và 375px.

## 11. Giới hạn của phiên bản

- Đây là **prototype front-end phục vụ học tập**, không phải hệ thống xác thực an toàn.
- Tài khoản và mật khẩu được lưu trong `localStorage`; không dùng mật khẩu thật hoặc thông tin nhạy cảm.
- Dữ liệu chỉ nằm trong trình duyệt và thiết bị đang sử dụng; không tự đồng bộ giữa các thiết bị hoặc người dùng.
- Xóa dữ liệu website trong trình duyệt có thể làm mất tài khoản, phiên đăng nhập, nhiệm vụ và dự án đã lưu.
- Trang Liên hệ & Hỗ trợ hiển thị QR và hướng dẫn, không có chat trực tiếp.
- Không có backend, API hoặc cơ sở dữ liệu máy chủ.

---

**StudyVerse — Plan | Personalized | Grow**
