import React from 'react'
import styles from './manageservice.module.css'
import Link from 'next/link'

const Page = () => {
    return (
        <div className='flex flex-col gap-5 justify-center mx-5 my-36'>
            <Link href='/setupservice' className={styles.h1}>Quản lí hồ sơ</Link>
            <Link href='/managebooking' className={styles.h1}>Quản lí đặt lịch</Link>
        </div>
    )
}

export default Page