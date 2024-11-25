import { Button } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Success = () => {
    return (
        <div className='flex justify-center items-center '>
            <div className='w-[893px] flex flex-col justify-center items-center text-center'>
                <Image src='/cathappy.png' alt='' width={453} height={292} />
                <h1 className='text-[#2CA12C] font-semibold text-3xl'>Chúc mừng! Bạn đã hoàn thành tất cả các bước cần thiết để trở thành người chăm sóc mèo.</h1>
                <h2 className='font-semibold text-[16px] text-secondary'>Chúng tôi sẽ xem xét hồ sơ của bạn và liên hệ trong vòng 1-3 ngày làm việc. Vui lòng kiểm tra hộp thư email của bạn thường xuyên để nhận thông báo và cập nhật từ chúng tôi.</h2>
                <Button as={Link} href='/' className='my-10 rounded-full text-white bg-[#FF5B2E] px-10' size='lg'>Trở về trang chủ</Button>
            </div>
        </div>
    )
}

export default Success