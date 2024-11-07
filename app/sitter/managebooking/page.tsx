'use client'

import { Order, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient'
import { Avatar, Navbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'


const Page = () => {
    const [data, setData] = useState<Order[]>([]);
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('Tất cả');

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    const menuItems = [
        { name: 'Tất cả' },
        { name: 'Đang diễn ra' },
    ];

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
        <div className='flex flex-col mt-12 justify-center items-center text-black'>
            <div className='w-[1104px]'>
                <h1 className='text-[32px] font-semibold'>{selectedMenuItem}</h1>
                <hr className='my-3' />
            </div>
            <div className='flex justify-center ml-[-48px]'>
                <Navbar className="flex items-start bg-transparent w-[300px] h-[800px] ">
                    <NavbarContent className="flex flex-col gap-8 items-start ">
                        <NavbarItem className="text-xl">
                            <div className="flex flex-col space-y-2 ">
                                {menuItems.map((item) => (
                                    <div
                                        key={item.name}
                                        onClick={() => setSelectedMenuItem(item.name)}
                                        className={`flex flex-row items-center p-2 rounded-lg w-[264px] cursor-pointer h-14 ${item.name === selectedMenuItem ? 'bg-[#ffeae0]' : ''
                                            }`}
                                    >
                                        {/* {item.icon} */}
                                        <span className="font-semibold text-[16px] flex">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </NavbarItem>
                    </NavbarContent>
                </Navbar>
                <div className='w-[804px] flex flex-col gap-5 bg-transparent'>
                    {data ? (data.map((activity) => (
                        <Link href={`/sitter/bookingdetail/${activity.id}`} key={activity.id} className='flex flex-col gap-3 p-3 cursor-pointer'>
                            <div className='flex justify-between '>
                                <div className='flex gap-3'>
                                    <Avatar src='' className='w-14 h-14 ' />
                                    <div className=''>
                                        <h1 className='font-bold'>{activity.user.fullName}</h1>
                                        <h1 className='text-secondary'>{activity.user.address}</h1>
                                    </div>
                                </div>
                                <div className='text-secondary'>Hôm nay</div>
                            </div>
                            <div>Chăm sóc mèo tại nhà: <span className='text-green-500'>15 tháng 10</span> - <span className='text-green-500'>21 tháng 10</span></div>
                            <hr />
                        </Link>
                    ))) : (
                        <div>
                            <h1>Hiện tại chưa có lịch</h1>
                        </div>
                    )

                    }
                </div>
            </div>
        </div>
    )
}

export default Page

