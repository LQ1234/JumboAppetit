import { useCameraPermissions,  CameraView } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Text, TouchableOpacity, View } from 'react-native';
import LocationMenuPicker from './locationmenupicker';
import EventSource from "react-native-sse";
import * as ImageManipulator from 'expo-image-manipulator'
import { ScreenProps } from '../types';

export default function CameraScreen({ navigation }: ScreenProps) {
    const cameraRef = useRef(null);
    const [type, setType] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    const [location, setLocation] = useState<string | null>(null);
    const [menu, setMenu] = useState<string | null>(null); // TODO: not sure about the type of menu

    if (permission?.status !== 'granted') {
        return (
            <View>
                <Text>No access to camera</Text>
                <Button title="Request Camera Permission" onPress={requestPermission} />
            </View>
        );
    }


    const toggleCameraType = () => {
        setType(current => (current === 'back' ? 'front' : 'back'));
    }

    const handleLocationMenuChange = (newLoc: string, newMenu: string) => {
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
            <CameraView type={type} ref={cameraRef}>
                <View style = {{ 
                    backgroundColor: 'transparent',
                    aspectRatio: 1,
                }}>
                    <TouchableOpacity onPress={toggleCameraType}>
                        <Text >Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
            <Button title="Take Picture" onPress={handleTakePicture} />
        </View>
    );
}
