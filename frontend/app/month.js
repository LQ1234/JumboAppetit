import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import axios from "axios";
import Daily from './daily';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState([]);

  const setInitialSelectedDate = (data) => {
    if (data.length > 0) {
      const firstDay = data.reduce((min, item) => (item.day < min ? item.day : min), data[0].day);
      const startDate = new Date(firstDay);
      setSelectedDate(startDate);
      // console.log(startDate)
    }
  };

  const enabledDates = (availableDays) => {
    return availableDays.map(item => item.day);
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://jumboappetit.larrys.tech/api/menu/monthly-view/{location-slug}/{menu-type-slug}/2024/2?location_slug=dewick-dining&menu_type_slug=lunch", {});
        // console.log(response.data);

        const apiResponse = response.data;

        // Process the API response and update state
        setCalendarData(apiResponse);
        setInitialSelectedDate(apiResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function

  }, []);

  const enabledDays = enabledDates(calendarData)
  // console.log(enabledDays)

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <CalendarPicker
        selectedStartDate={selectedDate}
        onDateChange={handleDateChange}
        disabledDates={date => !(enabledDays.includes(date.toISOString().split('T')[0]))}
      />
      {selectedDate && 
        <ScrollView style={styles.dailyContainer}>
          <Daily date={selectedDate} location="dewick-dining" menu_type="dinner" />
        </ScrollView>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  dailyContainer: {
    flex: 1,
    paddingTop: 10,
    // flexGrow: 1
  },
});

export default CalendarScreen;
