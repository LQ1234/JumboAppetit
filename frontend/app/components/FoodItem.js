import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FoodProperties from './FoodProperties';
import NutritionalInfos from './NutritionalInfos';
import Dial from './Dial';

const FoodItem = ({foodName, foodSize, ingredients, propertySlugs, nutritionalInfos, count, setCount}) => {

    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.foodName}>{foodName}</Text>
                    <Text style={styles.foodSize}>{foodSize}</Text>
                    <FoodProperties propertySlugs={propertySlugs} />

                </View>
                <Text style={styles.ingredients} numberOfLines = {2}>{ingredients}</Text>
                <NutritionalInfos infos={nutritionalInfos} />
            </View>
            {count == null ? null : <Dial count={count} setCount={setCount} />}
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
        maxWidth: "77%"
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
