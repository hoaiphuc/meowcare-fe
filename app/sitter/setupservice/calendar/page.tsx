'use client'

import { useEffect, useState } from 'react';
import styles from './calendar.module.css';
import { Button } from '@nextui-org/react';
import axiosClient from '@/app/lib/axiosClient';
import { UserLocal } from '@/app/constants/types/homeType';

const Calendar = () => {
    // const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
    const [daysOfWeek, setDaysOfWeek] = useState([
        { key: "monday", name: "Thứ 2", isAvailable: true },
        { key: "tuesday", name: "Thứ 3", isAvailable: true },
        { key: "wednesday", name: "Thứ 4", isAvailable: true },
        { key: "thursday", name: "Thứ 5", isAvailable: true },
        { key: "friday", name: "Thứ 6", isAvailable: true },
        { key: "saturday", name: "Thứ 7", isAvailable: true },
        { key: "sunday", name: "Chủ nhật", isAvailable: true },
    ]);
    const [next15Days, setNext15Days] = useState<{ date: Date; isAvailable: boolean }[]>([]);
    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };
    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    useEffect(() => {
        const today = new Date();
        const days = [];
        for (let i = 0; i <= 13; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            days.push({ date, isAvailable: true });
        }
        setNext15Days(days);
    }, []);

    useEffect(() => {
        try {
            axiosClient(`sitter-unavailable-dates/sitter/${userId}`)
        } catch (error) {

        }
    }, [userId])

    const toggleDateAvailability = (index: number) => {
        setNext15Days((prevDays) =>
            prevDays.map((day, i) =>
                i === index ? { ...day, isAvailable: !day.isAvailable } : day
            )
        );
    };

    const handleUpdate = () => {
        try {
            const unavailable = next15Days.filter((day) => !day.isAvailable).map((day) => day.date);
            // setUnavailableDates(unavailable);
            console.log("Unavailable Dates:", unavailable);
            // axiosClient("sitter-unavailable-dates", unavailableDates)
        } catch (error) {

        }
    }

    return (
        <div className="flex items-center justify-center my-5 ">
            <div className=' w-[1000px] flex flex-col'>
                <div>
                    <div className='mb-10'>
                        <h1 className={styles.h1}>Thời gian nhận đặt lịch</h1>
                        <h2>Hãy bỏ chọn những ngày bạn không muốn nhận việc</h2>
                    </div>
                    <div className="flex mb-5">
                        {daysOfWeek.map((day) => (
                            <div
                                className={`w-[130px] h-[70px] cursor-pointer ${day.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                                key={day.key}
                                onClick={() =>
                                    setDaysOfWeek((prevDays) =>
                                        prevDays.map((d) =>
                                            d.key === day.key ? { ...d, isAvailable: !d.isAvailable } : d
                                        )
                                    )
                                }
                            >
                                <div
                                    className={`w-[130px] h-[70px]  flex items-center justify-center text-white `}
                                >
                                    {day.name}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-wrap">
                        {next15Days.map((day, index) => (
                            <div
                                key={index}
                                className={` w-[130px] h-[70px] flex justify-center items-center cursor-pointer ${day.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                                onClick={() => toggleDateAvailability(index)}
                            >
                                <p className="text-white font-semibold">
                                    {day.date.toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <Button onClick={handleUpdate}>Cập nhật</Button>
            </div>
        </div>
    );
};

export default Calendar;
