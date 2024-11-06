'use client'

import { Button } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import styles from './activity.module.css'
import { Order, UserLocal } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'

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
        axiosClient(`booking-orders/user?id=${userId}`)
            .then((res) => {
                setData(res.data)
            })
            .catch((e) => {
                console.log(e);
            })
    }, [userId])

    return (
        <div className="w-[891px]  bg-white rounded-2xl shadow-2xl">
            <div className="ml-20 w-full gap-5 flex flex-col">
                <h1 className="text-2xl font-bold pt-10">Hoạt động</h1>
                <div className='flex gap-3'>
                    <Button className={styles.button}>Tất cả</Button>
                    <Button className={styles.button}>Chờ xác nhận</Button>
                </div>
                <div>
                    {data ? (data.map((activity) => (
                        <div key={activity.id} className='border w-[700px] p-3 rounded-lg flex justify-between my-3'>
                            <div>
                                <div className='flex'>
                                    <Icon icon="cbi:camera-pet" className='text-[#902C6C] w-12 h-11 mr-2' />
                                    <div>
                                        <h2><span className={styles.title}>Dịch vụ: </span>{activity.bookingDetailWithPetAndServices[0].service.serviceName}</h2>
                                        <h2><span className={styles.title}>Người chăm sóc: </span>{activity.sitter.fullName}</h2>
                                        <h2><span className={styles.title}>Mèo của bạn: </span>{activity.bookingDetailWithPetAndServices[0].pet.petName}</h2>
                                        <h2><span className={styles.title}>Thời gian: </span></h2>
                                    </div>
                                </div>
                                <Button as={Link} href={`/profile/activity/detail/${activity.id}`} className='bg-btnbg text-white rounded-lg mt-3'>Theo dõi lịch</Button>
                            </div>
                            <div>
                                {/* <h2 className='text-[#FFC107]'>Chờ xác nhận</h2> */}
                                <h2 className='text-[#9E9E9E]'>Chờ xác nhận</h2>
                            </div>
                        </div>
                    ))) : (
                        <div>
                            <h1>Hiện tại không có hoạt động nào</h1>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page