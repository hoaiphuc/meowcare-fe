'use client'

import { ConfigService, Service } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Input, TimeInput, TimeInputValue } from '@nextui-org/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./servicedetail.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPlus } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Time } from "@internationalized/date";

const ServiceDetail = () => {
    const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [service, setService] = useState<Service>()
    const [configService, setConfigService] = useState<ConfigService>()
    const [serviceData, setServiceData] = useState({
        status: 0,
        configServiceId: params.id,
        price: '',
    })
    const [childServices, setChildServices] = useState<Service[]>([{
        id: uuidv4(),
        name: "",
        serviceType: "CHILD_SERVICE",
        actionDescription: "",
        endTime: 0,
        startTime: 0,
        type: "",
        price: 0, // Default price value
        isBasicService: false, // Default boolean value
    }]);

    //check valid
    const [isPriceValid, setIsPriceValid] = useState(false);

    useEffect(() => {
        setIsLoading(true)
        try {
            axiosClient(`services/${params.id}`)
                .then((res) => {
                    axiosClient('config-services')
                        .then((resConfig) => {
                            const filter = resConfig.data.filter((config: ConfigService) => config.id === res.data.configServiceId)
                            setConfigService(filter)
                        })
                    setService(res.data)
                    setServiceData((prevState) => ({
                        ...prevState,
                        price: res.data.price,
                    }));
                    setIsLoading(false);
                })
                .catch((e) => {
                    if (e.response.data.status === 2002) {
                        axiosClient(`config-services/${params.id}`)
                            .then((res) => {
                                setConfigService(res.data)
                                setIsLoading(false);
                            })
                            .catch((e) => {
                                console.log(e);
                            })
                    }
                })
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, [params.id])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        const numericValue = Number(value);
        if (configService) {
            if (name === "price" && (numericValue < configService?.floorPrice || numericValue > configService?.ceilPrice)) {
                setIsPriceValid(true)
            }
            else
                setIsPriceValid(false)
        }

        setServiceData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }

    const handleAdd = () => {
        if (isPriceValid) {
            return;
        }

        try {
            axiosClient.post('services', serviceData)
                .then(() => {
                    toast.success("Bạn đã tạo dịch vụ thành công")
                    router.push('/sitter/setupservice')
                })
                .catch(() => {
                    toast.error("Tạo dịch vụ thất bại vui lòng kiểm tra lại")
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdate = () => {
        console.log(childServices);

    }

    if (isLoading) {
        return <Loading />;
    }

    const handleInputServiceChange = (
        id: string,
        field: string,
        value: TimeInputValue
    ) => {
        // const formattedTime = `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`;
        const formattedTime = `${value.hour.toString().padStart(2, '0')}`;
        setChildServices((prev) =>
            prev.map((service) =>
                service.id === id ? { ...service, [field]: formattedTime } : service
            )
        );
    };
    const handleInputTextChange = (
        id: string,
        field: string,
        value: string
    ) => {
        setChildServices((prev) =>
            prev.map((service) =>
                service.id === id ? { ...service, [field]: value } : service
            )
        );
    };

    const addTime = () => {
        const newService: Service = {
            id: uuidv4(),
            name: "",
            serviceType: "CHILD_SERVICE",
            actionDescription: "",
            endTime: 0,
            startTime: 0,
            type: "",
            price: 0,
            isBasicService: false,
        };

        setChildServices((prevState) => [...prevState, newService]);
    };


    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <div className='w-[600px] flex flex-col gap-5'>
                <h1 className={styles.title}>{service ? service?.name : configService?.name}</h1>
                <h2>{service?.actionDescription}</h2>
                <div className='flex bg-[#F3F5F7] p-5 rounded-2xl gap-2'>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    <h3>Chúng tôi đề xuất cho bạn đặt giá trung bình. Bạn có thể chỉnh sửa chúng ngay bây giờ hoặc bất kì lúc nào trong tương lai.</h3>
                </div>

                <h1 className={styles.title}>Giá cả</h1>
                <h2 className='font-semibold'>Giá gốc</h2>
                <Input
                    type="number"
                    name='price'
                    placeholder="Giá trung bình là 50.000"
                    min={configService?.floorPrice}
                    max={configService?.ceilPrice}
                    value={serviceData.price}
                    onChange={(e) => handleInputChange(e)}
                    isInvalid={isPriceValid}
                    errorMessage={`Giá phải từ: ${configService?.floorPrice} đến ${configService?.ceilPrice}`}
                    labelPlacement="outside"
                    endContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">VND</span>
                        </div>
                    }
                />
                {!service?.isBasicService &&
                    <div>
                        <h1 className={styles.title}>Thời gian hoạt động</h1>
                        <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-md shadow-md">
                            {childServices.map((childService: Service) => (
                                <div
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-5"
                                    key={childService.id}
                                >
                                    <div className='flex justify-center items-center gap-3'>
                                        <TimeInput
                                            className='w-28'
                                            label="Giờ bắt đầu"
                                            hourCycle={24}
                                            granularity="minute"
                                            value={new Time(childService.startTime)}
                                            onChange={(e) => handleInputServiceChange(childService.id, 'startTime', e)}
                                        />
                                        -
                                        <TimeInput
                                            className='w-28'
                                            label="Giờ bắt đầu"
                                            hourCycle={24}
                                            granularity="minute"
                                            value={new Time(childService.endTime)}
                                            onChange={(e) => handleInputServiceChange(childService.id, 'endTime', e)}
                                        />
                                    </div>
                                    <Input
                                        label="Tên dịch vụ"
                                        value={childService.name}
                                        onChange={(e) =>
                                            handleInputTextChange(childService.id, 'name', e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                            <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={() => addTime()}>
                                <FontAwesomeIcon icon={faPlus} /> Tạo thêm không giờ
                            </Button>
                        </div>

                    </div>
                }
                {service ? (
                    <div>
                        <div></div>
                        <Button onClick={() => handleUpdate()}>Cập nhật</Button>
                    </div>
                ) : (
                    <div>
                        <Button onClick={() => handleAdd()}>
                            Tạo
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ServiceDetail