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
    },

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



const SafeArea = ({ children, darkBG }) => {

    return (
        <SafeAreaView style={{ ...styles.androidSafeArea, backgroundColor: darkBG ? "#000" : "#fff" }}>
            {children}
        </SafeAreaView>
    );
}

function convertMenuItem(menuItem, summaryNut = true) {
    const nutritionMapping = {
        calories: 'CAL',
        g_added_sugar: 'SUG',
        g_carbs: 'CARB',
        g_fat: 'FAT',
        g_fiber: 'FIBER',
        g_protein: 'PROT',
        g_saturated_fat: 'SAT FAT',
        g_sugar: 'SUG',
        g_trans_fat: 'TRANS FAT',
        iu_vitamin_a: 'VIT A',
        mcg_vitamin_a: 'VIT A',
        mcg_vitamin_d: 'VIT D',
        mg_calcium: 'CALC',
        mg_cholesterol: 'CHOL',
        mg_iron: 'IRON',
        mg_potassium: 'POT',
        mg_sodium: 'SOD',
        mg_vitamin_c: 'VIT C',
        mg_vitamin_d: 'VIT D',
        re_vitamin_a: 'VIT A',
    };
    const unitsMapping = {
        calories: '',
        g_added_sugar: 'g',
        g_carbs: 'g',
        g_fat: 'g',
        g_fiber: 'g',
        g_protein: 'g',
        g_saturated_fat: 'g',
        g_sugar: 'g',
        g_trans_fat: 'g',
        iu_vitamin_a: 'iu',
        mcg_vitamin_a: 'mcg',
        mcg_vitamin_d: 'mcg',
        mg_calcium: 'mg',
        mg_cholesterol: 'mg',
        mg_iron: 'mg',
        mg_potassium: ',g',
        mg_sodium: ',g',
        mg_vitamin_c: 'mg',
        mg_vitamin_d: 'mg',
        re_vitamin_a: 're',
    };

    const summaryNutritionSlugs = ['calories', 'g_sugar', 'g_carbs', 'g_fat'];

    const convertNutritionInfo = (nutritionInfo) => {
        return nutritionInfo
            .filter(info => info.amount !== null)
            .filter(info => !summaryNut || summaryNutritionSlugs.includes(info.slug))
            .map(info => ({
                label: nutritionMapping[info.slug] || info.slug.replace(/_/g, '').toUpperCase(),
                value: Math.floor(info.amount) + (unitsMapping[info.slug] || ''),
            }));
    };

    return {
        foodName: menuItem.name,
        foodSize: `${menuItem.serving_size.amount} ${menuItem.serving_size.unit}`,
        ingredients: menuItem.ingredients,
        propertySlugs: menuItem.food_properties,
        nutritionalInfos: convertNutritionInfo(menuItem.nutrition_information),
        count: null, // Assuming count is null as it's not provided in the original data
    };
}


const DOMAIN = "jumboappetit-dev.larrys.tech"


export { FontLoader, SafeArea, DOMAIN, convertMenuItem };
