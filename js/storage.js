const STORAGE_KEYS = { users: 'users', currentUser: 'currentUser', tasks: 'tasks', projects: 'projects', init: 'studyVerseInitialized' };
const CATEGORIES = { study: 'Học tập', work: 'Công việc', personal: 'Cá nhân' };
const STATUSES = { todo: 'Chưa triển khai', doing: 'Đang triển khai', done: 'Hoàn thành' };
const PRIORITIES = { high: 'Cao', medium: 'Trung bình', low: 'Thấp' };
const PRIORITIES_SHORT = { high: 'Cao', medium: 'TB', low: 'Thấp' };

function readJSON(key, fallback) {
  try { const v = JSON.parse(localStorage.getItem(key)); return v === null || v === undefined ? fallback : v; }
  catch (e) { return fallback; }
}
function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

function getTasks() { return readJSON(STORAGE_KEYS.tasks, []); }
function saveTasks(tasks) { writeJSON(STORAGE_KEYS.tasks, tasks); }
function getProjects() { return readJSON(STORAGE_KEYS.projects, []); }
function saveProjects(projects) { writeJSON(STORAGE_KEYS.projects, projects); }
function getUsers() { return readJSON(STORAGE_KEYS.users, []); }
function saveUsers(users) { writeJSON(STORAGE_KEYS.users, users); }
function getCurrentUser() { return readJSON(STORAGE_KEYS.currentUser, null); }
function setCurrentUser(user) { writeJSON(STORAGE_KEYS.currentUser, user); }
function clearCurrentUser() { localStorage.removeItem(STORAGE_KEYS.currentUser); }
function clearDemoData() { saveTasks([]); saveProjects([]); }

function pad2(n) { return String(n).padStart(2, '0'); }
function todayString() { const d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }
function normalizeDeadlineDate(value) {
  if (!value) return '';
  // Hỗ trợ cả YYYY-MM-DD và dữ liệu cũ lỡ lưu kèm phần thời gian.
  const match = String(value).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}
function formatDate(iso) {
  const normalized = normalizeDeadlineDate(iso);
  if (!normalized) return '';
  const p = normalized.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}
function getTaskDeadlineTime(task) {
  if (task && task.deadlineTime) return task.deadlineTime;
  // Nếu deadline cũ có dạng YYYY-MM-DDTHH:mm thì lấy lại giờ từ đó.
  const match = String((task && task.deadline) || '').match(/T(\d{2}:\d{2})/);
  return match ? match[1] : '23:59';
}
function formatTaskDeadline(iso, time) {
  const legacyTime = String(iso || '').match(/T(\d{2}:\d{2})/);
  return (time || (legacyTime && legacyTime[1]) || '23:59') + ' ' + formatDate(iso);
}
function getTaskDateTime(task) {
  return normalizeDeadlineDate(task && task.deadline) + 'T' + getTaskDeadlineTime(task);
}
function getTimeRemaining(deadlineValue, timeValue, completed) {
  if (completed) return 'Đã hoàn thành';
  const date = normalizeDeadlineDate(deadlineValue);
  if (!date) return 'Chưa có deadline';
  const timeMatch = String(deadlineValue || '').match(/T(\d{2}:\d{2})/);
  const time = timeValue || (timeMatch && timeMatch[1]) || '23:59';
  const target = new Date(date + 'T' + time + ':00');
  if (Number.isNaN(target.getTime())) return 'Chưa có deadline';
  const diff = target.getTime() - Date.now();
  if (diff < 0) {
    const days = Math.floor(Math.abs(diff) / 86400000);
    const hours = Math.floor((Math.abs(diff) % 86400000) / 3600000);
    const minutes = Math.floor((Math.abs(diff) % 3600000) / 60000);
    if (days > 0) return 'Quá hạn ' + days + ' ngày';
    if (hours > 0) return 'Quá hạn ' + hours + ' giờ';
    return 'Quá hạn ' + Math.max(1, minutes) + ' phút';
  }
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return 'Còn ' + days + ' ngày ' + hours + ' giờ';
  if (hours > 0) return 'Còn ' + hours + ' giờ ' + minutes + ' phút';
  return 'Còn ' + Math.max(1, minutes) + ' phút';
}
function getProjectTimeRemaining(project) {
  return getTimeRemaining(project && project.deadline, '23:59', false);
}
function isOverdue(task) {
  const now = new Date();
  const localNow = now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate()) + 'T' + pad2(now.getHours()) + ':' + pad2(now.getMinutes());
  return task.status !== 'done' && getTaskDateTime(task) < localNow;
}
function getTaskState(task) { return isOverdue(task) ? 'overdue' : task.status; }
function getStateLabel(state) { return state === 'overdue' ? 'Quá hạn' : STATUSES[state]; }
function getProjectProgress(project, tasks) {
  const list = tasks.filter(t => t.projectId === project.id);
  const done = list.filter(t => t.status === 'done').length;
  return { done: done, total: list.length, percent: list.length ? Math.round(done / list.length * 100) : 0 };
}
function newId(prefix) { return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5); }
function esc(s) { return String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function getDisplayName(user) { return user ? (user.fullName || user.username || user.email) : ''; }
function fillSelect(select, obj, emptyLabel) {
  select.innerHTML = (emptyLabel === undefined ? '' : '<option value="">' + emptyLabel + '</option>') +
    Object.keys(obj).map(k => '<option value="' + k + '">' + obj[k] + '</option>').join('');
}
function applyProgress(root) {
  root.querySelectorAll('[data-progress]').forEach(el => el.style.setProperty('--progress', el.dataset.progress + '%'));
}

/* Dữ liệu cũ có thể lưu deadline dạng "YYYY-MM-DDTHH:mm". Tách thành deadline (ngày) và deadlineTime (giờ). */
function migrateDeadlines() {
  const tasks = getTasks();
  let tasksChanged = false;
  tasks.forEach(t => {
    const raw = String(t.deadline || '');
    if (raw.length > 10 || (raw && !/^\d{4}-\d{2}-\d{2}$/.test(raw)) || !t.deadlineTime) {
      const time = getTaskDeadlineTime(t);
      const date = normalizeDeadlineDate(raw);
      if (t.deadline !== date || t.deadlineTime !== time) { t.deadline = date; t.deadlineTime = time; tasksChanged = true; }
    }
  });
  if (tasksChanged) saveTasks(tasks);
  const projects = getProjects();
  let projectsChanged = false;
  projects.forEach(p => {
    const date = normalizeDeadlineDate(p.deadline);
    if (p.deadline && p.deadline !== date) { p.deadline = date; projectsChanged = true; }
  });
  if (projectsChanged) saveProjects(projects);
}

function initData() {
  migrateDeadlines();
  if (localStorage.getItem(STORAGE_KEYS.init)) return;
  saveUsers([{ email: 'demo@studyverse.vn', password: '123456', fullName: 'Nguyễn Thị A', username: 'Cô em A' }]);
  saveProjects([
    { id: 'project_001', name: 'Bán hàng', priority: 'high', deadline: '2026-10-30' },
    { id: 'project_002', name: 'Khai trương', priority: 'medium', deadline: '2026-11-20' },
    { id: 'project_003', name: 'Khởi nghiệp', priority: 'low', deadline: '2026-12-24' },
    { id: 'project_004', name: 'Thuê nhân viên', priority: 'high', deadline: '2026-11-01' }
  ]);
  saveTasks([
    { id: 'task_001', title: 'Phân tích KPI', category: 'work', priority: 'high', status: 'doing', deadline: '2026-10-15', deadlineTime: '23:59', projectId: 'project_001' },
    { id: 'task_002', title: 'Lập kế hoạch bán hàng', category: 'work', priority: 'medium', status: 'doing', deadline: '2026-10-30', deadlineTime: '23:59', projectId: 'project_001' },
    { id: 'task_003', title: 'Phân công công việc', category: 'work', priority: 'low', status: 'done', deadline: '2026-10-20', deadlineTime: '23:59', projectId: 'project_001' },
    { id: 'task_004', title: 'Đào tạo nhân viên', category: 'study', priority: 'medium', status: 'todo', deadline: '2026-11-05', deadlineTime: '23:59', projectId: 'project_002' },
    { id: 'task_005', title: 'Báo cáo doanh thu', category: 'work', priority: 'low', status: 'todo', deadline: '2026-11-10', deadlineTime: '23:59', projectId: 'project_003' },
    { id: 'task_006', title: 'Đọc nốt cuốn sách', category: 'personal', priority: 'low', status: 'done', deadline: '2026-10-20', deadlineTime: '23:59', projectId: null },
    { id: 'task_007', title: 'Đánh giá KPI', category: 'work', priority: 'high', status: 'todo', deadline: '2026-10-20', deadlineTime: '23:59', projectId: 'project_003' }
  ]);
  localStorage.setItem(STORAGE_KEYS.init, '1');
}
initData();
document.addEventListener('error', e => { if (e.target.tagName === 'IMG') e.target.hidden = true; }, true);
