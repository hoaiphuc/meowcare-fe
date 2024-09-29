'use client'

import React, { useState } from 'react'
// import { UserType } from '../constants/types/homeType';
import { Button, Input } from '@nextui-org/react';

const Profile = () => {
    // const [userProfile, setUserProfile] = useState<UserType>();
    const [isEditing, setIsEditing] = useState(false);
    // const [userName, setUserName] = useState("");
    // const [phoneNumber, setPhoneNumber] = useState("");
    // let data = {
    //     userName: userName,
    //     phoneNumber: phoneNumber,
    // };



    return (
        <div>
            {/* <ToastContainer /> */}
            <div className="w-[1350px] h-full bg-white rounded-2xl">
                <div className="ml-20">
                    <h2 className="text-xl font-bold pt-10">Cài đặt thông tin cá nhân</h2>
                    {/* {userProfile ? ( */}
                    <div className="my-7 w-[1150px]">
                        <h2>Họ và tên</h2>
                        <div className="flex justify-center items-center mb-4">
                            <Input
                                className=""
                                disabled={!isEditing}
                                type="text"
                                variant="bordered"
                            // defaultValue={userProfile?.userName}
                            // onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        <h2>Số điện thoại</h2>
                        <div className="flex justify-center items-center mb-4">
                            <Input
                                type="number"
                                disabled={!isEditing}
                                variant="bordered"
                            // defaultValue={userProfile?.phoneNumber?.toString() ?? 0}
                            // onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                        <h2>Email</h2>
                        <div className="flex justify-center items-center mb-4">
                            <Input
                                type="text"
                                disabled
                                variant="faded"
                            // defaultValue={userProfile?.email}
                            />
                        </div>
                    </div>
                    {/* ) : (
                        <div>Vui lòng đăng nhập</div>
                    )} */}
                    {!isEditing ? (
                        <Button
                            className="bg-[#FF0004] text-white"
                            onClick={() => setIsEditing(true)}
                        >
                            Cập nhật thông tin
                        </Button>
                    ) : (
                        <div>
                            <Button
                                className="bg-[#FF0004] text-white"
                            // onClick={() => handleSubmit()}
                            >
                                Xác nhận
                            </Button>
                            <Button
                                className="bg-[#FF0004] text-white ml-5"
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