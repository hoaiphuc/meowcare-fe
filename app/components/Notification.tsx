import { db } from '@/app/utils/firebase';
import { collection, query, where, limit, orderBy, getDocs, startAfter, writeBatch } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Notification } from '../constants/types/homeType';

const useNotifications = (userId?: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [lastVisible, setLastVisible] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchNotifications = async (nextPage = false) => {
        if (!userId || (nextPage && !lastVisible) || loading) return;

        setLoading(true);
        try {
            const notificationsRef = collection(db, 'notify');
            let q = query(
                notificationsRef,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc'),
                limit(5)
            );

            if (nextPage) {
                q = query(q, startAfter(lastVisible));
            }

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setHasMore(false);
                return;
            }

            const newNotifications: Notification[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            } as Notification));

            setNotifications((prev) => [...prev, ...newNotifications]);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);

            if (snapshot.docs.length < 5) setHasMore(false); // No more documents
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        if (!userId) return;

        try {
            const notificationsRef = collection(db, 'notify');
            const q = query(notificationsRef, where('userId', '==', userId), where('isRead', '==', false));
            const snapshot = await getDocs(q);
            setUnreadCount(snapshot.size);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAllAsRead = async () => {
        if (!userId) return;

        try {
            const notificationsRef = collection(db, 'notify');
            const q = query(notificationsRef, where('userId', '==', userId), where('isRead', '==', false));
            const snapshot = await getDocs(q);

            const batch = writeBatch(db); // Correct way to create a batch
            snapshot.docs.forEach((doc) => {
                const docRef = doc.ref;
                batch.update(docRef, { isRead: true });
            });

            await batch.commit(); // Commit the batch

            setUnreadCount(0); // Reset the unread count locally
            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        setNotifications([]);
        setLastVisible(null);
        setHasMore(true);
        fetchNotifications(); // Fetch initial notifications
        fetchUnreadCount(); // Fetch unread count
    }, [userId]);

    return { notifications, unreadCount, fetchNotifications, hasMore, loading, markAllAsRead };
};

export default useNotifications;
