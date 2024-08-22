import React, { useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      fontFamily: 'Roboto-Regular',
    },
    androidSafeArea: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "white"
    }
});


const FontLoader = ({ children }) => {
  SplashScreen.preventAutoHideAsync();

  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'CourierPrime-Regular': require('../assets/fonts/CourierPrime-Regular.ttf'),
    'CourierPrime-Bold': require('../assets/fonts/CourierPrime-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {children}
    </View>
  );
};



const SafeArea = ({ children }) => {
  return (
    <SafeAreaView style={styles.androidSafeArea}>
        {children}
    </SafeAreaView>
  );
}

export {FontLoader, SafeArea};
