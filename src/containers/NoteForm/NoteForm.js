import React, { Component } from 'react';
import  PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchAddNote } from '../../thunks/fetchAddNote';
import { fetchPutNote } from '../../thunks/fetchPutNote';
import { fetchDeleteNote } from '../../thunks/fetchDeleteNote'
import { Redirect } from 'react-router-dom';
import ListItem from '../ListItem/ListItem';

export class NoteForm extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      list: [],
      listItem: '',
      id: null,
      submitted: false
    }
  }

  componentDidMount() {
    if (this.props.note) {
      const {id, title, list} = this.props.note;
      this.setState({list, title, id});
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSave = async () => {
    await this.updateList();

    const { title, list, id } = this.state;

    if (this.state.id) {
      this.props.fetchPutNote({ title, list, id });
    } else {
      this.props.fetchAddNote({ title, list, id: Date.now() });
    }

    this.setState({ list:[], title: '', submitted: true });

  }

  updateList = async () => {
    const newItem = this.state.listItem;

    await this.setState({
      list: [...this.state.list, { item: newItem, completed: false, id: Date.now() }],
      listItem: ''
    });
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.updateList(e);
    }
  }

  handleDelete = () => {
   const {id} = this.state;
   console.log('fire')
   this.props.fetchDeleteNote(id)
  }

  render() {
    if (this.state.submitted) {
      return <Redirect path="/" />
    }

    const itemInput = 
      <input 
        type="text"
        placeholder="List item"
        name="listItem"
        value={this.state.listItem}
        onChange={this.handleChange}
        onKeyPress={this.handleKeyPress} />
    let displayListItems;

    if (this.state.list.length) {
      displayListItems = this.state.list.map(listItem => 
        <ListItem 
          {...listItem} 
          key={listItem.id} />
      );
    }

    return (
      <div className="note-form-bg">
        <section className="note-form">
          <input 
            type="text" 
            className="note-title"
            placeholder="Title"
            name="title"
            value={this.state.title}
            onChange={this.handleChange} />
          {displayListItems}
          {itemInput}
          <i className="far fa-trash-alt" onClick={this.handleDelete} ></i>
          <button onClick={this.handleSave}><i className="fas fa-plus"></i></button>
        </section>
      </div>
    );
  }
}

export const mapStateToProps = ({notes}) => ({
  notes
});

export const mapDispatchToProps = dispatch => ({
  fetchAddNote: note => dispatch(fetchAddNote(note)),
  fetchDeleteNote: id => dispatch(fetchDeleteNote(id)),
  fetchPutNote: note => dispatch(fetchPutNote(note))
});

export default connect(mapStateToProps, mapDispatchToProps)(NoteForm);

NoteForm.propTypes = {
  title: PropTypes.string,
  listItem: PropTypes.string,
  list: PropTypes.array,
  id: PropTypes.number
}
