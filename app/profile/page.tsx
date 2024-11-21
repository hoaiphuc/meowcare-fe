'use client'

import React, { useEffect, useState } from 'react'
// import { UserType } from '../constants/types/homeType';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
// import axiosClient from '../lib/axiosClient';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { fetchUserProfile, updateUserProfile } from '../lib/slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axiosClient from '../lib/axiosClient';
// import axiosClient from '../lib/axiosClient';

const Profile = () => {
    const dispatch = useAppDispatch();
    const { userProfile, loading, error } = useAppSelector((state) => state.user);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [isVisibleNew, setIsVisibleNew] = useState(false);
    const toggleVisibilityNew = () => setIsVisibleNew(!isVisibleNew);
    const [isVisibleRepeat, setIsVisibleRepeat] = useState(false);
    const toggleVisibilityRepeat = () => setIsVisibleRepeat(!isVisibleRepeat);

    const [isEditing, setIsEditing] = useState(false);
    const [fullName, setFullName] = useState(userProfile?.fullName || '');
    const [phoneNumber, setPhoneNumber] = useState(userProfile?.phoneNumber || '');
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (userProfile) {
            setFullName(userProfile.username || '');
            setPhoneNumber(userProfile.phoneNumber || '');
        }
    }, [userProfile]);

    const handleUpdate = () => {
        const updatedData = {
            fullName,
            phoneNumber,
        };
        dispatch(updateUserProfile(updatedData));
        setIsEditing(false);
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const handleUpdatePassword = (id: string) => {
        if (newPassword !== repeatPassword) {
            toast.error('Mật khẩu mới không khớp!')
            return;
        }
        try {
            const dataUpdatePassword = {
                password: newPassword
            }

            axiosClient.put(`users/${id}`, dataUpdatePassword)
                .then(() => {
                    toast.success('Đổi mật khẩu thành công')
                })
                .catch(() => {
                    toast.error('Có lỗi xảy ra, vui lòng thử lại sau!')
                })
        } catch (error) {

        }
    }
    return (
        <div>
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
                                defaultValue={userProfile?.fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <h2>Số điện thoại</h2>
                            {/* <div className="flex justify-center items-center mb-4"> */}
                            <Input
                                className='mb-4'
                                type="number"
                                disabled={!isEditing}
                                variant="bordered"
                                defaultValue={userProfile?.phoneNumber?.toString() ?? 0}
                                onChange={(e) => setPhoneNumber(e.target.value)}
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
                    <div className='flex gap-5'>
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
                                    onClick={() => handleUpdate()}
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
                        <Button onClick={onOpen} className='border border-maincolor text-maincolor' variant='bordered'>Đổi mật khẩu</Button>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Đổi Mật Khẩu</ModalHeader>
                            <ModalBody>
                                <div>
                                    <h2>Mật khẩu cũ</h2>
                                    <Input
                                        className="mb-4"
                                        type={isVisible ? "text" : "password"}
                                        variant="bordered"
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
                                    <h2>Mật khẩu mới</h2>
                                    <Input
                                        type={isVisibleNew ? "text" : "password"}
                                        className="mb-4"
                                        variant="bordered"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        endContent={
                                            <button className="focus:outline-none" type="button" onClick={toggleVisibilityNew} aria-label="toggle password visibility">
                                                {isVisibleNew ? (
                                                    <FontAwesomeIcon icon={faEye} className="size-6 text-default-400 pointer-events-none" />
                                                ) : (
                                                    <FontAwesomeIcon icon={faEyeSlash} className="size-6 text-default-400 pointer-events-none" />
                                                )}
                                            </button>
                                        }
                                    />
                                    <h2>Nhập lại mật khẩu</h2>
                                    <Input
                                        className="mb-4"
                                        type={isVisibleRepeat ? "text" : "password"}
                                        variant="bordered"
                                        onChange={(e) => setRepeatPassword(e.target.value)}
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
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button
                                    color="primary"
                                    disabled={loading}
                                    onClick={() => {
                                        handleUpdatePassword(userProfile?.id ? userProfile?.id : "")
                                        onClose();
                                    }}
                                >
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Profile