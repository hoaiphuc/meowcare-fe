'use client'

import './service.scss';
import { Avatar, Button, DateRangePicker, Input, Select, SelectItem, Slider } from '@nextui-org/react';
import data from '@/app/lib/vietnam.json';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import axiosClient from '../lib/axiosClient';
import { CatSitter } from '../constants/types/homeType';
const Map = dynamic(() => import('../components/Map'), { ssr: false });

interface Province {
    idProvince: string;
    name: string;
}

interface District {
    idProvince: string;
    idDistrict: string;
    name: string;
}

const Service = () => {
    const [selectedService, setSelectedService] = useState<string>('1');
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

    const provinces: Province[] = data.province;
    const districts: District[] = data.district;

    const [catSitters, setCatSitters] = useState<CatSitter[]>([]);

    const [price, setPrice] = useState<number[]>([20000, 2000000]);
    const listItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Function to scroll to a list item
    const scrollToListItem = (id: string) => {
        const element = listItemRefs.current[id];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest', });
        }
    };

    const services = [
        { id: '1', serviceName: 'Gửi thú cưng' },
        { id: '2', serviceName: 'Trông tại nhà' },
    ];

    const [selectedCatNumber, setSelectedCatNumber] = useState<string | null>(null);
    const options = ['1', '2', '3+'];

    // Handle service change
    const handleServiceChange = (serviceId: string) => {
        setSelectedService(serviceId);
    };

    // Handle province change
    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId);
    };

    // Filter districts when selected province changes
    useEffect(() => {
        const newDistricts: District[] = districts.filter(district => district.idProvince === selectedProvince);
        setFilteredDistricts(newDistricts);
    }, [districts, selectedProvince]);

    //fake favorites button
    const [isClicked, setIsClicked] = useState(false);

    // Function to handle click
    const handleClick = () => {
        setIsClicked(!isClicked); // Toggle the state
    };

    //change price range
    const handleInputChange = (index: number, value: string) => {
        const newPrice = [...price];
        newPrice[index] = Number(value);
        setPrice(newPrice);
    };

    //get cat sitters
    useEffect(() => {
        try {
            axiosClient('sitter-profiles')
                .then((res) => {
                    setCatSitters(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);

        }
    }, [])
    return (
        <div className='flex flex-cols-3 p-[5px] justify-center'>
            {/* 1 */}
            <div className='bg-[#FFF6ED] w-[310px] h-[617px] flex flex-col gap-5 p-[10px] rounded-xl'>
                <Select
                    label="Loại dịch vụ"
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
                <div className='flex items-end'>
                    <Select
                        label="Địa điểm"
                        labelPlacement='outside'
                        placeholder="Tỉnh/Thành Phố"
                        className="select"
                        variant="bordered"
                        onChange={(event) => handleProvinceChange(event.target.value)}
                    >
                        {provinces.map((province) => (
                            <SelectItem key={province.idProvince} value={province.idProvince}>
                                {province.name}
                            </SelectItem>
                        ))}
                    </Select>

                    {/* District Select (filtered by province) */}
                    <Select
                        aria-label="Quận/Huyện"
                        placeholder="Quận/Huyện"
                        className="select"
                        variant="bordered"
                        disabled={!selectedProvince} // Disable if no province is selected
                    >
                        {filteredDistricts.length > 0 ? (
                            filteredDistricts.map((district) => (
                                <SelectItem key={district.idDistrict} value={district.idDistrict}>
                                    {district.name}
                                </SelectItem>
                            ))
                        ) : (
                            <SelectItem isDisabled key="no-districts">Vui lòng chọn Tỉnh/Thành phố</SelectItem>
                        )}
                    </Select>
                </div>

                <div>
                    <h2>Đặt lịch</h2>
                    <DateRangePicker
                        label="Stay duration"
                        className="max-w-[388px]"
                        variant="bordered"
                    />
                </div>

                <div className='flex flex-col gap-3'>
                    <h2>Số lượng thú cưng</h2>
                    <div className="options-container">
                        {options.map((option) => (
                            <div
                                key={option}
                                className={`option ${selectedCatNumber === option ? 'selected' : ''}`}
                                onClick={() => setSelectedCatNumber(option)}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>

                {/* <p className="text-default-500 font-medium text-small">
                        {Array.isArray(price) && price.map((b) => `$${b}`).join(" – ")}
                    </p> */}
                <div>
                    <h2 className='mb-3'>Giá mỗi giờ</h2>
                    <div className='flex gap-3 justify-center items-center'>
                        <Input
                            aria-label="Giá tối thiểu"
                            type="number"
                            value={price[0].toString().toLocaleString()}
                            onChange={(e) => handleInputChange(0, e.target.value)}
                            className="input"
                            endContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">đ</span>
                                </div>
                            }
                        />
                        <p>~</p>
                        <Input
                            aria-label="Giá tối đa"
                            type="number"
                            value={price[1].toString().toLocaleString()}
                            onChange={(e) => handleInputChange(1, e.target.value)}
                            className="input"
                            endContent={
                                <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">đ</span>
                                </div>
                            }
                        />
                    </div>
                    <Slider
                        aria-label='price range'
                        step={50}
                        minValue={20000}
                        maxValue={2000000}
                        defaultValue={[100, 500]}
                        value={price}
                        // getValue={(price) => `${price}đ`}
                        onChange={(value) => {
                            const newValue = Array.isArray(value) ? value : [value];
                            setPrice(newValue);
                        }}
                        formatOptions={{ style: "currency", currency: "VND" }}
                        className="max-w-md"
                    />
                </div>

                <div className='flex items-center justify-end'>
                    <Button className='h-12 w-10 font-semibold' variant='bordered'>Tìm kiếm</Button>
                </div>
            </div>

            {/* 2 */}
            <div className='flex flex-col justify-start items-start w-[909px] text-black bg-[#FFF6ED] h-[900px] overflow-auto scrollbar-hide px-4'>
                {
                    catSitters.length > 0 ?
                        (
                            catSitters.map((catSitter, index) => (
                                <div
                                    key={catSitter.id}
                                    ref={(el) => {
                                        listItemRefs.current[catSitter.id] = el;
                                    }}
                                    className='selectDiv min-w-full border-b pb-3 bg-[#FFF6ED]'>
                                    <Link href={`/service/sitterprofile/${catSitter.id}`}>
                                        <div className='flex gap-3 cursor-pointer'>
                                            <Avatar
                                                // src={catSitter.avatarUrl}
                                                className='h-[80px] w-[80px]'
                                            />
                                            <div className='flex flex-col gap-1'>
                                                <div className='flex items-center gap-3'>
                                                    <p className='text-[26px] font-semibold'>
                                                        <span className="font-bold">{index + 1}. </span>
                                                        {catSitter.fullName}
                                                    </p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleClick();
                                                        }}
                                                    >
                                                        <Icon
                                                            icon='mdi:heart'
                                                            className={`transition-colors size-3 ${isClicked ? 'text-red-500' : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                                <p className='text-xs'>
                                                    {catSitter.bio}
                                                </p>
                                                <p className='text-xs'>
                                                    Địa chỉ: {catSitter.location}
                                                </p>
                                            </div>
                                            <div className='ml-auto flex flex-col text-right'>
                                                <p className='text-xs font-semibold text-right'>
                                                    Giá mỗi đêm
                                                </p>
                                                <p className='text-[20px] font-semibold text-[#2B764F]'>
                                                    {/* {catSitter.price} */}
                                                    20000
                                                </p>
                                            </div>
                                        </div>
                                        <div className='flex gap-1 text-[#66625F] mt-3 mb-2x`'>
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                className='text-[#F8B816] size-4'
                                            />
                                            <p className=' text-[14px] font-normal'>{catSitter.rating ? catSitter.rating : 'Chưa có đánh giá'}</p>
                                            <FontAwesomeIcon
                                                icon={faCircle}
                                                className='text-text size-1 self-center px-1'
                                            />
                                            {/* <p className=' text-[14px] font-normal'>{catSitter.reviews} Đánh giá</p> */}
                                            <p className=' text-[14px] font-normal'>20 Đánh giá</p>
                                        </div>
                                        <p className='text-[14px] my-2'>
                                            {catSitter.bio}
                                        </p>
                                        <div className='flex  font-semibold text-[#66625F]'>
                                            <FontAwesomeIcon
                                                icon={faCircleCheck}
                                                className='text-green-600 size-4 self-center px-1'
                                            />
                                            <p className='text-[10px]'>Đã cập nhật 2 ngày trước</p>
                                        </div>
                                    </Link>

                                </div>
                            ))
                        )
                        :
                        (
                            <div className='flex flex-col justify-center items-center px-32'>
                                <p className='text-xl font-semibold'>Chúng tôi không tìm thấy người chăm sóc thú cưng nào.</p>
                                <p className='text-[18px]'>Hãy thử thay đổi tiêu chí tìm kiếm hoặc cập nhật vị trí của bạn. </p>
                            </div>

                        )
                }
            </div >
            {/* 3 */}
            <div className='w-[735px] flex'>
                <Map markers={catSitters} onMarkerClick={scrollToListItem} />
            </div>
        </div >
    )
}

export default Service