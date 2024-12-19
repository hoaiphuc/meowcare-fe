'use client'

import Loading from '@/app/components/Loading';
import { CatSitter, Certificate, ProfilePicture, UserLocal } from '@/app/constants/types/homeType';
import useGeoapify from '@/app/hooks/useGeoapify';
import CatSitterSkill from '@/app/lib/CatSitterSkill.json';
import axiosClient from '@/app/lib/axiosClient';
import { storage } from '@/app/utils/firebase';
import { faCamera, faCheck, faCircleQuestion, faFilePdf, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Autocomplete, AutocompleteItem, Avatar, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, Tooltip, useDisclosure } from '@nextui-org/react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import styles from './createinfo.module.css';

const MapComponent = dynamic(() => import('@/app/components/MapPick'), {
    ssr: false,
});;

interface Skill {
    id: number;
    skill: string
}

interface Address {
    lon: number
    lat: number
    formatted: string
}

const CreateInfo = () => {
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
    const [sitterData, setSitterData] = useState<CatSitter>();
    const [address, setAddress] = useState<string>('');
    const [query, setQuery] = useState<string>('')
    const geoSuggestions = useGeoapify(query);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const hiddenImageInput = useRef<HTMLInputElement>(null);
    const hiddenCargoInput = useRef<HTMLInputElement>(null);
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [selectedPdf, setSelectedPdf] = useState<string>();
    const [selectPicture, setSelectPicture] = useState<ProfilePicture[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const handleSelect = (item: Skill) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item])
        } else {
            setSelectedItems(selectedItems.filter(selection => selection !== item))

        }
    }
    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    const handleDeleteSelection = (item: Skill) => {
        setSelectedItems(selectedItems.filter(selection => selection !== item))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSitterData((prevData) => ({
            ...prevData,
            [name]: value,
        }) as CatSitter); // Type assertion to satisfy TypeScript
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;
        setAddress(newAddress);
        setQuery(newAddress);
        setShowSuggestions(true)
    };

    const handleLocationChange = (lat: number, lng: number) => {
        setSitterData((prevData) => ({
            ...prevData,
            latitude: lat,
            longitude: lng,
        }) as CatSitter);
    };


    const handleSuggestionClick = async (suggestion: Address) => {
        setAddress(suggestion.formatted);
        setQuery('');
        setShowSuggestions(false);

        handleLocationChange(suggestion.lat, suggestion.lon);
        setSitterData((prev) => ({
            ...prev,
            latitude: suggestion.lat,
            longitude: suggestion.lon,
        }) as CatSitter);
    };

    //create profile
    const handleCreate = async () => {
        setIsLoading(true)
        try {
            if (selectPicture.filter((pic: ProfilePicture) => pic.isCargoProfilePicture === false).length < 4) {
                toast.error("Thêm ít nhất 4 ảnh cho hồ sơ của bạn")
                return
            }

            if (selectPicture.filter((pic: ProfilePicture) => pic.isCargoProfilePicture === true).length < 1) {
                toast.error("Thêm ít nhất 1 ảnh cho môi trường và chuồng nuôi")
                return
            }

            if (!sitterData) {
                toast.error("Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
                return;
            }

            if (sitterData.fullRefundDay < 1 || sitterData.fullRefundDay > 7) {
                toast.error("Số ngày hoàn tiền phải nằm trong khoảng từ 1 đến 7")
                return
            }

            if (sitterData.maximumQuantity < 1 || sitterData.maximumQuantity > 20) {
                toast.error("Bạn phải chăm sóc tối thiểu 1 bé mèo và tối đa 20 bé mèo")
                return
            }

            const uploadedPictures = await Promise.all(
                selectPicture.map(async (picture) => {
                    const response = await fetch(picture.imageUrl); // Convert blob URL to Blob
                    const blob = await response.blob();
                    const fileName = `${uuidv4()}_profile_picture`;
                    const storageRef = ref(storage, `sitterprofilepictures/${fileName}`);
                    await uploadBytes(storageRef, blob);
                    const downloadUrl = await getDownloadURL(storageRef);
                    return {
                        ...picture,
                        imageUrl: downloadUrl, // Replace the local URL with Firebase URL
                    };
                })
            );

            const skillString = selectedItems.map((item) => item.skill).join(";");

            const completeSitterData = {
                ...sitterData, // Include existing data
                location: address,
                profilePictures: uploadedPictures, // Add uploaded pictures
                skill: skillString
            } as CatSitter;

            const profileResponse = await axiosClient.post("sitter-profiles", completeSitterData)

            if (profileResponse.status === 201 && certificates && certificates.length > 0) {
                for (const item of certificates) {
                    if (item.certificateUrl.startsWith("blob:")) {
                        try {
                            const response = await fetch(item.certificateUrl); // Convert local URL to Blob
                            const blob = await response.blob();
                            const fileName = `${uuidv4()}_${item.certificateName}`;
                            const storageRef = ref(storage, `certificates/${fileName}`);
                            await uploadBytes(storageRef, blob);
                            const downloadUrl = await getDownloadURL(storageRef);

                            // Prepare certificate data
                            const newCertificate = {
                                ...item,
                                certificateUrl: downloadUrl,
                            };

                            // Post certificate data to the API
                            await axiosClient.post("certificates", newCertificate);
                        } catch (error) {
                            toast.error("Lỗi khi thêm chứng chỉ");
                            console.error("Certificate upload error:", error);
                        }
                    }
                }
                setCertificates([]); // Clear certificates after processing
            }

            toast.success("Hồ sơ đã được tạo thành công!");
            router.push("/sitter/setupservice");
        } catch (error) {

        } finally {
            setIsLoading(false); // Always reset loading state
        }
    }

    //certificate upload
    const handleCertificateClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newCertificates = filesArray.map((file) => ({
                id: "",
                userId: userId || "",
                certificateType: file.type.includes("pdf") ? "PDF" : "IMAGE",
                certificateName: file.name,
                institutionName: "",
                certificateUrl: URL.createObjectURL(file),
                description: ""
            }));

            // Update the selectedTaskEvidence to display the new images
            setCertificates((prevImages) => [...prevImages, ...newCertificates]);
        }
    };

    const handleRemoveUpdateCertificate = (certificate: Certificate) => {
        setCertificates((prev) => prev.filter((item) => item !== certificate));
    };

    //======================================= picture profile update ==================================
    //image upload
    const handleImageClick = () => {
        if (hiddenImageInput.current) {
            hiddenImageInput.current.click();
        }
    };

    const handleCargoClick = () => {
        if (hiddenCargoInput.current) {
            hiddenCargoInput.current.click();
        }
    };

    const handlePictureChange = (event: React.ChangeEvent<HTMLInputElement>, isCargo: boolean) => {
        if (event.target.files) {
            console.log(event.target);

            const filesArray = Array.from(event.target.files);
            const newPictures = filesArray.map((file) => ({
                requestId: uuidv4(),
                name: "",
                imageUrl: URL.createObjectURL(file),
                isCargoProfilePicture: isCargo,
                description: "",
                isNew: true,
            }));
            setSelectPicture((prevImages) => [...prevImages, ...newPictures]);
        }
    };

    const markAsDeleted = (id?: string) => {
        if (!id) {
            console.error("ID is undefined");
            return; // Exit if the ID is undefined
        }

        setSelectPicture((prevPictures) => prevPictures.filter((picture) => picture.requestId !== id));
    };

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='flex items-center justify-center my-10'>
            <div className='flex flex-col gap-5 w-[754px]'>
                <div className=' text-center'>
                    <h1 className='text-4xl font-semibold mb-5'>Thông tin cá nhân của bạn</h1>
                    <h3 className={styles.h3}>
                        Hãy để cho người chủ mèo biết về bạn và tình yêu của bạn dành cho những bé mèo
                    </h3>
                </div>

                <div className='mt-5'>
                    <h2 className={styles.h2}>Thêm ảnh cho hồ sơ của bạn</h2>
                    <div className='flex overflow-x-auto '>
                        <div className='flex gap-2 flex-shrink-0'>
                            {selectPicture.filter((pic: ProfilePicture) => pic.isCargoProfilePicture === false).length < 10 &&
                                <button
                                    className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                                    onClick={handleImageClick}
                                >
                                    <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                                    <p>Thêm hình ảnh</p>
                                    <p>{`${selectPicture.filter((e) => e.isCargoProfilePicture === false && !e.isDeleted).length}/10`}</p>
                                </button>
                            }
                            <input
                                type="file"
                                accept='image/*'
                                ref={hiddenImageInput}
                                onChange={(e) => handlePictureChange(e, false)}
                                style={{ display: 'none' }}
                                multiple
                            />

                            {selectPicture && selectPicture.filter((picture) => picture.isCargoProfilePicture === false && !picture.isDeleted).map((photo) => (
                                <div key={photo.requestId} className="relative w-36 h-36">
                                    <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                                    <button
                                        onClick={() => markAsDeleted(photo.requestId)}
                                        className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                <div className='mt-5'>
                    <h2 className={styles.h2}>Giới thiệu</h2>
                    <Textarea value={sitterData?.bio} name='bio' onChange={handleInputChange} placeholder="Thông tin về bạn hoặc 1 vài sở thích của bạn" maxLength={500} />
                </div>

                <div className="flex mt-5 gap-3 items-start">
                    <h2 className={styles.h2}>Số ngày hoàn tiền <Tooltip content="Số ngày khách hàng có thể hủy dịch vụ"><FontAwesomeIcon icon={faCircleQuestion} size="2xs" /></Tooltip></h2>
                    <Input
                        type="number"
                        variant="bordered"
                        value={sitterData?.fullRefundDay ? sitterData.fullRefundDay.toString() : ""}
                        name="fullRefundDay"
                        className="w-32"
                        onChange={handleInputChange}
                        endContent="Ngày"
                        min={1}
                        max={7}
                        errorMessage="Tối thiểu 1 ngày và tối đa 7 ngày"
                    />
                </div>

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Kinh nghiệm</h2>
                    <Textarea placeholder="Hãy cho mọi người biết về kinh nghiệm chăm sóc mèo của bạn" value={sitterData?.experience} name='experience' onChange={handleInputChange} maxLength={500} />
                </div>

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Kỹ năng của bạn</h2>
                    <Autocomplete
                        className=" h-10 mt-2"
                        placeholder="Tìm kiếm kỹ năng bạn sở hữu"
                        size='md'
                        selectedKey={''}>
                        {CatSitterSkill.map((item, index) => (
                            <AutocompleteItem
                                key={index}
                                value={item.id}
                                onClick={() => handleSelect(item)}
                                endContent={
                                    selectedItems.some(
                                        (selection) => selection.id === item.id
                                    ) && (
                                        <FontAwesomeIcon
                                            icon={faCheck}
                                            size="xl"
                                            className="mr-2 text-green-500"
                                        />
                                    )
                                }
                            >
                                {item.skill}
                            </AutocompleteItem>
                        ))}
                    </Autocomplete>
                    <div className={selectedItems.length < 1 ? `hidden` : `flex bg-white p-3 h-full rounded-md shadow-md items-start justify-start`}>
                        <div className="flex mt-2 flex-wrap">
                            {selectedItems.map((item: Skill) => (
                                <Chip
                                    key={item.id}
                                    color={"primary"}
                                    className="mr-2 mt-2 h-10"
                                    endContent={<FontAwesomeIcon icon={faXmark}
                                        size="xl"
                                        className="mr-1 cursor-pointer"
                                        onClick={() => handleDeleteSelection(item)}
                                    />}>
                                    {item.skill}
                                </Chip>
                            ))}

                        </div>

                    </div>
                </div>

                {/* Cargo  */}
                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Môi trường và chuồng cho mèo</h2>
                    <h3 className={styles.h3}>Mô tả</h3>
                    <Textarea placeholder="Hãy cho mọi người biết về môi trường sống và chuồng nuôi" value={sitterData?.environment} name='environment' onChange={handleInputChange} maxLength={500} />
                    <h3 className={styles.h3}>Số lượng mèo bạn có thể chăm sóc</h3>
                    <Input
                        type='number'
                        placeholder="Số lượng mèo có thể chăm sóc"
                        value={sitterData?.maximumQuantity !== undefined ? sitterData.maximumQuantity.toString() : ""}
                        name='maximumQuantity'
                        onChange={handleInputChange}
                        min={1}
                        max={20}
                        errorMessage="Bạn phải chăm sóc tối thiểu 1 bé mèo và tối đa 20 bé mèo"
                    />
                    <h3 className={styles.h3}>Hình ảnh môi trường và chuồng, lồng</h3>
                    <div className='flex overflow-x-auto gap-2'>
                        <div className="flex gap-2 flex-shrink-0">
                            {selectPicture.filter((pic: ProfilePicture) => pic.isCargoProfilePicture === true).length < 10 &&
                                <button
                                    className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                                    onClick={handleCargoClick}
                                >
                                    <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                                    <p>Thêm hình ảnh</p>
                                    <p>{`${selectPicture.filter((e) => e.isCargoProfilePicture && !e.isDeleted).length}/10`}</p>
                                </button>
                            }
                            <input
                                type="file"
                                accept='image/*'
                                ref={hiddenCargoInput}
                                onChange={(e) => handlePictureChange(e, true)}
                                style={{ display: 'none' }}
                                multiple
                            />
                            {selectPicture.filter((picture) => picture.isCargoProfilePicture && !picture.isDeleted).map((photo) => (
                                <div key={photo.requestId} className="relative w-36 h-36">
                                    <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                                    <button
                                        onClick={() => markAsDeleted(photo.requestId)}
                                        className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div>
                    <h2 className={styles.h2}>Chứng chỉ</h2>
                    <div className="flex overflow-x-auto gap-2">
                        <button
                            className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                            onClick={handleCertificateClick}
                        >
                            <FontAwesomeIcon icon={faFilePdf} className="text-maincolor" size="2xl" />
                            <p>Thêm chứng chỉ</p>
                        </button>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={hiddenFileInput}
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            multiple
                        />
                        {certificates.map((certificate, index) => (
                            <div key={index} className="relative w-36 h-36">
                                {certificate.certificateType === "IMAGE" ? (
                                    <Avatar
                                        src={certificate.certificateUrl}
                                        alt={`Certificate ${index + 1}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-md">
                                        <FontAwesomeIcon icon={faFilePdf} size="2xl" />
                                        <p className="text-center text-xs mt-2">{certificate.certificateName}</p>
                                        <button
                                            className="text-maincolor underline mt-2"
                                            onClick={() => {
                                                setSelectedPdf(certificate.certificateUrl!);
                                                onOpen()
                                            }}
                                        >
                                            Xem chứng chỉ
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemoveUpdateCertificate(certificate)}
                                    className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                </div>

                {/* location */}
                <div className={styles.location}>
                    <h2 className={styles.h2}>Địa chỉ</h2>
                    <Input
                        value={address}
                        variant='bordered'
                        className={styles.searchInput}
                        name='location'
                        onChange={handleAddressChange}
                    />
                    {showSuggestions && geoSuggestions.length > 0 && (
                        <div className={styles.suggestionsDropdown}>
                            {geoSuggestions.map((suggestion, index) => (
                                <div
                                    key={index}
                                    className={styles.suggestionItem}
                                    onClick={() => handleSuggestionClick(suggestion.properties as Address)}
                                >
                                    <p>{suggestion.properties.formatted}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='z-40'>

                    <MapComponent
                        onLocationChange={handleLocationChange}
                        location={{ lat: sitterData?.latitude ?? 10.8231, lng: sitterData?.longitude ?? 106.6297 }}
                    />
                </div>


                <Button onClick={handleCreate} className='text-white bg-maincolor'>Lưu</Button>
                {/* <Button onClick={handleUpdate} className='text-white bg-maincolor'>Cập nhật</Button> */}
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
        </div >
    )
}

export default CreateInfo