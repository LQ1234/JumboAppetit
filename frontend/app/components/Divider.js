import React from 'react';
import { View, StyleSheet } from 'react-native';

const Divider = () => {
    return (
        <View style={styles.divider} />
    );
};

const styles = StyleSheet.create({
    divider: {
        height: 1,
        backgroundColor: '#000', // Color of the divider
        marginVertical: 10, // Space above and below the divider
        marginHorizontal: "30%",
        alignSelf: 'stretch', // Ensures the divider stretches across the container width
    },
});

export default Divider;
