import { db } from '@/app/utils/firebase';
import { collection, query, where, limit, orderBy, getDocs, startAfter } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Notification } from '../constants/types/homeType';

const useNotifications = (userId?: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastVisible, setLastVisible] = useState<unknown>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchNotifications = async (nextPage = false) => {
        if (!userId || (nextPage && !lastVisible) || loading) return;

        setLoading(true);
        try {
            const notificationsRef = collection(db, "notify");
            let q = query(
                notificationsRef,
                where("userId", "==", userId),
                orderBy("createdAt", "desc"),
                limit(5)
            );

            // Add pagination condition
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
            console.error("Error fetching notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setNotifications([]);
        setLastVisible(null);
        setHasMore(true);
        fetchNotifications(); // Fetch initial 5 notifications
    }, [userId]);

    return { notifications, fetchNotifications, hasMore, loading };
};

export default useNotifications;
