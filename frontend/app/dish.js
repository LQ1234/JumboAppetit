import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutritionTable = ({ nutritionInfo }) => {
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={[styles.cell, styles.header]}>Nutrient</Text>
        <Text style={[styles.cell, styles.header]}>Amount</Text>
      </View>
      {nutritionInfo.map((info, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.cell}>{info.slug}</Text>
          <Text style={styles.cell}>{info.amount}</Text>
        </View>
      ))}
    </View>
  );
};

const DishScreen = ({ route }) => {
  const { menuItem } = route.params; 

  return (
    <View>
      <Text>Nutrition Profile of {menuItem.name}</Text>
      <NutritionTable nutritionInfo={menuItem.nutrition_information}></NutritionTable>
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#000000',
    margin: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 6,
    borderWidth: 1,
    borderColor: '#000000',
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
});

export default DishScreen;
