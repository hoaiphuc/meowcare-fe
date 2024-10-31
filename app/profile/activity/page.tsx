import { Button } from '@nextui-org/react'
import React from 'react'
import styles from './activity.module.css'
const Page = () => {
    return (
        <div className="w-[891px]  bg-white rounded-2xl shadow-2xl">
            <div className="ml-20 w-full gap-5 flex flex-col">
                <h1 className="text-2xl font-bold pt-10">Hoạt động</h1>
                <div className='flex gap-3'>
                    <Button className={styles.button}>Tất cả</Button>
                    <Button className={styles.button}>Chờ xác nhận</Button>
                </div>
                <div className='border w-[700px] p-3 rounded-lg flex justify-between'>
                    <div>
                        <h2><span className={styles.title}>Dịch vụ: </span>Gửi thú cưng</h2>
                        <h2><span className={styles.title}>Người chăm sóc: </span>Minh Nguyệt</h2>
                        <h2><span className={styles.title}>Mèo của bạn: </span>Mồn lèo</h2>
                        <h2><span className={styles.title}>Thời gian: </span></h2>
                        <Button className='bg-btnbg text-white rounded-lg mt-3'>Theo dõi lịch</Button>
                    </div>
                    <div>
                        <h2 className='text-[#FFC107]'>Đang diễn ra</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page