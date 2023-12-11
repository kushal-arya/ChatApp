import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, ActionSheetIOS } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, deleteDoc } from 'firebase/firestore';
import { auth, database } from '../config/firebase'; // Ensure this is the correct path
import colors from '../colors'; // Ensure this is the correct path

const Chat = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const chatRoomId = 'your_chat_room_id'; // Replace with actual chat room ID logic
        const chatRoomCollection = collection(database, 'chatrooms', chatRoomId, 'messages');
        const q = query(chatRoomCollection, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setMessages(
                querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();

                    return {
                        _id: doc.id,
                        createdAt,
                        text: data.text,
                        user: data.user,
                    };
                })
            );
        });

        return () => unsubscribe();
    }, []);

    const onSend = useCallback((messages = []) => {
        const chatRoomId = 'your_chat_room_id'; // Replace with actual chat room ID logic
        const chatRoomCollection = collection(database, 'chatrooms', chatRoomId, 'messages');

        messages.forEach((message) => {
            addDoc(chatRoomCollection, {
                text: message.text,
                createdAt: serverTimestamp(),
                user: message.user,
            });
        });
    }, []);

    const handleDeleteMessage = (messageId) => {
        const chatRoomId = 'your_chat_room_id'; // Replace with actual chat room ID logic
        const messageRef = doc(database, 'chatrooms', chatRoomId, 'messages', messageId);
        deleteDoc(messageRef);
    };

    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: { backgroundColor: colors.primary },
                    left: { backgroundColor: colors.secondary },
                }}
            />
        );
    };

    const renderSend = (props) => {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <MaterialIcons name="send" size={24} color={colors.primary} />
                </View>
            </Send>
        );
    };

    const renderInputToolbar = (props) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={styles.inputToolbar}
                primaryStyle={{ alignItems: 'center' }}
            />
        );
    };

    const onLongPress = (context, message) => {
        const options = ['Delete Message', 'Cancel'];
        const cancelButtonIndex = options.length - 1;

        context.actionSheet().showActionSheetWithOptions({
            options,
            cancelButtonIndex,
        },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        handleDeleteMessage(message._id);
                        break;
                }
            });
    };

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth.currentUser?.uid || 'unknown_user',
            }}
            renderBubble={renderBubble}
            renderSend={renderSend}
            renderInputToolbar={renderInputToolbar}
            onLongPress={onLongPress}
        // ... other GiftedChat props ...
        />
    );
};

const styles = StyleSheet.create({
    sendingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    inputToolbar: {
        borderTopWidth: 1,
        borderTopColor: colors.lightGray,
        backgroundColor: 'white',
    },
    // ... other styles ...
});

export default Chat;
