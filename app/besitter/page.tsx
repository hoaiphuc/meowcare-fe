'use client'

import { Button, Divider } from '@nextui-org/react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import "./besitter.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { showConfirmationDialog } from '../components/confirmationDialog'
const BeSister = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Safely access localStorage in useEffect (runs on client-side)
        const storedUser = localStorage.getItem("user");
        setUser(storedUser ? JSON.parse(storedUser) : null);
    }, []);

    const handleNavigate = async () => {
        if (!user) {
            const isConfirmed = await showConfirmationDialog({
                title: 'Bạn cần đăng nhập để đăng ký làm người chăm sóc?',
                confirmButtonText: 'Chắc chắn rồi',
                denyButtonText: 'Để sau nhé',
                confirmButtonColor: '#00BB00',
            });
            if (isConfirmed) {
                router.push("login")
            } else {
                return
            }
        }
        router.push("besitter/sitter/1")
    }

    return (
        <div>
            <div className='bg-[url("/besitter/bg.png")] bg-cover'>
                <div className='flex flex-col gap-3 justify-center items-center pt-80 pb-36 text-white px-[500px] text-center'>
                    <h1 className='font-bold text-4xl'>Trở thành người chăm sóc mèo</h1>
                    <h1 className='font-semibold text-2xl '>Nếu mèo là đam mê của bạn, hãy gia nhập và trở thành người chăm sóc đáng tin cậy cho những chú mèo cần được yêu thương!</h1>
                    <Button onClick={() => handleNavigate()} className='bg-[#2E67D1] rounded-full text-white mt-10 px-20 py-8 font-semibold text-xl'>Bắt đầu</Button>
                </div>
            </div>

            <div className='flex flex-row p-32'>
                <Image src="/image/cat3.png" alt="" width={238} height={253} />
                <h1 className='text-4xl font-semibold flex items-center text-center px-32'>Sau khi đăng ký, bạn sẽ nhận yêu cầu chăm sóc mèo. Bạn sẽ thực hiện các bước sau.</h1>
                <Image src="/besitter/cat2.png" alt="" width={238} height={253} />
            </div>

            <div className='bg-[#FFE3D5] flex justify-center items-center flex-col gap-10 rounded-3xl mx-32 p-20'>
                <h1 className='text-5xl font-semibold'>Quy trình hoạt động</h1>
                <div className='flex justify-center items-center'>
                    <div className='circle-custom'>1</div>
                    <div className='circle-hr'></div>
                    <div className='circle-custom'>2</div>
                    <div className='circle-hr'></div>
                    <div className='circle-custom'>3</div>
                    <div className='circle-hr'></div>
                    <div className='circle-custom'>4</div>
                </div>
                <div className='grid grid-cols-4 justify-center items-start gap-70 text-center '>
                    <div className='ml-[-150px] px-20'>
                        <h1 className='circle-h1'>Xác minh hồ sơ</h1>
                        <p className='circle-p'>Gồm 4 bước xác minh thông tin đăng ký của bạn. Điều này giúp đảm bảo bạn đủ điều kiện trở thành người chăm sóc mèo</p>
                    </div>
                    <div className='ml-[-50px] px-10'>
                        <h1 className='circle-h1'>Tạo hồ sơ giới thiệu</h1>
                        <p className='circle-p'>Chúng tôi hướng dẫn bạn xây dựng hồ sơ thể hiện thông tin mà chủ vật nuôi quan tâm.</p>
                    </div>
                    <div className='mr-[-50px] px-10'>
                        <h1 className='circle-h1'>Nhận yêu cầu chăm sóc</h1>
                        <p className='circle-p'>Người chăm sóc mèo nhận yêu cầu từ chủ mèo. Bắt đầu quá trình chăm sóc, đảm bảo mèo được yêu thương trong thời gian chủ vắng mặt.</p>
                    </div>
                    <div className='mr-[-150px] px-20'>
                        <h1 className='circle-h1'>Nhận thanh toán</h1>
                        <p className='circle-p'>Sau khi hoàn thành quá trình chăm sóc. Thanh toán có thể được rút sau hai ngày kể từ khi bạn hoàn thành dịch vụ.</p>
                    </div>
                </div>
                <Button onClick={() => handleNavigate()} className='bg-[#2E67D1] rounded-full text-white mt-10 px-20 py-8 font-semibold text-xl'>Bắt đầu</Button>
            </div>

            <div className='grid grid-cols-2 my-32'>
                <div className='flex'>
                    <div className='px-32 flex justify-start flex-col items-center gap-10'>
                        <h1 className='text-5xl font-semibold '>Dịch vụ</h1>
                        <div className='flex gap-10'>
                            <Image src='/besitter/camera-pet.png' alt='' width={64} height={54} className='max-h-[54px]' />
                            <div>
                                <h1 className='text-3xl font-semibold'>Gửi thú cưng</h1>
                                <p className='text-xl font-semibold text-secondary '>Chăm sóc mèo qua đêm tại nhà bạn. Người trông giữ cung cấp dịch vụ trông giữ có thể kiếm tiền thông qua việc chăm sóc chu đáo và đảm bảo sự an toàn cho mèo trong suốt thời gian chủ vắng mặt. Dịch vụ này giúp chủ mèo yên tâm, đồng thời tạo cơ hội thu nhập ổn định cho người chăm sóc.</p>
                            </div>
                        </div>
                        <div className='flex gap-10'>
                            <Image src='/besitter/home.png' alt='' width={64} height={54} className='max-h-[54px]' />
                            <div>
                                <h1 className='text-3xl font-semibold'>Trông tại nhà</h1>
                                <p className='text-xl font-semibold text-secondary '>Chăm sóc mèo tại nhà của chủ, giúp những bé mèo không phải thay đổi không gian sống và luôn được yêu thương.</p>
                            </div>
                        </div>
                    </div>
                    <Divider orientation="vertical" />
                </div>

                <div className='flex flex-col justify-start items-center mx-44 text-center gap-10'>
                    <h1 className='text-5xl font-semibold '>An toàn là trên hết</h1>
                    <p className='text-2xl text-[#666089] font-semibold'>Chúng tôi làm việc không biết mệt mỏi để đảm bảo rằng tiếng kêu vui vẻ của mèo luôn vang vọng và tâm trí của chủ những bé mèo luôn yên tâm.</p>
                    <ul className="text-2xl text-[#666089] gap-5 flex flex-col items-start justify-center text-left">
                        <li className="flex">
                            <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
                            Mọi dịch vụ bạn cung cấp trên MeowCare đều được hỗ trợ.
                        </li>
                        <li className="flex">
                            <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
                            Thanh toán trực tuyến an toàn, bảo mật và tiện lợi.
                        </li>
                        <li className="flex ">
                            <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
                            Đội ngũ hỗ trợ hàng đầu luôn túc trực 24/7.
                        </li>
                        <li className="flex ">
                            <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
                            Đào tạo về chăm sóc mèo liên tục cho người chăm sóc mèo.
                        </li>
                    </ul>
                </div>
            </div>

            <div className='flex flex-col justify-center items-center gap-5'>
                <h1 className='text-[32px] font-semibold'>Kết nối với chủ vật nuôi sau khi hồ sơ của bạn được chấp thuận</h1>
                <Button onClick={() => handleNavigate()} className='bg-btnbg  text-xl p-6 rounded-full text-white'>Bắt đầu xây dựng hồ sơ</Button>
            </div>

        </div>
    )
}

export default BeSister