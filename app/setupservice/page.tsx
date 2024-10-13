'use client'

import { Icon } from '@iconify/react';
import { Avatar, Button } from '@nextui-org/react';
import Image from 'next/image';
import styles from './setupservice.module.css';
const Page = () => {
    return (
        <div className='flex flex-cols-2 mx-72 my-10 gap-3 '>
            <div className='flex flex-col gap-2 w-96'>
                <div className='flow-root'>
                    <Avatar src='/User-avatar.png' className='float-left h-20 w-20' />
                </div>
                <h1 className={styles.h1}>Nguyễn Lê Đức Tấn</h1>

                <h1 className='text-xs font-semibold'>Địa chỉ: Linh Xuân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</h1>
                <div className='shadow-xl p-2'>
                    <h1 className='font-semibold text-xl'>Dịch vụ</h1>
                    <div className=' flex flex-col'>
                        <div className='flex'>
                            {/* <Image src='/besitter/camera-pet.png' alt='' width={64} height={54} className='max-h-[54px]' /> */}
                            <Icon icon="cbi:camera-pet" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text text-xl font-semibold'>Gửi thú cưng</h1>
                                <p className={styles.p}>Tại nhà người chăm sóc</p>
                                <p className={styles.p}>Giá 100.000đ mỗi đêm</p>
                            </div>
                        </div>
                        <div className='flex'>
                            <Icon icon="mdi:home-find" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text text-xl font-semibold'>Trông tại nhà</h1>
                                <p className={styles.p}>Tại nhà bạn</p>
                                <p className={styles.p}>Giá 150.000đ mỗi đêm</p>
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

            <div >
                <div className='bg-white p-3 mb-5'>
                    <Image src="/service/cat1.png" alt='' width={592} height={297} />
                </div>
                <div>
                    <textarea className={styles.textareaTitle} defaultValue='Tôi có kinh nghiệm chăm sóc mèo 10 năm' />
                    <h1 className={styles.h1}>Kinh nghiệm chăm sóc mèo:</h1>
                    <textarea className={styles.textarea} defaultValue='Tôi là Tấn, một người rất yêu thích mèo và đã gắn bó với chúng từ khi còn nhỏ. Tôi bắt đầu chăm sóc bé mèo đầu tiên của mình từ khi 10 tuổi, và từ đó, tình yêu dành cho loài vật đáng yêu này ngày càng lớn dần.' />
                </div>
                <hr className={styles.hr} />

                <h1 className={styles.h1}>Thời gian chăm sóc </h1>
                <textarea className={styles.textarea} defaultValue={'6:00 - 7:00 AM: Cho mèo ăn sáng và vệ sinh khay cát'} />
                <hr className={styles.hr} />

                <h1 className={styles.h1}>Thông tin về người chăm sóc</h1>
                <h2 className='text-[18px] my-3 font-semibold'>Kỹ năng</h2>
                <div className='grid grid-cols-3'>
                    <h3 className='border items-center flex justify-center p-3 rounded-full border-[#666666]'>Hiểu về dinh dưỡng</h3>
                </div>
                <h2 className='text-[18px] my-3 font-semibold'>Thông tin về nơi ở</h2>
                <textarea className={styles.textarea} defaultValue={'Sống trong một ngôi nhà'} />

                <h1 className='mt-10 text-xl font-semibold'>An toàn, tin cậy & môi trường</h1>
                <textarea className={styles.textarea} defaultValue={'Hiện tại tôi có một căn hộ nhỏ. Tuy nhiên, tôi có thể chăm sóc chúng tại căn hộ của tôi khi không có lựa chọn nào khác.'} />

                <h1 className='mt-10 text-xl font-semibold'>Thông tin muốn biết về thú cưng của bạn</h1>
                <textarea className={styles.textarea} defaultValue={"Hiện tại tôi có một căn hộ nhỏ. Tuy nhiên, tôi có thể chăm sóc chúng tại căn hộ của tôi khi không có lựa chọn nào khác."} />
            </div>
        </div>
    )
}

export default Page