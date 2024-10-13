'use client'

import { Button, Checkbox, DateRangePicker, Input, RangeCalendar, Select, SelectItem, Textarea } from '@nextui-org/react'
import React, { useState } from 'react'
import './booking.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import Link from 'next/link'
import { today, getLocalTimeZone } from "@internationalized/date";
import { parseZonedDateTime } from "@internationalized/date";
const Page = () => {
    const [selectedService, setSelectedService] = useState<string>('1');
    const [isSelected, setIsSelected] = useState(false);
    const [isRequireFood, setIsRequireFood] = useState(false);
    const services = [
        { id: '1', serviceName: 'Gửi thú cưng' },
        { id: '2', serviceName: 'Trông tại nhà' },
    ];

    const catFoods = [
        { id: '1', foodName: 'Cá' },
        { id: '2', foodName: 'Thịt' },
    ];


    // Handle service change
    const handleServiceChange = (serviceId: string) => {
        setSelectedService(serviceId);
    };

    return (
        <div className='flex flex-col items-center justify-start my-12'>
            <h1>Đặt lịch</h1>
            <div className='flex flex-row items-start justify-center gap-8 mt-10'>
                <div>
                    <RangeCalendar
                        aria-label="Date (Read Only)"
                        value={{
                            start: today(getLocalTimeZone()),
                            end: today(getLocalTimeZone()).add({ days: 2 }),
                        }}
                        isReadOnly
                    />
                </div>
                {/* 2 */}
                <div className='flex flex-col gap-3 w-[486px]'>
                    <div className='flex flex-col gap-3'>
                        <h2>Chọn dịch vụ</h2>
                        <Select
                            labelPlacement='outside'
                            className="select min-w-full"
                            variant="bordered"
                            defaultSelectedKeys={selectedService}
                            onChange={(event) => handleServiceChange(event.target.value)}
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
                <h1></h1>
                <Button as={Link} href='/service/pay' className='bg-[#2E67D1] text-white text-[16px] font-semibold rounded-full w-[483px]'>Đặt lịch và thanh toán</Button>
            </div>
        </div>
    )
}

export default Page