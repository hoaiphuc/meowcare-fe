'use client'

import React, { useEffect } from 'react'
import Chat from '../components/Chat'
import { fetchUserProfile } from '../lib/slices/userSlice';
import Loading from '../components/Loading';
import { useAppDispatch, useAppSelector } from '../lib/hooks';

const ChatPage = () => {
    const dispatch = useAppDispatch();
    const { userProfile, loading } = useAppSelector((state) => state.user);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('auth-token')) {
                return;
            }
        }
        if (!userProfile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, userProfile]);

    if (loading) {
        return <Loading />;
    }
    return (
        <div className='flex justify-center items-center'>
            {userProfile &&
                <div className='w-[700px] h-[300px] mt-5'>
                    <h1 className='text-3xl font-semibold'>Tin nhắn</h1>
                    <Chat userId={userProfile.email} userName={userProfile.fullName} />
                </div>
            }
        </div>
    )
}

export default ChatPage