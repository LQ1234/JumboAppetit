import { Camera, CameraType } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, Text, TouchableOpacity, View, Image } from 'react-native';
import LocationMenuPicker from './locationMenuPicker';
import EventSource from "react-native-sse";
import * as ImageManipulator from 'expo-image-manipulator'
import "react-native-url-polyfill/auto"; 

export default function PhotoScanner({ navigation, route }) {
    const { photoUri, location, menu } = route.params;

    const [visionStatus, setVisionStatus] = useState("Uploading...");
    const [summary, setSummary] = useState(null);
    const [items, setItems] = useState([]);


    useEffect(() => {
        const scan = async () => {
            const resizedPhoto = await ImageManipulator.manipulateAsync(
                photoUri,
                [{ resize: { width: 1024 } }],
                { compress: 0.7, format: 'jpeg' },
            );
            
            let localUri = resizedPhoto.uri;
            let filename = localUri.split('/').pop();

            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            let formData = new FormData();
            formData.append('image', { uri: localUri, name: filename, type });

            const es = new EventSource('https://jumboappetit-dev.larrys.tech/api/vision/analyze-image', {
                headers: {
                    'content-type': 'multipart/form-data',
                },
                method: "POST",
                body: formData,
                pollingInterval: 0,
            });
            
            es.addEventListener('message', (event) => {
                let data = JSON.parse(event.data);
                if (data.status == "start") {
                    setVisionStatus("Scanning...");
                } else if (data.status == "stop") {
                    setVisionStatus("Done!");
                } else if (data.summary) {
                    setSummary(data.summary);
                } else if (data.menu_item) {
                    let thisItem = data.menu_item.name + " - " + data.servings;
                    setItems((prevItems) => [...prevItems, thisItem]);
                }
            });

            es.addEventListener('error', (event) => {
                console.error('Error:', event);
            });

            es.addEventListener('end', (event) => {
                console.log('End:', event);
            });
        }

        let ignore = false;
        console.log("SCANNING!!")
        scan();
        return () => {
          ignore = true;
        }    
    }, [photoUri]);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'top' }}>
            <Image source={{ uri: photoUri }} style={{ width: 300, height: 300}} />
            <Text>{visionStatus}</Text>
            <Text>{summary}</Text>
            {items && items.map((item, i) => (
                <Text key={i}>{" - " +item}</Text>
            ))}
        </View>
    );
}