import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Modal, TouchableHighlight, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import colors from '../colors';
import { Entypo, MaterialIcons } from '@expo/vector-icons';

const Home = () => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            // Optional: Navigate to login after sign out
            // navigation.navigate('Login');
        } catch (error) {
            Alert.alert('Error', 'Failed to log out');
        }
    };

    const navigateToProfile = () => {
        setModalVisible(false);
        navigation.navigate('Profile');
    };

    const navigateToChat = () => {
        const chatRoomId = 'some_chat_room_id'; // Replace with actual chat room ID logic
        navigation.navigate('Chat', { chatRoomId });
    };

    return (
        <View style={styles.container}>
            <View style={styles.topNavBar}>
                <Text style={styles.navBarTitle}>Chat App</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Entypo name="dots-three-vertical" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TouchableHighlight
                            style={styles.modalButton}
                            onPress={navigateToProfile}
                        >
                            <Text style={styles.textStyle}>Profile</Text>
                        </TouchableHighlight>
                        <TouchableHighlight
                            style={styles.modalButton}
                            onPress={handleSignOut}
                        >
                            <Text style={styles.textStyle}>Logout</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>

            <TouchableOpacity onPress={navigateToChat} style={styles.button}>
                <MaterialIcons name="chat" size={24} color="white" />
                <Text style={styles.buttonText}>Go to Chat</Text>
            </TouchableOpacity>

            {/* Any other UI components you'd like to include */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    topNavBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    navBarTitle: {
        color: 'white',
        fontSize: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalButton: {
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical: 5,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    button: {
        backgroundColor: colors.primary,
        padding: 20,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
    },
   
});

export default Home;
