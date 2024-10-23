'use client'

import React from 'react'
import styles from './pay.module.scss';
import { Button, Radio, RadioGroup } from '@nextui-org/react';
import Image from 'next/image';

const page = () => {
    return (
        <div className={` flex justify-center items-center m-14`}>
            <div className='flex flex-col justify-center items-center border border-black rounded-lg w-[650px] p-10 gap-5'>
                <h1 className={styles.h1}>Thanh toán dịch vụ</h1>
                <p className={styles.p}>Cảm ơn quý khách đã đặt lịch dich vụ của MeowCare. Xin vui lòng xem kỹ chi tiết đặt dịch vụ dưới đây và chọn phương thức thanh toán.</p>
                <div className='flex items-start justify-start flex-col w-full'>
                    <h2 className={styles.h2}>Thông tin quý khách</h2>
                    <div className={`${styles.h3} grid grid-cols-2 w-80`}>
                        <h3 className={styles.h3}>Họ và tên: </h3>
                        <h3 >phuc</h3>
                        <h3 className={styles.h3}>Điện thoại: </h3>
                        <h3 >03232323</h3>
                        <h3 className={styles.h3}>Email:</h3>
                        <h3 > hoaiphuc@gmail.com</h3>
                    </div>
                </div>
                <div className='flex items-start justify-start flex-col w-full'>
                    <h2 className={styles.h2}>Thông tin đặt lịch của bạn</h2>
                    <div className='grid grid-cols-2 w-80'>
                        <h3 className={styles.h3}>Mã đặt hàng</h3> <h3>123</h3>
                        <h3 className={styles.h3}>Dịch vụ</h3> <h3>Gửi thú cưng</h3>
                        <h3 className={styles.h3}>Ngày gửi</h3> <h3>04/09/2024   8:00</h3>
                        <h3 className={styles.h3}>Ngày Nhận</h3> <h3>05/09/2024   15:00</h3>
                        <h3 className={styles.h3}>Người chăm sóc</h3> <h3>Đức Tấn</h3>
                        <h3 className={styles.h3}>Số lượng thú cưng</h3> <h3>1</h3>
                    </div>
                </div>

                <div className='flex flex-col items-start justify-start w-full'>
                    <h2 className={styles.h2}>Tổng giá dịch vụ</h2>
                    <div className='grid grid-cols-5 w-full'>
                        <div className={styles.money}>123</div>
                        <div className={`${styles.money} col-span-2`}>Đức Tấn</div>
                        <div className={styles.money}>150.000</div>
                        <div className={styles.money}>VND</div>

                        <div className={`${styles.money} col-span-3`}>Tổng cộng</div>
                        <div className={styles.money}>150.000</div>
                        <div className={styles.money}>VND</div>
                    </div>
                </div>

                <div className='flex flex-col items-start justify-start w-full gap-3'>
                    <h2 className={styles.h2}>Chọn phương thức thanh toán</h2>
                    <RadioGroup
                        aria-label="Select payment"
                        // color=""
                        className='w-full flex flex-col '
                    >
                        <div className='border border-black p-3'>
                            <Radio value="qr" className='px-5'>
                                <div className='flex items-center'>
                                    <Image src='/nganhang.png' alt='' width={50} height={50} className='mx-3 w-[50px] h-[50px]' />
                                    <div>
                                        <h1 className={styles.paymentHeading1}>Thanh toán qua tài khoản ngân hàng</h1>
                                        <h2 className={styles.paymentHeading2}>Thanh toán bằng mã VietQR</h2>
                                    </div>
                                </div>
                            </Radio>
                        </div>
                        <div className='border border-black mt-[-8px] p-3'>
                            <Radio value="cash" className='px-5' aria-label='j'>
                                <div className='flex items-center'>
                                    <Image src='/cash.png' alt='' width={51} height={44} className='mx-3 w-[51px] h-[44px]' />
                                    <div>
                                        <h1 className={styles.paymentHeading1}>Thanh toán bằng tiền mặt</h1>
                                        <h2 className={styles.paymentHeading2}>Sau khi hoàn thành dịch vụ</h2>
                                    </div>
                                </div>
                            </Radio>
                        </div>
                    </RadioGroup>
                    <div className='w-full flex justify-center'>
                        <Button className='bg-btnbg text-white w-[206px] rounded-full h-[42px]'>Thanh toán</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default page