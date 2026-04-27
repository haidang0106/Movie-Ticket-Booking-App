import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OtpScreen from '../screens/OtpScreen';
import UsernameScreen from '../screens/UsernameScreen';
import HomeScreen from '../screens/home/HomeScreen';
import TicketScreen from '../screens/ticket/TicketScreen';
import MovieScreen from '../screens/movie/MovieScreen';
import MovieDetailScreen from '../screens/movie/MovieDetailScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

export type RootStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Otp: { phoneNumber: string };
  Username: undefined;
  Home: undefined;
  Ticket: undefined;
  Movie: undefined;
  MovieDetail: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
          animation: 'none', // For instant bottom nav switching
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="Username" component={UsernameScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Ticket" component={TicketScreen} />
        <Stack.Screen name="Movie" component={MovieScreen} />
        <Stack.Screen name="MovieDetail" component={MovieDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
