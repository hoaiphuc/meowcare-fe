'use client'

import { Service } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Input } from '@nextui-org/react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./servicedetail.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
const ServiceDetail = () => {
    const params = useParams();
    const [service, setService] = useState<Service>()
    useEffect(() => {
        try {
            axiosClient(`services/${params.id}`)
                .then((res) => {
                    setService(res.data)
                })
                .catch(() => { })
        } catch (error) {
            console.log(error);
        }
    }, [params.id])

    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <div className='w-[600px] flex flex-col gap-5'>
                <h1 className={styles.title}>{service?.serviceName}</h1>
                <h2>{service?.actionDescription}</h2>
                <div className='flex bg-[#F3F5F7] p-5 rounded-2xl gap-2'>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    <h3>Chúng tôi đề xuất cho bạn đặt giá trung bình. Bạn có thể chỉnh sửa chúng ngay bây giờ hoặc bất kì lúc nào trong tương lai.</h3>
                </div>

                <h1 className={styles.title}>Giá cả</h1>
                <h2 className='font-semibold'>Giá gốc</h2>
                <Input
                    type="number"
                    placeholder="Giá trung bình là 50.000"
                    value={service?.price?.toString()}
                    labelPlacement="outside"
                    endContent={
                        <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">VND</span>
                        </div>
                    }
                />
                {service ? (
                    <div>
                        <div></div>
                        <Button>Cập nhật</Button>
                    </div>
                ) : (
                    <div>
                        Thêm
                    </div>
                )}
            </div>
        </div>
    )
}

export default ServiceDetail