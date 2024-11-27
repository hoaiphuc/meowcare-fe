'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    collection,
    addDoc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
    DocumentData,
    QuerySnapshot,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/app/utils/firebase';
import './chat.css'
// Define the props type for the Chat component
interface ChatProps {
    userId: string;
    userName: string;
    orderId: string;
}

// Define the type for a single message
interface Message {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: Timestamp; // Using Firestore timestamp type
}

const Chat: React.FC<ChatProps> = ({ userId, userName, orderId }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const messagesListRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to the bottom whenever messages change
        if (messagesListRef.current) {
            messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        // Set up Firestore listener for real-time messages
        const messagesRef = collection(db, 'conversations', orderId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'desc'));

        const unsubscribeMessages = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
            const messagesArray: Message[] = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Message, 'id'>), // Casting to Message type
            }));
            setMessages(messagesArray.reverse());
        });

        // Clean up listener on component unmount
        return () => {
            unsubscribeMessages();
        };
    }, [orderId]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        const messagesRef = collection(db, 'conversations', orderId, 'messages');
        try {
            await addDoc(messagesRef, {
                text: newMessage,
                senderId: userId,
                senderName: userName,
                timestamp: serverTimestamp(),
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message: ', error);
        }
    };

    return (
        <div className='chat-container'>
            <div className='messages-list' ref={messagesListRef}>
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message ${message.senderId === userId ? 'message-right' : 'message-left'
                            }`}
                    >
                        <div className="message-content">
                            <strong>{message.senderName}</strong>
                            <p>{message.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className='send-message'>
                <input
                    type='text'
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder='Type your message...'
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
