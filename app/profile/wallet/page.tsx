'use client'

import { RequestWithdrawal, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faMoneyBillTransfer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionItem, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';

interface Wallet {
    balance: number
}

const Wallet = () => {
    const [wallet, setWallet] = useState<Wallet>()
    const [topUpMoney, setTopUpMoney] = useState("")

    const [requestData, setRequestData] = useState<RequestWithdrawal>({
        id: "",
        userId: "",
        balance: 0,
        bankNumber: "",
        fullName: "",
        bankName: "",
        processStatus: "",
        createAt: "",
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
        try {
            axiosClient.post("request-withdrawal/createNewRequest", requestData)
                .then(() => {
                    fetchWallet()
                    toast.success("Gửi yêu cầu thành công")
                    onOpenChange()
                })
                .catch(() => {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
                })
        } catch (error) {

        }
    }

    const handleTopUp = () => {
        try {
            axiosClient.post(`wallets/top-up/momo?userId=${userId}&amount=${topUpMoney}&redirectUrl=${process.env.NEXT_PUBLIC_BASE_URL}&requestType=CAPTURE_WALLET`)
                .then((res) => {
                    window.open(res.data.payUrl, "_self");
                })
                .catch(() => {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
                })
        } catch (error) {

        }
    }

    return (
        <div className="w-full max-w-[891px] h-full bg-white rounded-2xl shadow-xl flex flex-col text-black">
            <div className="m-5 flex flex-col gap-4">
                <div className="bg-orange-100 p-5 rounded-md flex">
                    <h1>
                        Số dư ví:{" "}
                        <span className="text-green-500 font-bold">
                            {wallet?.balance.toLocaleString("de")}đ
                        </span>
                    </h1>
                </div>
                <div className="bg-orange-100 p-5 rounded-md">
                    <Accordion>
                        <AccordionItem
                            key="1"
                            aria-label="Accordion 1"
                            title="Rút tiền"
                            className="flex flex-col"
                        >
                            Rút ít nhất 20.000đ
                            <div className="flex gap-3 mt-2">
                                <Input
                                    errorMessage={`Số tiền phải ít nhất 20000 và không được nhiều hơn ${wallet?.balance}`}
                                    type="number"
                                    className="w-52 no-spinner"
                                    min={20000}
                                    max={wallet?.balance}
                                    placeholder="Số tiền muốn rút"
                                />
                                <Button onClick={onOpen} className="bg-blue-500 hover:bg-blue-700 text-white">
                                    Yêu cầu rút tiền
                                </Button>
                            </div>
                        </AccordionItem>
                        <AccordionItem
                            key="2"
                            aria-label="Accordion 2"
                            title={
                                <div className='flex items-center gap-3'>
                                    <FontAwesomeIcon icon={faMoneyBillTransfer} />
                                    <h1>Nạp tiền</h1>
                                </div>
                            }
                        >
                            <p className='text-xs'>Nạp tiền ít nhất 10.000đ</p>
                            <div className="flex gap-3 mt-2">
                                <Input
                                    errorMessage={`Số tiền phải ít nhất 10000`}
                                    type="number"
                                    className="w-52 no-spinner"
                                    min={10000}
                                    placeholder="Số tiền muốn nạp"
                                    onChange={(e) => setTopUpMoney(e.target.value)}
                                />
                                <Button onClick={handleTopUp} className="bg-green-500 hover:bg-green-700 text-white">
                                    Nạp tiền
                                </Button>
                            </div>
                        </AccordionItem>
                    </Accordion>
                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1 text-lg font-bold">
                                    Yêu cầu rút tiền
                                </ModalHeader>
                                <ModalBody>
                                    <div className="flex flex-col gap-4">
                                        <h1 className="font-medium">Tên ngân hàng</h1>
                                        <Input name="bankName" onChange={(e) => handleInputChange(e)} />
                                        <h1 className="font-medium">Số tài khoản</h1>
                                        <Input name="bankNumber" onChange={(e) => handleInputChange(e)} />
                                        <h1 className="font-medium">Tên chủ thẻ</h1>
                                        <Input name="fullName" onChange={(e) => handleInputChange(e)} />
                                        <h1 className="font-medium">Số tiền</h1>
                                        <Input name="balance" onChange={(e) => handleInputChange(e)} />
                                    </div>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose} className="bg-red-500 hover:bg-red-700 text-white">
                                        Đóng
                                    </Button>
                                    <Button color="primary" onPress={handleSendRequest} className="bg-blue-500 hover:bg-blue-700 text-white">
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