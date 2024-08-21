import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"; 
import axios from "axios";
import { useNavigation } from '@react-navigation/native';

const Daily = (props) => {
  const [dailyMenu, setDailyMenu] = useState(null);
  const navigation = useNavigation();
  
  const handleDishPress = (menuItem) => {
    navigation.navigate('Dish', { menuItem });
  };

  const { date, location, menu_type } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        console.log(`today is ${year}/${month}/${day}`);

        const response = await axios.get(`https://jumboappetit.larrys.tech/api/menu/daily-menu/{location-slug}/{menu-type-slug}/${year}/${month}/${day}?location_slug=${location}&menu_type_slug=${menu_type}`, {});
        const apiResponse = response.data;
        setDailyMenu(apiResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the async function
  }, [date, location, menu_type]);

  if (!dailyMenu) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {dailyMenu.sections.map((sec, i) => (
        <View key={i} style={styles.secContainer}>
          <Text style={styles.secName}>{sec.name}</Text>
          {sec.menu_items.map((entry, j) => (
            <TouchableOpacity key={j} onPress={() => handleDishPress(entry.menu_item)}>
              <Text style={styles.dishName}>{entry.menu_item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  secContainer: {
    marginBottom: 10,
  },
  secName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "#9e590b",
    fontFamily: 'ShortStack-Regular'
  },
  dishName: {
    fontSize: 16,
    marginLeft: 10,
    marginBottom: 2,
    fontFamily: 'ShortStack-Regular'
  },
});

export default Daily;
