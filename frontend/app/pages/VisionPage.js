import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { FontLoader, SafeArea } from '../utils';
import FoodItem from '../components/FoodItem'; // Import the FoodItem component
import NutritionalInfos from '../components/NutritionalInfos'; // Import the NutritionalInfos component
import Divider from '../components/Divider'; // Import the Divider component
import { TooltipProvider } from '../components/TooltipContext'; // Import the TooltipProvider component
import TooltipOverlay from '../components/TooltipOverlay'; // Import the TooltipOverlay component
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import AddItemPage from './AddItemPage'; // Import the AddItemPage component
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const VisionPage = ({ navigation }) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    const bottomSheetRef = useRef(null);

    // Simulate loading for demonstration purposes
    useEffect(() => {
        const timer = setTimeout(() => setHasLoaded(true), 500); // Simulate a loading time
        return () => clearTimeout(timer);
    }, []);

    const openAddItemSheet = () => {
        bottomSheetRef.current?.expand();
    };

    // Return early while loading
    if (!hasLoaded) {
        return (
            <View style={styles.container}>
                <SafeArea>
                    {/* Header with Back Button and Title */}
                    <View style={styles.headerContainer}>
                        {/* Back Button */}
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Image source={require('../../assets/icons/Arrow left.png')} style={styles.backIcon} />
                        </TouchableOpacity>

                        {/* Title */}
                        <Text style={styles.title}>Post</Text>
                    </View>

                    {/* Image Placeholder */}
                    <View style={styles.imagePlaceholder} />

                    {/* Loading Indicator */}
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#000" />
                        <Text style={styles.loadingText}>Identifying menu items...</Text>
                    </View>
                </SafeArea>
            </View>
        );
    }

    // Main content after loading
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TooltipProvider>
                <FontLoader>
                    <SafeArea>
                        <View style={styles.innerContainer}>
                            {/* Header with Back Button and Title */}
                            <View style={styles.headerContainer}>
                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                    <Image source={require('../../assets/icons/Arrow left.png')} style={styles.backIcon} />
                                </TouchableOpacity>

                                <Text style={styles.title}>Post</Text>

                                <TouchableOpacity style={styles.forwardButton} onPress={() => navigation.navigate('NextScreen')}>
                                    <Image source={require('../../assets/icons/Arrow right.png')} style={styles.forwardIcon} />
                                </TouchableOpacity>
                            </View>

                            {/* Image Placeholder */}
                            <View style={styles.imagePlaceholder} />

                            {/* Loaded Content */}
                            <View style={styles.loadedContent}>
                                <View style={styles.foodItemContainer}>
                                    <FoodItem
                                        name="Berry Blast Smoothie"
                                        description="Fresh Orange Juice (orange juice, water), Whole Strawberries, Wild Blueberries, Raspberries"
                                        nutrition={[
                                            { label: "CAL", value: "81" },
                                            { label: "SUG", value: "14g" },
                                            { label: "CARB", value: "19g" },
                                            { label: "FAT", value: "0g" },
                                        ]}
                                        properties={['SY', 'SF']}
                                    />

                                    <Divider />

                                    <View style={styles.totalContainer}>
                                        <Text style={styles.totalLabel}>Total:</Text>
                                        <NutritionalInfos
                                            infos={[
                                                { label: "CAL", value: "81" },
                                                { label: "SUG", value: "14g" },
                                                { label: "CARB", value: "19g" },
                                                { label: "FAT", value: "0g" },
                                            ]}
                                        />
                                    </View>

                                    <View style={styles.addButtonContainer}>
                                        <TouchableOpacity style={styles.addButton} onPress={openAddItemSheet}>
                                            <Text style={styles.addButtonText}>+ Add Item</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </SafeArea>
                    <TooltipOverlay />

                    {/* Bottom Sheet for Add Item */}
                    <BottomSheet
                        ref={bottomSheetRef}
                        index={-1} // Initially hidden
                        snapPoints={['80%']}
                        enablePanDownToClose={true} // Enable closing by dragging down
                    >
                        <BottomSheetView style={styles.bottomSheetContent}>
                            <AddItemPage />
                        </BottomSheetView>
                    </BottomSheet>
                </FontLoader>
            </TooltipProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    innerContainer: {
        paddingHorizontal: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 20,
        paddingBottom: 10,
    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
    },
    forwardButton: {
        marginLeft: 10,
    },
    forwardIcon: {
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    imagePlaceholder: {
        width: "100%",
        flex: 0,
        backgroundColor: '#D3D3D3',
        aspectRatio: 1,
        marginBottom: 20,
    },
    loadingContainer: {
        alignItems: 'center',
        marginBottom: 30,
        flex: 1,
        justifyContent: "center",
    },
    loadingText: {
        fontSize: 16,
        color: '#000',
        marginTop: 10,
    },
    loadedContent: {},
    foodItemContainer: {},
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    totalLabel: {
        fontWeight: '600',
        marginRight: 10,
    },
    addButtonContainer: {
        alignItems: 'center',
    },
    addButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    addButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
    bottomSheetContent: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});

export default VisionPage;
