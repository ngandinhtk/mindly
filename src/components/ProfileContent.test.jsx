import React from 'react';
import ReactDOM from 'react-dom';
import { act, Simulate } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router-dom';
import ProfileContent from './ProfileContent';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: key => key }) }));
let container;
const render = username => act(() => { ReactDOM.render(<MemoryRouter><ProfileContent username={username} /></MemoryRouter>, container); });
beforeEach(() => {
  localStorage.clear();
  container = document.createElement('div');
  document.body.appendChild(container);
});
afterEach(() => {
  act(() => { ReactDOM.unmountComponentAtNode(container); });
  container.remove();
  jest.restoreAllMocks();
});
test('saves personal details and loads only the current user', () => {
  render('alice');
  act(() => Simulate.change(container.querySelector('textarea'), { target: { value: ' I like quiet mornings ' } }));
  act(() => Simulate.change(container.querySelector('input'), { target: { value: 'Take a break' } }));
  act(() => Simulate.submit(container.querySelector('form')));
  expect(JSON.parse(localStorage.getItem('profileDetails_alice'))).toEqual({ about: 'I like quiet mornings', intention: 'Take a break' });
  expect(container.querySelector('[role="status"]').textContent).toBe('profile_details_saved');
  render('bob');
  expect(container.querySelector('textarea').value).toBe('');
  render('alice');
  expect(container.querySelector('textarea').value).toBe('I like quiet mornings');
});
test('reports a save failure and keeps the draft for retry', () => {
  render('alice');
  act(() => Simulate.change(container.querySelector('textarea'), { target: { value: 'My draft' } }));
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage full'); });
  act(() => Simulate.submit(container.querySelector('form')));
  expect(container.querySelector('[role="alert"]').textContent).toBe('profile_details_failed');
  expect(container.querySelector('textarea').value).toBe('My draft');
  expect(container.querySelector('button').disabled).toBe(false);
});
test('provides working route links without rendering mood history', () => {
  render('alice');
  expect([...container.querySelectorAll('a')].map(link => link.getAttribute('href'))).toEqual(['/journal', '/insights', '/notes']);
  expect(container.textContent).not.toContain('emotion_history_7_days');
});
