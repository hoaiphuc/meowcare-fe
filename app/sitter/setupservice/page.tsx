'use client'

import Loading from "@/app/components/Loading"
import { CatSitter, ConfigService, Service } from "@/app/constants/types/homeType"
import axiosClient from "@/app/lib/axiosClient"
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks"
import { fetchUserProfile } from "@/app/lib/slices/userSlice"
import { faCheck, faChevronRight, faCircle, faEye, faRectangleList, faStarHalfStroke, faUnlock, faUsers, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, useDisclosure } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./setupservice.module.css"
import { toast } from "react-toastify"

const Page = () => {
    const [services, setServices] = useState<ConfigService[]>([])
    const [createdServices, setCreatedServices] = useState<Service[]>([])
    const dispatch = useAppDispatch();
    const [showAll, setShowAll] = useState(false);
    const { userProfile } = useAppSelector((state) => state.user);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [sitterProfile, setSitterProfile] = useState<CatSitter>();
    const [sitterStatus, setSitterStatus] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const statusColors: { [key: string]: string } = {
        ACTIVE: 'text-[#4CAF50]',        // Hoàn thành - green
        INACTIVE: 'text-[#DC3545]',     // Đã hủy - Red
    };

    const statusLabels: { [key: string]: string } = {
        ACTIVE: 'Đang hoạt động',
        INACTIVE: 'Đang ngoại tuyến',
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sitterProfileRes, servicesRes, configServicesRes] = await Promise.allSettled([
                    axiosClient(`sitter-profiles/sitter/${userProfile?.id}`),
                    axiosClient(`services/sitter/${userProfile?.id}`),
                    axiosClient('config-services'),
                ]);

                // Handle sitter profile response
                if (sitterProfileRes.status === "fulfilled") {
                    setSitterProfile(sitterProfileRes.value.data);
                    setSitterStatus(sitterProfileRes.value.data.status);
                } else {
                    console.error("Failed to fetch sitter profile:", sitterProfileRes.reason);
                }

                // Handle services response
                if (servicesRes.status === "fulfilled") {
                    setCreatedServices(servicesRes.value.data);
                } else {
                    console.error("Failed to fetch services:", servicesRes.reason);
                }

                // Handle config services response
                if (configServicesRes.status === "fulfilled") {
                    setServices(configServicesRes.value.data);
                } else {
                    console.error("Failed to fetch config services:", configServicesRes.reason);
                }
            } catch (error) {
                console.error("An unexpected error occurred:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userProfile?.id]);

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

    if (isLoading) {
        return <Loading />;
    }

    //Change status 
    const handleChangeStatus = () => {
        if (!sitterStatus) {
            toast.error("Bạn cần thêm thông tin cơ bản trước")
            return
        }

        const newStatus = sitterStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"

        try {
            axiosClient.put(`sitter-profiles/status/${userProfile?.id}?status=${newStatus}`)
                .then(() => {
                    setSitterStatus(newStatus);
                    toast.success(`Trạng thái đã được cập nhật thành ${newStatus === "ACTIVE" ? "Đang hoạt động" : "Đang ngoại tuyến"}`);
                })
                .catch(() => { })
        } catch (error) {

        }
    }

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
                        alt="" className="w-16 h-16 rounded-full"
                    />
                    <div >
                        <h1 className="text-3xl font-semibold">
                            Chào mừng, {userProfile?.fullName}
                        </h1>
                        <Button onClick={onOpen} variant="bordered">
                            <h1 className={sitterProfile?.status ? statusColors[sitterProfile.status] : "text-[#DC3545]"}>
                                <FontAwesomeIcon icon={faCircle} className="mr-1" />
                                {sitterProfile ? statusLabels[sitterProfile.status] : "Đang ngoại tuyến"}
                            </h1>
                        </Button>
                    </div>
                </div>
                <div className="mt-10">
                    <h1 className={styles.h1}>Cài đặt dịch vụ</h1>
                    <div className="flex flex-col gap-5">
                        {services.filter((service) => service.serviceType === "MAIN_SERVICE").map((service) => {
                            const createdService = createdServices.find(
                                (createdService) => createdService.name === service.name
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
                        {/* addition service  */}

                        <h1 className={showAll ? `${styles.h1}` : "hidden"}>Dịch vụ thêm</h1>
                        {showAll && services.filter((service) => service.serviceType === "ADDITION_SERVICE").map((service) => {
                            const createdService = createdServices.find(
                                (createdService) => createdService.name === service.name
                            );
                            const isActivated = Boolean(createdService);

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
                        <div className="flex gap-3 items-center">
                            {sitterProfile ?
                                <FontAwesomeIcon icon={faCheck} className="text-green-500" size="2x" />
                                :
                                <FontAwesomeIcon icon={faXmark} className="text-red-500" size="2x" />
                            }
                            <Link href={"/sitter/setupservice/info"} className={styles.h3}>Thông tin cơ bản</Link>
                        </div>
                        <h3 className={styles.h3}>Chi tiết</h3>
                        <h3 className={styles.h3}>Ảnh</h3>
                    </div>
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
                <ModalContent>
                    {() => (
                        <>
                            <ModalBody className="p-0">
                                <div>

                                    <div className={styles.headerModal}>
                                        <Avatar src={userProfile?.avatar} className="w-20 h-20" />
                                    </div>
                                    <div className="px-10">
                                        <div>
                                            <h1 className="text-2xl font-semibold">Dịch vụ của bạn đang {sitterProfile?.status}</h1>
                                            <h2 className="mb-4">Mở hoạt động để mọi người có thể tìm thấy dịch vụ của bạn</h2>
                                            <div className="flex justify-center items-center gap-32">
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <Button className={styles.modalButton} onClick={() => { }}>
                                                        <FontAwesomeIcon icon={faEye} size="2x" className="cursor-pointer p-0" />
                                                    </Button>
                                                    <p className="text-[16px] font-semibold">Xem hồ sơ</p>
                                                </div>
                                                <div className="flex flex-col justify-center items-center gap-2">
                                                    <Button className={styles.modalButton} onClick={handleChangeStatus}>
                                                        <FontAwesomeIcon icon={faUnlock} size="2x" className="cursor-pointer" />
                                                    </Button>
                                                    <p className="text-[16px] font-semibold">Mở hoạt động</p>
                                                </div>
                                            </div>
                                            <hr className="my-10" />
                                            <div className="flex flex-col gap-3">
                                                <div className="flex gap-3 items-center">
                                                    <FontAwesomeIcon icon={faUsers} size="2x" />
                                                    <p className={styles.modalList}>Mọi người có thể tìm và xem dịch của bạn</p>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <FontAwesomeIcon icon={faRectangleList} size="2x" />
                                                    <p className={styles.modalList}>Mọi người có thể tìm và đặt dịch vụ của bạn</p>
                                                </div>
                                                <div className="flex gap-3 items-center">
                                                    <FontAwesomeIcon icon={faStarHalfStroke} size="2x" />
                                                    <p className={styles.modalList}>Mọi người xem và đánh giá dịch vụ</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default Page