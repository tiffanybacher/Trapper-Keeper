import { addNote, setLoading, setError } from '../actions/index';

export const fetchAddNote = (note) => {
  return async (dispatch) => {
    const url = 'http://localhost:3001/api/v1/notes';
    const body = {
      title: note.title,
      list: note.list,
      id: note.id
    }
    const options = {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: body
    }

    try {
      dispatch(setLoading(true));

      const response = await fetch(url, options);

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const note = await response.json();

      dispatch(addNote(note));
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error.message));
    }
  }
}