import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { format, addDays } from 'date-fns';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarData, setCalendarData] = useState([]);

  // Simulated API response
  const apiResponse = [
    { "day": "2024-01-18", "has_menu_items": true },
    { "day": "2024-01-19", "has_menu_items": true },
    { "day": "2024-02-03", "has_menu_items": true },
    { "day": "2024-02-07", "has_menu_items": true },
  ];

  useEffect(() => {
    // Process the API response and update state
    setCalendarData(apiResponse);
    setInitialSelectedDate(apiResponse);
  }, []);

  const disabledDates = createDisabledDates(calendarData);

  const setInitialSelectedDate = (data) => {
    if (data.length > 0) {
      const startDate = new Date(data[0].day);
      setSelectedDate(startDate);
    }
  };

  const handleDateChange = (date) => {
    // Additional logic or actions on date change if needed
    setSelectedDate(date);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <CalendarPicker
        selectedStartDate={selectedDate}
        onDateChange={handleDateChange}
        disabledDates={disabledDates}
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

const createDisabledDates = (calendarData) => {
  const disabledDates = [];

  if (calendarData.length > 0) {
    const startDate = new Date(calendarData[0].day);
    const endDate = addDays(startDate, 31);

    // Generate an array of all dates in the range
    const allDatesInRange = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      allDatesInRange.push(currentDate);
      currentDate = addDays(currentDate, 1);
    }

    // Filter dates that are not in the JSON response and add them to disabledDates
    const missingDates = allDatesInRange.filter(
      (date) => !calendarData.some((item) => new Date(item.day).getTime() === date.getTime())
    );

    disabledDates.push(...missingDates.map((date) => format(date, 'yyyy-MM-dd')));
  }

  return disabledDates;
};
