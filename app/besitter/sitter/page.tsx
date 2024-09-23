'use client'

import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import './sitter.scss'
import data from '@/app/lib/vietnam.json';
import CatKnowledge from '@/app/components/CatKnowledge';

interface Province {
    idProvince: string;
    name: string;
}

interface District {
    idProvince: string;
    idDistrict: string;
    name: string;
}

const Sitter = () => {
    // const [province, setProvince] = useState("")
    const [name, setName] = useState("")
    // let dataa = {
    //     name,
    //     province,
    // }

    const [step, setStep] = useState(1);
    // State for selected province
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    // State for filtered districts
    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);

    const provinces: Province[] = data.province;
    const districts: District[] = data.district;

    // Handle province change
    const handleProvinceChange = (provinceId: string) => {
        setSelectedProvince(provinceId);
    };

    // Filter districts when selected province changes
    useEffect(() => {
        const newDistricts: District[] = districts.filter(district => district.idProvince === selectedProvince);
        setFilteredDistricts(newDistricts);
    }, [districts, selectedProvince]);

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className='flex flex-col px-[500px] text-center justify-center items-center'>
                        <h1 className='font-semibold text-xl py-10'>Vui lòng điền đầy đủ thông tin để chúng tôi đảm bảo thông tin để xác nhận bạn trở thành người chăm sóc mèo</h1>
                        <div className='flex flex-col justify-center items-start gap-6'>
                            {/* <h2>Họ và tên</h2> */}
                            <Input placeholder="Nhập họ và tên" label="Họ và tên" labelPlacement='outside' variant="bordered" className='input' value={name} onChange={(e) => setName(e.target.value)} />
                            <Input placeholder="Nhập họ và tên" label="Email" labelPlacement='outside' variant="bordered" className='input' />
                            <Input placeholder="Nhập số điện thoại" label="Số điện thoại" labelPlacement='outside' variant="bordered" className='input' />

                            <div className='flex flex-col gap-3'>

                                <div className='flex justify-end items-end gap-[10px]'>
                                    <Select
                                        label="Địa chỉ"
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
                                <Input placeholder="Nhập địa chỉ của ban" variant="bordered" className='input' />
                            </div>
                            <Input placeholder="Nhập số điện thoại" label="Số điện thoại" labelPlacement='outside' variant="bordered" className='input' />
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div>
                        <CatKnowledge />
                    </div>
                )
            case 3:
                return (
                    <div>
                        Stepper 3
                    </div>
                )
            default:
                return <div>Step 4</div>;
        }
    }

    return (
        <div className='my-10 flex justify-center flex-col items-center'>
            <h1 className='flex justify-center items-center text-[32px] font-semibold'>Các bước xác minh hồ sơ</h1>
            <div className='flex justify-center items-center mt-10'>
                <div className={step === 1 ? "circle-done" : "circle-pending"}>1</div>
                <div className='circle-hr'></div>
                <div className={step === 2 ? "circle-done" : "circle-pending"}>2</div>
                <div className='circle-hr'></div>
                <div className={step === 3 ? "circle-done" : "circle-pending"}>3</div>
                <div className='circle-hr'></div>
                <div className={step === 4 ? "circle-done" : "circle-pending"}>4</div>
            </div>
            {renderStep()}
            <div className='flex gap-20'>
                <Button onClick={() => setStep(step - 1)} className={step === 1 ? `hidden` : `w-[228px] h-[47px] text-[16px] font-bold bg-transparent border-text border rounded-full mt-5`}>Trở lại</Button>
                <Button isDisabled={step === 4} onClick={() => setStep(step + 1)} className='w-[228px] h-[47px] text-[16px] font-bold text-white bg-btnbg rounded-full mt-5'>Tiếp theo</Button>
            </div>
        </div >
    )

}

export default Sitter