import test from 'node:test';
import assert from 'node:assert/strict';
import { TodoStore } from '../public/todoStore.js';

test('adds trimmed todos to the beginning of the list', () => {
  const store = new TodoStore();
  const todo = store.add('  Learn the test runner  ');
  assert.equal(todo.text, 'Learn the test runner');
  assert.equal(todo.completed, false);
  assert.equal(store.getAll()[0].text, 'Learn the test runner');
});

test('ignores empty todos', () => {
  const store = new TodoStore();
  assert.equal(store.add('   '), null);
  assert.deepEqual(store.getAll(), []);
});

test('toggles completion state', () => {
  const store = new TodoStore();
  const todo = store.add('Walk the dog');
  const toggled = store.toggle(todo.id);
  assert.equal(toggled.completed, true);
  assert.equal(store.getAll()[0].completed, true);
});

test('removes todos and returns whether removal happened', () => {
  const store = new TodoStore();
  const todo = store.add('Read a book');
  assert.equal(store.remove(todo.id), true);
  assert.equal(store.remove(999), false);
  assert.deepEqual(store.getAll(), []);
});

test('clears completed todos and reports the number removed', () => {
  const store = new TodoStore([
    { id: 1, text: 'One', completed: true },
    { id: 2, text: 'Two', completed: false },
    { id: 3, text: 'Three', completed: true },
  ]);
  assert.equal(store.clearCompleted(), 2);
  assert.deepEqual(store.getAll(), [{ id: 2, text: 'Two', completed: false }]);
});
