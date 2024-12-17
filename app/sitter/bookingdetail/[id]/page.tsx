'use client'

import { Feedback, Order } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faHandshake, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Textarea } from '@nextui-org/react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { formatDate } from 'date-fns';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const param = useParams();
    const [data, setData] = useState<Order>();
    const [feedback, setFeedback] = useState<Feedback>()

    useEffect(() => {
        try {
            axiosClient(`booking-orders/${param.id}`)
                .then((res) => {
                    const data = res.data
                    setData({
                        ...data,
                        startDate: new Date(data.startDate),
                        endDate: new Date(data.endDate),
                    })
                })
                .catch((e) => {
                    console.log(e);
                })
            axiosClient(`reviews/booking-order/${param.id}`)
                .then((res) => {
                    const responseData = res.data[0]; // Extract the first feedback item
                    if (responseData) {
                        setFeedback({
                            id: responseData.id,
                            comments: responseData.comments,
                            rating: responseData.rating,
                            userId: responseData.user.id,
                            bookingOrderId: responseData.bookingOrder.id,
                        });
                    }
                })
                .catch((e) => {
                    console.error("Error fetching feedback:", e);
                });
        } catch (error) {
            console.log(error);
        }
    }, [param.id])

    return (
        <div className='flex justify-center items-center my-5 '>
            {data &&
                <div key={data.id} className='flex gap-5 '>
                    <div className='flex flex-col gap-5 w-[400px] '>
                        <div className='bg-white rounded-md shadow-xl flex justify-center items-center'>
                            {
                                data.status === "COMPLETED" ?
                                    <FontAwesomeIcon icon={faCircleCheck} size='2xl' className='text-green-400' />
                                    :
                                    <FontAwesomeIcon icon={faTriangleExclamation} size='2xl' className='text-yellow-400' />
                            }
                            <h1 className='text-black p-5 text-2xl font-semibold'>{data.status === "COMPLETED" ? "Yêu cầu này đã hoàn thành" : "Yêu cầu này đã bị hủy"}</h1>
                        </div>
                        <div className='bg-[#FFE3D5] text-black p-5 py-10 rounded-md shadow-xl font-medium flex flex-col gap-3'>
                            <h1 className='font-semibold text-xl'>{data.orderType === "OVERNIGHT" ? "Gửi thú cưng" : "Dịch vụ"}</h1>
                            <h1>
                                {formatDate(data.startDate.toISOString(), "dd/MM/yyyy")}
                                {data.endDate ? ` - ${formatDate(data.endDate.toISOString(), "dd/MM/yyyy")}` : ""}
                            </h1>
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
                        </div>
                    </div>
                    <div className=' flex flex-col gap-3 w-[850px]'>
                        <div className=' bg-white shadow-xl rounded-md p-5 flex flex-col gap-5'>
                            <h1 className='text-xl font-semibold'>Cơ hội</h1>
                            <div className='flex gap-5 items-center text-black'>
                                <FontAwesomeIcon icon={faHandshake} size='2xl' className='text-[#4BA3C1]' />
                                <p>Có cơ hội hãy hợp tác với {data.user.fullName} nhé</p>
                            </div>
                        </div>
                        <div className='bg-white w-full h-full shadow-2xl rounded-md p-5'>
                            <h1 className='font-semibold text-2xl my-3'>{feedback ? "Đánh giá" : "Chưa có đánh giá"}</h1>
                            <div className='bg-from-[#d8ab95] bg-gradient-to-r from-[#fab1a0] to-blue-[#FFE3D5] p-3 rounded-xl'>
                                <Rating readOnly value={feedback?.rating ? feedback?.rating : 0} />

                                <Textarea isReadOnly value={feedback?.comments} className='bg-white rounded-xl' variant='bordered' placeholder="Chưa có đánh giá cho dịch vụ này" />
                            </div>
                            <div className='text-black my-5 flex justify-center items-center'>
                                <h1 >
                                    Đặt lịch và thanh toán trên Meowcare bắt buộc tuân theo <Link href='/termsofservice' className='underline font-semibold'>điều khoản của Meowcare</Link>.
                                </h1>
                            </div>
                            <div className='bg-[#FFE3D5] p-3 rounded-xl text-black flex flex-col gap-2'>
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