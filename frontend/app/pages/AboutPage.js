import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const AboutPage = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>About Jumbo Appetit</Text>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    Jumbo Appetit was created by Larry (lawrence.qiu@tufts.edu) and Joanne (joanne.fan@tufts.edu) to help Tufts students eat better. Feel free to contact us with questions, comments, or suggestions.
                </Text>
                <Text style={styles.text}>
                    Jumbo Appetit is not affiliated with Tufts University or Tufts Dining.
                </Text>

                <Text style={styles.subtitle}>Acknowledgments</Text>
                <Text style={styles.text}>
                    User Interface based on “Simple Design System” by Figma{'\n'}
                    Icon based on “Vector Hand Drawn Shapes” by Juan Buitrago{'\n'}
                    Logo generated using DALL·E 3
                </Text>

                <Text style={styles.subtitle}>Source Code</Text>
                <Text style={styles.text}>
                    The source code is available at https://github.com/LQ1234/JumboAppetit
            </Text>
            </View>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',

    },
    text: {
        fontSize: 12,
        textAlign: 'left',
        marginBottom: 10,
    },
    textContainer: {

    },
    subtitle: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    logo: {
        width: 150,
        height: 150,
        resizeMode: 'contain',
    },
    button: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default AboutPage;
