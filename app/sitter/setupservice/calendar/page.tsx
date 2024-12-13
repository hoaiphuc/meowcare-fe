'use client'
import { useEffect, useState } from 'react';
import styles from './calendar.module.css';

const Calendar = () => {
    const [daysOfWeek, setDaysOfWeek] = useState([
        { key: "2", name: "Thứ 2", isAvailable: true },
        { key: "3", name: "Thứ 3", isAvailable: true },
        { key: "4", name: "Thứ 4", isAvailable: true },
        { key: "5", name: "Thứ 5", isAvailable: true },
        { key: "6", name: "Thứ 6", isAvailable: true },
        { key: "8", name: "Chủ nhật", isAvailable: true },
    ]);

    const [next15Days, setNext15Days] = useState<Date[]>([]);

    useEffect(() => {
        const today = new Date();
        const days = [];
        for (let i = 0; i <= 15; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            days.push(date);
        }
        setNext15Days(days);
    }, []);

    const handleDate = (id: string) => {
        setDaysOfWeek((prevDays) =>
            prevDays.map((day) =>
                day.key === id ? { ...day, isAvailable: !day.isAvailable } : day
            )
        );
    };

    return (
        <div className="flex items-center justify-center my-5 ">
            <div className=' w-[900px] flex flex-col'>
                <div>
                    <div className='mb-10'>
                        <h1 className={styles.h1}>Thời gian nhận đặt lịch</h1>
                        <h2>Hãy bỏ chọn những ngày bạn không muốn nhận việc</h2>
                    </div>
                    <div className="flex">
                        {daysOfWeek.map((day) => (
                            <div
                                className={`w-[130px] h-[70px] cursor-pointer ${day.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}
                                key={day.key}
                                onClick={() => handleDate(day.key)}
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
                        {next15Days.map((date, index) => (
                            <div
                                key={index}
                                className="bg-blue-500 w-[130px] h-[70px] flex justify-center items-center"
                            >
                                <p className="text-white font-semibold">
                                    {date.toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Calendar;
