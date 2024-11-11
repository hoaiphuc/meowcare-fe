import React from 'react'
import styles from './sitter.module.css'
import Link from 'next/link'

const Page = () => {
    return (
        <div className='flex flex-col gap-5 justify-center mx-5 my-36 w-[500px]'>
            <Link href='/sitter/setupservice' className={styles.h1}>Quản lí hồ sơ</Link>
            <Link href='/sitter/managebooking' className={styles.h1}>Quản lí đặt lịch</Link>
        </div>
    )
}

export default Page