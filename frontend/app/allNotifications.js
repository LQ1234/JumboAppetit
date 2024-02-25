import axios from "axios";
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const AllNotificationsScreen = () => {
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    // const fetchData = async () => {
    //   try {
    //     const apiUrl = `https://jumboappetit.larrys.tech/api/user/notifications`;
    //     const token = "your token";
    //     const config = {
    //       headers: {
    //         'accept': 'application/json',
    //         'Authorization': `Bearer ${token}`
    //       }
    //     };

    //     const response = await axios.get(apiUrl, config);
    //     console.log(response.data);

    //     const apiResponse = response.data;

    //     setNotifications(apiResponse);
    //   } catch (error) {
    //     console.error('Error fetching data:', error);
    //   }
    // };

    // fetchData();
    exampleDishes = [
      { id: 1, name: 'Blueberry pancakes' },
      { id: 2, name: 'Clam Chowder' },
      { id: 3, name: 'Kale Salad' }
    ];

    setNotifications(exampleDishes);
  }, []);
  
  const renderDishItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>You are subscribed to: </Text>
      <FlatList
        data={notifications}
        renderItem={renderDishItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  item: {
    backgroundColor: "orange",
    padding: 20,
    marginVertical: 3,
    marginHorizontal: 16,
    borderRadius: 5,
  },
  itemText: {
    fontFamily: 'ShortStack-Regular'
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 20,
    fontFamily: 'ShortStack-Regular'
  },
});
  
export default AllNotificationsScreen;
  