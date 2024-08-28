import React, { useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TooltipContext } from './TooltipContext';
import { AppContext } from '../contexts/AppContext';

const FoodProperties = ({ propertySlugs }) => {
    const { showTooltip } = useContext(TooltipContext);
    const { foodPropertiesData } = useContext(AppContext);
    /*[{"description": "Contains Shellfish", "displayed": false, "initials": "SH", "name": "Shellfish", "slug": "shellfish"}, {"description": "Contains Soy", "displayed": false, "initials": "SO", "name": "Soy", "slug": "soy"}, {"description": "Contains Egg", "displayed": false, "initials": "EG", "name": "Egg", "slug": "egg"}, {"description": "Contains Gluten", "displayed": false, "initials": "GL", "name": "Gluten", "slug": "gluten"}, {"description": "Vegan", "displayed": false, "initials": "VE", "name": "Vegan", "slug": "vegan"}, {"description": "Vegetarian", "displayed": false, "initials": "VE", "name": "Vegetarian", "slug": "vegetarian"}, {"description": "Contains Sesame", "displayed": false, "initials": "SE", "name": "Sesame", "slug": "sesame"}, {"description": "Contains Milk", "displayed": false, "initials": "MI", "name": "Milk", "slug": "milk"}, {"description": "Contains Peanut", "displayed": false, "initials": "PE", "name": "Peanut", "slug": "peanut"}, {"description": "Contains Tree Nuts", "displayed": false, "initials": "TR", "name": "Tree Nuts", "slug": "tree-nuts"}, {"description": "Halal", "displayed": false, "initials": "HA", "name": "Halal", "slug": "halal"}, {"description": "Contains Fish", "displayed": false, "initials": "FI", "name": "Fish", "slug": "fish"}, {"description": "Contains Coconut", "displayed": false, "initials": "CO", "name": "Coconut", "slug": "coconut"}]*/
    const propertyRefs = useRef([]);

    console.log(propertySlugs)
    const properties = foodPropertiesData?.filter((property) =>
        propertySlugs.includes(property.slug)
    ) || [];

    const handlePress = (property, index) => {
        const ref = propertyRefs.current[index];
        if (ref) {
            ref.measure((x, y, width, height, pageX, pageY) => {
                showTooltip(
                    property.name,
                    property.description,
                    { top: pageY, left: pageX + width / 2 }
                );
            });
        }
    };



    return (
        <View style={styles.container}>
            {properties.map((property, index) => (
                <View key={index} style = {styles.itemContainer}>
                <TouchableOpacity
                    style={styles.propertyContainer}
                    onPress={() => handlePress(property, index)}
                    activeOpacity={0.7}
                    ref={(el) => (propertyRefs.current[index] = el)}
                >
                    <Text style={styles.propertyText}>{property.initials}</Text>
                </TouchableOpacity>
                {index < properties.length - 1 && (
                    <Text style={styles.bullet}>•</Text>
                )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin:0,
        padding: 0,
        gap: 0,
    },
    propertyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    propertyText: {
        fontFamily: 'CourierPrime-Bold',
        fontSize: 16,
    },
    bullet: {
        marginHorizontal: 2,
        fontSize: 16,
    },
});

export default FoodProperties;
