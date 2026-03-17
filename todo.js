// =========================================
//  PROJETO 003 — Lista de Tarefas
//  todo.js — Lógica completa da aplicação
// =========================================

// ── Referências DOM ──────────────────────
const taskInput   = document.getElementById('taskInput');
const addBtn      = document.getElementById('addBtn');
const taskList    = document.getElementById('taskList');
const emptyState  = document.getElementById('emptyState');
const totalCount  = document.getElementById('totalCount');
const doneCount   = document.getElementById('doneCount');
const pendingCount = document.getElementById('pendingCount');
const clearDoneBtn = document.getElementById('clearDoneBtn');

// ── Persistência via localStorage ────────

/**
 * Retorna todas as tarefas salvas.
 * @returns {Array<{id: string, text: string, done: boolean}>}
 */
function getTasks() {
  try {
    return JSON.parse(localStorage.getItem('tasks')) || [];
  } catch {
    return [];
  }
}

/**
 * Salva o array de tarefas no localStorage.
 * @param {Array} tasks
 */
function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ── CRUD ─────────────────────────────────

/**
 * Adiciona uma nova tarefa.
 * @param {string} text
 */
function addTask(text) {
  const trimmed = text.trim();
  if (!trimmed) return;

  const tasks = getTasks();
  const newTask = {
    id:   Date.now().toString(),
    text: trimmed,
    done: false,
  };

  tasks.push(newTask);
  saveTasks(tasks);
  renderTasks();
  taskInput.value = '';
  taskInput.focus();
}

/**
 * Alterna o estado concluído de uma tarefa.
 * @param {string} id
 */
function toggleTask(id) {
  const tasks = getTasks().map(t =>
    t.id === id ? { ...t, done: !t.done } : t
  );
  saveTasks(tasks);
  renderTasks();
}

/**
 * Remove uma tarefa pelo id (com animação).
 * @param {string} id
 * @param {HTMLElement} itemEl
 */
function removeTask(id, itemEl) {
  itemEl.classList.add('removing');
  itemEl.addEventListener('animationend', () => {
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
  }, { once: true });
}

/**
 * Remove todas as tarefas marcadas como concluídas.
 */
function clearDone() {
  const tasks = getTasks().filter(t => !t.done);
  saveTasks(tasks);
  renderTasks();
}

// ── Render ────────────────────────────────

/**
 * Renderiza a lista completa de tarefas e atualiza o contador.
 */
function renderTasks() {
  const tasks = getTasks();

  // Limpa lista
  taskList.innerHTML = '';

  // Estado vazio
  if (tasks.length === 0) {
    emptyState.classList.add('visible');
  } else {
    emptyState.classList.remove('visible');
    tasks.forEach(task => {
      taskList.appendChild(createTaskElement(task));
    });
  }

  updateStats(tasks);
}

/**
 * Cria o elemento <li> para uma tarefa.
 * @param {{ id: string, text: string, done: boolean }} task
 * @returns {HTMLLIElement}
 */
function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.done ? ' done' : '');
  li.dataset.id = task.id;

  // Checkbox
  const checkbox = document.createElement('input');
  checkbox.type      = 'checkbox';
  checkbox.className = 'task-check';
  checkbox.checked   = task.done;
  checkbox.setAttribute('aria-label', 'Concluir tarefa');
  checkbox.addEventListener('change', () => toggleTask(task.id));

  // Texto
  const span = document.createElement('span');
  span.className  = 'task-text';
  span.textContent = task.text;

  // Botão deletar
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'task-delete';
  deleteBtn.textContent = '✕';
  deleteBtn.setAttribute('aria-label', 'Remover tarefa');
  deleteBtn.addEventListener('click', () => removeTask(task.id, li));

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(deleteBtn);

  return li;
}

/**
 * Atualiza os contadores de estatísticas.
 * @param {Array} tasks
 */
function updateStats(tasks) {
  const done    = tasks.filter(t => t.done).length;
  const pending = tasks.length - done;

  totalCount.textContent   = tasks.length;
  doneCount.textContent    = done;
  pendingCount.textContent = pending;
}

// ── Eventos ───────────────────────────────

// Botão ADD
addBtn.addEventListener('click', () => addTask(taskInput.value));

// Tecla Enter no input
taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask(taskInput.value);
});

// Limpar concluídas
clearDoneBtn.addEventListener('click', () => {
  const done = getTasks().filter(t => t.done);
  if (done.length === 0) return;
  clearDone();
});

// ── Inicialização ─────────────────────────
renderTasks();
