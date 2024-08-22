import React, { useContext, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TooltipContext } from './TooltipContext';

const FoodProperties = ({ properties }) => {
    const { showTooltip } = useContext(TooltipContext);
    const propertyRefs = useRef([]);

    const propertyInfo = {
        SY: { title: 'SY', text: 'Contains Soy' },
        SF: { title: 'SF', text: 'Contains Shellfish' },
        // Add more properties as needed
    };

    const handlePress = (property, index) => {
        const ref = propertyRefs.current[index];
        if (ref) {
            ref.measure((x, y, width, height, pageX, pageY) => {
                showTooltip(
                    propertyInfo[property]?.title || property,
                    propertyInfo[property]?.text || 'No info available',
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
                    <Text style={styles.propertyText}>{property}</Text>
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
