// pages/ChatPage.tsx or app/chat/page.tsx (depends on your folder structure)
'use client';

import React, { useEffect, useState } from 'react';
import Chat from '../components/Chat';
import { fetchUserProfile } from '../lib/slices/userSlice';
import Loading from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation'; // Importing from next/navigation

const ChatPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { userProfile, loading } = useAppSelector((state) => state.user);

    const [isClientReady, setIsClientReady] = useState(false);

    useEffect(() => {
        // This ensures the effect runs only on the client side
        setIsClientReady(true);

        if (typeof window !== 'undefined' && !localStorage.getItem('auth-token')) {
            return;
        }

        if (!userProfile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, userProfile]);

    if (loading || !isClientReady) {
        return <Loading />;
    }

    const handleCall = () => {
        if (userProfile) {
            router.push(`/videocall?userID=hoaiphuc1@gmail.com&userName=Phuc&targetUserID=recipient_user_id`);
        }
    };

    return (
        <div className='flex justify-center items-center'>
            {userProfile && (
                <div className='w-[700px] h-[300px] mt-5'>
                    <h1 className='text-3xl font-semibold'>Messages</h1>
                    <Button onPress={handleCall}>Call</Button>
                    <Chat userId={userProfile.email} userName={userProfile.fullName} />
                </div>
            )}
        </div>
    );
};

export default ChatPage;
