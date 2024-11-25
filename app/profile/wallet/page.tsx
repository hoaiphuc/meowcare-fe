'use client'

import { UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import React, { useEffect, useState } from 'react'

interface Wallet {
    balance: number
}

const Wallet = () => {
    const [wallet, setWallet] = useState<Wallet>()
    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };
    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    useEffect(() => {
        try {
            axiosClient(`wallets/user/${userId}`)
                .then((res) => {
                    setWallet(res.data)
                })
                .catch(() => { })
        } catch (error) {

        }
    })

    return (
        <div className='w-[891px] h-full bg-white rounded-2xl shadow-2xl flex flex-col text-black'>
            <div className=' m-5 flex flex-col gap-4'>
                <div className='bg-[#FFE3D5] p-5 rounded-md flex'>
                    <h1>Số dư ví: <span className='text-green-500'>{wallet?.balance.toLocaleString()}</span></h1>

                </div>
                <div className=' bg-[#FFE3D5] p-5 rounded-md'>
                    <div>
                        <h1>Momo</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet