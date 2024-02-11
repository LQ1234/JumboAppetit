import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from "react-native";
import CalendarPicker from 'react-native-calendar-picker';
import axios from "axios";
import Daily from './daily';
import DropDownPicker from 'react-native-dropdown-picker';

const Dropdown = ({ onLocationChange }) => {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://jumboappetit.larrys.tech/api/menu/locations');
        const data = response.data;

        const displayable = data.filter(entry => entry.displayed);
        const options = displayable.map(entry => ({
            value: entry.slug,
            label: entry.name,
        }));

        setItems(options);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onSelectItem={(item) => {
        onLocationChange(item.value);
        console.log("changed!", item.value)
      }}
    />
  );
};

const Calendar = ({ location }) => {
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
        const apiUrl = `https://jumboappetit.larrys.tech/api/menu/monthly-view/{location-slug}/{menu-type-slug}/2024/2?location_slug=${location}&menu_type_slug=dinner`;
        console.log(apiUrl)
        const response = await axios.get(apiUrl, {});
        // console.log(response.data);

        const apiResponse = response.data;

        setCalendarData(apiResponse);
        setInitialSelectedDate(apiResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function

  }, [location]);

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
          <Daily date={selectedDate} location={location} menu_type="dinner" />
        </ScrollView>
      }
    </View>
  );
};

const MonthlyScreen = () => {
  const [location, setLocation] = useState("dewick-dining");

  const handleLocationChange = (newLoc) => {
    setLocation(newLoc);
  };

  return (
    <View style={styles.container}>
      <Dropdown onLocationChange={handleLocationChange} />
      <Calendar location={location} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dailyContainer: {
    flex: 1,
    paddingTop: 10,
    // flexGrow: 1
  },
});

export default MonthlyScreen;
