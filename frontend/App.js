import * as React from 'react';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './app/login'
import CalendarScreen from './app/month'
import DishScreen from './app/dish'
import CameraScreen from './app/camera'
import FontLoader from './app/loadFonts'

function HomeScreen({ navigation }) {
  return (
    <FontLoader>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>
          Welcome to JumboAppetit. Ready to get started?
        </Text>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />
        <Button
          title="Menu!"
          onPress={() => navigation.navigate('Month')}
        />
        <Button
          title="Camera"
          onPress={() => navigation.navigate('Camera')}
        />
      </View>
    </FontLoader>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'JumboAppetit' }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Month" component={CalendarScreen} />
        <Stack.Screen name="Dish" component={DishScreen} />
        <Stack.Screen name="Camera" component={CameraScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  mainTitle: {
    // flex: 1,
    justifyContent: "center",
    padding: 20,
    // maxWidth: 960,
    // marginHorizontal: "auto",
    fontSize: 26,
    color: "#38434D",
    fontFamily: 'ShortStack-Regular'
  },
});


export default App;