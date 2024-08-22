
import React, { useState, useEffect } from 'react';
import { View } from "react-native";
import axios from "axios";

import DropDownPicker from 'react-native-dropdown-picker';

const LocationMenuPicker = ({ onLocationMenuChange }) => {
    const [apiData, setApiData] = useState([]);

    const [locationOpen, setLocationOpen] = useState(false);
    const [locationValue, setLocationValue] = useState(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuValue, setMenuValue] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://jumboappetit.larrys.tech/api/menu/locations');
                const data = response.data;
                setApiData(data);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const displayableLocations = apiData.filter(entry => entry.displayed);
    const locationItems = displayableLocations.map(entry => ({
        value: entry.slug,
        label: entry.name,
    }));
    const locationDisabled = locationItems.length === 0;

    useEffect(() => {
        if (!locationDisabled && !locationValue) {
            setLocationValue(locationItems[0].value);
        }
    }, [locationItems, locationValue, locationDisabled]);

    let menuItems = [];
    if (locationValue) {
        const location = apiData.find(entry => entry.slug === locationValue);
        if (location) {
            menuItems = location.menu_types.map(entry => ({
                value: entry.slug,
                label: entry.name,
            }));
        }
    }
    const menuDisabled = menuItems.length === 0;
    useEffect(() => {
        if (!menuDisabled && !menuValue) {
            setMenuValue(menuItems[0].value);
            onLocationMenuChange(locationValue, menuValue);
        }
    }, [menuItems, menuValue, menuDisabled]);


    return (
        <View
            style={{
                flexDirection: 'row',
                // flex: 1,
                zIndex: 1000,
                flexShrink : 1,
            }}>
            <View style={{ width:"60%" }}>
            <DropDownPicker
                open={locationOpen}
                value={locationValue}
                items={locationItems}
                setOpen={setLocationOpen}
                onOpen={() => setMenuOpen(false)}
                setValue={setLocationValue}
                setItems={setLocationValue}
                disabled={locationDisabled}
                disabledStyle={{ backgroundColor: '#f5f5f5' }}
            />
            </View>

            <View style={{ width:"40%" }}>

            <DropDownPicker
                open={menuOpen}
                value={menuValue}
                items={menuItems}
                setOpen={setMenuOpen}
                onOpen={() => setLocationOpen(false)}
                setValue={setMenuValue}
                setItems={setMenuValue}
                disabled={menuDisabled}
                disabledStyle={{ backgroundColor: '#f5f5f5' }}
                onChangeValue={(value) => onLocationMenuChange(locationValue, value)}
            />
            </View>
        </View>
    );
};

export default LocationMenuPicker;