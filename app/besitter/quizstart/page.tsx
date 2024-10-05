import React from 'react'
import './quiz.css'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
const Page = () => {
    return (
        <div className='flex gap-20 flex-col items-start justify-center m-10'>
            <div className=''>
                <h1 className='text-3xl font-semibold'>Bài kiểm tra kiến thức</h1>
            </div>
            <div className='flex items-center flex-col mx-96 text-center gap-3'>
                <h2>Nhấn nút dưới đây để bắt đầu ngay – mỗi câu hỏi là cơ hội để bạn khám phá thêm những điều thú vị về loài mèo. Bạn đã sẵn sàng chưa? Cùng thử thách bản thân và xem bạn hiểu mèo đến mức nào!</h2>
                <h2>Số lần cho phép: 3</h2>
                <h2>Thời gian giới hạn: 15 phút</h2>
                <Button as={Link} href='/besitter/quiz' className='button bg-[#2E67D1] text-white my-3'>Bắt đầu</Button>
                <Button as={Link} href='/besitter/sitter/2' className='button bg-transparent border'>Trở lại</Button>
            </div>
        </div>
    )
}

export default Page