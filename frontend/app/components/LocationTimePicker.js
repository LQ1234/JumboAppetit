import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { AppContext } from '../contexts/AppContext';

const CustomDropdown = ({ iconSource, selectedValue, items, onSelect, isOpen, setIsOpen, closeOtherDropdown, disabled }) => {
    
    
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
        closeOtherDropdown();
    };

    const handleSelect = (value) => {
        onSelect(value);
        setIsOpen(false);
    };

    return (
        <View style={styles.dropdownContainer}>
            <TouchableOpacity style={styles.pickerContainer} onPress={toggleDropdown} disabled={disabled}>
                <Image source={iconSource} style={styles.icon} />
                <Text style={styles.pickerText}>{selectedValue}</Text>
                <Image source={require('../../assets/icons/Chevron down.png')} style={styles.dropdownIcon} />
            </TouchableOpacity>
            {isOpen && (
                <View style={styles.dropdown}>
                    {items.map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={styles.dropdownItem}
                            onPress={() => handleSelect(item)}
                        >
                            <Text style={styles.dropdownItemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const LocationTimePicker = ({ includeAll, onLocationTimeChange }) => {

    const {locationsData, foodPropertiesData} = useContext(AppContext);

    const [locationOpen, setLocationOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Dewick');
    const [selectedTime, setSelectedTime] = useState('All');

    const closeDropdowns = () => {
        setLocationOpen(false);
        setTimeOpen(false);
    };

    let locationItems = [];
    let timeItems = [];
    let disabled = false;


    if (locationsData) {
        for (const location of locationsData) {
            if (location.displayed) {
                locationItems.push(location.name);
                if (location.name === selectedLocation) {
                    for (const time of location.menu_types) {
                        timeItems.push(time.name);
                    }
                }
            }
        }
        if (includeAll) {
            locationItems.unshift('All');
            timeItems.unshift('All');
        }

    } else {
        locationItems = ["Loading..."];
        timeItems = ["Loading..."];
        disabled = true;
    }

    useEffect(() => {
        if (!locationItems.includes(selectedLocation)) {
            setSelectedLocation(locationItems[0]);
        }
        if (!timeItems.includes(selectedTime)) {
            setSelectedTime(timeItems[0]);
        }
    }, [locationItems, selectedLocation, timeItems, selectedTime]);

    useEffect(() => {
        // get slug for name
        let locationSlug = null, timeSlug = null;
        if (locationsData == null) return;

        for (const location of locationsData) {
            if (location.name === selectedLocation) {
                locationSlug = location.slug;
                for (const time of location.menu_types) {
                    if (time.name === selectedTime) {
                        timeSlug = time.slug;
                        break;
                    }
                }
                break;
            }
        }
        if (locationSlug == null) return;

        onLocationTimeChange(locationSlug, timeSlug);

    }, [selectedLocation, selectedTime, onLocationTimeChange]);

    return (
        <TouchableWithoutFeedback onPress={closeDropdowns}>
            <View style={styles.container}>
                <CustomDropdown
                    iconSource={require('../../assets/icons/Map pin.png')}
                    selectedValue={selectedLocation}
                    items={locationItems}
                    onSelect={setSelectedLocation}
                    isOpen={locationOpen}
                    setIsOpen={setLocationOpen}
                    closeOtherDropdown={() => setTimeOpen(false)}
                    disabled={disabled}
                />
                <CustomDropdown
                    iconSource={require('../../assets/icons/Clock.png')}
                    selectedValue={selectedTime}
                    items={timeItems}
                    onSelect={setSelectedTime}
                    isOpen={timeOpen}
                    setIsOpen={setTimeOpen}
                    closeOtherDropdown={() => setLocationOpen(false)}
                    disabled={disabled}

                />
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'stretch',
        alignItems: 'center',
        paddingVertical: 5,
        gap: 5,
        width: '100%',
        zIndex: 100,
    },
    dropdownContainer: {
        position: 'relative',
        flex: 1,
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 3,
        padding: 5,
        justifyContent: 'space-between',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 5,
    },
    pickerText: {
        fontSize: 16,
        color: '#000',
        flex: 1,
    },
    dropdownIcon: {
        width: 15,
        height: 15,
    },
    dropdown: {
        position: 'absolute',
        top: 32,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 3,
        zIndex: 2000,
    },
    dropdownItem: {
        padding: 5,
        paddingLeft: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#000',
    },
});

export default LocationTimePicker;
