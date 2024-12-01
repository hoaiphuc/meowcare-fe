'use client'

import { RequestWithdrawal, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react'
import styles from "./wallet.module.css"
// import { toast } from 'react-toastify';

interface Wallet {
    balance: number
}

const Wallet = () => {
    const [wallet, setWallet] = useState<Wallet>()
    const [requestData, setRequestData] = useState<RequestWithdrawal>({
        userId: "",
        balance: 0,
        bankNumber: "",
        fullName: "",
        bankName: ""
    })
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };
    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    useEffect(() => {
        if (userId) {
            setRequestData((prevState) => ({
                ...prevState,
                userId: userId,  // Set the userId when the user is found
            }));
        }
    }, [userId]);

    const fetchWallet = useCallback(() => {
        try {
            axiosClient(`wallets/user/${userId}`)
                .then((res) => {
                    setWallet(res.data)
                })
                .catch(() => { })
        } catch (error) {

        }
    }, [userId])

    useEffect(() => {
        fetchWallet()
    }, [fetchWallet])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRequestData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }


    const handleSendRequest = () => {
        // try {
        //     axiosClient.post("request-withdrawal/createNewRequest", requestData)
        //         .then(() => {
        //             fetchWallet()
        //             toast.success("Gửi yêu cầu thành công")
        //         })
        //         .catch(() => {
        //             toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
        //         })
        // } catch (error) {

        // }
        console.log(requestData);

    }

    return (
        <div className='w-[891px] h-full bg-white rounded-2xl shadow-2xl flex flex-col text-black'>
            <div className=' m-5 flex flex-col gap-4'>
                <div className='bg-[#FFE3D5] p-5 rounded-md flex'>
                    <h1>Số dư ví: <span className='text-green-500'>{wallet?.balance.toLocaleString()}</span></h1>
                    <Button onClick={onOpen}>Yêu cầu rút tiền</Button>
                </div>
                <div className=' bg-[#FFE3D5] p-5 rounded-md'>
                    <div>
                        <h1>Momo</h1>
                    </div>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Yêu cầu rút tiền</ModalHeader>
                                <ModalBody>
                                    <div className='flex flex-col gap-3'>
                                        <h1 className={styles.modalTitle}>Tên ngân hàng</h1>
                                        <Input
                                            name='bankName'
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <h1 className={styles.modalTitle}>Số tài khoản</h1>
                                        <Input
                                            name='bankNumber'
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <h1 className={styles.modalTitle}>Tên chủ thẻ</h1>
                                        <Input
                                            name='fullName'
                                            onChange={(e) => handleInputChange(e)}
                                        />
                                        <h1 className={styles.modalTitle}>Số tiền</h1>
                                        <Input
                                            name='balance'
                                            onChange={(e) => handleInputChange(e)}
                                        />

                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Đóng
                                    </Button>
                                    <Button color="primary" onPress={handleSendRequest}>
                                        Xác nhận
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </div>
    )
}

export default Wallet