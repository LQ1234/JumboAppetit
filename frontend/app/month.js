import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { format } from 'date-fns';
import axios from "axios";

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
    // TODO
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://jumboappetit.larrys.tech/api/menu/monthly-view/{location-slug}/{menu-type-slug}/2024/2?location_slug=dewick-dining&menu_type_slug=lunch", {});
        console.log(response.data);

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
  console.log(enabledDays)

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <CalendarPicker
        selectedStartDate={selectedDate}
        onDateChange={handleDateChange}
        disabledDates={date => !(enabledDays.includes(date.toISOString().split('T')[0]))}
      />
      {selectedDate && (
        <View style={{ marginTop: 20 }}>
          <Text>Selected Date: {format(selectedDate, 'yyyy-MM-dd')}</Text>
        </View>
      )}
    </View>
  );
};

export default CalendarScreen;
