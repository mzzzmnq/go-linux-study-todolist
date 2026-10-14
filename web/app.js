(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const categories = ['Go', 'Linux', 'Git', '数据库', '项目', '算法', '求职', '计算机基础'];
  const expanded = new Set();
  const expandedGuides = new Set();
  const drafts = new Map();
  let plan = null;
  let state = null;
  let selectedWeekId = '';
  let filter = 'all';
  let query = '';
  let saving = false;
  let importCandidate = null;
  let deletingTask = null;
  let nextAction = null;

  function node(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function icon(kind) {
    const paths = {
      check: ['M3 7l3 3 6-6'],
      clock: ['M7 3v4l2 1'],
      arrow: ['M4 8l4 4 4-4'],
      link: ['M8 3h5v5M13 3 6 10M6 3H3v10h10v-3'],
      delete: ['M3 4h10M6 4V2h4v2M4 4l1 10h6l1-10M7 7v4m2-4v4'],
      note: ['M3 2h8l2 2v10H3zM6 6h4M6 9h4'],
    };
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 16 16');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('aria-hidden', 'true');
    if (kind === 'clock') {
      const circle = document.createElementNS(svg.namespaceURI, 'circle');
      circle.setAttribute('cx', '8'); circle.setAttribute('cy', '8'); circle.setAttribute('r', '6');
      svg.append(circle);
    }
    for (const data of paths[kind] || []) {
      const path = document.createElementNS(svg.namespaceURI, 'path');
      path.setAttribute('d', data);
      svg.append(path);
    }
    return svg;
  }

  function localDate(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  function calendarDay(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const [year, month, day] = value.split('-').map(Number);
    if (year < 2000 || year > 2100) return null;
    const date = new Date(Date.UTC(year, month - 1, day));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return date.getTime() / 86400000;
  }

  function calendar() {
    const days = calendarDay(localDate()) - calendarDay(state.startDate);
    const position = Math.floor(days / 7);
    return { days, position, index: Math.max(0, Math.min(plan.weeks.length - 1, position)) };
  }

  function duration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (!hours) return `${minutes} 分钟`;
    return remainder ? `${hours} 小时 ${remainder} 分` : `${hours} 小时`;
  }

  function getProgress(id) {
    return state.tasks[id] || { done: false, notes: '', actualMinutes: 0 };
  }

  function tasksFor(week) {
    return [...week.tasks, ...state.customTasks.filter((task) => task.weekId === week.id).map((task) => ({ ...task, custom: true }))];
  }

  function allTasks() { return plan.weeks.flatMap(tasksFor); }
  function activeWeek() { return plan.weeks.find((week) => week.id === selectedWeekId) || plan.weeks[0]; }

  async function fetchJSON(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    let response;
    try {
      response = await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
    } catch (cause) {
      const error = new Error(cause.name === 'AbortError' ? '连接超时，请稍后再试。' : '无法连接到学习应用，请确认应用正在运行。');
      error.networkFailure = true;
      throw error;
    } finally {
      clearTimeout(timer);
    }
    let body;
    try { body = await response.json(); } catch {
      const error = new Error('读取到的内容不完整，请重新加载。');
      error.networkFailure = response.ok;
      error.status = response.status;
      throw error;
    }
    if (!response.ok) {
      const error = new Error(typeof body.error === 'string' ? body.error : '操作未完成，请稍后重试。');
      error.status = response.status;
      throw error;
    }
    return body;
  }

  function validatePlan(value) {
    if (!value || !Array.isArray(value.weeks) || !value.weeks.length) throw new Error('学习路线暂时没有可用的周次。');
    const ids = new Set();
    const taskIds = new Set();
    for (const week of value.weeks) {
      if (typeof week.id !== 'string' || ids.has(week.id) || typeof week.title !== 'string' || !Number.isInteger(week.number) || !Array.isArray(week.tasks)) throw new Error('学习路线内容不完整。');
      ids.add(week.id);
      for (const task of week.tasks) {
        if (typeof task.id !== 'string' || taskIds.has(task.id) || typeof task.title !== 'string' || !Number.isInteger(task.minutes) || task.minutes < 0) throw new Error('学习任务内容不完整。');
        taskIds.add(task.id);
      }
    }
    return value;
  }

  function normalizeState(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value) || value.version !== 1) throw new Error('这份文件不是有效的学习记录备份。');
    if (calendarDay(value.startDate) === null) throw new Error('起始日期需是 2000—2100 年之间的有效日期。');
    if (value.customTasks != null && !Array.isArray(value.customTasks)) throw new Error('自定义任务的格式不正确。');
    const customTasks = value.customTasks || [];
    if (customTasks.length > 500) throw new Error('自定义任务最多保留 500 个。');
    const weeks = new Set(plan.weeks.map((week) => week.id));
    const validIds = new Set(plan.weeks.flatMap((week) => week.tasks.map((task) => task.id)));
    const normalizedCustom = customTasks.map((task) => {
      if (!task || typeof task.id !== 'string' || !/^custom-[a-zA-Z0-9_-]{1,100}$/.test(task.id) || validIds.has(task.id)) throw new Error('备份中有重复或无效的自定义任务。');
      if (!weeks.has(task.weekId) || !categories.includes(task.category)) throw new Error('备份中的任务周次或分类不属于当前路线。');
      if (typeof task.title !== 'string' || !task.title.trim() || Array.from(task.title).length > 120) throw new Error('任务名称需为 1—120 字。');
      if (!Number.isInteger(task.minutes) || task.minutes < 1 || task.minutes > 1200) throw new Error('自定义任务的预计时长需为 1—1200 分钟。');
      if (task.description != null && (typeof task.description !== 'string' || Array.from(task.description).length > 2000)) throw new Error('任务说明不能超过 2000 字。');
      validIds.add(task.id);
      return { id: task.id, title: task.title.trim(), category: task.category, minutes: task.minutes, weekId: task.weekId, description: task.description || '' };
    });
    if (value.tasks != null && (typeof value.tasks !== 'object' || Array.isArray(value.tasks))) throw new Error('任务记录的格式不正确。');
    const progress = Object.create(null);
    for (const [id, entry] of Object.entries(value.tasks || {})) {
      if (!validIds.has(id) || !entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error('备份包含不属于当前路线的任务记录。');
      if (entry.done != null && typeof entry.done !== 'boolean') throw new Error('任务的完成状态不正确。');
      if (entry.notes != null && (typeof entry.notes !== 'string' || Array.from(entry.notes).length > 8000)) throw new Error('单项任务的笔记不能超过 8000 字。');
      if (entry.actualMinutes != null && (!Number.isInteger(entry.actualMinutes) || entry.actualMinutes < 0 || entry.actualMinutes > 100000)) throw new Error('实际学习时长需为 0—100000 分钟。');
      progress[id] = { done: entry.done || false, notes: entry.notes || '', actualMinutes: entry.actualMinutes || 0 };
    }
    return { version: 1, revision: Number.isInteger(value.revision) && value.revision >= 0 ? value.revision : 0, startDate: value.startDate, tasks: progress, customTasks: normalizedCustom, updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : '' };
  }

  function showNotice(message) {
    $('noticeText').textContent = message;
    $('notice').hidden = false;
  }

  function setStatus(message, type = '') {
    $('saveStatus').textContent = message;
    $('saveStatus').className = `save-status ${type}`.trim();
  }

  function setBusy(value) {
    saving = value;
    document.querySelectorAll('[data-mutates]').forEach((element) => { element.disabled = value || !state; });
    if (!value && state) updateDraftButtons();
  }

  function sameRecords(left, right) {
    const snapshot = (value) => ({
      startDate: value.startDate,
      tasks: Object.keys(value.tasks).sort().map((id) => [id, value.tasks[id].done, value.tasks[id].notes, value.tasks[id].actualMinutes]),
      customTasks: [...value.customTasks].sort((a, b) => a.id.localeCompare(b.id)).map((task) => [task.id, task.title, task.category, task.minutes, task.weekId, task.description]),
    });
    return JSON.stringify(snapshot(left)) === JSON.stringify(snapshot(right));
  }

  async function saveChange(change, successMessage = '已保存', onSuccess) {
    if (saving || !state) return false;
    const candidate = JSON.parse(JSON.stringify(state));
    change(candidate);
    candidate.revision = state.revision;
    setBusy(true);
    setStatus('正在保存…', 'saving');
    let success = false;
    try {
      state = normalizeState(await fetchJSON('/api/state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candidate) }));
      if (onSuccess) onSuccess();
      $('notice').hidden = true;
      setStatus(`${successMessage} · ${new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`);
      success = true;
    } catch (error) {
      if (error.status === 409) {
        try {
          state = normalizeState(await fetchJSON('/api/state'));
          showNotice('其他页面更新了学习记录，已载入最新进度。本次修改尚未保存，请检查后重新操作；笔记草稿仍然保留。');
        } catch {
          showNotice('其他页面更新了学习记录，但最新记录暂时无法读取。请重新加载后再保存；笔记草稿仍然保留。');
        }
      } else if (error.networkFailure) {
        try {
          state = normalizeState(await fetchJSON('/api/state'));
          if (sameRecords(state, candidate)) {
            if (onSuccess) onSuccess();
            $('notice').hidden = true;
            setStatus(`${successMessage} · 已重新核对学习记录`);
            success = true;
          } else {
            showNotice('刚才的保存结果未能确认，已重新读取学习记录。请检查进度后再操作；笔记草稿仍然保留。');
          }
        } catch {
          showNotice(`${error.message} 保存结果未能确认，请稍后重新加载并检查；笔记草稿仍然保留。`);
        }
      } else {
        showNotice(`保存未完成：${error.message} 本次修改没有保存；笔记草稿仍然保留。`);
      }
      if (!success) setStatus('本次保存未完成', 'failed');
    } finally {
      setBusy(false);
      render();
    }
    return success;
  }

  function keepFocus(callback) {
    const active = document.activeElement;
    const key = active?.dataset.focusKey;
    const selection = active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null;
    callback();
    if (!key) return;
    const replacement = [...document.querySelectorAll('[data-focus-key]')].find((element) => element.dataset.focusKey === key);
    if (replacement && !replacement.disabled) {
      replacement.focus({ preventScroll: true });
      if (selection && typeof replacement.setSelectionRange === 'function' && replacement.type !== 'number') replacement.setSelectionRange(...selection);
    }
  }

  function renderNav() {
    const fragment = document.createDocumentFragment();
    const current = calendar();
    for (const [index, week] of plan.weeks.entries()) {
      const tasks = tasksFor(week);
      const completed = tasks.filter((task) => getProgress(task.id).done).length;
      const button = node('button', `week-link${week.id === selectedWeekId ? ' active' : ''}`);
      button.dataset.focusKey = `week-${week.id}`;
      button.setAttribute('aria-current', week.id === selectedWeekId ? 'page' : 'false');
      button.setAttribute('aria-label', `第 ${week.number} 周 ${week.title}，完成 ${completed} / ${tasks.length}${index === current.index && current.position >= 0 && current.position < plan.weeks.length ? '，当前周' : ''}`);
      button.append(node('span', 'week-link-number', String(week.number).padStart(2, '0')));
      const copy = node('span', 'week-link-copy');
      copy.append(node('span', 'week-link-title', week.title), node('span', 'week-link-subtitle', `${completed} / ${tasks.length} 已完成 · ${duration(tasks.reduce((sum, task) => sum + task.minutes, 0))}`));
      button.append(copy);
      if (index === current.index && current.position >= 0 && current.position < plan.weeks.length) button.append(node('span', 'week-current-dot'));
      if (tasks.length && completed === tasks.length) button.append(node('span', 'week-complete-mark', '✓'));
      button.addEventListener('click', () => selectWeek(week.id));
      fragment.append(button);
    }
    $('weekNav').replaceChildren(fragment);
  }

  function renderOverview() {
    const all = allTasks();
    const completed = all.filter((task) => getProgress(task.id).done).length;
    const percent = all.length ? Math.round(completed / all.length * 100) : 0;
    $('overallPercent').textContent = `${percent}%`;
    $('overallCount').textContent = `${completed} / ${all.length}`;
    $('progressRing').style.setProperty('--progress', `${percent}%`);
    $('progressRing').setAttribute('aria-label', `整条路线已完成 ${percent}%`);
    const week = activeWeek();
    const tasks = tasksFor(week);
    const done = tasks.filter((task) => getProgress(task.id).done).length;
    const planned = tasks.reduce((sum, task) => sum + task.minutes, 0);
    const actual = tasks.reduce((sum, task) => sum + getProgress(task.id).actualMinutes, 0);
    $('plannedTime').textContent = duration(planned);
    $('actualTime').textContent = actual ? duration(actual) : '0 小时';
    $('plannedCount').textContent = `${tasks.length} 项学习任务${state.customTasks.some((task) => task.weekId === week.id) ? ' · 含自定义任务' : ''}`;
    $('weekNumber').textContent = `第 ${String(week.number).padStart(2, '0')} 周`;
    $('weekTitle').textContent = week.title;
    $('weekGoal').textContent = week.goal || '';
    $('weekProgressFill').style.width = `${tasks.length ? done / tasks.length * 100 : 0}%`;
    $('weekProgressText').textContent = `已完成 ${done} / ${tasks.length}`;
    $('allCount').textContent = tasks.length;
    $('pendingCount').textContent = tasks.length - done;
    $('doneCount').textContent = done;
    const current = calendar();
    const currentWeek = plan.weeks[current.index];
    const start = state.startDate.split('-').map(Number);
    $('dateButtonText').textContent = `${start[0]} 年 ${start[1]} 月 ${start[2]} 日开始`;
    $('scheduleCaption').textContent = current.position < 0 ? `还有 ${-current.days} 天开始` : current.position >= plan.weeks.length ? '12 周之后 · 继续复盘和实践' : `今天在第 ${currentWeek.number} 周`;
    $('currentWeekButton').hidden = currentWeek.id === selectedWeekId;
    $('currentWeekButton').textContent = current.position < 0 ? '回到第 1 周' : current.position >= plan.weeks.length ? '回到第 12 周' : '回到当前周';
    const first = tasks.find((task) => !getProgress(task.id).done);
    if (first) {
      $('nextEyebrow').textContent = `第 ${String(week.number).padStart(2, '0')} 周 · 你的下一步`;
      $('nextHeading').textContent = first.title;
      $('nextDescription').textContent = `留出 ${duration(first.minutes)}，${first.description || '完成这项练习，再留下你的学习笔记。'}`;
      $('nextButtonLabel').textContent = '打开这项任务';
      $('nextButton').hidden = false;
      nextAction = () => openTask(first.id);
    } else {
      const index = plan.weeks.indexOf(week);
      const next = plan.weeks.slice(index + 1).find((item) => tasksFor(item).some((task) => !getProgress(task.id).done));
      $('nextEyebrow').textContent = `第 ${String(week.number).padStart(2, '0')} 周 · 已完成`;
      $('nextHeading').textContent = next ? '这一周，已经迈出了扎实的一步。' : '这一周的任务都完成了。';
      $('nextDescription').textContent = next ? '花几分钟回看笔记，整理本周成果，再开始下一周的学习。' : '回看你的笔记，检查项目是否能运行，把学到的内容整理成可以展示的成果。';
      $('nextButtonLabel').textContent = next ? `前往第 ${next.number} 周` : '回看本周任务';
      $('nextButton').hidden = false;
      nextAction = next ? () => selectWeek(next.id) : () => { filter = 'all'; query = ''; $('searchInput').value = ''; render(); $('taskList').scrollIntoView({ behavior: scrollBehavior(), block: 'start' }); };
    }
  }

  function safeResource(value) {
    if (typeof value !== 'string') return null;
    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
    } catch { return null; }
  }

  function getDraft(taskId) {
    if (!drafts.has(taskId)) {
      const saved = getProgress(taskId);
      drafts.set(taskId, { notes: saved.notes, actualMinutes: String(saved.actualMinutes) });
    }
    return drafts.get(taskId);
  }

  function isDirty(taskId) {
    const draft = drafts.get(taskId);
    if (!draft) return false;
    const saved = getProgress(taskId);
    return draft.notes !== saved.notes || draft.actualMinutes !== String(saved.actualMinutes);
  }

  function updateDraftButtons() {
    document.querySelectorAll('[data-draft-save]').forEach((button) => {
      const id = button.dataset.draftSave;
      const dirty = isDirty(id);
      button.disabled = saving || !dirty;
      const status = [...document.querySelectorAll('[data-draft-status]')].find((item) => item.dataset.draftStatus === id);
      if (status) {
        status.textContent = dirty ? '有未保存的修改' : '笔记和学习时长已保存';
        status.classList.toggle('unsaved', dirty);
      }
    });
  }

  function renderTask(task) {
    const progress = getProgress(task.id);
    const item = node('li', `task-card${progress.done ? ' is-done' : ''}`);
    item.dataset.taskId = task.id;
    const row = node('div', 'task-row');
    const check = node('span', 'task-check');
    const input = node('input');
    input.type = 'checkbox';
    input.id = `check-${encodeURIComponent(task.id)}`;
    input.checked = progress.done;
    input.disabled = saving;
    input.dataset.mutates = '';
    input.dataset.focusKey = `check-${task.id}`;
    input.setAttribute('aria-label', `${progress.done ? '取消完成' : '完成'}：${task.title}`);
    input.addEventListener('change', () => {
      const done = input.checked;
      saveChange((candidate) => { candidate.tasks[task.id] = { ...getProgress(task.id), done }; }, done ? '任务已完成' : '已恢复为未完成');
    });
    const visual = node('span', 'checkbox-visual'); visual.append(icon('check')); check.append(input, visual);
    const main = node('div', 'task-main');
    const heading = node('div', 'task-heading');
    const title = node('h3', 'task-title');
    const label = node('label', '', task.title); label.htmlFor = input.id; title.append(label);
    const chip = node('span', 'category-chip', task.category || '学习'); chip.dataset.tone = String(Math.max(0, categories.indexOf(task.category)) % 5);
    heading.append(title, chip);
    if (task.custom) heading.append(node('span', 'category-chip custom-chip', '自定义'));
    main.append(heading);
    if (task.description) main.append(node('p', 'task-description', task.description));
    const meta = node('div', 'task-meta');
    const minutes = node('span', '', duration(task.minutes)); minutes.prepend(icon('clock')); meta.append(minutes);
    if (progress.actualMinutes) meta.append(node('span', '', `实学 ${duration(progress.actualMinutes)}`));
    if (progress.notes) { const hint = node('span', 'task-notes-indicator', '已记笔记'); hint.prepend(icon('note')); meta.append(hint); }
    const href = safeResource(task.resourceURL);
    if (href) { const link = node('a', 'resource-link', task.resourceLabel || '参考资料'); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.append(icon('link')); meta.append(link); }
    main.append(meta);
    const actions = node('div', 'task-actions');
    const details = node('button', 'details-button', '笔记与用时');
    details.type = 'button'; details.dataset.focusKey = `details-${task.id}`;
    details.setAttribute('aria-expanded', String(expanded.has(task.id)));
    details.setAttribute('aria-controls', `editor-${encodeURIComponent(task.id)}`);
    details.append(icon('arrow'));
    details.addEventListener('click', () => { if (expanded.has(task.id)) expanded.delete(task.id); else { expanded.add(task.id); getDraft(task.id); } keepFocus(renderTasks); });
    actions.append(details);
    if (task.custom) {
      const remove = node('button', 'delete-button'); remove.type = 'button'; remove.dataset.mutates = ''; remove.disabled = saving; remove.dataset.focusKey = `delete-${task.id}`;
      remove.setAttribute('aria-label', `删除自定义任务：${task.title}`); remove.append(icon('delete'));
      remove.addEventListener('click', () => { deletingTask = task; $('deleteDescription').textContent = `“${task.title}”以及它的完成状态、笔记和用时会一起移除。`; $('deleteDialog').showModal(); });
      actions.append(remove);
    }
    row.append(check, main, actions); item.append(row);
    if (task.details) item.append(renderStudyGuide(task));
    if (expanded.has(task.id)) item.append(renderEditor(task));
    return item;
  }

  function renderStudyGuide(task) {
    const guide = task.details;
    const details = node('details', 'study-guide');
    details.open = expandedGuides.has(task.id);
    details.addEventListener('toggle', () => {
      if (details.open) expandedGuides.add(task.id);
      else expandedGuides.delete(task.id);
    });
    const summary = node('summary', 'study-guide-summary');
    summary.dataset.focusKey = `guide-${task.id}`;
    summary.append(node('span', '', '查看详细计划'), node('span', 'guide-step-count', `${guide.steps.length} 个步骤 · ${duration(task.minutes)}`), icon('arrow'));
    details.append(summary);
    const body = node('div', 'study-guide-body');
    body.append(node('p', 'guide-objective', guide.objective));
    function addList(title, values, ordered = false) {
      if (!values || !values.length) return;
      const section = node('section', 'guide-section');
      section.append(node('h4', '', title));
      const list = node(ordered ? 'ol' : 'ul', 'guide-list');
      values.forEach((value) => list.append(node('li', '', value)));
      section.append(list); body.append(section);
    }
    addList('开始前确认', guide.prerequisites);
    const steps = node('section', 'guide-section');
    steps.append(node('h4', '', '按步骤完成'));
    if (guide.steps.some((step) => step.commands && step.commands.some((command) => /<[^>]+>/.test(command)))) {
      steps.append(node('p', 'guide-reference-hint', '命令中的 <…> 是待填写内容：先按步骤确认版本、文件名或测试值，再替换后执行。'));
    }
    const stepList = node('ol', 'guide-steps');
    guide.steps.forEach((step, index) => {
      const item = node('li', 'guide-step');
      const heading = node('div', 'guide-step-heading');
      heading.append(node('h5', '', `${index + 1}. ${step.title}`), node('span', 'guide-step-time', duration(step.minutes)));
      item.append(heading);
      const actions = node('ul', 'guide-list');
      step.actions.forEach((action) => actions.append(node('li', '', action)));
      item.append(actions);
      if (step.commands && step.commands.length) {
        const pre = node('pre', 'guide-commands');
        pre.append(node('code', '', step.commands.join('\n'))); item.append(pre);
      }
      stepList.append(item);
    });
    steps.append(stepList); body.append(steps);
    addList('完成后逐项验收', guide.acceptance);
    addList('保留这些学习产物', guide.deliverables);
    if (guide.pitfalls && guide.pitfalls.length) {
      const section = node('section', 'guide-section guide-pitfalls');
      section.append(node('h4', '', '遇到问题先这样检查'));
      guide.pitfalls.forEach((pitfall) => {
        const item = node('div', 'guide-pitfall');
        item.append(node('h5', '', pitfall.problem), node('p', '', pitfall.solution)); section.append(item);
      });
      body.append(section);
    }
    addList('写进笔记的复盘问题', guide.reflection);
    if (guide.resources && guide.resources.length) {
      const section = node('section', 'guide-section');
      section.append(node('h4', '', '查证与参考'));
      section.append(node('p', 'guide-reference-hint', '先用任务卡片上的中文资料学习；官方页面用于核对当前命令和 API，可以配合浏览器翻译，不必全文通读。'));
      const links = node('ul', 'guide-list');
      guide.resources.forEach((resource) => {
        const href = safeResource(resource.url);
        if (!href) return;
        const link = node('a', 'guide-resource', resource.label);
        link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
        const item = node('li'); item.append(link); links.append(item);
      });
      section.append(links); body.append(section);
    }
    addList('可选延伸：从已有预算中调配时间', guide.extension);
    body.append(node('p', 'guide-finish-hint', '完成验收后再勾选任务；用“笔记与用时”记录实际投入。步骤时间是安排建议，可以按自己的进度调整。'));
    details.append(body);
    return details;
  }

  function renderEditor(task) {
    const draft = getDraft(task.id);
    const form = node('form', 'task-editor');
    form.id = `editor-${encodeURIComponent(task.id)}`;
    const notesField = node('div', 'notes-field');
    const notesLabel = node('label', 'field-label', '学习笔记');
    const notes = node('textarea', 'form-input');
    notes.id = `notes-${encodeURIComponent(task.id)}`;
    notesLabel.htmlFor = notes.id; notes.rows = 3; notes.maxLength = 8000; notes.placeholder = '记录你理解的概念、遇到的问题和练习结果。'; notes.value = draft.notes; notes.dataset.mutates = ''; notes.dataset.focusKey = `notes-${task.id}`; notes.disabled = saving;
    notes.addEventListener('input', () => { draft.notes = notes.value; updateDraftButtons(); });
    notesField.append(notesLabel, notes);
    const timeField = node('div', 'time-field');
    const timeLabel = node('label', 'field-label', '实际学习分钟');
    const actual = node('input', 'form-input'); actual.type = 'number'; actual.id = `actual-${encodeURIComponent(task.id)}`; actual.min = '0'; actual.max = '100000'; actual.step = '1'; actual.required = true; actual.value = draft.actualMinutes; actual.dataset.mutates = ''; actual.dataset.focusKey = `actual-${task.id}`; actual.disabled = saving;
    timeLabel.htmlFor = actual.id; actual.addEventListener('input', () => { draft.actualMinutes = actual.value; updateDraftButtons(); });
    timeField.append(timeLabel, actual, node('p', 'record-hint', '记录累计用时，如 90 分钟。'));
    const actions = node('div', 'editor-actions');
    const status = node('span', `draft-status${isDirty(task.id) ? ' unsaved' : ''}`, isDirty(task.id) ? '有未保存的修改' : '笔记和学习时长已保存'); status.dataset.draftStatus = task.id;
    const submit = node('button', 'button button-primary', '保存记录'); submit.type = 'submit'; submit.dataset.mutates = ''; submit.dataset.draftSave = task.id; submit.dataset.focusKey = `save-${task.id}`; submit.disabled = saving || !isDirty(task.id);
    actions.append(status, submit); form.append(notesField, timeField, actions);
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity() || saving) return;
      const actualMinutes = Number(actual.value);
      if (!Number.isInteger(actualMinutes)) { actual.setCustomValidity('请输入整数分钟。'); actual.reportValidity(); actual.setCustomValidity(''); return; }
      await saveChange((candidate) => { candidate.tasks[task.id] = { ...getProgress(task.id), notes: draft.notes, actualMinutes }; }, '学习记录已保存', () => { drafts.delete(task.id); });
    });
    return form;
  }

  function renderTasks() {
    document.querySelectorAll('[data-filter]').forEach((button) => { const active = button.dataset.filter === filter; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    const tasks = tasksFor(activeWeek());
    const matching = tasks.filter((task) => {
      const progress = getProgress(task.id);
      const matchesStatus = filter === 'all' || (filter === 'done' ? progress.done : !progress.done);
      const matchesQuery = !query || `${task.title} ${task.category} ${task.description || ''} ${task.details ? JSON.stringify(task.details) : ''} ${progress.notes}`.toLocaleLowerCase().includes(query.toLocaleLowerCase());
      return matchesStatus && matchesQuery;
    });
    const fragment = document.createDocumentFragment(); matching.forEach((task) => fragment.append(renderTask(task))); $('taskList').replaceChildren(fragment);
    $('emptyState').hidden = matching.length > 0;
    if (!matching.length) {
      $('emptyTitle').textContent = query ? '没有找到符合的任务' : filter === 'pending' ? '本周任务都完成了' : filter === 'done' ? '还没有已完成的任务' : '这一周暂时没有任务';
      $('emptyDescription').textContent = query ? '换个关键词，或清除搜索和筛选再看看。' : filter === 'pending' ? '回看笔记，整理这一周的练习成果。' : filter === 'done' ? '完成一项练习后，勾选任务就会出现在这里。' : '你可以补充自己的学习目标。';
      $('clearFilterButton').hidden = filter === 'all' && !query;
    }
  }

  function render() {
    if (!state || !plan) return;
    keepFocus(() => { renderNav(); renderOverview(); renderTasks(); });
  }

  function closeMenu() {
    const wasOpen = $('sidebar').classList.contains('open');
    const mobile = window.matchMedia('(max-width: 800px)').matches;
    $('sidebar').classList.remove('open'); $('sidebarOverlay').hidden = true; $('menuButton').setAttribute('aria-expanded', 'false'); $('menuButton').setAttribute('aria-label', '打开周导航'); document.body.classList.remove('menu-open');
    $('sidebar').inert = mobile;
    $('main').inert = false;
    $('sidebar').removeAttribute('role'); $('sidebar').removeAttribute('aria-modal');
    if (wasOpen && mobile) $('menuButton').focus({ preventScroll: true });
  }

  function openMenu() {
    $('sidebar').inert = false; $('main').inert = true;
    $('sidebar').classList.add('open'); $('sidebarOverlay').hidden = false;
    $('menuButton').setAttribute('aria-expanded', 'true'); $('menuButton').setAttribute('aria-label', '关闭周导航'); document.body.classList.add('menu-open');
    $('sidebar').setAttribute('role', 'dialog'); $('sidebar').setAttribute('aria-modal', 'true');
    $('drawerClose').focus();
  }

  function selectWeek(id) {
    selectedWeekId = id;
    closeMenu();
    render();
  }

  function scrollBehavior() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }

  function openTask(id) {
    filter = 'all'; query = ''; $('searchInput').value = '';
    const task = tasksFor(activeWeek()).find((item) => item.id === id);
    if (task && task.details) expandedGuides.add(id);
    else { expanded.add(id); getDraft(id); }
    renderTasks();
    const card = [...$('taskList').children].find((item) => item.dataset.taskId === id);
    if (card) {
      card.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
      const target = card.querySelector('.study-guide-summary') || card.querySelector('.details-button');
      if (target) target.focus({ preventScroll: true });
    }
  }

  async function load() {
    $('loadingPanel').hidden = false; $('loadError').hidden = true; $('pageContent').hidden = true;
    $('retryButton').disabled = true; $('exportButton').disabled = true; setBusy(false);
    try {
      const [planData, stateData] = await Promise.all([fetchJSON('/api/plan'), fetchJSON('/api/state')]);
      plan = validatePlan(planData); state = normalizeState(stateData);
      if (!plan.weeks.some((week) => week.id === selectedWeekId)) selectedWeekId = plan.weeks[calendar().index].id;
      $('loadingPanel').hidden = true; $('pageContent').hidden = false; $('exportButton').disabled = false; setBusy(false); render();
      setStatus(state.updatedAt ? '学习记录已载入' : '从今天的第一项任务开始');
    } catch (error) {
      $('loadingPanel').hidden = true; $('loadError').hidden = false; $('loadErrorText').textContent = error.message;
    } finally { $('retryButton').disabled = false; }
  }

  $('dismissNotice').addEventListener('click', () => { $('notice').hidden = true; });
  $('retryButton').addEventListener('click', load);
  $('menuButton').addEventListener('click', () => { if ($('sidebar').classList.contains('open')) closeMenu(); else openMenu(); });
  $('drawerClose').addEventListener('click', closeMenu);
  $('sidebarOverlay').addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
    if (event.key === 'Tab' && $('sidebar').classList.contains('open')) {
      const controls = [...$('sidebar').querySelectorAll('a[href], button:not([disabled])')];
      const first = controls[0]; const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);
  $('nextButton').addEventListener('click', () => { if (nextAction) nextAction(); });
  $('currentWeekButton').addEventListener('click', () => selectWeek(plan.weeks[calendar().index].id));
  document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => { filter = button.dataset.filter; renderTasks(); }));
  $('searchInput').addEventListener('input', (event) => { query = event.target.value.trim(); renderTasks(); });
  $('clearFilterButton').addEventListener('click', () => { filter = 'all'; query = ''; $('searchInput').value = ''; renderTasks(); });
  document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', () => $(button.dataset.close).close()));
  document.querySelectorAll('dialog').forEach((dialog) => dialog.addEventListener('click', (event) => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } }));

  $('dateButton').addEventListener('click', () => { $('startDateInput').value = state.startDate; $('dateDialog').showModal(); });
  $('dateForm').addEventListener('submit', async (event) => {
    event.preventDefault(); if (saving || !$('dateForm').reportValidity()) return;
    const date = $('startDateInput').value;
    if (calendarDay(date) === null) { $('startDateInput').setCustomValidity('请选择 2000—2100 年之间的有效日期。'); $('startDateInput').reportValidity(); return; }
    if (await saveChange((candidate) => { candidate.startDate = date; }, '起始日期已保存')) $('dateDialog').close();
  });
  $('startDateInput').addEventListener('input', () => $('startDateInput').setCustomValidity(''));
  $('startDateInput').min = '2000-01-01'; $('startDateInput').max = '2100-12-31';

  for (const category of categories) { const option = node('option', '', category); option.value = category; $('customCategory').append(option); }
  $('addButton').addEventListener('click', () => {
    $('addForm').reset(); $('customWeek').replaceChildren();
    plan.weeks.forEach((week) => { const option = node('option', '', `第 ${week.number} 周 · ${week.title}`); option.value = week.id; $('customWeek').append(option); });
    $('customWeek').value = selectedWeekId; $('customCategory').value = '项目'; $('addDialog').showModal();
  });
  $('addForm').addEventListener('submit', async (event) => {
    event.preventDefault(); if (saving || !$('addForm').reportValidity()) return;
    const title = $('customTitle').value.trim(); if (!title) { $('customTitle').setCustomValidity('请输入任务名称。'); $('customTitle').reportValidity(); return; }
    const suffix = globalThis.crypto?.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    const task = { id: `custom-${suffix}`, title, category: $('customCategory').value, minutes: Number($('customMinutes').value), weekId: $('customWeek').value, description: $('customDescription').value.trim() };
    if (await saveChange((candidate) => { candidate.customTasks.push(task); }, '自定义任务已加入', () => { selectedWeekId = task.weekId; filter = 'all'; query = ''; $('searchInput').value = ''; })) $('addDialog').close();
  });
  $('customTitle').addEventListener('input', () => $('customTitle').setCustomValidity(''));
  $('deleteForm').addEventListener('submit', async (event) => {
    event.preventDefault(); if (saving || !deletingTask) return;
    const id = deletingTask.id;
    if (await saveChange((candidate) => { candidate.customTasks = candidate.customTasks.filter((task) => task.id !== id); delete candidate.tasks[id]; }, '自定义任务已删除', () => { expanded.delete(id); drafts.delete(id); deletingTask = null; })) $('deleteDialog').close();
  });

  $('exportButton').addEventListener('click', () => {
    if (!state) return;
    const backup = { format: 'go-linux-study-backup', exportedAt: new Date().toISOString(), state };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob); const link = node('a'); link.href = url; link.download = `后端起步-学习备份-${localDate()}.json`; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
    setStatus('已导出当前保存的学习记录');
  });
  $('importButton').addEventListener('click', () => { if (!saving) { $('importFile').value = ''; $('importFile').click(); } });
  $('importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0]; if (!file || !state || saving) return;
    try {
      if (file.size > 2 * 1024 * 1024) throw new Error('备份文件不能超过 2 MB。');
      const parsed = JSON.parse(await file.text());
      importCandidate = normalizeState(parsed && typeof parsed === 'object' && parsed.state ? parsed.state : parsed);
      const entries = Object.values(importCandidate.tasks);
      const details = [`文件：${file.name}`, `起始日期：${importCandidate.startDate}`, `已完成任务：${entries.filter((entry) => entry.done).length} 项`, `学习笔记：${entries.filter((entry) => entry.notes).length} 项`, `自定义任务：${importCandidate.customTasks.length} 项`];
      const fragment = document.createDocumentFragment(); details.forEach((text) => fragment.append(node('p', '', text))); $('importSummary').replaceChildren(fragment); $('importError').hidden = true; $('importDialog').showModal();
    } catch (error) { importCandidate = null; showNotice(`无法导入：${error instanceof SyntaxError ? '请选择有效的 JSON 备份文件。' : error.message}`); }
  });
  $('importForm').addEventListener('submit', async (event) => {
    event.preventDefault(); if (saving || !importCandidate) return;
    if (await saveChange((candidate) => { const revision = candidate.revision; Object.assign(candidate, importCandidate, { revision }); }, '备份已导入', () => { drafts.clear(); expanded.clear(); selectedWeekId = plan.weeks[calendar().index].id; filter = 'all'; query = ''; $('searchInput').value = ''; importCandidate = null; })) $('importDialog').close();
    else { $('importError').textContent = '导入未完成。请关闭此窗口，查看页面上方的提示后重试。'; $('importError').hidden = false; }
  });

  closeMenu();
  load();
})();
