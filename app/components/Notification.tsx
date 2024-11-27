'use client';

import { db } from '@/app/utils/firebase';
import {
    collection,
    onSnapshot,
    query,
    where
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Notification } from '../constants/types/homeType';


const useNotifications = (userId?: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!userId) return;

        const notificationsRef = collection(db, "notify");
        const q = query(notificationsRef, where("userId", "==", userId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newNotifications: Notification[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Notification));

            setNotifications(newNotifications);
        });

        return () => unsubscribe(); // Clean up listener
    }, [userId]);

    return notifications;
};


export default useNotifications;
