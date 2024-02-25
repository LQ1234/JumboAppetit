import { Camera, CameraType } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import LocationMenuPicker from './locationMenuPicker';
import EventSource from "react-native-sse";
import * as ImageManipulator from 'expo-image-manipulator'


export default function CameraScreen({ navigation }) {
    const cameraRef = useRef(null);
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

    const handleTakePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({});
            navigation.navigate('PhotoScanner', { photoUri: photo.uri, location, menu });
        }
    }



    return (
        <View >
            <LocationMenuPicker onLocationMenuChange={handleLocationMenuChange} />
            <Camera type={type} ref={cameraRef}>
                <View style = {{ 
                    backgroundColor: 'transparent',
                    aspectRatio: 1,
                }}>
                    <TouchableOpacity onPress={toggleCameraType}>
                        <Text >Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
            <Button title="Take Picture" onPress={handleTakePicture} />
        </View>
    );
}
