(function () {
  if (!getCurrentUser()) return;
  const $ = id => document.getElementById(id);
  fillSelect($('projectPriorityInput'), PRIORITIES);

  function renderProjects() {
    const projects = getProjects(), tasks = getTasks();
    $('projectGrid').innerHTML = projects.length ? projects.map(p => {
      const g = getProjectProgress(p, tasks);
      return '<article class="card projects-card" id="' + p.id + '">' +
        '<div class="projects-tags"><h2>' + esc(p.name) + '</h2></div>' +
        '<div class="projects-meta"><span>Tiến độ: ' + g.percent + '%</span><span class="projects-date">📅 ' + formatDate(p.deadline) + '</span></div>' +
        '<p class="projects-time-remaining' + (getTimeRemaining(p.deadline, '23:59', false).startsWith('Quá hạn') ? ' is-overdue' : '') + '">' + esc(getProjectTimeRemaining(p)) + '</p>' +
        '<div class="progress"><span data-progress="' + g.percent + '"></span></div>' +
        '<p class="projects-count">' + g.done + '/' + g.total + ' nhiệm vụ đã hoàn thành</p>' +
        '<div class="projects-foot"><span class="badge badge-' + p.priority + '">' + PRIORITIES_SHORT[p.priority] + '</span>' +
        '<div class="row-actions"><a class="link-btn" href="tasks.html?projectId=' + encodeURIComponent(p.id) + '">☷ Nhiệm vụ</a>' +
        '<button type="button" class="link-btn" data-act="edit" data-id="' + p.id + '">🛠 Sửa</button>' +
        '<button type="button" class="link-btn" data-act="delete" data-id="' + p.id + '">🗑 Xóa</button></div></div></article>';
    }).join('') : '<p class="empty projects-empty">Chưa có dự án nào. Bấm "+ Thêm dự án" để bắt đầu.</p>';
    applyProgress($('projectGrid'));
  }

  function openModal(p) {
    $('projectModalTitle').textContent = p ? 'Sửa dự án' : 'Thêm dự án';
    $('projectIdInput').value = p ? p.id : '';
    $('projectNameInput').value = p ? p.name : '';
    $('projectPriorityInput').value = p ? p.priority : 'medium';
    $('projectDeadlineInput').value = p ? normalizeDeadlineDate(p.deadline) : todayString();
    $('projectModal').hidden = false;
    $('projectNameInput').focus();
  }
  const closeModal = () => { $('projectModal').hidden = true; };

  $('projectAddBtn').addEventListener('click', () => openModal(null));
  $('projectCancelBtn').addEventListener('click', closeModal);
  $('projectModal').addEventListener('click', e => { if (e.target === $('projectModal')) closeModal(); });

  $('projectForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('projectNameInput').value.trim();
    if (!name || !$('projectDeadlineInput').value) return;
    const projects = getProjects(), id = $('projectIdInput').value;
    const data = { name: name, priority: $('projectPriorityInput').value, deadline: $('projectDeadlineInput').value };
    if (id) { const i = projects.findIndex(p => p.id === id); projects[i] = Object.assign({ id: id }, data); }
    else projects.push(Object.assign({ id: newId('project') }, data));
    saveProjects(projects);
    closeModal();
    renderProjects();
  });

  $('projectGrid').addEventListener('click', e => {
    const btn = e.target.closest('[data-act]'); if (!btn) return;
    const projects = getProjects(), p = projects.find(x => x.id === btn.dataset.id); if (!p) return;
    if (btn.dataset.act === 'edit') return openModal(p);
    if (!confirm('Xóa dự án "' + p.name + '"? Các nhiệm vụ liên kết sẽ trở thành nhiệm vụ lẻ.')) return;
    saveTasks(getTasks().map(t => t.projectId === p.id ? Object.assign({}, t, { projectId: null }) : t));
    saveProjects(projects.filter(x => x.id !== p.id));
    renderProjects();
  });
  renderProjects();
})();
