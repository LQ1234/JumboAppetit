import React, { useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { FontLoader, SafeArea } from '../utils';
import LocationTimePicker from '../components/LocationTimePicker';
import BottomNavbar from '../components/BottomNavbar';
import { TooltipProvider } from '../components/TooltipContext';
import TooltipOverlay from '../components/TooltipOverlay';
import Divider from '../components/Divider';
import FoodItem from '../components/FoodItem';
import Calendar from '../components/Calendar';
import NotificationsPage from './NotificationsPage';
import AboutPage from './AboutPage';

import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const MenuPage = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [calendarWidth, setCalendarWidth] = useState(0);
    const [expandedSections, setExpandedSections] = useState({});
    const notificationSheetRef = useRef(null);
    const aboutSheetRef = useRef(null);

    const onDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleLayout = (event) => {
        const { width } = event.nativeEvent.layout;
        setCalendarWidth(width - 40);
    };

    const toggleSection = (section) => {
        setExpandedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };

    const openNotificationSheet = () => {
        aboutSheetRef.current?.close();
        notificationSheetRef.current?.expand();
    };

    const openAboutSheet = () => {
        notificationSheetRef.current?.close();

        aboutSheetRef.current?.expand();
    };

    const sections = [
        {
            title: 'Breakfast Entrees',
            items: [
                {
                    name: 'Berry Blast Smoothie',
                    description: 'Fresh Orange Juice, Whole Strawberries, Wild Blueberries, Raspberries',
                    nutrition: { calories: 81, sugar: '14g', carbs: '19g', fat: '0g' },
                    properties: ['SY', 'SF'],
                },
                // Add more items as needed
            ],
        },
        {
            title: 'Breakfast Grain',
            items: [
                {
                    name: 'Oatmeal',
                    description: 'Whole grain oats, water, salt',
                    nutrition: { calories: 150, sugar: '1g', carbs: '27g', fat: '2g' },
                    properties: ['V', 'GF'],
                },
                // Add more items as needed
            ],
        },
        {
            title: 'Breakfast Protein',
            items: [
                {
                    name: 'Scrambled Eggs',
                    description: 'Fresh eggs, milk, salt, pepper',
                    nutrition: { calories: 200, sugar: '2g', carbs: '2g', fat: '14g' },
                    properties: ['GF'],
                },
                // Add more items as needed
            ],
        },
    ];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TooltipProvider>
                <FontLoader>
                    <SafeArea>
                        <View style={styles.container} onLayout={handleLayout}>
                            {/* Header */}
                            <View style={styles.headerContainer}>
                                <TouchableOpacity onPress={openAboutSheet}>
                                    <Image
                                        source={require('../../assets/icons/Help circle.png')}
                                        style={styles.headerIcon}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>Menus</Text>
                                <TouchableOpacity onPress={openNotificationSheet}>
                                    <Image
                                        source={require('../../assets/icons/Bell.png')}
                                        style={styles.headerIcon}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Location and Time Picker */}
                            <LocationTimePicker />

                            {/* Calendar Picker */}
                            {calendarWidth > 0 && (
                                <Calendar
                                    onDateChange={onDateChange}
                                    selectedDate={selectedDate}
                                    calendarWidth={calendarWidth}
                                />
                            )}

                            <Divider />

                            <ScrollView style={styles.scrollView}>
                                {/* Accordions */}
                                {sections.map((section, index) => (
                                    <View key={index} style={styles.accordionContainer}>
                                        <TouchableOpacity
                                            style={styles.accordionHeader}
                                            onPress={() => toggleSection(section.title)}
                                        >
                                            <Text style={styles.accordionTitle}>{section.title}</Text>
                                            <Image
                                                source={require('../../assets/icons/chevron-down.png')}
                                                style={[
                                                    styles.accordionIcon,
                                                    expandedSections[section.title] && { transform: [{ rotate: '180deg' }] },
                                                ]}
                                            />
                                        </TouchableOpacity>

                                        {expandedSections[section.title] && (
                                            <View style={styles.accordionContent}>
                                                {section.items.map((item, itemIndex) => (
                                                    <View key={itemIndex} style={styles.itemContainer}>
                                                        <FoodItem {...item} />
                                                    </View>
                                                ))}
                                            </View>
                                        )}
                                    </View>
                                ))}
                            </ScrollView>
                        </View>

                        <View style={styles.navbarContainer}>
                            <BottomNavbar navigation={navigation} />
                        </View>
                        <TooltipOverlay />

                        {/* Bottom Sheet for Notifications */}
                        <BottomSheet
                            ref={notificationSheetRef}
                            index={-1} // Initially hidden
                            snapPoints={useMemo(() => ['80%'], [])}
                            enablePanDownToClose={true} // Enable closing by dragging down
                        >
                            <BottomSheetView style={styles.bottomSheetContent}>
                                <NotificationsPage />
                            </BottomSheetView>
                        </BottomSheet>

                        {/* Bottom Sheet for About */}
                        <BottomSheet
                            ref={aboutSheetRef}
                            index={-1} // Initially hidden
                            snapPoints={useMemo(() => ['80%'], [])}
                            enablePanDownToClose={true} // Enable closing by dragging down
                        >
                            <BottomSheetView style={styles.bottomSheetContent}>
                                <AboutPage />
                            </BottomSheetView>
                        </BottomSheet>
                    </SafeArea>
                </FontLoader>
            </TooltipProvider>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '600',
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    navbarContainer: {
        justifyContent: 'flex-end',
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    accordionIcon: {
        width: 16,
        height: 16,
    },
    accordionContent: {
        paddingHorizontal: 10,
    },
    accordionContainer: {
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 10,
    },
    itemContainer: {
        marginBottom: 8,
    },
    scrollView: {
        flex: 1,
    },
    bottomSheetContent: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
});

export default MenuPage;
