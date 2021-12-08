import AsyncStorage from '@react-native-async-storage/async-storage';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;

export const setDidTryAL = () => {
  return {
    type: SET_DID_TRY_AL,
  };
};

export const authenticate = (userId, token, expiryTime) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, userId: userId, token: token });
  };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expireyMilisec) => {
  const expirationDate = new Date(
    new Date().getTime() + parseInt(expireyMilisec) * 1000
  );
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

export const signup = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBM7HNZF4CPMEjPa2Mk99SGfxPJ4VyAj_M',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error.message;
      console.log('error message ', errorResData);

      let message = 'Something went wrong!';
      switch (errorId) {
        case 'EMAIL_EXISTS':
          message = 'This email exists already!';
          break;
        case 'INVALID_EMAIL':
          message = 'Please enter a valid email';
          break;
        case 'MISSING_PASSWORD':
          message = 'Please enter a password';
          break;
        default:
          break;
      }

      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    saveDataToStorage(resData.idToken, resData.localId, resData.expiresIn);
  };
};

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBM7HNZF4CPMEjPa2Mk99SGfxPJ4VyAj_M',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      console.log(errorResData);
      const errorId = errorResData.error.message;
      let message = 'Something went wrong signing in!';
      switch (errorId) {
        case 'INVALID_EMAIL':
          message = 'This email address could not be found';
          break;
        case 'INVALID_PASSWORD':
          message = 'Incorrect password';
          break;
        case 'MISSING_PASSWORD':
          message = 'Please enter a password';
          break;
        default:
          break;
      }

      throw new Error(message);
    }

    const resData = await response.json();

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    );
    saveDataToStorage(resData.idToken, resData.localId, resData.expiresIn);
  };
};
