(function () {
  const user = getCurrentUser(); if (!user) return;
  const tasks = getTasks();
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(isOverdue).length;
  const todo = tasks.filter(t => t.status === 'todo' && !isOverdue(t)).length;
  const doing = tasks.filter(t => t.status === 'doing' && !isOverdue(t)).length;
  const open = total - done;
  const pct = n => total ? n / total * 100 : 0;
  const a = pct(done), b = a + pct(todo), c = b + pct(doing);

  document.getElementById('greeting').textContent = 'Chào mừng ' + getDisplayName(user);
  document.getElementById('statTotal').textContent = total;
  document.getElementById('statOpen').textContent = open;
  document.getElementById('statOverdue').textContent = overdue;
  document.querySelectorAll('.donut').forEach(d => {
    d.style.setProperty('--a', a + '%'); d.style.setProperty('--b', b + '%'); d.style.setProperty('--c', c + '%');
    if (!total) d.classList.add('donut-empty');
  });

  const upcoming = tasks.filter(t => t.status !== 'done').sort((x, y) => getTaskDateTime(x).localeCompare(getTaskDateTime(y))).slice(0, 5);
  document.getElementById('upcomingList').innerHTML = upcoming.length ? upcoming.map(t => {
    const s = getTaskState(t);
    return '<li class="upcoming-item"><span class="upcoming-name">' + esc(t.title) + '</span>' +
      '<span class="upcoming-date">' + formatTaskDeadline(t.deadline, getTaskDeadlineTime(t)) + '</span>' +
      '<span class="badge status-' + s + '">' + getStateLabel(s) + '</span></li>';
  }).join('') : '<li class="empty">Bạn không còn nhiệm vụ nào cần làm.</li>';

  const overall = total ? Math.round(done / total * 100) : 0;
  document.getElementById('overallBar').dataset.progress = overall;
  applyProgress(document.getElementById('overallBox'));
  document.getElementById('overallText').textContent = done + '/' + total + ' nhiệm vụ đã hoàn thành (' + overall + '%)';
})();
