const createTodo = (text, id) => ({
  id,
  text,
  completed: false,
});

export class TodoStore {
  constructor(initialTodos = []) {
    this._todos = initialTodos.map((todo, index) => ({
      ...todo,
      id: todo.id ?? index + 1,
      completed: Boolean(todo.completed),
    }));
    this._nextId = this._todos.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;
  }

  add(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      return null;
    }
    const todo = createTodo(trimmed, this._nextId++);
    this._todos = [todo, ...this._todos];
    return todo;
  }

  toggle(id) {
    let updated = null;
    this._todos = this._todos.map((todo) => {
      if (todo.id === id) {
        updated = { ...todo, completed: !todo.completed };
        return updated;
      }
      return todo;
    });
    return updated;
  }

  remove(id) {
    const beforeLength = this._todos.length;
    this._todos = this._todos.filter((todo) => todo.id !== id);
    return this._todos.length !== beforeLength;
  }

  clearCompleted() {
    const beforeLength = this._todos.length;
    this._todos = this._todos.filter((todo) => !todo.completed);
    return beforeLength - this._todos.length;
  }

  getAll() {
    return this._todos.map((todo) => ({ ...todo }));
  }

  getActiveCount() {
    return this._todos.filter((todo) => !todo.completed).length;
  }
}
