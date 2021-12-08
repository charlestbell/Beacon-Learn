import * as Location from 'expo-location';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export const ADD_ENTRY_REMOTE = 'ADD_ENTRY_REMOTE';
export const SET_ENTRIES = 'SET_ENTRIES';
export const DELETE_ENTRY = 'DELETE_ENTRY';

import { insertEntry, fetchEntries, removeEntry, init } from '../../models/db';
import Place from '../../models/place';

const logBook_Id = 1;

export const addEntry = (recordType, title, description, imageUri, address) => {
  const getLocationHandler = async () => {
    let location;
    // try {
    //   const location = await Location.getCurrentPositionAsync({
    //     timeout: 5000,
    //   });
    //   return location;
    // } catch (err) {
    //   Alert.alert(
    //     'Could not fetch location!',
    //     'Please try again later or pick a location on the map.',
    //     [{ text: 'Ok' }]
    //   );
    // }
    // Stub version. Development only.
    return (location = {
      coords: { latitude: 1234567890, longitude: -1234567890 },
    });
  };

  const thunk = async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const date = Date.now();
    const location = await getLocationHandler();
    const uuid = uuidv4();

    //Update DB
    const dbResult = await insertEntry(
      uuid,
      logBook_Id,
      recordType,
      title,
      date,
      description,
      imageUri,
      address,
      location.coords.latitude,
      location.coords.longitude
    );
    // Update State
    dispatch({
      type: ADD_ENTRY_REMOTE,
      payload: {
        id: uuid,
        logBook_Id,
        date,
        recordType,
        title,
        description,
        imageUri,
        coords: location.coords,
      },
    });

    // Add to Firebase
    const response = await fetch(
      `https://brog-trip-journal-default-rtdb.firebaseio.com/${userId}/entries/${uuid}.json?auth=${token}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logBook_Id,
          recordType,
          title,
          date,
          description,
          imageUri,
          address,
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        }),
      }
    );

    const resData = await response.json();
    console.log('Add entry firebase response ', resData);
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true,
  };
  return thunk;
};

export const loadEntries = () => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;

    const loadedEntries = [];
    const localEntries = [];

    const dbResult = await fetchEntries();
    const dbResultArray = dbResult.rows._array;
    // console.log('dbResult ', JSON.stringify(dbResult.rows._array));
    for (const key in dbResultArray) {
      localEntries.push(
        new Place(
          dbResultArray[key].id,
          dbResultArray[key].logBook_Id,
          dbResultArray[key].recordType,
          dbResultArray[key].title,
          dbResultArray[key].date,
          dbResultArray[key].description,
          dbResultArray[key].imageUri,
          dbResultArray[key].address,
          dbResultArray[key].lat,
          dbResultArray[key].lng
        )
      );
    }
    dispatch({ type: SET_ENTRIES, entries: localEntries });

    const response = await fetch(
      `https://brog-trip-journal-default-rtdb.firebaseio.com/${userId}/entries.json?auth=${token}`
    );
    const resData = await response.json();
    console.log('firebase data ', resData);
    for (const key in resData) {
      loadedEntries.push(
        new Place(
          key,
          resData[key].logBook_Id,
          resData[key].recordType,
          resData[key].title,
          resData[key].date,
          resData[key].description,
          resData[key].imageUri,
          resData[key].address,
          resData[key].lat,
          resData[key].lng
        )
      );
    }
    dispatch({ type: SET_ENTRIES, entries: loadedEntries });
  };
};

export const deleteEntry = entryId => {
  const thunk = async dispatch => {
    // Delete from firebase
    const response = await fetch(
      `https://brog-trip-journal-default-rtdb.firebaseio.com/entries/${entryId}.json`,
      {
        method: 'DELETE',
      }
    );
    if (!response.ok) {
      throw new Error(
        'Something went wrong while deleting an entry on the server!'
      );
    }

    // Delete from database
    try {
      const dbResult = await removeEntry(entryId);
    } catch (error) {
      throw error;
    }

    // Delete from state
    dispatch({ type: DELETE_ENTRY, id: entryId });
  };
  thunk.interceptInOffline = true;
  thunk.meta = {
    retry: true,
  };
  return thunk;
};
