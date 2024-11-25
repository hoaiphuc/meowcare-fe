import { Input, Select, SelectItem } from '@nextui-org/react';
import data from '@/app/lib/vietnam.json';
import { useEffect, useState } from 'react';

interface Province {
    idProvince: string;
    name: string;
}

interface District {
    idProvince: string;
    idDistrict: string;
    name: string;
}

const Information = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
    });
    const [isInitialized, setIsInitialized] = useState(false);

    const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
    const provinces: Province[] = data.province;
    const districts: District[] = data.district;
    const handleProvinceChange = (provinceId: string) => {
        setFormData((prevData) => ({ ...prevData, selectedProvince: provinceId }));
    };

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


    useEffect(() => {
        const newDistricts: District[] = districts.filter(
            (district) => district.idProvince === formData.address
        );
        setFilteredDistricts(newDistricts);
    }, [districts, formData.address]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem('formData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setFormData(parsedData);
            }
            setIsInitialized(true); // Set to true after data is loaded
        }
    }, []);


    useEffect(() => {
        if (typeof window !== 'undefined' && isInitialized) {
            localStorage.setItem('formData', JSON.stringify(formData));
        }
    }, [formData, isInitialized]);
    return (
        <div className='flex flex-col px-[500px] text-center justify-center items-center'>
            <h1 className='font-semibold text-xl py-10'>Vui lòng điền đầy đủ thông tin để chúng tôi đảm bảo thông tin để xác nhận bạn trở thành người chăm sóc mèo</h1>
            <div className='flex flex-col justify-center items-start gap-6'>
                {/* <h2>Họ và tên</h2> */}
                <Input placeholder="Nhập họ và tên" label="Họ và tên" labelPlacement='outside' variant="bordered" className='input' name="fullName" value={formData.fullName} onChange={handleInputChange} />
                <Input placeholder="Nhập họ và tên" label="Email" labelPlacement='outside' variant="bordered" className='input' name="email" value={formData.email} onChange={handleInputChange} />
                <Input placeholder="Nhập số điện thoại" label="Số điện thoại" labelPlacement='outside' variant="bordered" className='input' name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />

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
                            disabled={!formData.address} // Disable if no province is selected
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
                    <Input placeholder="Nhập địa chỉ của ban" variant="bordered" className='input' name="address" value={formData.address} onChange={handleInputChange} />
                </div>
                <Input placeholder="Nhập số điện thoại" label="Số điện thoại" labelPlacement='outside' variant="bordered" className='input' />
            </div>
        </div>
    )
}

export default Information
