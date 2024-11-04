'use client'

import { Button, Checkbox, DateRangePicker, Input, Modal, ModalBody, ModalContent, ModalFooter, Radio, RadioGroup, Select, SelectItem, Textarea, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import styles from './booking.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
// import Link from 'next/link'
import { parseZonedDateTime } from "@internationalized/date";
import { useParams } from 'next/navigation'
import axiosClient from '@/app/lib/axiosClient'
import { PetProfile, Service } from '@/app/constants/types/homeType'
import Image from 'next/image'

const Page = () => {
    const params = useParams();
    const [selectedService, setSelectedService] = useState<string>('1');
    const [isSelected, setIsSelected] = useState(false);
    const [isRequireFood, setIsRequireFood] = useState(false);
    const [pets, setPets] = useState<PetProfile[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [data, setData] = useState({
        id: params.id,
        service: 2,
    })

    const [services, setServices] = useState<Service[]>([])
    // const services = [
    //     { id: '1', serviceName: 'Gửi thú cưng' },
    //     { id: '2', serviceName: 'Trông tại nhà' },
    // ];

    const catFoods = [
        { id: '1', foodName: 'Cá' },
        { id: '2', foodName: 'Thịt' },
    ];

    // Handle service change
    const handleServiceChange = (serviceId: string) => {
        setSelectedService(serviceId);

        setData((prevData) => ({ ...prevData, service: Number(serviceId) }))
    };

    useEffect(() => {
        try {
            axiosClient('services')
                .then((res) => {
                    setServices(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    })

    //get pets
    useEffect(() => {
        try {
            axiosClient('pet-profiles')
                .then((res) => {
                    setPets(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [data])

    // const handleBooking = () => {

    // }

    const handlePay = () => {
        try {
            axiosClient.post(`booking-orders/with-details`, data)
                .then(() => { })
                .catch(() => { })
        } catch (error) {

        }
    }


    return (
        <div className='flex flex-col items-center justify-start my-12'>
            <h1>Đặt lịch</h1>
            <div className='flex flex-row items-start justify-center gap-8 mt-10'>
                {/* 1 */}
                <div className='flex flex-col gap-3 w-[486px]'>
                    <div className='flex flex-col gap-3'>
                        <h2>Chọn dịch vụ</h2>
                        <Select
                            labelPlacement='outside'
                            className="select min-w-full"
                            variant="bordered"
                            defaultSelectedKeys={selectedService}
                            name='service'
                            onChange={(e) => handleServiceChange(e.target.value)}
                        >
                            {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                    {service.serviceName}
                                </SelectItem>
                            ))}
                        </Select>
                        <Checkbox isSelected={isSelected} onValueChange={setIsSelected} radius='none'>
                            Dịch vụ đưa đón mèo (1-10km)
                        </Checkbox>
                        <Input placeholder='Nhập địa chỉ đưa đoán mèo' isDisabled={!isSelected} variant="bordered" className='input' />
                        <h2>Chọn ngày</h2>
                        <DateRangePicker
                            label="Event duration"
                            hideTimeZone
                            visibleMonths={2}
                            defaultValue={{
                                start: parseZonedDateTime("2024-04-01T00:45[America/Los_Angeles]"),
                                end: parseZonedDateTime("2024-04-08T11:15[America/Los_Angeles]"),
                            }}
                        />

                        <h2>Thêm thú cưng của bạn</h2>
                        <Select
                            labelPlacement='outside'
                            className="select min-w-full"
                            variant="bordered"
                            // defaultSelectedKeys={selectedService}
                            onChange={(event) => handleServiceChange(event.target.value)}
                        >
                            {pets.map((pet) => (
                                <SelectItem key={pet.id} value={pet.id}>
                                    {pet.petName}
                                </SelectItem>
                            ))}
                        </Select>

                        <h2>Chọn thức ăn cho mèo</h2>
                        <Select
                            labelPlacement='outside'
                            className="select min-w-full"
                            variant="bordered"
                            defaultSelectedKeys={selectedService}
                            onChange={(event) => handleServiceChange(event.target.value)}
                        >
                            {catFoods.map((food) => (
                                <SelectItem key={food.id} value={food.id}>
                                    {food.foodName}
                                </SelectItem>
                            ))}
                        </Select>

                        <Checkbox isSelected={isRequireFood} onValueChange={setIsRequireFood} radius='none'>
                            Thức ăn theo yêu cầu
                        </Checkbox>
                        <Input placeholder='Nhập loại thức ăn cụ thể' isDisabled={!isSelected} variant="bordered" className='input' />

                        <h2>Thông tin cá nhân</h2>
                        <Input placeholder='Họ và tên' variant='bordered' />
                        <Input placeholder='Số điện thoại' variant='bordered' />

                        <h2>Lời nhắn</h2>
                        <Textarea placeholder='VD: chia sẽ về sở thích của mèo' variant='bordered' />

                    </div>
                </div>
                <div className='w-[327px]'>
                    <div className='border flex flex-col p-3 rounded-lg gap-3 mb-10'>
                        <h2>Bảng giá dịch vụ</h2>
                        <div className='flex justify-between'>
                            <h3>Gửi thú cưng</h3>
                            <div className='flex flex-col left-0'>
                                <h3 className='text-[#2B764F]'>100.000đ</h3>
                                <h4>giá mỗi đêm</h4>
                            </div>
                        </div>
                    </div>

                    {/* Final price */}
                    <div className='border flex flex-col p-3 rounded-lg gap-3'>
                        <h2>Thông tin đặt lịch </h2>
                        <h3>Dịch vụ: Gửi thú cưng</h3>
                        <div className='flex flex-cols-3 justify-between'>
                            <div>
                                <h3>Ngày nhận</h3>
                                <h3>01/10/2024</h3>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h3 className='text-[#902C6C]'>1 đêm</h3>
                                <FontAwesomeIcon icon={faClock} className='text-[#A65587]' />
                            </div>
                            <div>
                                <h3>Ngày trả</h3>
                                <h3>02/10/2024</h3>
                            </div>
                        </div>
                        <h3>Số lượng mèo: 2</h3>
                        <h3>Số ngày lễ: 1</h3>
                        <hr className='text-[#66696]' />
                        <div className='flex justify-between'>
                            <h3>Tổng giá:</h3>
                            <h3 className='text-[#2B764F]'>150.000đ</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-10'>
                <Button onPress={onOpen} className='bg-[#2E67D1] text-white text-[16px] font-semibold rounded-full w-[483px]'>Đặt lịch và thanh toán</Button>
            </div>
            <div className='mt-10'>
                <Button className='bg-[#2E67D1] text-white text-[16px] font-semibold rounded-full w-[483px]'>Đặt lịch (test)</Button>
            </div>

            {/* Modal payment */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl' className='mt-32'>
                <ModalContent>
                    {() => (
                        <>
                            {/* <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader> */}
                            <ModalBody>
                                <div className="flex justify-center items-center mt-3">
                                    <div className='flex flex-col justify-center items-center border border-black rounded-lg w-[650px] p-5 gap-5'>
                                        <h1 className={styles.h1}>Thanh toán dịch vụ</h1>
                                        <p className={styles.p}>Cảm ơn quý khách đã đặt lịch dich vụ của MeowCare. Xin vui lòng xem kỹ chi tiết đặt dịch vụ dưới đây và chọn phương thức thanh toán.</p>
                                        <div className='flex items-start justify-start flex-col w-full'>
                                            <h2 className={styles.h2}>Thông tin quý khách</h2>
                                            <div className={`${styles.h3} grid grid-cols-2 w-80`}>
                                                <h3 className={styles.h3}>Họ và tên: </h3>
                                                <h3 >phuc</h3>
                                                <h3 className={styles.h3}>Điện thoại: </h3>
                                                <h3 >03232323</h3>
                                                <h3 className={styles.h3}>Email:</h3>
                                                <h3 > hoaiphuc@gmail.com</h3>
                                            </div>
                                        </div>
                                        <div className='flex items-start justify-start flex-col w-full'>
                                            <h2 className={styles.h2}>Thông tin đặt lịch của bạn</h2>
                                            <div className='grid grid-cols-2 w-80'>
                                                <h3 className={styles.h3}>Mã đặt hàng</h3> <h3>123</h3>
                                                <h3 className={styles.h3}>Dịch vụ</h3> <h3>Gửi thú cưng</h3>
                                                <h3 className={styles.h3}>Ngày gửi</h3> <h3>04/09/2024   8:00</h3>
                                                <h3 className={styles.h3}>Ngày Nhận</h3> <h3>05/09/2024   15:00</h3>
                                                <h3 className={styles.h3}>Người chăm sóc</h3> <h3>Đức Tấn</h3>
                                                <h3 className={styles.h3}>Số lượng thú cưng</h3> <h3>1</h3>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-start justify-start w-full'>
                                            <h2 className={styles.h2}>Tổng giá dịch vụ</h2>
                                            <div className='grid grid-cols-5 w-full'>
                                                <div className={styles.money}>123</div>
                                                <div className={`${styles.money} col-span-2`}>Đức Tấn</div>
                                                <div className={styles.money}>150.000</div>
                                                <div className={styles.money}>VND</div>

                                                <div className={`${styles.money} col-span-3`}>Tổng cộng</div>
                                                <div className={styles.money}>150.000</div>
                                                <div className={styles.money}>VND</div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-start justify-start w-full gap-3'>
                                            <h2 className={styles.h2}>Chọn phương thức thanh toán</h2>
                                            <RadioGroup
                                                aria-label="Select payment"
                                                // color=""
                                                className='w-full flex flex-col '
                                            >
                                                <div className='border border-black p-3'>
                                                    <Radio value="qr" className='px-5'>
                                                        <div className='flex items-center'>
                                                            <Image src='/nganhang.png' alt='' width={50} height={50} className='mx-3 w-[50px] h-[50px]' />
                                                            <div>
                                                                <h1 className={styles.paymentHeading1}>Thanh toán qua tài khoản ngân hàng</h1>
                                                                <h2 className={styles.paymentHeading2}>Thanh toán bằng mã VietQR</h2>
                                                            </div>
                                                        </div>
                                                    </Radio>
                                                </div>
                                                <div className='border border-black mt-[-8px] p-3'>
                                                    <Radio value="cash" className='px-5' aria-label='j'>
                                                        <div className='flex items-center'>
                                                            <Image src='/cash.png' alt='' width={51} height={44} className='mx-3 w-[51px] h-[44px]' />
                                                            <div>
                                                                <h1 className={styles.paymentHeading1}>Thanh toán bằng tiền mặt</h1>
                                                                <h2 className={styles.paymentHeading2}>Sau khi hoàn thành dịch vụ</h2>
                                                            </div>
                                                        </div>
                                                    </Radio>
                                                </div>
                                            </RadioGroup>

                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className='w-full flex justify-center'>
                                <Button className='bg-btnbg text-white w-[206px] rounded-full h-[42px]' onPress={() => handlePay()}>
                                    Thanh toán
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page