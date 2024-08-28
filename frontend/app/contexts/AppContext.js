import React, { createContext, useState, useEffect, useRef } from 'react';
import { DOMAIN } from '../utils';
import axios from 'axios';

export const AppContext = createContext();
export const AppProvider = ({children}) => {
    const [locationsData, setLocationsData] = useState(null);
    const [foodPropertiesData, setFoodPropertiesData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${DOMAIN}/api/menu/locations`);
                const data = response.data;
                setLocationsData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`https://${DOMAIN}/api/menu/food-properties`);
                const data = response.data;
                setFoodPropertiesData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <AppContext.Provider value={{ locationsData, foodPropertiesData }}>
            {children}
        </AppContext.Provider>
    );

}