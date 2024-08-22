import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const BottomNavbar = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Feed');

    const handleTabPress = (tabName) => {
        setActiveTab(tabName);
        // Navigate to the respective screen if needed
        // Example: navigation.navigate(tabName);
    };

    return (
        <View style={styles.navbar}>
            <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('Post')}>
                <Image
                    source={require('../../assets/icons/Camera.png')}
                    style={[styles.icon, activeTab !== 'Post' && styles.inactiveIcon]}
                />
                <Text style={[styles.label, activeTab === 'Post' && styles.activeLabel]}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('Feed')}>
                <Image
                    source={require('../../assets/icons/Thumbs up.png')}
                    style={[styles.icon, activeTab !== 'Feed' && styles.inactiveIcon]}
                />
                <Text style={[styles.label, activeTab === 'Feed' && styles.activeLabel]}>Feed</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => handleTabPress('Menu')}>
                <Image
                    source={require('../../assets/icons/Calendar.png')}
                    style={[styles.icon, activeTab !== 'Menu' && styles.inactiveIcon]}
                />
                <Text style={[styles.label, activeTab === 'Menu' && styles.activeLabel]}>Menu</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        height: 30,
        // borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#fff',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10
    },
    icon: {
        width: 24,
        height: 24,
        marginBottom: 4,
        resizeMode: 'contain',
    },
    inactiveIcon: {
        tintColor: '#888', // Apply gray color to inactive icons
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold', // Make the font bold
        color: '#888',
    },
    activeLabel: {
        color: '#000',
    },
});

export default BottomNavbar;
