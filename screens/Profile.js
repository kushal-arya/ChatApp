// Profile.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase'; // Ensure this is the correct path
import * as ImagePicker from 'expo-image-picker'; // Make sure you have installed expo-image-picker

const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const userRef = doc(database, 'users', userId);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    setProfileData(userSnap.data());
                } else {
                    Alert.alert('Error', 'User not found in the database.');
                }
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleImagePick = async () => {
        // Request permissions for image library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Sorry', 'We need camera roll permissions to make this work!');
            return;
        }

        // Pick an image
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            // Update the user's profile image in Firestore
            const userId = auth.currentUser?.uid;
            const userRef = doc(database, 'users', userId);

            setLoading(true);
            await updateDoc(userRef, {
                profileImageUrl: result.uri,
            });

            // Update local state
            setProfileData({
                ...profileData,
                profileImageUrl: result.uri,
            });
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleImagePick}>
                <Image
                    source={profileData.profileImageUrl ? { uri: profileData.profileImageUrl } : { uri: 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <Text style={styles.name}>{`${profileData.firstName} ${profileData.lastName}`}</Text>
            <Text style={styles.phone}>{profileData.phoneNumber}</Text>
            {/* Other profile details */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 4,
        borderColor: '#fff', // or any other color for border
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    phone: {
        fontSize: 16,
        color: 'gray',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // ... Add other styles you need
});

export default Profile;
