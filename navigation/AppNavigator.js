import React from 'react';
import { useSelector } from 'react-redux';

import StartupScreen from '../screens/StartupScreen';
import VotingScreen from '../screens/VotingScreen/VotingScreen';

const AppNavigator = () => {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

  return (
    <>
      <VotingScreen />
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </>
  );
};

export default AppNavigator;
