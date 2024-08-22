import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FoodProperties from './FoodProperties';
import NutritionalInfos from './NutritionalInfos';
import Dial from './Dial';

const FoodItem = () => {
    const foodName = "Berry Blast Smoothie";
    const foodSize = "8 oz";
    const ingredients = "Fresh Orange Juice (orange juice, water), Whole Strawberries, Wild Blueberries, Raspberries";
    const properties = ["SY", "SF"];
    const nutritionalInfos = [
        { label: "CAL", value: "81" },
        { label: "SUG", value: "14g" },
        { label: "CARB", value: "19g" },
        { label: "FAT", value: "0g" },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.foodName}>{foodName}</Text>
                    <Text style={styles.foodSize}>({foodSize})</Text>
                    <FoodProperties properties={properties} />

                </View>
                <Text style={styles.ingredients}>{ingredients}</Text>
                <NutritionalInfos infos={nutritionalInfos} />
            </View>
            <Dial />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 8,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        marginBottom: 5,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline'
    },
    infoContainer: {
        flex: 1,
        marginRight: 10,
    },
    foodName: {
        fontSize: 16,
    },
    foodSize: {
        fontSize: 14,
        marginHorizontal: 5,
    },
    ingredients: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        marginBottom: 10,
    },
});

export default FoodItem;
