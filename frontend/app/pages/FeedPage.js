import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { FontLoader, SafeArea } from '../utils';
import LocationTimePicker from '../components/LocationTimePicker';
import BottomNavbar from '../components/BottomNavbar';
import { TooltipProvider } from '../components/TooltipContext';
import TooltipOverlay from '../components/TooltipOverlay';
import Post from '../components/Post';

const FeedPage = ({ setCurrentPage }) => {
    // Sample data for multiple posts
;
    const postsData = [
        {
            imageUrl: 'https://example.com/image1.jpg',
            timeAgo: '4 weeks ago',
            location: 'Dewick',
            mealType: 'Breakfast',
            likes: 32,
            description: 'I recently tried the Tropical Bliss Smoothie, and it was an absolute delight for the senses! From the first sip, I was transported to..',
            nutrition: [
                { label: "CAL", value: "81" },
                { label: "SUG", value: "14g" },
                { label: "CARB", value: "19g" },
                { label: "FAT", value: "0g" },
            ]
        },
        {
            imageUrl: 'https://example.com/image2.jpg',
            timeAgo: '3 weeks ago',
            location: 'Carm',
            mealType: 'Lunch',
            likes: 45,
            description: 'The Berry Blast Smoothie was another hit. The perfect blend of flavors made it irresistible!',
            nutrition: [
                { label: "CAL", value: "95" },
                { label: "SUG", value: "18g" },
                { label: "CARB", value: "25g" },
                { label: "FAT", value: "1g" },
            ]
        },
        // Add more post objects as needed
    ];

    return (
        <TooltipProvider>
            <FontLoader>
                <SafeArea>
                    <View style={styles.container}>
                        <LocationTimePicker />
                        <ScrollView style={styles.scrollView}>
                            {postsData.map((post, index) => (
                                <Post key={index} {...post} />
                            ))}
                        </ScrollView>
                    </View>
                    <View style={styles.navbarContainer}>
                        <BottomNavbar setCurrentPage={setCurrentPage} activeTab="feed"/>
                    </View>
                    <TooltipOverlay />
                </SafeArea>
            </FontLoader>
        </TooltipProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    scrollView: {
        flex: 1,
    },
    navbarContainer: {
        justifyContent: 'flex-end',
    },
});

export default FeedPage;
