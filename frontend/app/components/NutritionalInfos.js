import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NutritionalInfos = ({ infos }) => {
    return (
        <View style={styles.container}>
            {infos.map((info, index) => (
                <View key={index} style={styles.infoContainer}>
                    <Text style={styles.label}>{info.label}</Text>
                    <Text style={styles.value}>{info.value}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',

    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 5,
        borderColor: '#000',
        borderWidth: 1,
        borderRadius: 3,
    },
    label: {
        fontWeight: 'bold',
        backgroundColor: '#000',
        paddingHorizontal: 5,
        paddingTop: 3,
        paddingBottom:1,
        color: '#fff',
        fontFamily: 'CourierPrime-Bold',

        fontSize: 12,

    },
    value: {
        fontSize: 12,
        paddingHorizontal: 5,
        paddingTop: 3,
        paddingBottom:1,
        fontFamily: 'CourierPrime-Bold',
    },
});

export default NutritionalInfos;
