import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2, Pin } from 'lucide-react';

const Notes = () => {
  const { t, i18n } = useTranslation();
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 10; // Number of notes to show per page
  const username = localStorage.getItem('username');

  const groupNotesByDate = (notesToGroup) => {
    if (!notesToGroup) return {};
    return notesToGroup.reduce((acc, note) => {
      const date = new Date(note.date);
      // Use a sortable key like YYYY-MM-DD to group
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(note);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (username) {
      const savedNotes = localStorage.getItem(`notes_${username}`);
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
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
    setCurrentPage(1);
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter((note) => (note.id || note._id) !== id);
    setNotes(updatedNotes);
    localStorage.setItem(`notes_${username}`, JSON.stringify(updatedNotes));

    const newTotalPages = Math.ceil(updatedNotes.length / notesPerPage);
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages || 1);
    }
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

  // --- Pagination Logic ---
  const totalPages = Math.ceil(notes.length / notesPerPage);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  // Group the notes for the current page by date for display
  const groupedCurrentNotes = groupNotesByDate(currentNotes);
  const dateKeys = Object.keys(groupedCurrentNotes).sort((a, b) => new Date(b) - new Date(a));

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
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
            {t('saveing') || "Save"}
          </button>
        </div>
      </div>

      {dateKeys.map(dateKey => (
        <div key={dateKey} className="mb-8">
          <h2 className="text-lg font-semibold text-gray-500 mb-3 border-b pb-2">
            {new Date(dateKey).toLocaleDateString(i18n.language, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {groupedCurrentNotes[dateKey].map((note) => (
              <div key={note._id || note.id} className={`bg-yellow-50 border-l-4 ${note.pinned ? 'border-green-500' : 'border-yellow-400'} p-2 shadow-sm rounded-r-md relative group`}>
                <p className="text-gray-800 whitespace-pre-wrap break-words p-2">{note.content}</p>
                <div className="flex justify-between items-center text-xs text-gray-500 px-2">
                  <span>{new Date(note.date).toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' })}</span>
                  <div className="flex items-center">
                    <button
                      onClick={() => handleDeleteNote(note._id || note.id)}
                      className="px-1 text-red-400 hover:text-red-600 opacity-0 bg-yellow-50 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handlePinNote(note._id || note.id)}
                      className={`px-1 hover:text-green-600 bg-yellow-50 transition-opacity ${note.pinned ? 'text-green-600 opacity-100' : 'text-gray-700 opacity-0 group-hover:opacity-100'}`}
                    >
                      <Pin className="w-4 h-4" fill={note.pinned ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            {t('previous')}
          </button>
          <span className="text-gray-700">
            {t('page')} {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
          >
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
};


export default Notes;