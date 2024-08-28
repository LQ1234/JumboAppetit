import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import {useWindowDimensions} from 'react-native';
import { DOMAIN, convertMenuItem } from '../utils';
import axios from 'axios';


import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const MenuPage = ({ setCurrentPage }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [expandedSections, setExpandedSections] = useState({});
    const notificationSheetRef = useRef(null);
    const aboutSheetRef = useRef(null);
    const {width} = useWindowDimensions();


    const onDateChange = (date) => {
        setSelectedDate(date);
    };

    calendarWidth = width - 40;

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


    
    const [location, setLocation] = useState(null);
    const [time, setTime] = useState(null);
    const onLocationTimeChange = (location, time) => {
        setLocation(location);
        setTime(time);
    }

    const [month, setMonth] = useState(new Date());
    const [monthlyViewData, setMonthlyViewData] = useState([]);
    const [monthlyViewDataUpdateTime, setMonthlyViewDataUpdateTime] = useState(null);
    const onMonthChange = (month) => {
        setMonth(month);
    }
    useEffect(() => {
        const fetchData = async () => {
            const updateTime = new Date();
            setMonthlyViewDataUpdateTime(updateTime);
            try {
                if (!location || !time || !month) {
                    return;
                }

                const url = `https://${DOMAIN}/api/menu/monthly-view/{location-slug}/{menu-type-slug}/${month.getUTCFullYear()}/${month.getUTCMonth() + 1}?location_slug=${location}&menu_type_slug=${time}`;
                const response = await axios.get(url);
                const data = response.data;
                if (updateTime < monthlyViewDataUpdateTime) {
                    return;
                }
                setMonthlyViewData(data);
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [location, time, month.getUTCFullYear(), month.getUTCMonth()]);
    let enabledDays = [];
    for (let i = 0; i < monthlyViewData.length; i++) {
        if (monthlyViewData[i].has_menu_items)
            enabledDays.push(monthlyViewData[i].day);
    }

    useEffect(() => {
        if (enabledDays.length == 0) {
            return;
        }
        if (selectedDate.toISOString().split('T')[0] in enabledDays) {
            return;
        }
        if(selectedDate.getUTCFullYear() != month.getUTCFullYear() || selectedDate.getUTCMonth() != month.getUTCMonth()) {
            return;
        }
        // get date closest to selected date
        let closest = enabledDays[0];
        let closestDiff = Math.abs(selectedDate.getTime() - new Date(closest).getTime());
        for (let i = 1; i < enabledDays.length; i++) {
            let diff = Math.abs(selectedDate.getTime() - new Date(enabledDays[i]).getTime());
            if (diff < closestDiff) {
                closest = enabledDays[i];
                closestDiff = diff;
            }
        }
        setSelectedDate(new Date(closest));
    }, [JSON.stringify(enabledDays), selectedDate.toISOString().split('T')[0], month.getUTCFullYear(), month.getUTCMonth()]);


    const [dailyViewData, setDailyViewData] = useState(null);
    const [dailyViewDataUpdateTime, setDailyViewDataUpdateTime] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const updateTime = new Date();
            setDailyViewDataUpdateTime(updateTime);
            try {
                // setMonthlyViewData([]);
                if (!location || !time || !selectedDate) {
                    return;
                }


                const url = `https://${DOMAIN}/api/menu/daily-menu/{location-slug}/{menu-type-slug}/${selectedDate.getUTCFullYear()}/${selectedDate.getUTCMonth() + 1}/${selectedDate.getUTCDate()}?location_slug=${location}&menu_type_slug=${time}`;
                const response = await axios.get(url);
                const data = response.data;
                if (updateTime < dailyViewDataUpdateTime) {
                    return;
                }
                setDailyViewData(data);
                setExpandedSections({});
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [location, time, selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()]);
    
    let sections = [];

    if (dailyViewData) {
        for (let i = 0; i < dailyViewData.sections.length; i++) {
            let section = dailyViewData.sections[i];
            let items = [];
            for (let j = 0; j < section.menu_items.length; j++) {
                let item = convertMenuItem(section.menu_items[j].menu_item);
                items.push(item);
            }
            sections.push({
                title: section.name,
                items: items,
            });
        }
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <TooltipProvider>
                <FontLoader>
                    <SafeArea>
                        <View style={styles.container}>
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
                            <LocationTimePicker onLocationTimeChange={onLocationTimeChange}/>

                            {/* Calendar Picker */}
                            {calendarWidth > 0 && (
                                <Calendar
                                    onDateChange={onDateChange}
                                    selectedDate={selectedDate}
                                    calendarWidth={calendarWidth}
                                    onMonthChange={onMonthChange}
                                    disabledDates={date => !(enabledDays.includes(date.toISOString().split('T')[0]))}

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
                            <BottomNavbar setCurrentPage={setCurrentPage} activeTab="menu" />
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
                                <AboutPage setCurrentPage={setCurrentPage}/>
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
