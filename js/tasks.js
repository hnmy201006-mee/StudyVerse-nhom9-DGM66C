(function () {
  if (!getCurrentUser()) return;
  const $ = id => document.getElementById(id);
  fillSelect($('taskCategoryInput'), CATEGORIES);
  fillSelect($('taskPriorityInput'), PRIORITIES);
  fillSelect($('taskStatusInput'), STATUSES);
  const NEXT = { todo: 'doing', doing: 'done', done: 'todo' };

  function renderTasks() {
    const q = $('taskSearchInput').value.trim().toLowerCase();
    const fs = $('taskFilterStatus').value, fp = $('taskFilterPriority').value, fc = $('taskFilterCategory').value;
    const projects = getProjects();
    const projectSelect = $('taskFilterProject');
    const previousProjectFilter = projectSelect.value;
    projectSelect.innerHTML = '<option value="">Mọi dự án</option><option value="none">Nhiệm vụ lẻ</option>' + projects.map(p => '<option value="' + p.id + '">' + esc(p.name) + '</option>').join('');
    const queryProjectId = new URLSearchParams(location.search).get('projectId');
    if (queryProjectId && !window.studyVerseProjectFilterApplied) {
      projectSelect.value = queryProjectId;
      window.studyVerseProjectFilterApplied = true;
    } else if (previousProjectFilter && Array.from(projectSelect.options).some(option => option.value === previousProjectFilter)) {
      projectSelect.value = previousProjectFilter;
    }
    const projectFilter = projectSelect.value;
    const list = getTasks().filter(t =>
      (!q || t.title.toLowerCase().includes(q)) && (!fs || getTaskState(t) === fs) &&
      (!fp || t.priority === fp) && (!fc || t.category === fc) &&
      (!projectFilter || (projectFilter === 'none' ? !t.projectId : t.projectId === projectFilter))
    ).sort((x, y) => getTaskDateTime(x).localeCompare(getTaskDateTime(y)));
    $('taskEmpty').hidden = list.length > 0;
    $('taskTableBody').innerHTML = list.map(t => {
      const s = getTaskState(t);
      const p = projects.find(x => x.id === t.projectId);
      return '<tr><td class="tasks-name">' + esc(t.title) + '</td><td>' + CATEGORIES[t.category] + '</td>' +
        '<td><span class="badge badge-' + t.priority + '">' + PRIORITIES_SHORT[t.priority] + '</span></td>' +
        '<td><span class="task-date">' + formatDate(t.deadline) + '</span><span class="task-time">' + esc(getTaskDeadlineTime(t)) + '</span></td>' +
        '<td><span class="task-time-remaining' + (isOverdue(t) ? ' is-overdue' : '') + (t.status === 'done' ? ' is-complete' : '') + '">' + esc(getTimeRemaining(t.deadline, getTaskDeadlineTime(t), t.status === 'done')) + '</span></td>' +
        '<td><button type="button" class="badge badge-status status-' + s + '" data-act="cycle" data-id="' + t.id + '" title="Bấm để đổi trạng thái">' + getStateLabel(s) + '</button></td>' +
        '<td>' + (p ? '<a class="task-project-link" href="projects.html#' + encodeURIComponent(p.id) + '">' + esc(p.name) + '</a>' : '—') + '</td>' +
        '<td><div class="row-actions"><button type="button" class="link-btn" data-act="edit" data-id="' + t.id + '">✎ Sửa</button>' +
        '<button type="button" class="link-btn" data-act="delete" data-id="' + t.id + '">🗑 Xóa</button></div></td></tr>';
    }).join('');
  }

  function openModal(task) {
    const projects = getProjects();
    $('taskProjectInput').innerHTML = '<option value="">Không thuộc dự án</option>' +
      projects.map(p => '<option value="' + p.id + '">' + esc(p.name) + '</option>').join('');
    $('taskModalTitle').textContent = task ? 'Sửa nhiệm vụ' : 'Thêm nhiệm vụ mới';
    $('taskIdInput').value = task ? task.id : '';
    $('taskTitleInput').value = task ? task.title : '';
    $('taskCategoryInput').value = task ? task.category : 'study';
    $('taskPriorityInput').value = task ? task.priority : 'medium';
    $('taskStatusInput').value = task ? task.status : 'todo';
    $('taskDeadlineInput').value = task ? normalizeDeadlineDate(task.deadline) : todayString();
    $('taskDeadlineTimeInput').value = task ? getTaskDeadlineTime(task) : '23:59';
    $('taskProjectInput').value = task && task.projectId ? task.projectId : '';
    $('taskModal').hidden = false;
    $('taskTitleInput').focus();
  }
  const closeModal = () => { $('taskModal').hidden = true; };

  $('taskAddBtn').addEventListener('click', () => openModal(null));
  $('taskCancelBtn').addEventListener('click', closeModal);
  $('taskModal').addEventListener('click', e => { if (e.target === $('taskModal')) closeModal(); });
  ['taskSearchInput', 'taskFilterStatus', 'taskFilterPriority', 'taskFilterCategory', 'taskFilterProject'].forEach(id => {
    $(id).addEventListener('input', renderTasks);
  });

  $('taskForm').addEventListener('submit', e => {
    e.preventDefault();
    const title = $('taskTitleInput').value.trim();
    if (!title) { $('taskTitleInput').focus(); return; }
    if (!$('taskDeadlineInput').value) { $('taskDeadlineInput').focus(); return; }
    if (!$('taskDeadlineTimeInput').value) { $('taskDeadlineTimeInput').value = '23:59'; }
    const tasks = getTasks();
    const id = $('taskIdInput').value;
    const data = {
      title: title, category: $('taskCategoryInput').value, priority: $('taskPriorityInput').value,
      status: $('taskStatusInput').value, deadline: $('taskDeadlineInput').value, deadlineTime: $('taskDeadlineTimeInput').value, projectId: $('taskProjectInput').value || null
    };
    const index = id ? tasks.findIndex(t => t.id === id) : -1;
    if (index >= 0) tasks[index] = Object.assign({ id: id }, data);
    else tasks.push(Object.assign({ id: id || newId('task') }, data));
    saveTasks(tasks);
    closeModal();
    renderTasks();
  });

  $('taskTableBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]'); if (!btn) return;
    const tasks = getTasks();
    const task = tasks.find(t => t.id === btn.dataset.id); if (!task) return;
    if (btn.dataset.act === 'edit') return openModal(task);
    if (btn.dataset.act === 'delete') {
      if (!confirm('Xóa nhiệm vụ "' + task.title + '"?')) return;
      saveTasks(tasks.filter(t => t.id !== task.id));
    } else {
      task.status = NEXT[task.status];
      saveTasks(tasks);
    }
    renderTasks();
  });
  renderTasks();
})();
