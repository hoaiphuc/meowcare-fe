import { Button } from '@nextui-org/react'
import React from 'react'
import styles from './calendar.module.css'

const Calendar = () => {
    const daysOfWeek = [
        { key: "2", name: "Thứ 2" },
        { key: "3", name: "Thứ 3" },
        { key: "4", name: "Thứ 4" },
        { key: "5", name: "Thứ 5" },
        { key: "6", name: "Thứ 6" },
        { key: "2", name: "Thứ 2" },
        { key: "8", name: "Chủ nhật" },
    ]
    return (
        <div className='flex items-center justify-center my-5'>
            <div>
                <div>
                    <h1 className={styles.h1}>Thời gian nhận đặt lịch</h1>
                    <div className='bg-green-500'>12/12</div>
                    <div>13/12</div>
                </div>

                <div className='flex gap-3'>
                    {
                        daysOfWeek.map((day) => (
                            <Button key={day.key} className='' radius='none'>{day.name}</Button>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Calendar