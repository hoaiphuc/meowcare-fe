'use client'

import React from 'react'
import styles from './termsofservice.module.css'
import { Accordion, AccordionItem } from '@nextui-org/react'

const Page = () => {

    // Define your accordion items
    const accordionItems = [
        {
            key: "1",
            title: "1. Giới thiệu",
            content: "Chào mừng bạn đến với Meowcare, nền tảng kết nối chủ nuôi mèo với những người chăm sóc mèo đáng tin cậy. Việc sử dụng dịch vụ của chúng tôi đồng nghĩa với việc bạn đồng ý với các điều khoản và điều kiện dưới đây.",
        },
        {
            key: "2",
            title: "2. Chấp Nhận Điều Khoản",
            content: "Bằng việc truy cập và sử dụng trang web này, bạn đồng ý tuân thủ các điều khoản dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của điều khoản, vui lòng không sử dụng dịch vụ của chúng tôi.",
        },
        {
            key: "3",
            title: "3. Mô Tả Dịch Vụ",
            content: "Meowcare cung cấp nền tảng kết nối giữa chủ nuôi mèo và người chăm sóc mèo. Chúng tôi không trực tiếp cung cấp dịch vụ chăm sóc mèo mà chỉ đóng vai trò trung gian.",
        },
    ];

    // Extract keys for defaultExpandedKeys
    const allKeys = accordionItems.map((item) => item.key);

    return (
        <div className='flex flex-col justify-center items-center m-5 mx-[444px]'>
            <h1 className='font-bold text-4xl'>Điều Khoản Dịch Vụ</h1>
            <Accordion defaultExpandedKeys={allKeys} selectionMode="multiple" variant="splitted" className='flex gap-5 py-10'>
                {accordionItems.map((item) => (
                    <AccordionItem
                        className='bg-transparent '
                        key={item.key}
                        aria-label={item.title}
                        title={item.title}
                    >
                        <p className='text-secondary'>{item.content}</p>
                    </AccordionItem>
                ))}
            </Accordion>
            <p className={styles.p}>

            </p>
        </div >
    )
}

export default Page