'use client'

import { faEnvelope, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

const Login = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <div className='flex bg-login-bg bg-cover items-center justify-center'>
            <div className='bg-white w-[1360px] h-[700px] m-[82px] rounded-[70px] grid grid-cols-2 '>
                <div className='bg-[#FF9676] rounded-l-[70px] bg-[url("/login/cat.png")]  bg-no-repeat bg-right bg-contain '>
                    <div className='text-2xl text-white flex justify-end items-center h-full flex-col gap-3'>
                        <h1 className='text-4xl font-bold'>Chào mừng đến với MeowCare!</h1>
                        <h1 className='text-2xl font-bold'>Kết nối yêu thương, chăm sóc hoàn hảo</h1>
                        <Button as={Link} className='my-10 border-white bg-transparent text-white border px-14 py-7 rounded-full text-2xl' href='/register'>Đăng ký</Button>
                    </div>
                    {/* <div className='flex justify-end'>
                        <Image src='/login/cat.png' alt='' width={680} height={700} className='w-[600px] h-[700px] ' />
                    </div> */}
                </div>

                <div className='flex flex-col justify-center items-center gap-10 px-20'>
                    <h1 className='text-[40px] font-bold '>Đăng nhập</h1>
                    <div className='flex gap-10'>
                        < Image src="/media/fb.png" alt='' width={50} height={50} />
                        < Image src="/media/gg.webp" alt='' width={50} height={50} />
                    </div>
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
                    <h1 className='font-semibold text-3xl'>Quên mật khẩu?</h1>
                    <Button className='bg-[#2BAAE7] text-2xl font-semibold text-white p-8 px-20 rounded-full'>Đăng nhập</Button>
                </div>

            </div>
        </div >
    )
}

export default Login