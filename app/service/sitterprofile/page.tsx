'use client'

import { faCircle, faMessage, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button } from '@nextui-org/react';
import Image from 'next/image';
import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import './sitterprofile.scss'
const Page = () => {
    const [isClicked, setIsClicked] = useState(false);


    const handleClick = () => {
        setIsClicked(!isClicked); // Toggle the state
    };


    return (
        <div className='flex flex-cols-2 mx-96 my-10 gap-3 '>
            <div className='flex flex-col gap-2 w-72'>
                <div className='flow-root'>
                    <Avatar src='/User-avatar.png' className='float-left h-20 w-20' />
                    <button onClick={() => handleClick()} className='float-right'>
                        {/* <Heart className={`transition-colors size-3 ${isClicked ? 'fill-red-500 text-red-500 ' : ''}`} /> */}
                        <Icon icon="mdi:heart" className={`transition-colors size-3 ${isClicked ? 'text-red-500  ' : ''}`} />
                    </button>
                </div>
                <h1 className='text-xl font-semibold'>Nguyễn Lê Đức Tấn</h1>

                <h1 className='text-xs font-semibold'>Địa chỉ: Linh Xuân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</h1>
                <div className='flex gap-1 text-[10px] text-[#66625F]'>
                    <FontAwesomeIcon icon={faStar} className='text-[#F8B816] size-3' />
                    <p>5.0</p>
                    <FontAwesomeIcon icon={faCircle} className='text-text size-1 self-center px-1' />
                    <p>15 Đánh giá</p>
                </div>
                <div className='flex gap-3'>
                    <Button className='w-44 rounded-full text-white bg-[#2E67D1]'>Đặt lịch</Button>
                    <Button className='rounded-full bg-[#2E67D1] text-white min-w-8 min-h-8'>
                        <FontAwesomeIcon icon={faMessage} />
                    </Button>
                </div>

                <div className='shadow-xl p-2'>
                    <h1 className='font-semibold text-xl'>Dịch vụ</h1>
                    <div className=' flex flex-col'>
                        <div className='flex'>
                            {/* <Image src='/besitter/camera-pet.png' alt='' width={64} height={54} className='max-h-[54px]' /> */}
                            <Icon icon="cbi:camera-pet" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text'>Gửi thú cưng</h1>
                                <p>Tại nhà người chăm sóc</p>
                                <p>Giá 100.000đ mỗi đêm</p>
                            </div>
                        </div>
                        <div className='flex'>
                            <Icon icon="mdi:home-find" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text'>Trông tại nhà</h1>
                                <p>Tại nhà bạn</p>
                                <p>Giá 150.000đ mỗi đêm</p>
                            </div>
                        </div>
                        <Button className='button '>Xem chi tiết giá</Button>
                    </div>

                    <div className='my-5 flex flex-col'>
                        <h1>Dịch vụ thêm có phí</h1>
                        <ul>
                            <li>Chải lông mèo: 50.000đ</li>
                            <li>Vệ sinh tai và mắt: 30.000đ</li>
                            <li>Cho ăn thức ăn đặc biệt: 30.000đ</li>
                            <li>Bổ sung vitamin: 30.000đ</li>
                        </ul>
                        <Button className='button '>Xem chi tiết yêu cầu thêm </Button>
                    </div>

                    <h1>Thời gian làm việc</h1>
                    <p>Hiện tại tôi đang làm đồ án của trường ĐH FPT. Vì vậy, tôi có thể học ở bất cứ đâu và tôi khá linh hoạt về thời gian.</p>
                </div>
            </div>

            <div >
                <div className='bg-white p-3'>
                    <Image src="/service/cat1.png" alt='' width={592} height={297} />
                </div>
                <div>
                    <h1>Cat sitter</h1>
                    <h1>Kinh nghiệm chăm sóc mèo:</h1>
                    <p>Tôi là Tấn, một người rất yêu thích mèo và đã gắn bó với chúng từ khi còn nhỏ. Tôi bắt đầu chăm sóc bé mèo đầu tiên của mình từ khi 10 tuổi, và từ đó, tình yêu dành cho loài vật đáng yêu này ngày càng lớn dần. Với kinh nghiệm và sự tận tâm, tôi luôn mong muốn mang lại sự thoải mái và an toàn nhất cho mỗi bé mèo mà tôi chăm sóc....
                        Đọc thêm</p>
                </div>
                <hr />

                <h1>Thời gian chăm sóc </h1>
                <p>6:00 - 7:00 AM: Cho mèo ăn sáng và vệ sinh khay cát</p>
                <p>  7:00 - 9:00 AM: Quan sát sức khỏe và chơi với mèo</p>
                <hr />

                <h1>Đánh giá</h1>
                <div className='grid grid-cols-2 gap-3'>
                    <div>
                        <div className='flex items-center gap-3'>
                            <Avatar src='/User-avatar.png' />
                            <h2>Nguyễn Hoài Phúc</h2>
                        </div>
                        <h3>Gửi thú cưng   30/08/2024</h3>
                        <p>Đức Tấn là một người chăm sóc thú cưng chuyển nghiệp mà tôi yên tâm gửi bé!</p>
                    </div>
                </div>
                <hr />

                <h1>Thông tin về người chăm sóc</h1>
                <h2 className='text-[18px] my-3'>Kỹ năng</h2>
                <div className='grid grid-cols-3'>
                    <h3 className='border items-center flex justify-center p-3 rounded-full border-[#666666]'>Hiểu về dinh dưỡng</h3>
                </div>
                <h2 className='text-[18px] my-3'>Thông tin về nơi ở</h2>
                <p className='text-[#000857]'>Sống trong một ngôi nhà</p>

                <h1 className='mt-10'>An toàn, tin cậy & môi trường</h1>
                <p>Hiện tại tôi có một căn hộ nhỏ. Tuy nhiên, tôi có thể chăm sóc chúng tại căn hộ của tôi khi không có lựa chọn nào khác. Tôi có thể đến căn hộ của bạn trong thời gian còn lại. Tôi có gắn camera theo dõi quá trình chăm sóc nếu bạn muốn xem quá trình Ứng dụng giám sát: App(name) IOS Sau khi booking tôi sẽ gửi tài khoản mật khẩu để bạn có thể theo dõi quá trình chăm sóc.</p>
          
                    <h1 className='mt-10'>Thông tin Đức Tấn muốn biết về thú cưng của bạn</h1>
                    <p>Rất muốn biết tính khí của thú cưng của bạn và bất kỳ loại thức ăn cụ thể nào mà chúng cần hoặc nếu bạn cũng có thể cung cấp những thứ này. Tôi cũng muốn biết chúng được huấn luyện đi vệ sinh tốt như thế nào và nếu bạn cần tôi cung cấp hộp vệ sinh hay không (chỉ dành cho mèo).</p>
                    </div>
        </div>
    )
}

export default Page