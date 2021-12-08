import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import NewPlaceScreen, {
  screenOptions as NewPlaceScreenOptions,
} from '../screens/NewPlaceScreen';
import AuthScreen, {
  screenOptions as authScreenOptions,
} from '../screens/AuthScreen';

import Colors from '../constants/Colors';

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary[4] : '',
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary[4],
};

const TripStack = createStackNavigator();

export const LogBookNavigator = () => {
  return (
    <TripStack.Navigator>
      <TripStack.Screen
        name="Entries"
        component={NewPlaceScreen}
        options={NewPlaceScreenOptions}
      />
    </TripStack.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};
