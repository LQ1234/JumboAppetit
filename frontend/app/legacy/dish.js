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
      <Text style={styles.ingredients}>{ingredients}</Text>
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
  const [buttonText, setButtonText] = useState('Notify Me');
  const [backgroundColor, setBackgroundColor] = useState('#efe07f');

  const handlePress = () => {
    const token = "TODO";
    const url = "TODO"

    const config = {
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    axios.get(url, config)
      .then(response => {
        console.log(response.data); 
        
        setButtonText('Unsubscribe');
        setBackgroundColor('#efa87f');
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.notifyBtn, { backgroundColor }]}>
        <Text style={styles.notifyBtnText}>{buttonText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const DishScreen = ({ route }) => {
  const { menuItem } = route.params; 

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <NotifyBtn dishHash={menuItem.hash}/>
        <Text style={styles.title}>{menuItem.name}</Text>
        <IngredientList ingredients={menuItem.ingredients} allergens={menuItem.food_properties}/>
        <NutritionTable nutritionInfo={menuItem.nutrition_information}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    fontFamily: 'ShortStack-Regular'
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 4,
    fontFamily: 'ShortStack-Regular'
  },
  paragraph: {
    paddingBottom: 10,
    fontFamily: 'ShortStack-Regular'
  },
  ingredients: {
    fontFamily: 'ShortStack-Regular'
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
    color: "white",
    fontFamily: 'ShortStack-Regular'
  },
  table: {
    width: 300,
    borderWidth: 1,
    borderColor: '#87725A',
    margin: 10,
    backgroundColor: "#F3DACE",
    marginBottom: 50,
  },
  tableRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    padding: 6,
    borderWidth: 0.5,
    borderColor: '#87725A',
    fontFamily: 'ShortStack-Regular'
  },
  header: {
    fontWeight: 'bold',
    backgroundColor: '#f2f2f2',
    fontFamily: 'ShortStack-Regular'
  },
  notifyBtn: {
    width: 140,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    marginTop: 20
  },
  notifyBtnText: {
    fontFamily: 'ShortStack-Regular'
  },
});

export default DishScreen;
