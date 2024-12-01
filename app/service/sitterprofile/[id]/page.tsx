'use client'

import { faCircle, faMessage, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button } from '@nextui-org/react';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import styles from './sitterprofile.module.css'
import Link from 'next/link';
import 'yet-another-react-lightbox/styles.css';
import PhotoGallery from '@/app/components/PhotoGallery';
import axiosClient from '@/app/lib/axiosClient';
import { useParams } from 'next/navigation';
import { CatSitter, Service } from '@/app/constants/types/homeType';
import Loading from '@/app/components/Loading';



const Page = () => {
    const params = useParams();
    const [sitterProfile, setSitterProfile] = useState<CatSitter | undefined>();
    const [isClicked, setIsClicked] = useState(false);
    const [isUser, setIsUser] = useState<boolean>();
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([])

    // check user
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = localStorage.getItem('auth-token');
            setIsUser(Boolean(authToken));
        }
    }, []);

    const handleClick = () => {
        setIsClicked(!isClicked); // Toggle the state
    };

    useEffect(() => {
        try {
            axiosClient(`sitter-profiles/sitter/${params.id}`)
                .then((res) => {
                    setSitterProfile(res.data);
                    console.log(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [params])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sitterProfileRes, servicesRes] = await Promise.allSettled([
                    axiosClient(`sitter-profiles/sitter/${params.id}`),
                    axiosClient(`services/sitter/${params.id}`),
                ]);

                // Handle sitter profile response
                if (sitterProfileRes.status === "fulfilled") {
                    setSitterProfile(sitterProfileRes.value.data);
                } else {
                    console.error("Failed to fetch sitter profile:", sitterProfileRes.reason);
                }

                // Handle services response
                if (servicesRes.status === "fulfilled") {
                    setServices(servicesRes.value.data);
                } else {
                    console.error("Failed to fetch services:", servicesRes.reason);
                }

            } catch (error) {
                console.error("An unexpected error occurred:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (isLoading) {
        return <Loading />;
    }

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
                    <div className='gap-2 flex flex-col'>
                        <h1 className="text-[30px] font-semibold">{sitterProfile?.fullName}</h1>
                        <h1 className='text-[16px] font-semibold'>{sitterProfile?.location}</h1>
                        <div className='flex gap-1 text-[10px] text-[#3b2f26] items-start'>
                            <FontAwesomeIcon icon={faStar} className='text-[#F8B816] h-5 w-5' />
                            <p className='text-[16px]'>5.0</p>
                            <FontAwesomeIcon icon={faCircle} className='text-text size-1 self-center px-1' />
                            <p className='text-[16px]'>15 Đánh giá</p>
                        </div>
                    </div>
                    <div className='flex gap-3 w-full mt-7'>
                        <Button as={Link} href={isUser ? `/service/booking/${sitterProfile?.sitterId}` : `/login`} className='w-full rounded-full text-white bg-[#2E67D1] shadow-sm'>Đặt lịch</Button>
                        <Button className='rounded-full bg-[#2E67D1] text-white w-8 h-10 border-0'>
                            <FontAwesomeIcon icon={faMessage} />
                        </Button>
                    </div>
                </div>

                <div className='shadow-xl p-4 border-[0.5px] rounded-md mt-20'>
                    <h1 className={styles.h1}>Dịch vụ</h1>
                    <div className=' flex flex-col gap-3'>
                        {services && services.filter((service) => service.serviceType === "MAIN_SERVICE").map((ser) => (
                            <div className='flex' key={ser.id}>
                                <Icon icon="cbi:camera-pet" className='text-black w-12 h-11' />
                                <div className='text-secondary font-semibold'>
                                    <h1 className='text-text text-xl font-semibold'>{ser.name}</h1>
                                    <p className={styles.p}>{ser.actionDescription}</p>
                                    <p className={styles.p}>Giá <span className='text-[#2B764F]'>{ser.price.toLocaleString("de")}đ</span> <span className='font-semibold'>mỗi đêm</span></p>
                                </div>
                            </div>
                        ))}
                        <Button className={styles.button}>Xem chi tiết giá</Button>
                    </div>

                    <h1 className={styles.h1}>Thời gian làm việc</h1>
                    <p className={styles.p}>Hiện tại tôi đang làm đồ án của trường ĐH FPT. Vì vậy, tôi có thể học ở bất cứ đâu và tôi khá linh hoạt về thời gian.</p>
                </div>
            </div>

            {/* 2 */}
            <div className='w-[745px]'>
                <div className='bg-transparent p-3'>
                    <PhotoGallery />
                </div>
                <div className='mt-20'>
                    <h1 className={styles.h1}>Cat sitter</h1>
                    <h1 className={styles.h1}>Kinh nghiệm chăm sóc mèo:</h1>
                    <p className={styles.p}>{sitterProfile?.bio}</p>
                </div>
                <hr className={styles.hr} />

                <h1 className={styles.h1}>Thời gian chăm sóc</h1>
                {services && services.filter((service) => service.serviceType === "CHILD_SERVICE").map((ser) => (
                    <div key={ser.id} className='flex text-xl items-center gap-3'>
                        <FontAwesomeIcon icon={faCircle} className="text-xs" size='2xs' />
                        <div className={styles.time}>{ser.startTime} giờ - {ser.endTime} giờ: </div>
                        <p className={styles.childService}>{ser.name}</p>
                    </div>
                ))}

                <hr className={styles.hr} />

                {/* Feedback */}
                <h1 className={styles.h1}>Đánh giá</h1>
                <div className='grid grid-cols-2 gap-5'>
                    <div className=''>
                        <div className='flex items-center gap-3 mb-3'>
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