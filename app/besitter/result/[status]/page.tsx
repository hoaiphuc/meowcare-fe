'use client'

import { Button } from '@nextui-org/react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React from 'react'

const Status = () => {
    const param = useParams()
    const result = [
        { id: 'success', title: 'Chúc mừng! Bạn đã vượt qua bài kiểm tra với kết quả xuất sắc!' },
        { id: 'fail', title: 'Không sao, lần sau sẽ tốt hơn! Hãy thử lại nhé!' },
    ];
    const score = param && typeof param.status === 'string' ? Number(param.status) : NaN;

    return (
        <div className='flex justify-center items-center my-10 '>
            {!isNaN(score) && (
                <div className='flex flex-col items-center gap-3'>
                    <h1 className='text-[#000857] font-semibold text-3xl'>Kết quả bài làm</h1>
                    <Image
                        src={score >= 80 ? `/passed.png` : `/NotPass.png`}
                        alt=''
                        width={300}
                        height={300}
                    />
                    <h2 className='font-semibold text-[18px]'>Số điểm của bạn: {score}/100</h2>
                    <h1 className={`text-5xl font-bold ${score >= 80 ? `text-[#3CB878]` : `text-red-600`}`}>
                        {result[score >= 80 ? 0 : 1].title}
                    </h1>
                    <div className='flex mt-10'>
                        {score >= 80 ?
                            <Button as={Link} href='/besitter/sitter/3' className='bg-maincolor text-white px-10' size='lg'>Tiếp theo</Button>
                            :
                            <div>
                                <Button as={Link} href='/besitter/quizstart' variant='bordered' size='lg' className='px-10'>Làm lại</Button>
                            </div>
                        }
                    </div>
                </div>
            )}
        </div>
    )
}

export default Status   