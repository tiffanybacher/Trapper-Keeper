import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllNotes } from '../../thunks/fetchAllNotes';
import { fetchDeleteNote } from '../../thunks/fetchDeleteNote';
import Note from '../../components/Note/Note';
import NoteForm from '../NoteForm/NoteForm';
import {Link} from 'react-router-dom';

export class NotesContainer extends Component {
  componentDidMount() {
    this.props.fetchAllNotes();
  }

  assignDisplayNotes = () => {
    let { notes, fetchDeleteNote } = this.props;
    let displayNotes;
    
    if (notes.length) {  
      displayNotes = notes.map(note => 
        <Note {...note} key={note.id} fetchDeleteNote={fetchDeleteNote} />
      );
    } else {
      displayNotes = <div className='empty-notes'>
        <i className="fas fa-edit"></i>
        <p>Notes will display here</p>
      </div>
    }

    return displayNotes;
  }

  assignNotePopup = () => {
    const { notes, location } = this.props;
    let notePopup;

    if (location.pathname === "/new-note" ) {
      notePopup = 
        <div className="popup-background">
          <NoteForm />
        </div>
    } 

    if (location.pathname.includes('/notes/')) {
      const id = location.pathname.split("/")[2]
      const match = notes.find(note => {
        return note.id === parseInt(id);
      });

      if (match !== undefined) {
        notePopup = 
        <div className="popup-background">
          <NoteForm note={match} />
        </div>
      }
    }

    return notePopup;
  }

  render() {
    const displayNotes = this.assignDisplayNotes();
    const notePopup = this.assignNotePopup();

    return (
      <div>
          <div className="sidebar">
            <Link to="/new-note" className="add-link">
              <i className="fas fa-plus add-btn"></i>     
            </Link>
          </div>
          <section className="notes-container">
            {displayNotes}
          </section>
        {notePopup}
      </div>
    );
  }
}

export const mapStateToProps = state => ({
  notes: state.notes
});

export const mapDispatchToProps = dispatch => ({
  fetchAllNotes: () => dispatch(fetchAllNotes()),
  fetchDeleteNote: id => dispatch(fetchDeleteNote(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(NotesContainer);
