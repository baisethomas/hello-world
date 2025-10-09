import { TodoStore } from './todoStore.js';

const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const feedback = document.getElementById('feedback');
const summary = document.getElementById('summary');
const clearCompletedButton = document.getElementById('clear-completed');

const storageKey = 'hello-world-todos';
const loadTodos = () => {
  try {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((todo) => typeof todo.text === 'string');
  } catch (error) {
    console.error('Failed to load todos', error);
    return [];
  }
};

const saveTodos = (todos) => {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos', error);
  }
};

const store = new TodoStore(loadTodos());

const updateSummary = () => {
  const remaining = store.getActiveCount();
  const total = store.getAll().length;
  if (!total) {
    summary.textContent = 'No tasks yet. Enjoy the free time!';
  } else if (remaining === 0) {
    summary.textContent = 'Everything is done — nice work!';
  } else {
    summary.textContent = `${remaining} of ${total} tasks remaining.`;
  }
};

const setFeedback = (message, type = 'info') => {
  feedback.textContent = message;
  feedback.dataset.type = type;
};

const createTodoElement = (todo) => {
  const item = document.createElement('li');
  item.className = 'todo-item';
  if (todo.completed) {
    item.classList.add('completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.id = `todo-${todo.id}`;
  checkbox.addEventListener('change', () => {
    const updated = store.toggle(todo.id);
    if (updated) {
      if (updated.completed) {
        item.classList.add('completed');
      } else {
        item.classList.remove('completed');
      }
      saveTodos(store.getAll());
      updateSummary();
    }
  });

  const label = document.createElement('label');
  label.setAttribute('for', checkbox.id);
  label.textContent = todo.text;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.setAttribute('aria-label', `Remove ${todo.text}`);
  removeButton.textContent = '✕';
  removeButton.addEventListener('click', () => {
    const removed = store.remove(todo.id);
    if (removed) {
      item.remove();
      saveTodos(store.getAll());
      updateSummary();
      setFeedback('Task removed.');
    }
  });

  item.append(checkbox, label, removeButton);
  return item;
};

const renderTodos = () => {
  todoList.innerHTML = '';
  const todos = store.getAll();
  todos.forEach((todo) => {
    todoList.appendChild(createTodoElement(todo));
  });
  updateSummary();
};

renderTodos();

clearCompletedButton.addEventListener('click', () => {
  const removedCount = store.clearCompleted();
  if (removedCount) {
    setFeedback(`Cleared ${removedCount} completed ${removedCount === 1 ? 'task' : 'tasks'}.`);
    saveTodos(store.getAll());
    renderTodos();
  } else {
    setFeedback('There are no completed tasks to clear.', 'warning');
  }
});

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = todoInput.value;
  const todo = store.add(value);
  if (!todo) {
    setFeedback('Please write what you need to do.', 'warning');
    return;
  }
  const element = createTodoElement(todo);
  todoList.insertBefore(element, todoList.firstChild);
  todoInput.value = '';
  todoInput.focus();
  setFeedback('Task added.');
  saveTodos(store.getAll());
  updateSummary();
});
