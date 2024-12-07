'use client'

import React, { useState } from 'react'
import { faEnvelope, faEye, faEyeSlash, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input } from '@nextui-org/react'
import Image from 'next/image'
import Link from 'next/link'
import axiosClient from '../lib/axiosClient'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'


const Register = () => {
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
    const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUserName] = useState('');
    const dataRegister = {
        email: email,
        password: password,
        fullName: username,
    };

    const handleSubmit = async () => {
        try {
            await axiosClient
                .post('users', dataRegister)
                .then(() => {
                    toast.success('Đăng ký tài khoản thành công')
                    router.push('/login');
                })
                .catch((error) => {
                    toast.error('Đăng ký tài khoản thất bại, vui lòng thử lại sau!')
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
        }
    };

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
                        onChange={(e) => setUserName(e.target.value)}
                        endContent={
                            <FontAwesomeIcon icon={faUser} className="size-6 text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                    <Input
                        className=''
                        size='lg'
                        type="email"
                        errorMessage="Email của bạn không tồn tại"
                        placeholder="Email"
                        labelPlacement="outside"
                        onChange={(e) => setEmail(e.target.value)}
                        endContent={
                            <FontAwesomeIcon icon={faEnvelope} className="size-6 text-default-400 pointer-events-none flex-shrink-0" />
                        }
                    />
                    <Input
                        type={isVisible ? "text" : "password"}
                        size='lg'
                        placeholder="Mật khẩu"
                        labelPlacement="outside"
                        onChange={(e) => setPassword(e.target.value)}
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibility} aria-label="toggle password visibility">
                                {isVisible ? (
                                    <FontAwesomeIcon icon={faEye} className="size-6 text-default-400 pointer-events-none" />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} className="size-6 text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Input
                        type={isVisibleRepeat ? "text" : "password"}
                        size='lg'
                        placeholder="Nhập lại mật khẩu"
                        labelPlacement="outside"
                        endContent={
                            <button className="focus:outline-none" type="button" onClick={toggleVisibilityRepeat} aria-label="toggle password visibility">
                                {isVisibleRepeat ? (
                                    <FontAwesomeIcon icon={faEye} className="size-6 text-default-400 pointer-events-none" />
                                ) : (
                                    <FontAwesomeIcon icon={faEyeSlash} className="size-6 text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                    />
                    <Button className='bg-[#2BAAE7] text-2xl font-semibold text-white p-8 px-20 rounded-full' onClick={() => handleSubmit()}>Đăng ký</Button>
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