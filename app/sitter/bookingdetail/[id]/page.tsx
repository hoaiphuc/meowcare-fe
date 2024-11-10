'use client'

import { Order } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faHandshake, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Textarea } from '@nextui-org/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const param = useParams();
    const [data, setData] = useState<Order>();
    useEffect(() => {
        try {
            axiosClient(`booking-orders/${param.id}`)
                .then((res) => {
                    setData(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [param.id])

    //denied request
    const handleDenied = (bookingId: string) => {
        try {
            axiosClient(`${bookingId}`)
        } catch (error) {

        }
    }
    //accept request
    const handleAccept = (bookingId: string) => {
        try {
            axiosClient(`${bookingId}`)
        } catch (error) {

        }
    }


    return (
        <div className='flex justify-center items-center my-5 '>
            {data &&
                <div key={data.id} className='flex gap-5'>
                    <div className='flex flex-col gap-5 w-[400px]'>
                        <div className='bg-white rounded-md shadow-xl flex justify-center items-center'>
                            <FontAwesomeIcon icon={faTriangleExclamation} size='2xl' className='text-yellow-400' />
                            <h1 className='text-black p-5 text-2xl font-semibold'>Yêu cầu này chưa được đặt</h1>
                        </div>
                        <div className='bg-[#3F4346] text-white p-5 rounded-md shadow-xl font-medium flex flex-col gap-3'>
                            <h1>{data.bookingDetailWithPetAndServices[0].service.serviceName}</h1>
                            <h1>15 tháng 10 - 16 tháng 10</h1>
                            <h1>Giờ bắt đầu: 5:00 sáng</h1>
                            <h1>Giờ kết thúc: 5:00 chiều</h1>
                            <h1>Bé mèo: {data.bookingDetailWithPetAndServices[0].pet.petName}</h1>

                            <div className='bg-white rounded-md text-black p-5 my-5'>
                                <h1>Bảng giá</h1>
                                <hr className='my-2' />
                                <div className='flex justify-between'>
                                    <div>
                                        <h1 className='text-lg'>{data.bookingDetailWithPetAndServices[0].pet.petName}</h1>
                                        <h1 className='text-secondary'>150.000 x 6 đêm</h1>
                                    </div>
                                    <h2>150.000đ</h2>
                                </div>
                                <hr className='my-2' />
                                <div className='flex justify-between'>
                                    <h1>Tổng tiền:</h1>
                                    <h1>150.000đ</h1>
                                </div>
                            </div>

                            <h1>Đặt lịch và thanh toán trên Meowcare bắt buộc tuân theo <Link href='/termsofservice' className='underline font-semibold'>điều khoản của Meowcare</Link>.</h1>
                            <Button className='text-red-500 bg-white font-semibold text-[16px] border-b-red-500' onClick={() => handleDenied(data.id)}>Từ chối</Button>
                            <Button className='bg-btnbg text-white text-[16px]' onClick={() => handleAccept(data.id)}>Chấp nhận</Button>
                        </div>
                    </div>
                    <div className=' flex flex-col gap-3 w-[850px]'>
                        <div className=' bg-white shadow-xl rounded-md p-5 flex flex-col gap-5'>
                            <h1 className='text-xl font-semibold'>Chào nhau</h1>
                            <div className='flex gap-5 items-center text-black'>
                                <FontAwesomeIcon icon={faHandshake} size='2xl' className='text-[#4BA3C1]' />
                                <p>Hãy gửi một lời chào đển {data.user.fullName}. Lên lịch và có một cuộc gặp mặt nhau thông qua tin nhắn.</p>
                            </div>
                            <Button className='rounded-full text-black bg-[#f1f1f3] font-semibold w-36'>Đến tin nhắn</Button>

                        </div>
                        <div className='bg-white w-full h-full shadow-2xl rounded-md p-5'>
                            <h1 className='font-semibold text-2xl my-3'>Tin nhắn</h1>
                            <div className='bg-[#BBBBBF] p-3 rounded-xl'>
                                <Textarea className='bg-white rounded-xl' variant='bordered' placeholder={`Gửi một tin nhắn mới cho ${data.user.fullName}`} />
                                <div className='flex justify-end mt-3 mb-5'>
                                    <Button className='bg-btnbg rounded-full text-white text-xl'>Gửi</Button>
                                </div>
                            </div>
                            <div className='text-black my-5 flex justify-center items-center'>
                                <h1 >
                                    Đặt lịch và thanh toán trên Meowcare bắt buộc tuân theo <Link href='/termsofservice' className='underline font-semibold'>điều khoản của Meowcare</Link>.
                                </h1>
                            </div>
                            <div className='bg-[#d0d0d3] p-3 rounded-xl text-black flex flex-col gap-2'>
                                <h1 className='text-xl'>Bạn nhận được yêu cầu này nhưng:</h1>
                                <ul className='ml-3'>
                                    <li>- Bạn ở xa và không muốn nhận</li>
                                    <li>- Bạn không quá tập trung vào công việc này</li>
                                </ul>
                                <h1>Nếu bạn từ chối yêu cầu này, nó sẽ không ảnh hưởng đến thứ hạng tìm kiếm của bạn. Bạn nên gửi 1 tin nhắn đến người yêu cầu để xác nhận nếu từ chối yêu cầu này.</h1>
                                <h1>Bạn có thể tắt hoạt động cho dịch vụ của bạn nếu như không cần thiết, bạn có thể bật lại bất cứ lúc nào.</h1>
                                <Button className='rounded-full text-black bg-[#f1f1f3] font-semibold w-36'>Tắt nhận yêu cầu</Button>
                            </div>
                        </div>
                    </div>

                </div>

            }
        </div>
    )
}
export default Page