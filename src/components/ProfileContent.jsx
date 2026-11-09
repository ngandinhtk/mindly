import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, FileText, Heart, Lock, TrendingUp } from 'lucide-react';

export default function ProfileContent({ username }) {
  const { t } = useTranslation();
  const [details, setDetails] = useState({ about: '', intention: '' });
  const [saved, setSaved] = useState({ about: '', intention: '' });
  const [status, setStatus] = useState('');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setStatus('');
    setFailed(false);
    let next = { about: '', intention: '' };
    if (username) {
      try {
        const value = JSON.parse(localStorage.getItem(`profileDetails_${username}`) || '{}');
        next = {
          about: typeof value?.about === 'string' ? value.about : '',
          intention: typeof value?.intention === 'string' ? value.intention : '',
        };
      } catch (error) {
        setFailed(true);
        setStatus('profile_load_failed');
      }
    }
    setDetails(next);
    setSaved(next);
  }, [username]);

  const save = event => {
    event.preventDefault();
    if (!username) return;
    const next = { about: details.about.trim(), intention: details.intention.trim() };
    try {
      localStorage.setItem(`profileDetails_${username}`, JSON.stringify(next));
      setDetails(next);
      setSaved(next);
      setFailed(false);
      setStatus('profile_details_saved');
    } catch (error) {
      setFailed(true);
      setStatus('profile_details_failed');
    }
  };
  const changed = details.about.trim() !== saved.about || details.intention.trim() !== saved.intention;
  const inputClass = 'mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100';
  const shortcuts = [
    { to: '/journal', icon: BookOpen, title: 'journal', description: 'profile_journal_link' },
    { to: '/insights', icon: TrendingUp, title: 'insights', description: 'profile_insights_link' },
    { to: '/notes', icon: FileText, title: 'notes', description: 'profile_notes_link' },
  ];

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-pink-50 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="rounded-2xl bg-white p-3 text-purple-900"><Heart className="h-5 w-5" aria-hidden="true" /></span>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-gray-800">{t('profile_space_title')}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{t('profile_space_description')}</p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6" aria-labelledby="profile-about-title">
        <h2 id="profile-about-title" className="text-lg font-bold text-gray-800">{t('profile_about_title')}</h2>
        <p className="mt-1 text-sm leading-relaxed text-gray-500">{t('profile_about_description')}</p>
        <form onSubmit={save} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="profile-about">
            {t('profile_about_label')}
            <textarea id="profile-about" rows={3} maxLength={300} value={details.about} onChange={event => { setDetails({ ...details, about: event.target.value }); setStatus(''); }} placeholder={t('profile_about_placeholder')} className={`${inputClass} resize-y`} />
          </label>
          <label className="block text-sm font-medium text-gray-700" htmlFor="profile-intention">
            {t('profile_intention_label')}
            <input id="profile-intention" type="text" maxLength={160} value={details.intention} onChange={event => { setDetails({ ...details, intention: event.target.value }); setStatus(''); }} placeholder={t('profile_intention_placeholder')} className={inputClass} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={!username || !changed} className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40">{t('save_changes')}</button>
            {status && <p role={failed ? 'alert' : 'status'} className={`text-sm ${failed ? 'text-red-700' : 'text-emerald-700'}`}>{t(status)}</p>}
          </div>
        </form>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6" aria-labelledby="profile-shortcuts-title">
        <h2 id="profile-shortcuts-title" className="text-lg font-bold text-gray-800">{t('profile_shortcuts_title')}</h2>
        <div className="mt-3 divide-y divide-gray-100">
          {shortcuts.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to} className="flex items-center gap-3 rounded-xl px-2 py-4 transition hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400">
              <span className="shrink-0 rounded-xl bg-purple-50 p-2.5 text-purple-900"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0 flex-1"><p className="font-semibold text-gray-800">{t(title)}</p><p className="mt-1 text-sm text-gray-500">{t(description)}</p></div>
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>

      <aside className="flex items-start gap-3 rounded-2xl bg-purple-50/70 p-4 text-sm leading-relaxed text-gray-600">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-purple-900" aria-hidden="true" />
        <div><p className="font-semibold text-gray-700">{t('profile_device_title')}</p><p className="mt-1">{t('profile_device_description')}</p></div>
      </aside>
    </div>
  );
}
