import React, { useEffect, useState } from 'react'
import Notification from './Components/Notification'
import Note from './Components/Note'
import noteService from './services/notes'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }

  return (
    <div style={footerStyle}>
      <br/>
      <em>Note App, Department of Computer Science, University of Helsinki 2021</em>
    </div>

  )
}

const App = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('a new note...');
  const [showAll, setShowAll] = useState('true');
  const [errorMessage, setErrorMessage] = useState(null)

  const Hook = () => {
    noteService
        .getAll()
        .then(initialNotes => {
          console.log(initialNotes);
          setNotes(initialNotes);
        })
  }

  useEffect(Hook, []);

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important }

    noteService.update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    }).catch(err => {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    
    setNotes(notes.filter(n => n.id !== id))
  })
  }

  const addNote = (event)=> {
    event.preventDefault();
   const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
   }
   noteService
       .create(noteObject)
       .then(returnedNote => {
         console.log(returnedNote.content);
         setNotes(notes.concat(returnedNote));
         setNewNote('');
       })
   
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  }
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
        <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>
          )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">Save</button>
      </form>
      <Footer />
    </div>
  )

 
}


export default App