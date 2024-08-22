import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import NutritionalInfos from './NutritionalInfos';

const Post = ({ imageUrl, timeAgo, location, mealType, likes, description, nutrition }) => {
    return (
        <View style={styles.postContainer}>
            {/* Post Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            
            {/* Post Details */}
            <View style={styles.detailsContainer}>
                <Text style={styles.detailsText}>{`${timeAgo} • ${location} • ${mealType} • ${likes} ${likes == 1 ? "like" : "likes"}`}</Text>
            </View>
            
            {/* Description, Nutritional Infos and Like Button */}
            <View style={styles.footerContainer}>
                <View style={styles.descriptionNutritionContainer}>
                    <Text style={styles.descriptionText}>{description}</Text>
                    <NutritionalInfos infos={nutrition} />
                </View>
                <TouchableOpacity style={styles.likeButton}>
                    <Image source={require('../../assets/icons/Heart.png')} style={styles.likeIcon} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        borderWidth: 1,
        borderColor: '#000',
        borderRadius: 5,
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1, // Ensure the image maintains a square aspect ratio
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 10,
        paddingBottom: 5
    },
    detailsText: {
        fontSize: 11,
        color: '#888',
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    descriptionNutritionContainer: {
        flex: 1,
        marginRight: 10,
    },
    descriptionText: {
        fontSize: 12,
        color: '#000',
    },
    likeButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
    },
    likeIcon: {
        width: 28,
        height: 28,
    },
});

export default Post;
