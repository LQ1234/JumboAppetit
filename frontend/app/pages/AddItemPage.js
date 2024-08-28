import React from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import FoodItem from '../components/FoodItem'; // Assuming you have a FoodItem component

const AddItemPage = ({}) => {
    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.addButton}>
                    <Image source={require('../../assets/icons/Plus.png')} style={styles.addIcon} />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Mac and cheese..."
                        placeholderTextColor="#888"
                    />
                    <View style={styles.searchButton}>
                        <Image source={require('../../assets/icons/Search.png')} style={styles.searchIcon} />
                    </View>
                    <View style={styles.underline} />
                </View>
            </View>

            {/* Food Items List */}
            <ScrollView style={styles.scrollView}>
                <View style={styles.itemContainer}>
                    <FoodItem
                        name="Berry Blast Smoothie"
                        description="Fresh Orange Juice (orange juice, water), Whole Strawberries, Wild Blueberries, Raspberries"
                        nutrition={{ CAL: "81", SUG: "14g", CARB: "19g", FAT: "0g" }}
                        properties={['SY', 'SF']}
                    />

                    <FoodItem
                        name="Berry Blast Smoothie"
                        description="Fresh Orange Juice (orange juice, water), Whole Strawberries, Wild Blueberries, Raspberries"
                        nutrition={{ CAL: "81", SUG: "14g", CARB: "19g", FAT: "0g" }}
                        properties={['SY', 'SF']}
                    />
                </View>

                {/* Add more FoodItem components as needed */}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        height: "100%",
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    addButton: {
        marginRight: 10,
    },
    addIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative', // Ensure the underline is positioned correctly
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 5,
        color: '#000',
    },
    searchButton: {
        marginLeft: 10,
    },
    searchIcon: {
        width: 20,
        height: 20,
        tintColor: '#000',
    },
    underline: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#888',
    },
    scrollView: {
        flex: 1,
    },
    itemContainer: {
        gap: 10
    }
});

export default AddItemPage;
