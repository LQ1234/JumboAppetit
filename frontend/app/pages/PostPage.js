import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import { SafeArea } from '../utils'; // Assuming you have a SafeArea component
import LocationTimePicker from '../components/LocationTimePicker'; // Assuming you have a LocationTimePicker component

const PostPage = ({ setCurrentPage }) => {
    return (
        <View style={styles.container}>
            <SafeArea>
                {/* Header with Back Button and Title */}
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.backButton} onPress={() => setCurrentPage("vision")}>
                        <Image source={require('../../assets/icons/Arrow left.png')} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Post</Text>
                    <View style={styles.forwardButtonPlaceholder}></View>
                </View>

                {/* Image Placeholder */}
                <View style={styles.imagePlaceholder} />

                {/* Location and Time Picker */}
                <LocationTimePicker />

                {/* Description Input */}
                <View style={styles.descriptionContainer}>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Write a description..."
                        placeholderTextColor="#888"
                        multiline
                    />
                </View>

                {/* Post Button */}
                <TouchableOpacity style={styles.postButton}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </SafeArea>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'space-between',

    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        width: 30,
        height: 30,
        tintColor: '#000',
    },
    forwardButtonPlaceholder: {
        width: 40,

    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
    },
    imagePlaceholder: {
        width: "100%",
        flex: 0,
        backgroundColor: '#D3D3D3',
        aspectRatio: 1,
        marginBottom: 20,
    },
    descriptionContainer: {
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 7,
    },
    descriptionInput: {
        fontSize: 14,
        color: '#000',
        minHeight: 60,
        maxHeight: 120
    },
    postButton: {
        backgroundColor: '#000',
        paddingVertical: 5,
        marginVertical: 5,
        borderRadius: 5,
        alignItems: 'center',
    },
    postButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: 16,
    },
});

export default PostPage;
