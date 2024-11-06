'use client'

import { Order, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient'
import React, { useEffect, useState } from 'react'


const Page = () => {
    const [data, setData] = useState<Order[]>([]);
    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    useEffect(() => {
        axiosClient(`booking-orders/sitter?id=${userId}`)
            .then((res) => {
                setData(res.data)
            })
            .catch((e) => {
                console.log(e);
            })
    }, [userId])

    return (
        <div>
            <div>
                {data ? (data.map((activity) => (
                    <div key={activity.id}>
                        <h1>{activity.id}</h1>
                    </div>
                ))) : (
                    <div>
                        <h1>Hiện tại chưa có lịch</h1>
                    </div>
                )

                }
            </div>
        </div>
    )
}

export default Page