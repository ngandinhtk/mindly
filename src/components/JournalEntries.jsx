import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { emotions } from '../data/emotions';

const dateKey = value => {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};
const normalize = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLocaleLowerCase();

export default function JournalEntries({ entries, setEntries, selectedDate, clearDate }) {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState('');
  const [emotionFilter, setEmotionFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [deleted, setDeleted] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400';
  const actionClass = 'rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500';

  const persist = (updated, success) => {
    try {
      const username = localStorage.getItem('username');
      if (!username) throw new Error('No active user');
      const key = `moodEntries_${username}`;
      const previous = localStorage.getItem(key);
      if (previous) localStorage.setItem(`${key}__backup`, previous);
      localStorage.setItem(key, JSON.stringify(updated));
      setEntries(updated);
      setError(false);
      setMessage(t(success));
      return true;
    } catch (err) {
      setError(true);
      setMessage(t('journal_save_error'));
      return false;
    }
  };
  const clearFilters = () => {
    setQuery(''); setEmotionFilter(''); setFrom(''); setTo(''); clearDate();
  };
  const visible = entries.map((entry, index) => ({ entry, index })).filter(({ entry }) => {
    const day = dateKey(entry.date);
    return (!selectedDate || day === dateKey(selectedDate)) &&
      (!emotionFilter || entry.emotion === emotionFilter) &&
      (!from || day >= from) && (!to || day <= to) &&
      (!query.trim() || normalize(entry.note).includes(normalize(query.trim())));
  }).sort((a, b) => new Date(b.entry.date) - new Date(a.entry.date));

  return (
    <section className="mt-6 rounded-3xl bg-white p-4 shadow-sm sm:p-6" aria-labelledby="journal-history-title">
      <h2 id="journal-history-title" className="text-lg font-bold text-gray-800">{t('journal_entries')}</h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="text-sm text-gray-700">{t('search_journal')}<input type="search" value={query} onChange={e => setQuery(e.target.value)} className={inputClass} /></label>
        <label className="text-sm text-gray-700">{t('entry_emotion')}<select value={emotionFilter} onChange={e => setEmotionFilter(e.target.value)} className={inputClass}><option value="">{t('all_emotions')}</option>{emotions.map(emotion => <option key={emotion.id} value={emotion.id}>{emotion.emoji} {t(emotion.label)}</option>)}</select></label>
        <label className="text-sm text-gray-700">{t('date_from')}<input type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)} className={inputClass} /></label>
        <label className="text-sm text-gray-700">{t('date_to')}<input type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)} className={inputClass} /></label>
      </div>
      {selectedDate && <p className="mt-3 text-sm text-purple-700">{t('selected_day')}: {selectedDate.toLocaleDateString(i18n.language)}</p>}
      {(query || emotionFilter || from || to || selectedDate) && <button type="button" onClick={clearFilters} className={`${actionClass} mt-3 bg-purple-50 text-purple-700 hover:bg-purple-100`}>{t('clear_filters')}</button>}
      {message && <p role={error ? 'alert' : 'status'} className={`mt-3 text-sm ${error ? 'text-red-700' : 'text-emerald-700'}`}>{message}</p>}
      {deleted && <button type="button" className={`${actionClass} mt-2 bg-purple-50 text-purple-700 hover:bg-purple-100`} onClick={() => {
        const updated = [...entries];
        updated.splice(Math.min(deleted.index, updated.length), 0, deleted.entry);
        if (persist(updated, 'entry_restored')) setDeleted(null);
      }}>{t('undo_delete')}</button>}
      <div className="mt-4 space-y-4">
        {visible.map(({ entry, index }) => {
          const emotion = emotions.find(item => item.id === entry.emotion);
          return <article key={index} className="group rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3"><span className="text-3xl" aria-hidden="true">{emotion?.emoji}</span><div><p className="font-semibold text-gray-800">{emotion ? t(emotion.label) : entry.emotion}</p><time dateTime={new Date(entry.date).toISOString()} className="text-sm text-gray-500">{new Date(entry.date).toLocaleString(i18n.language, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</time></div><button type="button" aria-label={t('delete_entry')} title={t('delete_entry')} onClick={() => {
              if (persist(entries.filter((_, itemIndex) => itemIndex !== index), 'entry_deleted')) setDeleted({ entry, index });
            }} className="mindly-journal-delete ml-auto bg-transparent p-1 text-red-700 opacity-0 transition-opacity hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100"><Trash2 className="h-4 w-4" aria-hidden="true" /></button></div>
            {entry.note && <p className="mt-3 whitespace-pre-wrap break-words text-gray-700">{entry.note}</p>}
          </article>;
        })}
        {!visible.length && <p className="py-4 text-sm text-gray-500">{t(entries.length ? 'no_search_results' : 'journal_empty')}</p>}
      </div>
    </section>
  );
}
