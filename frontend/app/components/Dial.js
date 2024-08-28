import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Dial = (count, setCount) => {
    const increaseCount = () => setCount(count + 1);
    const decreaseCount = () => setCount(count > 0 ? count - 1 : 0);

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={increaseCount}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{count}</Text>
            <TouchableOpacity style={styles.button} onPress={decreaseCount}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 30,

        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 3,
    },
    button: {
        paddingVertical: 4,
        width: "100%",
        alignItems: 'center',
        backgroundColor: '#000',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    countText: {
        fontSize: 16,
        fontWeight: 'bold',
        paddingVertical: 4
    },
});

export default Dial;
