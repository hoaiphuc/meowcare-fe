'use client'

import { faCat, faCircle, faFilePdf, faShieldCat, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Calendar, DateValue, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react';
// import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { Icon } from '@iconify/react';
import styles from './sitterprofile.module.css'
import Link from 'next/link';
import 'yet-another-react-lightbox/styles.css';
import PhotoGallery from '@/app/components/PhotoGallery';
import axiosClient from '@/app/lib/axiosClient';
import { useParams } from 'next/navigation';
import { CatSitter, Certificate, Service, UserLocal } from '@/app/constants/types/homeType';
import Loading from '@/app/components/Loading';
import Image from 'next/image';
import Lightbox from 'yet-another-react-lightbox';

const Page = () => {
    const params = useParams();
    const [sitterProfile, setSitterProfile] = useState<CatSitter | undefined>();
    const [isClicked, setIsClicked] = useState(false);
    const [isUser, setIsUser] = useState<boolean>();
    const [isLoading, setIsLoading] = useState(true);
    const [services, setServices] = useState<Service[]>([])
    const [additionServices, setAdditionServices] = useState<Service[]>([])
    const [childService, setChildService] = useState<Service[]>([])
    const [skills, setSkills] = useState([])
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [selectedPdf, setSelectedPdf] = useState<string>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isImageOpen, onOpen: onImageOpen, onOpenChange: onImageOpenChange } = useDisclosure();
    const { isOpen: isReportOpen, onOpen: onReportOpen, onOpenChange: onReportOpenChange } = useDisclosure();
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    // check user
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = localStorage.getItem('auth-token');
            setIsUser(Boolean(authToken));
        }
    }, []);

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };
    const user: UserLocal | null = getUserFromStorage();

    const handleImageClick = (index: number) => {
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    const handleImageCertificateClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        onImageOpen();
    };

    const handleClick = () => {
        setIsClicked(!isClicked); // Toggle the state
    };

    useEffect(() => {
        try {
            axiosClient(`sitter-profiles/sitter/${params.id}`)
                .then((res) => {
                    const skill = res.data.skill.split(",").map((s: string) => s.trim())
                    setSkills(skill)
                    setSitterProfile(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [params])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sitterProfileRes, servicesRes, childServiceRes, additionServiceRes, certificateRes] = await Promise.allSettled([
                    axiosClient(`sitter-profiles/sitter/${params.id}`),
                    axiosClient(`services/sitter/${params.id}/type?serviceType=MAIN_SERVICE&status=ACTIVE`),
                    axiosClient(`services/sitter/${params.id}/type?serviceType=CHILD_SERVICE&status=ACTIVE`),
                    axiosClient(`services/sitter/${params.id}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`),
                    axiosClient(`certificates/user/${params.id}`),
                ]);

                // Handle sitter profile response
                if (sitterProfileRes.status === "fulfilled") {
                    setSitterProfile(sitterProfileRes.value.data);
                } else {
                    console.error("Failed to fetch sitter profile:", sitterProfileRes.reason);
                }

                // Handle services response
                if (servicesRes.status === "fulfilled") {
                    setServices(servicesRes.value.data);
                } else {
                    console.error("Failed to fetch services:", servicesRes.reason);
                }

                if (childServiceRes.status === "fulfilled") {
                    setChildService(childServiceRes.value.data);
                } else {
                    console.error("Failed to fetch services:", childServiceRes.reason);
                }

                if (additionServiceRes.status === "fulfilled") {
                    setAdditionServices(additionServiceRes.value.data);
                } else {
                    console.error("Failed to fetch services:", additionServiceRes.reason);
                }

                if (certificateRes.status === "fulfilled") {
                    setCertificates(certificateRes.value.data);
                } else {
                    console.error("Failed to fetch services:", certificateRes.reason);
                }

            } catch (error) {
                console.error("An unexpected error occurred:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params]);

    if (isLoading) {
        return <Loading />;
    }

    // Define unavailable dates
    const unavailableDates = [
        new Date(2024, 11, 25), // December 25, 2024
        new Date(2024, 11, 31), // December 31, 2024
    ];

    // Function to check if a date is unavailable
    const isDateUnavailable = (date: DateValue) => {
        const dateToCheck = new Date(date.year, date.month - 1, date.day);
        return unavailableDates.some(
            (unavailableDate) =>
                unavailableDate.getFullYear() === dateToCheck.getFullYear() &&
                unavailableDate.getMonth() === dateToCheck.getMonth() &&
                unavailableDate.getDate() === dateToCheck.getDate()
        );
    };
    return (
        <div className='flex flex-cols-2 my-10 gap-10 justify-center'>
            <div className='flex flex-col gap-2 w-[352px]'>
                <div className='min-h-[300px]'>
                    <div className='flow-root'>
                        <Avatar src={sitterProfile?.avatar ?? '/User-avatar.png'} className='float-left h-20 w-20' />
                        <button onClick={() => handleClick()} className='float-right w-10 h-10 border-none'>
                            <Icon icon="mdi:heart" className={`transition-colors w-10 h-10 ${isClicked ? 'text-red-500  ' : ''}`} />
                        </button>
                    </div>
                    <div className='gap-2 flex flex-col'>
                        <h1 className="text-[30px] font-semibold">{sitterProfile?.fullName}</h1>
                        <h1 className='text-[16px] font-semibold'>{sitterProfile?.location}</h1>
                        <div className='flex gap-1 text-[10px] text-[#3b2f26] items-start'>
                            <FontAwesomeIcon icon={faStar} className='text-[#F8B816] h-5 w-5' />
                            <p className='text-[16px]'>5.0</p>
                            <FontAwesomeIcon icon={faCircle} className='text-text size-1 self-center px-1' />
                            <p className='text-[16px]'>15 Đánh giá</p>
                        </div>
                    </div>
                    <div className='flex gap-3 w-full mt-7'>
                        <Button
                            onClick={() => handleClick()}
                            className='w-full rounded-full text-white bg-[#2E67D1] shadow-sm'
                            isDisabled={user?.id === params.id}
                        >
                            Theo dõi
                        </Button>
                    </div>
                </div>

                <div className='items-center shadow-xl p-4 border-[0.5px] rounded-md mt-20'>
                    <h1 className={styles.h1}>Loại dịch vụ</h1>
                    <div className=' flex flex-col gap-3 my-3'>
                        {services && services.map((ser) => (
                            <div className='flex flex-col ' key={ser.id}>
                                <div className='flex'>
                                    <Icon icon="cbi:camera-pet" className='text-black w-12 h-11' />
                                    <div className='text-secondary font-semibold'>
                                        <h1 className='text-text text-xl font-semibold'>Gửi thú cưng</h1>
                                        <p className={styles.p}>Gửi thú cưng đến nhà người chăm sóc</p>
                                        <p className={styles.p}>Giá <span className='text-[#2B764F]'>{ser.price.toLocaleString("de")}đ</span> <span className='font-semibold'>/ ngày</span></p>
                                    </div>
                                </div>
                                <Button
                                    as={Link}
                                    href={isUser ? `/service/booking/${sitterProfile?.sitterId}` : `/login`}
                                    className={styles.button}
                                    isDisabled={user?.id === params.id}
                                >
                                    Đặt lịch
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* other service */}
                    <div className='flex flex-col'>
                        <div className='flex'>
                            <Icon icon="mdi:home-find-outline" className='text-black w-12 h-11' />
                            <div className='text-secondary font-semibold'>
                                <h1 className='text-text text-xl font-semibold'>Đặt dịch vụ</h1>
                                <p className={styles.p}>Dịch vụ chăm sóc mèo</p>
                            </div>
                        </div>
                        <Button
                            as={Link}
                            href={isUser ? `/service/housesitting/${sitterProfile?.sitterId}` : `/login`}
                            className={styles.button}
                            isDisabled={user?.id === params.id}
                        >
                            Đặt lịch
                        </Button>
                    </div>

                    {/* Calender  */}
                    <div className='w-full'>
                        <h1 className={styles.h1}>Thời gian làm việc</h1>
                        <div className='flex justify-center'>
                            <Calendar isReadOnly aria-label="Date (Unavailable)" isDateUnavailable={isDateUnavailable} className='' />
                        </div>
                    </div>

                    <div className='w-full'>
                        <h1 className={styles.h1}>Vị trí</h1>
                        <div className='flex justify-center'>

                        </div>
                    </div>

                    <div className='flex text-xl gap-3 items-center py-5 font-semibold cursor-pointer' onClick={onReportOpen}>
                        <Icon icon="noto:warning" />
                        <p>Báo cáo người dùng này</p>
                    </div>
                </div>
            </div>

            {/* 2 */}
            <div className='w-[745px]'>
                <div className='bg-transparent p-3'>
                    <PhotoGallery photos={sitterProfile?.profilePictures.filter((photo) => photo.isCargoProfilePicture === false)} />
                </div>
                <div className='mt-20'>
                    <h1 className={styles.h1}>Giới thiệu</h1>
                    <p className={styles.p}>{sitterProfile?.bio}</p>

                    <h1 className={styles.h1}>Kinh nghiệm chăm sóc mèo:</h1>
                    <p className={styles.p}>{sitterProfile?.experience}</p>
                </div>
                <hr className={styles.hr} />

                <div className='flex items-start justify-start gap-5'>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className={`${styles.h1} w-[170px]`}>Gửi thú cưng</h1>
                        <Image src='/service/boarding.png' alt='' width={144} height={144} />
                    </div>
                    <div className='flex flex-col items-start justify-start'>
                        <h1 className={styles.h1}>Lịch trình chăm sóc dự kiến</h1>
                        {childService && childService.map((ser) => (
                            <div key={ser.id} className='flex text-xl items-start gap-3'>
                                <FontAwesomeIcon icon={faCat} className="text-xs mt-2" size='2xs' />
                                <div className={styles.time}>{ser.startTime.split(":").slice(0, 2).join(":")} - {ser.endTime.split(":").slice(0, 2).join(":")} : </div>
                                <p className={styles.childService}>{ser.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <hr className={styles.hr} />

                <div className='flex items-start justify-start gap-5'>
                    <div className='flex flex-col items-center justify-center'>
                        <h1 className={`${styles.h1} w-[170px]`}>Dịch vụ khác</h1>
                        <Image src='/service/other.png' alt='' width={144} height={144} />
                    </div>
                    <div className='flex flex-col items-start justify-start gap-3'>
                        <h1 className={styles.h1}>Thông tin dịch vụ</h1>
                        <div className='flex'>
                            <p className={styles.tableBlockTitle}>Tên dịch vụ</p>
                            <p className={styles.tableBlockTitle}>Thời gian</p>
                            <p className={styles.tableBlockTitle}>Giá tiền</p>
                        </div>
                        {additionServices && additionServices.map((ser) => (
                            <div key={ser.id} className='flex text-xl items-center justify-start'>
                                <p className={styles.tableBlock}>
                                    <FontAwesomeIcon icon={faShieldCat} size='2xs' className='mr-2' />
                                    {ser.name}
                                </p>
                                <p className={styles.tableBlock}>{ser.duration} phút</p>
                                <p className={styles.tableBlock}>{ser.price.toLocaleString("de")}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <hr className={styles.hr} />

                {/* Feedback */}
                <h1 className={styles.h1}>Đánh giá</h1>
                <div className='grid grid-cols-2 gap-5'>
                    <div className=''>
                        <div className='flex items-center gap-3 mb-3'>
                            <Avatar src='/User-avatar.png' />
                            <h2 className={styles.h2}>Nguyễn Hoài Phúc</h2>
                        </div>
                        <h3 className={styles.h3}>Gửi thú cưng   30/08/2024</h3>
                        <p className={styles.p}>Đức Tấn là một người chăm sóc thú cưng chuyển nghiệp mà tôi yên tâm gửi bé!</p>
                    </div>
                </div>

                <hr className={styles.hr} />

                <h1 className={styles.h1}>Thông tin về người chăm sóc</h1>
                <h2 className='text-[18px] my-3 font-semibold'>Kỹ năng</h2>
                <div className='grid grid-cols-3 gap-3'>
                    {skills.map((skill, index) => (
                        <h3 className='border items-center flex justify-center p-3 rounded-full border-[#666666] text-[12px]' key={index}>
                            {skill}
                        </h3>
                    ))}
                </div>

                <h1 className='mt-10 text-xl font-semibold'>An toàn, tin cậy & môi trường</h1>
                <p className={styles.p}>{sitterProfile?.environment}</p>
                <p className={styles.p}>Số lượng thú cưng có thể nhận: {sitterProfile?.maximumQuantity}</p>
                <div className='flex overflow-x-auto gap-2'>
                    {sitterProfile?.profilePictures.filter((photo) => photo.isCargoProfilePicture === true).map((photo, index) => (
                        <div key={index} className="relative w-36 h-36" onClick={() => handleImageClick(index)}>
                            <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                        </div>
                    ))}
                </div>

                {/* Certificate  */}
                <h1 className='mt-10 text-xl font-semibold'>Chứng chỉ</h1>
                <div className='flex overflow-x-auto gap-2'>
                    {certificates.map((certificate, index) => (
                        <div key={index} className="relative w-36 h-36">
                            {certificate.certificateType === "IMAGE" ? (
                                <Avatar
                                    onClick={() => handleImageCertificateClick(certificate.certificateUrl)}
                                    src={certificate.certificateUrl}
                                    alt={`Certificate ${index + 1}`}
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <div
                                    onClick={() => {
                                        setSelectedPdf(certificate.certificateUrl!);
                                        onOpen()

                                    }}
                                    className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-md"
                                >
                                    <FontAwesomeIcon icon={faFilePdf} size="2xl" />
                                    <p className="text-center text-xs mt-2">{certificate.certificateName}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' className='z-[50] h-[800px] w-[1500px]'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Chứng chỉ</ModalHeader>
                            <ModalBody>
                                <iframe
                                    src={selectedPdf}
                                    title="PDF Viewer"
                                    className="h-full"
                                ></iframe>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal isOpen={isImageOpen} onOpenChange={onImageOpenChange} size="lg" className="h-[800px] w-[1500px]">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Chứng chỉ</ModalHeader>
                            <ModalBody>
                                {selectedImage && (
                                    <Avatar src={selectedImage} alt="Selected Certificate" className="w-full h-auto object-contain" radius="none" />
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal isOpen={isReportOpen} onOpenChange={onReportOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-3">
                                <Icon icon="noto:warning" />
                                Báo cáo người dùng vi phạm
                            </ModalHeader>
                            <ModalBody>
                                <h1>Loại vi phạm</h1>
                                <Input />
                                <h1>Nội dung vi phạm</h1>
                                <Textarea />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Gửi báo cáo
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={sitterProfile?.profilePictures
                    .filter((photo) => photo.isCargoProfilePicture === true)
                    .map((photo) => ({ src: photo.imageUrl }))}
            />
        </div>
    )
}

export default Page