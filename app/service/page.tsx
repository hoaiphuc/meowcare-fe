'use client'

import './service.scss';
import { Avatar, Select, SelectItem } from '@nextui-org/react';
import data from '@/app/lib/vietnam.json';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faStar } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '@iconify/react';
import Map from '../components/Map';

interface Province {
    idProvince: string;
    name: string;
}

interface District {
    idProvince: string;
    idDistrict: string;
    name: string;
}

interface Marker {
    id: string;
    lat: number;
    lng: number;
    title: string;
    price: string;
}

const Service = () => {
    const [selectedService, setSelectedService] = useState<string>('1');
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

    const provinces: Province[] = data.province;
    const districts: District[] = data.district;

    //data
    const markers: Marker[] = [
        { id: 'item-1', lat: 10.77584, lng: 106.70098, title: 'Hoài Phúc', price: '$55/đêm' }, // District 1
        { id: 'item-2', lat: 10.82310, lng: 106.62968, title: 'Samantha & Laura K.', price: '$80/night' }, // Phu Nhuan District
        { id: 'item-3', lat: 10.762622, lng: 106.660172, title: 'Edgar P.', price: '$75/night' }, // District 3
    ];
    const services = [
        { id: '1', serviceName: 'Gửi thú cưng' },
        { id: '2', serviceName: 'Trông tại nhà' },
    ];

    const catSitters = [
        { id: '1', serviceName: 'Gửi thú cưng' },
        { id: '2', serviceName: 'Trông tại nhà' },
    ];

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

    return (
        <div className='flex flex-cols-3 m-6 gap-2 justify-center'>
            {/* 1 */}
            <div className='bg-[#FFF6ED] w-[407px] h-[517px] flex flex-col gap-5 pt-10 px-1 rounded-xl shadow-xl'>
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

            </div>
            {/* 2 */}
            <div className='flex justify-start items-start w-[590px] bg-[#FFF6ED] text-black p-3'>
                {
                    catSitters.length > 0 ?
                        (
                            <div className='min-w-full border-b pb-3'>
                                <div className='flex gap-3'>
                                    <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" className='h-[52px] w-[52px]' />
                                    <div className=''>
                                        <div className='flex items-center gap-3'>
                                            <h1 className='text-[14px] font-semibold'>1. Nguyễn Lê Đức Tấn</h1>
                                            <button onClick={() => handleClick()}>
                                                <Icon icon="mdi:heart" className={`transition-colors size-3 ${isClicked ? 'text-red-500  ' : ''}`} />
                                            </button>
                                        </div>
                                        <h1 className='text-xs font-semibold'>I love cat</h1>
                                        <h1 className='text-xs font-semibold'>Địa chỉ: Linh Xuân, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</h1>
                                    </div>
                                    <div className='ml-auto flex flex-col text-right'>
                                        <h1 className='text-xs font-semibold text-right'>Giá mỗi đêm</h1>
                                        <h1 className='text-[20px] font-semibold text-[#2B764F]'>100.000đ</h1>
                                    </div>
                                </div>
                                <div className='flex gap-1 text-[10px] text-[#66625F]'>
                                    <FontAwesomeIcon icon={faStar} className='text-[#F8B816] size-3' />
                                    <h1>5.0</h1>
                                    <FontAwesomeIcon icon={faCircle} className='text-text size-1 self-center px-1' />
                                    <h1>15 Đánh giá</h1>
                                </div>
                                <h1 className='text-[11px] font-semibold my-2'>Tôi là một người yêu mèo, với việc nuôi mèo từ khi 12 tuổi và chăm sóc đến bây giờ, tôi tự tin chăm sóc mèo của bạn như cách tôi chăm sóc mèo của chính mình</h1>
                                <div className='flex text-[10px] font-semibold text-[#66625F]'>
                                    <FontAwesomeIcon icon={faCircleCheck} className='text-green-600 size-4 self-center px-1' />
                                    <h1>Đã cập nhật 1 ngày trước</h1>
                                </div>

                            </div>
                        )
                        :
                        (
                            <div className='flex flex-col justify-center items-center px-32'>
                                <h1 className='text-xl font-semibold'>Chúng tôi không tìm thấy người chăm sóc thú cưng nào.</h1>
                                <h1 className='text-[18px]'>Hãy thử thay đổi tiêu chí tìm kiếm hoặc cập nhật vị trí của bạn. </h1>
                            </div>

                        )
                }
            </div >
            {/* 3 */}
            <div className='w-[735px] flex'>
                <Map markers={markers} />
            </div>
        </div >
    )
}

export default Service