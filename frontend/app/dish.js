import axios from "axios";
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

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

const IngredientList = ({ ingredients, allergens }) => {
  propertyEmoji = {
    "coconut": "🥥", 
    "egg": "🥚", 
    "fish": "🐟",
    "gluten": "🌾",
    "halal": "?",
    "milk": "🥛",
    "peanut": "🥜",
    "sesame": "",
    "shellfish": "🍤",
    "soy": "🫛",
    "tree-nuts": "🌰",
    "vegan": "",
    "vegetarian": ""
  }

  return (
    <View style={styles.paragraph}>
      <Text style={styles.subtitle}>Ingredients: </Text>
      <Text>{ingredients}</Text>
      <View style={styles.allergensContainer}>
        {allergens.map((entry, index) => (
          <View key={index} style={styles.allergenBox}>
            <Text style={styles.allergenText}>{propertyEmoji[entry]} {entry}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const NotifyBtn = ({ dishHash }) => {
  const [buttonText, setButtonText] = useState('Notify Me!');
  const [backgroundColor, setBackgroundColor] = useState('red');

  const handlePress = () => {
    setTimeout(() => {
      console.log("dish hash: " + dishHash);
      const response = { status: 200 }; // replace with actual API call

      if (response.status === 200) {
        setButtonText('Subscribed!');
        setBackgroundColor('green');
      }
    }, 1000); // simulating API call delay
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.button, { backgroundColor }]}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DishScreen = ({ route }) => {
  const { menuItem } = route.params; 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{menuItem.name}</Text>
      <IngredientList ingredients={menuItem.ingredients} allergens={menuItem.food_properties}/>
      <NutritionTable nutritionInfo={menuItem.nutrition_information}/>
      <NotifyBtn dishHash={menuItem.hash}/>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  paragraph: {
    paddingBottom: 10,
  },
  allergensContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  allergenBox: {
    width: 80,
    height: 40,
    backgroundColor: '#517C50',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  allergenText: {
    color: "white"
  },
  table: {
    borderWidth: 1,
    borderColor: '#87725A',
    margin: 10,
    backgroundColor: "#F3DACE"
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#87725A',
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
  },
});

export default DishScreen;
