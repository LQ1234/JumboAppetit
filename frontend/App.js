import * as React from 'react';

import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginPage from './app/pages/LoginPage';
import FeedPage from './app/pages/FeedPage';
import MenuPage from './app/pages/MenuPage';
import CameraPage from './app/pages/CameraPage';
import VisionPage from './app/pages/VisionPage';
import PostPage from './app/pages/PostPage';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="post" 
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="login"
          component={LoginPage}
        />
        <Stack.Screen
          name="feed"
          component={FeedPage}
        />
        <Stack.Screen
          name="menu"
          component={MenuPage}
        />
        <Stack.Screen
          name="camera"
          component={CameraPage}
        />
        <Stack.Screen
          name="vision"
          component={VisionPage}
        />
        <Stack.Screen
          name="post"
          component={PostPage}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;