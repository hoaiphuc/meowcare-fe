import { Button, Divider } from '@nextui-org/react'
import Image from 'next/image'
import React from 'react'
import "./besitter.scss"
const BeSister = () => {
    return (
        <div>
            <div className='bg-[url("/besitter/bg.png")] bg-cover'>
                <div className='flex flex-col gap-3 justify-center items-center pt-80 pb-36 text-white px-[500px] text-center'>
                    <h1 className='font-bold text-4xl'>Trở thành người chăm sóc mèo</h1>
                    <h1 className='font-semibold text-2xl '>Nếu mèo là đam mê của bạn, hãy gia nhập và trở thành người chăm sóc đáng tin cậy cho những chú mèo cần được yêu thương!</h1>
                    <Button className='bg-[#2E67D1] rounded-full text-white mt-10 px-20 py-8 font-semibold text-xl'>Bắt đầu</Button>
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
                <div className='flex justify-center items-center gap-70 text-center '>
                    <div className='ml-[-90px] px-10'>
                        <h1 className='circle-h1'>Xác minh hồ sơ</h1>
                        <p className='circle-p'>Gồm 4 bước xác minh thông tin đăng ký của bạn. Điều này giúp đảm bảo bạn đủ điều kiện trở thành người chăm sóc mèo</p>
                    </div>
                    <div>
                        <h1 className='circle-h1'>Tạo hồ sơ giới thiệu</h1>
                        <p className='circle-p'>Chúng tôi hướng dẫn bạn xây dựng hồ sơ thể hiện thông tin mà chủ vật nuôi quan tâm.</p>
                    </div>
                    <div>
                        <h1 className='circle-h1'>Nhận yêu cầu chăm sóc</h1>
                        <p className='circle-p'>Người chăm sóc mèo nhận yêu cầu từ chủ mèo. Bắt đầu quá trình chăm sóc, đảm bảo mèo được yêu thương trong thời gian chủ vắng mặt.</p>
                    </div>
                    <div>
                        <h1 className='circle-h1'>Nhận thanh toán</h1>
                        <p className='circle-p'>Sau khi hoàn thành quá trình chăm sóc. Thanh toán có thể được rút sau hai ngày kể từ khi bạn hoàn thành dịch vụ.</p>
                    </div>
                </div>
                <Button className='bg-[#2E67D1] rounded-full text-white mt-10 px-20 py-8 font-semibold text-xl'>Bắt đầu</Button>
            </div>

            <div className='grid grid-cols-2 my-32'>
                <div className='px-32 flex justify-center flex-col items-center gap-10'>
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
                <div></div>
            </div>
        </div>
    )
}

export default BeSister