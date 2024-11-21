'use client'

import { ConfigService, Service } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Input } from '@nextui-org/react';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./servicedetail.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import { toast } from 'react-toastify';

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

    const handleUpdate = () => {

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

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <div className='w-[600px] flex flex-col gap-5'>
                <h1 className={styles.title}>{service ? service?.serviceName : configService?.name}</h1>
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