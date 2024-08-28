import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeArea } from '../utils'; // Assuming you have a SafeArea component
import { Camera, CameraView } from 'expo-camera';

const CameraPage = ({ setCurrentPage }) => {
    const cameraRef = useRef(null);

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            // Handle the photo as needed, e.g., save it or display it.
            setCurrentPage("vision")
        }
    };

    return (
        <SafeArea darkBG>
            <View style={styles.wrapper}>
                {/* Header with Close Button, Title, and Subtitle */}
                <View style={styles.headerContainer}>
                    {/* Close Button */}
                    <TouchableOpacity style={styles.closeButton} onPress={() => setCurrentPage("feed")}>
                        <Image source={require('../../assets/icons/X.png')} style={styles.closeIcon} />
                    </TouchableOpacity>

                    {/* Title and Subtitle */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>It’s Looking Delicious...</Text>
                        <Text style={styles.subtitle}>Take a photo to post and get nutrition facts</Text>
                    </View>
                </View>

                {/* Camera View */}
                <View style={styles.cameraContainer}>
                    <CameraView style={styles.cameraView} ref={cameraRef}>

                    </CameraView>
                </View>

                {/* Capture Button */}
                <View style={styles.captureContainer}>
                    <TouchableOpacity style={styles.captureButton} onPress={handleTakePicture}>
                        <Image source={require('../../assets/icons/Camera.png')} style={styles.captureIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeArea>
    );
};

const styles = StyleSheet.create({

    wrapper: {
        height: "100%",
        justifyContent: "space-evenly"
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'start',
        marginHorizontal: 20,
        marginBottom: 20,
    },
    closeButton: {
        marginRight: 10,
    },
    closeIcon: {
        width: 30,
        height: 30,
        tintColor: '#FFF',
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        color: '#FFF',
    },
    subtitle: {
        fontSize: 16,
        color: '#FFF',
    },
    cameraContainer: {
        flex: 0,
        aspectRatio: 1, // Ensures the camera view is square
        overflow: 'hidden',
    },
    cameraView: {
        flex: 1,
    },
    captureContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    captureButton: {
        backgroundColor: '#FFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureIcon: {
        width: 30,
        height: 30,
        tintColor: '#000',
    },
});

export default CameraPage;
