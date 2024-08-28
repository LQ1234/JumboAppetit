import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FoodItem from '../components/FoodItem'; // Assuming you have a FoodItem component

const NotificationsPage = () => {
    const foodItemData = {
        name: 'Berry Blast Smoothie',
        description: 'Fresh Orange Juice (orange juice, water), Whole Strawberries, Wild Blueberries, Raspberries',
        nutrition: { calories: 81, sugar: '14g', carbs: '19g', fat: '0g' },
        properties: ['SY', 'SF'],
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Get notified every time your favorite item is on the menu</Text>
            {/* <FoodItem {...foodItemData} /> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 0,
        backgroundColor: '#fff', // Ensure background is white
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
        color: '#000', // Ensure text is black
    },
    headerSubtitle: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },

});

export default NotificationsPage;
