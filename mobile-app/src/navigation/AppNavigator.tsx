import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OtpScreen from '../screens/OtpScreen';
import UsernameScreen from '../screens/UsernameScreen';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Otp: { phoneNumber: string };
  Username: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Username" component={UsernameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
