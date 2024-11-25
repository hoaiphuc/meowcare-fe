'use client'

import { useEffect, useState } from "react"
import styles from "./setupservice.module.css"
import axiosClient from "@/app/lib/axiosClient"
import { ConfigService, Service } from "@/app/constants/types/homeType"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks"
import Loading from "@/app/components/Loading"
import { fetchUserProfile } from "@/app/lib/slices/userSlice"
import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronRight } from "@fortawesome/free-solid-svg-icons"
import { Avatar, Button } from "@nextui-org/react"

const Page = () => {
    const [services, setServices] = useState<ConfigService[]>([])
    const [createdServices, setCreatedServices] = useState<Service[]>([])
    const dispatch = useAppDispatch();
    const [showAll, setShowAll] = useState(false);
    const { userProfile, loading } = useAppSelector((state) => state.user);

    useEffect(() => {
        try {
            axiosClient(`services/sitter/${userProfile?.id}`)
                .then((res) => {
                    setCreatedServices(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })

            axiosClient('config-services')
                .then((res) => {
                    setServices(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })

        } catch (error) {

        }
    }, [userProfile?.id])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('auth-token')) {
                return;
            }
        }
        if (!userProfile) {
            dispatch(fetchUserProfile());
        }
    }, [dispatch, userProfile]);

    if (loading) {
        return <Loading />;
    }

    const displayedServices = showAll
        ? services
        : services.filter((service) => service.type === "Main Service").slice(0, 2);

    return (
        <div className='flex flex-col justify-center items-center text-black my-10'>
            <div className="w-[600px]">
                <div className="flex gap-5">
                    <Avatar
                        src={
                            userProfile?.avatar &&
                                (userProfile.avatar.startsWith('http://') ||
                                    userProfile.avatar.startsWith('https://') ||
                                    userProfile.avatar.startsWith('/'))
                                ? userProfile.avatar
                                : '/User-avatar.png'
                        }
                        alt="" className="w-16 h-14 rounded-full"
                    />
                    <div >
                        <h1 className="text-3xl font-semibold">
                            Chào mừng, {userProfile?.fullName}
                        </h1>
                        <Link href='/profile' className="text-blue-500">Xem hồ sơ</Link>
                    </div>
                </div>
                <div className="mt-10">
                    <h1 className={styles.h1}>Cài đặt dịch vụ</h1>
                    <div className="flex flex-col gap-5">
                        {displayedServices.map((service) => {
                            const createdService = createdServices.find(
                                (createdService) => createdService.serviceName === service.name
                            );
                            const isActivated = Boolean(createdService);

                            // Use the id from createdService if it exists, otherwise fallback to service.id
                            const idToUse = createdService ? createdService.id : service.id;
                            return (
                                <Link href={`/sitter/servicedetail/${idToUse}`} key={service.id}>
                                    <div className="flex justify-between border-b py-4 cursor-pointer">
                                        <div className="flex gap-3">
                                            <Image src='/noimage.jpg' alt="" width={50} height={50} className="rounded-md" />
                                            <div>
                                                <h2 className={styles.h2}>{service.name}</h2>
                                                {isActivated ? <h2 className="text-green-500">Đã kích hoạt</h2> : <h2 className="text-[#A46950]">Chưa kích hoạt</h2>}
                                            </div>
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} />
                                    </div>
                                </Link>
                            )
                        })}
                        {services.length > 2 && (
                            <Button
                                onClick={() => setShowAll(!showAll)}
                                variant="bordered"
                                className=""
                            >
                                {showAll ? 'Thu gọn' : 'Xem thêm'}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Profile */}
                <div className="my-10">
                    <h1 className={styles.h1}>Cài đặt hồ sơ</h1>
                    <div className="flex flex-col gap-3">
                        <Link href={"/sitter/setupservice/info"} className={styles.h3}>Thông tin cơ bản</Link>
                        <h3 className={styles.h3}>Chi tiết</h3>
                        <h3 className={styles.h3}>Ảnh</h3>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Page