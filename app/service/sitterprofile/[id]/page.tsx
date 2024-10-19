'use client'

import { faCircle, faMessage, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button } from '@nextui-org/react';
// import Image from 'next/image';
import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import styles from './sitterprofile.module.css'
import Link from 'next/link';
import PhotoGallery from '@/app/components/PhotoGallery';
const Page = () => {
    const [isClicked, setIsClicked] = useState(false);


    const handleClick = () => {
        setIsClicked(!isClicked); // Toggle the state
    };


    return (
        <div className='flex flex-cols-2 my-10 gap-10 px-16 justify-center'>
            <div className='flex flex-col gap-2 w-[352px]'>
                <div className='min-h-[300px]'>
                    <div className='flow-root'>
                        <Avatar src='/User-avatar.png' className='float-left h-20 w-20' />
                        <button onClick={() => handleClick()} className='float-right w-10 h-10 border-none'>
                            <Icon icon="mdi:heart" className={`transition-colors w-10 h-10 ${isClicked ? 'text-red-500  ' : ''}`} />
                        </button>
                    </div>
                    <h1 className="text-[30px] font-semibold">Nguyễn Lê Đức Tấn</h1>

                    <h1 className='text-[16px] font-semibold'>Linh Xuân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</h1>
                    <div className='flex gap-1 text-[10px] text-[#3b2f26] items-start'>
                        <FontAwesomeIcon icon={faStar} className='text-[#F8B816] h-5 w-5' />
                        <p className='text-[16px]'>5.0</p>
                        <FontAwesomeIcon icon={faCircle} className='text-text size-1 self-center px-1' />
                        <p className='text-[16px]'>15 Đánh giá</p>
                    </div>
                    <div className='flex gap-3 w-full'>
                        <Button as={Link} href='/service/booking' className='w-full rounded-full text-white bg-[#2E67D1] shadow-sm'>Đặt lịch</Button>
                        <Button className='rounded-full bg-[#2E67D1] text-white w-8 h-10 border-0'>
                            <FontAwesomeIcon icon={faMessage} />
                        </Button>
                    </div>
                </div>

                <div className='shadow-xl p-4 border-[0.5px] rounded-md mt-20'>
                    <h1 className={styles.h1}>Dịch vụ</h1>
                    <div className=' flex flex-col gap-3'>
                        <div className='flex'>
                            {/* <Image src='/besitter/camera-pet.png' alt='' width={64} height={54} className='max-h-[54px]' /> */}
                            <Icon icon="cbi:camera-pet" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text text-xl font-semibold'>Gửi thú cưng</h1>
                                <p className={styles.p}>Tại nhà người chăm sóc</p>
                                <p className={styles.p}>Giá <span className='text-[#2B764F]'>100.000đ</span> <span className='font-semibold'>mỗi đêm</span></p>
                            </div>
                        </div>
                        <div className='flex'>
                            <Icon icon="mdi:home-find" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text text-xl font-semibold'>Trông tại nhà</h1>
                                <p className={styles.p}>Tại nhà bạn</p>
                                <p className={styles.p}>Giá 1<span className='text-[#2B764F]'>150.000đ</span> <span className='font-semibold'>mỗi đêm</span></p>
                            </div>
                        </div>
                        <Button className={styles.button}>Xem chi tiết giá</Button>
                    </div>

                    <div className='my-5 flex flex-col'>
                        <h1 className={styles.h1}>Dịch vụ thêm có phí</h1>
                        <ul className={styles.li}>
                            <li>Chải lông mèo: 50.000đ</li>
                            <li>Vệ sinh tai và mắt: 30.000đ</li>
                            <li>Cho ăn thức ăn đặc biệt: 30.000đ</li>
                            <li>Bổ sung vitamin: 30.000đ</li>
                        </ul>
                        <Button className={styles.button}>Xem chi tiết yêu cầu thêm </Button>
                    </div>

                    <h1 className={styles.h1}>Thời gian làm việc</h1>
                    <p className={styles.p}>Hiện tại tôi đang làm đồ án của trường ĐH FPT. Vì vậy, tôi có thể học ở bất cứ đâu và tôi khá linh hoạt về thời gian.</p>
                </div>
            </div>

            {/* 2 */}
            <div className='w-[745px]'>
                <div className='bg-transparent p-3'>
                    {/* <Image src="/service/cat1.png" alt='' width={592} height={297} /> */}
                    <PhotoGallery />
                </div>
                <div className='mt-20'>
                    <h1 className={styles.h1}>Cat sitter</h1>
                    <h1 className={styles.h1}>Kinh nghiệm chăm sóc mèo:</h1>
                    <p className={styles.p}>Tôi là Tấn, một người rất yêu thích mèo và đã gắn bó với chúng từ khi còn nhỏ. Tôi bắt đầu chăm sóc bé mèo đầu tiên của mình từ khi 10 tuổi, và từ đó, tình yêu dành cho loài vật đáng yêu này ngày càng lớn dần. Với kinh nghiệm và sự tận tâm, tôi luôn mong muốn mang lại sự thoải mái và an toàn nhất cho mỗi bé mèo mà tôi chăm sóc....
                        Đọc thêm</p>
                </div>
                <hr className={styles.hr} />

                <h1 className={styles.h1}>Thời gian chăm sóc </h1>
                <p className={styles.p}>6:00 - 7:00 AM: Cho mèo ăn sáng và vệ sinh khay cát</p>
                <p className={styles.p}>  7:00 - 9:00 AM: Quan sát sức khỏe và chơi với mèo</p>
                <hr className={styles.hr} />

                <h1 className={styles.h1}>Đánh giá</h1>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <div className='flex items-center gap-3'>
                            <Avatar src='/User-avatar.png' />
                            <h2 className={styles.h2}>Nguyễn Hoài Phúc</h2>
                        </div>
                        <h3 className={styles.h3}>Gửi thú cưng   30/08/2024</h3>
                        <p className={styles.p}>Đức Tấn là một người chăm sóc thú cưng chuyển nghiệp mà tôi yên tâm gửi bé!</p>
                    </div>
                </div>
                <hr className={styles.hr} />

                <h1 className={styles.h1}>Thông tin về người chăm sóc</h1>
                <h2 className='text-[18px] my-3 font-semibold'>Kỹ năng</h2>
                <div className='grid grid-cols-3'>
                    <h3 className='border items-center flex justify-center p-3 rounded-full border-[#666666]'>Hiểu về dinh dưỡng</h3>
                </div>
                <h2 className='text-[18px] my-3 font-semibold'>Thông tin về nơi ở</h2>
                <p className={styles.p}>Sống trong một ngôi nhà</p>

                <h1 className='mt-10 text-xl font-semibold'>An toàn, tin cậy & môi trường</h1>
                <p className={styles.p}>Hiện tại tôi có một căn hộ nhỏ. Tuy nhiên, tôi có thể chăm sóc chúng tại căn hộ của tôi khi không có lựa chọn nào khác. Tôi có thể đến căn hộ của bạn trong thời gian còn lại.Tôi có gắn camera theo dõi quá trình chăm sóc nếu bạn muốn xem quá trìnhỨng dụng giám sát: App(name) IOSSau khi booking tôi sẽ gửi tài khoản mật khẩu để bạn có thể theo dõi quá trình chăm sóc.</p>

                <h1 className='mt-10 text-xl font-semibold'>Thông tin muốn biết về thú cưng của bạn</h1>
                <p className={styles.p}>Rất muốn biết tính khí của thú cưng của bạn và bất kỳ loại thức ăn cụ thể nào mà chúng cần hoặc nếu bạn cũng có thể cung cấp những thứ này. Tôi cũng muốn biết chúng được huấn luyện đi vệ sinh tốt như thế nào và nếu bạn cần tôi cung cấp hộp vệ sinh hay không (chỉ dành cho mèo).</p>
            </div>
        </div>
    )
}

export default Page