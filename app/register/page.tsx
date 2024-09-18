'use client'

import React, { useState } from 'react'
import { faEnvelope, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'


const Register = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);
    return (
        <div className='flex bg-login-bg bg-cover items-center justify-center'>
            <div className='bg-white w-[1360px] h-[700px] m-5  rounded-[70px] grid grid-cols-1 md:grid-cols-2 md:m-[82px]'>
                <div className='flex flex-col justify-center items-center gap-10 px-20'>
                    <h1 className='text-[40px] font-bold '>Đăng ký</h1>
                    <div className='flex gap-10'>
                        < Image src="/media/fb.png" alt='' width={50} height={50} />
                        < Image src="/media/gg.webp" alt='' width={50} height={50} />
                    </div>
                    <Input
                        className=''
                        size='lg'
                        type="text"
                        placeholder="Họ và tên"
                        labelPlacement="outside"
                        endContent={
                            <FontAwesomeIcon icon={faUser} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                    <Input
                        className=''
                        size='lg'
                        type="email"
                        placeholder="Email"
                        labelPlacement="outside"
                        endContent={
                            <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                    <Input
                        type={isVisible ? "text" : "password"}
                        size='lg'
                        placeholder="Mật khẩu"
                        labelPlacement="outside"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <FontAwesomeIcon icon={faEye} className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Input
                        type={isVisible ? "text" : "password"}
                        size='lg'
                        placeholder="Nhập lại mật khẩu"
                        labelPlacement="outside"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <FontAwesomeIcon icon={faEye} className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Button className='bg-[#2BAAE7] text-2xl font-semibold text-white p-8 px-20 rounded-full'>Đăng ký</Button>
                </div>

                {/* section 2 */}
                <div className='bg-[#FACFE2] rounded-r-[70px] bg-[url("/login/registerBG.png")] bg-no-repeat bg-left bg-contain'>
                    <div className='text-2xl text-white flex justify-end items-center h-full flex-col gap-3 text-center px-10'>
                        <h1 className='text-4xl font-bold'>Chào mừng bạn quay trở lại</h1>
                        <h1 className='text-2xl font-bold'>Tham gia ngay để bắt đầu hành trình cùng những chú mèo đáng yêu!</h1>
                        <Button as={Link} className='my-10 border-white bg-transparent text-white border px-14 py-7 rounded-full text-2xl' href='/login'>Đăng nhập</Button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Register