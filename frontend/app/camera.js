import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LocationMenuPicker from './locationmenupicker';

export default function CameraScreen() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    const [location, setLocation] = useState(null);
    const [menu, setMenu] = useState(null);

    if (permission?.status !== 'granted') {
        return (
            <View>
                <Text>No access to camera</Text>
                <Button title="Request Camera Permission" onPress={requestPermission} />
            </View>
        );
    }


    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    const handleLocationMenuChange = (newLoc, newMenu) => {
        setLocation(newLoc);
        setMenu(newMenu);
    }


    return (
        <View >
            <LocationMenuPicker onLocationMenuChange={handleLocationMenuChange} />
            <Camera type={type}>
                <View style = {{ 
                    backgroundColor: 'transparent',
                    aspectRatio: 1,
                }}>
                    <TouchableOpacity onPress={toggleCameraType}>
                        <Text >Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            <Button title="Take Picture" onPress={() => {}} />
        </View>
    );
}
