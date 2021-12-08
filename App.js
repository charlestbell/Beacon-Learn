import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { composeWithDevTools } from 'redux-devtools-extension';
import ReduxThunk from 'redux-thunk';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import logBooksReducer from './store/reducers/logBooks-reducer';
import authReducer from './store/reducers/auth-reducer';

// This init function caused the Jest tests to not run.
//This will be commented out, until Expo-SQLite comes up with a fix.

let composedMiddleWare = compose(applyMiddleware(ReduxThunk));

const rootReducer = combineReducers({
  logBooks: logBooksReducer,
  auth: authReducer,
});

export const store = createStore(rootReducer, composedMiddleWare);

const fetchFonts = () => {
  return Font.loadAsync({
    abhaya: require('./assets/fonts/AbhayaLibre-Regular.ttf'),
    'abhaya-bold': require('./assets/fonts/AbhayaLibre-Bold.ttf'),
  });
};

const App = () => {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
        onError={() => {}}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
