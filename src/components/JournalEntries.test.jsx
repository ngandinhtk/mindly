import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import JournalEntries from './JournalEntries';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key, i18n: { language: 'en' } }) }));
const initial = [
  { date: '2026-10-01T08:00:00', emotion: 'happy', note: 'Công việc tốt' },
  { date: '2026-10-02T08:00:00', emotion: 'sad', note: 'Need rest' },
];
let container;
function Harness() {
  const [entries, setEntries] = React.useState(initial);
  return <JournalEntries entries={entries} setEntries={setEntries} selectedDate={null} clearDate={() => {}} />;
}
function button(label) { return [...container.querySelectorAll('button')].find(item => item.textContent === label); }
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('username', 'tester');
  localStorage.setItem('moodEntries_tester', JSON.stringify(initial));
  container = document.createElement('div');
  document.body.appendChild(container);
  act(() => { ReactDOM.render(<Harness />, container); });
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.restoreAllMocks();
});
test('search matches Vietnamese notes without diacritics and clears filters', () => {
  act(() => Simulate.change(container.querySelector('input[type="search"]'), { target: { value: 'cong viec' } }));
  expect(container.querySelectorAll('article')).toHaveLength(1);
  expect(container.textContent).toContain('Công việc tốt');
  act(() => button('clear_filters').click());
  expect(container.querySelectorAll('article')).toHaveLength(2);
});
test('delete persists and undo restores the original entry', () => {
  act(() => button('delete_entry').click());
  expect(JSON.parse(localStorage.getItem('moodEntries_tester'))).toHaveLength(1);
  act(() => button('undo_delete').click());
  expect(JSON.parse(localStorage.getItem('moodEntries_tester'))).toEqual(initial);
  expect(container.querySelectorAll('article')).toHaveLength(2);
});
test('editing saves the note and preserves the original date', () => {
  act(() => button('edit_entry').click());
  const original = initial[1];
  act(() => Simulate.change(container.querySelector('textarea'), { target: { value: 'Updated note' } }));
  act(() => Simulate.submit(container.querySelector('form')));
  const updated = JSON.parse(localStorage.getItem('moodEntries_tester'))[1];
  expect(updated.note).toBe('Updated note');
  expect(updated.date).toBe(original.date);
});
test('failed storage leaves the visible entries intact and reports an error', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage full'); });
  act(() => button('delete_entry').click());
  expect(container.querySelectorAll('article')).toHaveLength(2);
  expect(container.querySelector('[role="alert"]').textContent).toBe('journal_save_error');
});
test('date range and emotion filters combine', () => {
  const dateInputs = container.querySelectorAll('input[type="date"]');
  act(() => Simulate.change(dateInputs[0], { target: { value: '2026-10-02' } }));
  expect(container.querySelectorAll('article')).toHaveLength(1);
  act(() => Simulate.change(container.querySelector('select'), { target: { value: 'happy' } }));
  expect(container.querySelectorAll('article')).toHaveLength(0);
  expect(container.textContent).toContain('no_search_results');
});
