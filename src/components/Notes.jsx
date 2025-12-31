import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Save, Pin } from 'lucide-react';

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
      pinned: false,
    };

    const updatedNotes = [newNoteObj, ...notes].sort((a, b) => {
      if (!!a.pinned === !!b.pinned) {
        return new Date(b.date) - new Date(a.date);
      }
      return a.pinned ? -1 : 1;
    });
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => (note.id || note._id) !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));
  };

  const handlePinNote = (id) => {
    const updatedNotes = notes.map((note) => {
      if ((note.id || note._id) === id) {
        return { ...note, pinned: !note.pinned };
      }
      return note;
    });

    updatedNotes.sort((a, b) => {
      if (!!a.pinned === !!b.pinned) {
        return new Date(b.date) - new Date(a.date);
      }
      return a.pinned ? -1 : 1;
    });

    setNotes(updatedNotes);
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-white  p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-transparent outline-none resize-none min-h-[100px]"
          placeholder={t('write_note_placeholder') || "Write a note..."}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <div className="flex justify-center mt-2">
          <button
            onClick={handleSaveNote}
            className="flex items-center px-4 py-2 my-1 bg-gradient-to-b from-purple-500 to-pink-400 text-white  rounded-lg hover:bg-purple-700 transition-colors"
          >
            {/* <Save className="w-4 h-4 mr-2" /> */}
            {t('saveing') || "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {notes.map((note) => (
          <div key={note._id || note.id} className={`bg-yellow-50 border-l-4 ${note.pinned ? 'border-green-500' : 'border-yellow-400'} p-2 shadow-sm rounded-r-md relative group`}>
            <p className="text-gray-800 whitespace-pre-wrap break-words">{note.content}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{new Date(note.date).toLocaleDateString()}</span>
              <div className="flex items-center">
                
                <button
                  onClick={() => handleDeleteNote(note._id || note.id)}
                  className="  px-0  text-red-400 hover:text-red-600 opacity-0 bg-yellow-50 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-5 h-5 px-0" />
                </button>
                <button
                  onClick={() => handlePinNote(note._id || note.id)}
                  className={`px-2 hover:text-green-600 hover:not-focus:bg-yellow-50 bg-yellow-50 transition-opacity ${note.pinned ? 'text-green-600 bg-yellow-50 opacity-100' : 'bg-yellow-50 text-gray-500 opacity-0 group-hover:opacity-100'}`}
                >
                  <Pin className="w-5 h-5" fill={note.pinned ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Notes;