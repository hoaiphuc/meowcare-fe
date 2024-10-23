'use client'

import React, { useEffect, useState } from 'react'
import { UserType } from '../constants/types/homeType';
import { Button, Input } from '@nextui-org/react';
import axiosClient from '../lib/axiosClient';

const Profile = () => {
    const [userProfile, setUserProfile] = useState<UserType>();
    const [isEditing, setIsEditing] = useState(false);
    // const [userName, setUserName] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("");
    // let data = {
    //     userName: userName,
    //     phoneNumber: phoneNumber,
    // };

    useEffect(() => {
        axiosClient('/auth')
            .then((res) => {
                console.log(res.data);

                // setUserName(res.data.userName)
                setUserProfile(res.data)
            })
            .catch()
    }, [])

    return (
        <div>
            {/* <ToastContainer /> */}
            <div className="w-[891px] h-full bg-white rounded-2xl shadow-2xl">
                <div className="ml-20 w-full">
                    <h2 className="text-2xl font-bold pt-10">Cài đặt thông tin cá nhân</h2>
                    {userProfile ? (
                        <div className="my-7 w-[750px] flex flex-col justify-center items-start">
                            <h2>Họ và tên</h2>
                            <Input
                                className="mb-4"
                                disabled={!isEditing}
                                type="text"
                                variant="bordered"
                                defaultValue={userProfile?.username}
                            // onChange={(e) => setUserName(e.target.value)}
                            />
                            <h2>Số điện thoại</h2>
                            {/* <div className="flex justify-center items-center mb-4"> */}
                            <Input
                                className='mb-4'
                                type="number"
                                disabled={!isEditing}
                                variant="bordered"
                                defaultValue={userProfile?.phoneNumber?.toString() ?? 0}
                            // onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                            {/* </div> */}
                            <h2>Email</h2>
                            {/* <div className="flex justify-center items-center mb-4"> */}
                            <Input
                                className='mb-4'
                                type="text"
                                isDisabled
                                variant="faded"
                                defaultValue={userProfile?.email}
                            />
                            {/* </div> */}
                        </div>
                    ) : (
                        <div>Vui lòng đăng nhập</div>
                    )}
                    {!isEditing ? (
                        <Button
                            className="bg-[#902C6C] text-white"
                            onClick={() => setIsEditing(true)}
                        >
                            Cập nhật thông tin
                        </Button>
                    ) : (
                        <div>
                            <Button
                                className="bg-[#902C6C] text-white"
                            // onClick={() => handleSubmit()}
                            >
                                Xác nhận
                            </Button>
                            <Button
                                className="bg-[#902C6C] text-white ml-5"
                                onClick={() => setIsEditing(false)}
                            >
                                Hủy
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile