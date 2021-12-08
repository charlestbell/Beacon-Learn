import React from 'react';
import { useSelector } from 'react-redux';

import { LogBookNavigator, AuthNavigator } from './LogBookNavigator';
import StartupScreen from '../screens/StartupScreen';

const AppNavigator = () => {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

  return (
    <>
      {isAuth && <LogBookNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </>
  );
};

export default AppNavigator;
