'use client'

import { Button } from '@nextui-org/react'
import React, { useState } from 'react'
import styles from './calendar.module.css'

const Calendar = () => {
    const [daysOfWeek, setDaysOfWeek] = useState([
        { key: "2", name: "Thứ 2", isAvailable: true },
        { key: "3", name: "Thứ 3", isAvailable: true },
        { key: "4", name: "Thứ 4", isAvailable: true },
        { key: "5", name: "Thứ 5", isAvailable: true },
        { key: "6", name: "Thứ 6", isAvailable: true },
        { key: "2", name: "Thứ 2", isAvailable: true },
        { key: "8", name: "Chủ nhật", isAvailable: true },
    ])

    const handleDate = (id: string) => {
        setDaysOfWeek((prevDays) =>
            prevDays.map((day) =>
                day.key === id ? { ...day, isAvailable: !day.isAvailable } : day
            )
        );
    }

    return (
        <div className='flex items-center justify-center my-5'>
            <div>
                <div>
                    <h1 className={styles.h1}>Thời gian nhận đặt lịch</h1>
                    <div className='flex '>

                        <div className='bg-green-500'>12/12</div>
                        <div>13/12</div>
                    </div>
                </div>

                <div className='flex gap-3'>
                    {
                        daysOfWeek.map((day) => (
                            <div key={day.key}>
                                {day.isAvailable ?
                                    <Button className='' radius='none' onClick={() => handleDate(day.key)}>
                                        {day.name}
                                    </Button>
                                    :
                                    <Button className='' radius='none' onClick={() => handleDate(day.key)}>
                                        {day.name}
                                    </Button>
                                }
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Calendar