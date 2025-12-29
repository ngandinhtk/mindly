import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Save } from 'lucide-react';

const Notes = () => {
  const { t } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const username = localStorage.getItem('username');

  useEffect(() => {
    if (username) {
      const savedNotes = localStorage.getItem(`notes_${username}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, [username]);

  const handleSaveNote = () => {
    if (!newNote.trim()) return;

    const newNoteObj = {
      id: Date.now().toString(),
      content: newNote,
      date: new Date().toISOString(),
    };

    const updatedNotes = [newNoteObj, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => (note.id || note._id) !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none min-h-[100px]"
          placeholder={t('write_note_placeholder') || "Write a note..."}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex justify-center mt-2">
          <button
            onClick={handleSaveNote}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            {t('save') || "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {notes.map((note) => (
          <div key={note._id || note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-2 shadow-sm rounded-r-md relative group">
            <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
            <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(note.date).toLocaleDateString()}</span>
              <button
                onClick={() => handleDeleteNote(note._id || note.id)}
                className="text-red-400 hover:text-red-600 opacity-0 bg-yellow-50 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Notes;