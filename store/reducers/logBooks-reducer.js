import {
  ADD_ENTRY_REMOTE,
  SET_ENTRIES,
  DELETE_ENTRY,
} from '../actions/logBooks-actions';
import { RESET } from '../actions/reset-actions';

import Place from '../../models/place';
import PLACES from '../../data/dummy-data';

const initialState = {
  allEntries: PLACES,
};

export default (state = initialState, action) => {
  console.log('action fired: ', action.type);
  switch (action.type) {
    case SET_ENTRIES:
      return {
        allEntries: action.entries
          .map(
            pl =>
              new Place(
                pl.id.toString(),
                pl.logBook_id,
                pl.recordType,
                pl.title,
                pl.date,
                pl.description,
                pl.imageUri,
                pl.address,
                pl.lat,
                pl.lng
              )
          )
          .reverse(),
      };

    case ADD_ENTRY_REMOTE: {
      const newEntry = [
        new Place(
          action.payload.id,
          action.payload.logBook_id,
          action.payload.recordType,
          action.payload.title,
          action.payload.date,
          action.payload.description,
          'Address!',
          action.payload.imageUri,
          action.payload.coords.latitude,
          action.payload.coords.longitude
        ),
      ];
      return { allEntries: newEntry.concat(state.allEntries) };
    }

    case DELETE_ENTRY:
      return {
        ...state,
        allEntries: state.allEntries.filter(entry => entry.id !== action.id),
      };
    case RESET:
      return {
        initialState,
      };
    default:
      return state;
  }
};
