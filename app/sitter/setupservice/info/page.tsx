'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './info.module.css'
import { Autocomplete, AutocompleteItem, Avatar, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react'
import CatSitterSkill from '@/app/lib/CatSitterSkill.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faCheck, faFilePdf, faXmark } from '@fortawesome/free-solid-svg-icons'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, Certificate, UserLocal } from '@/app/constants/types/homeType'
import { useRouter } from 'next/navigation'
import "leaflet/dist/leaflet.css";
import useGeoapify from '@/app/hooks/useGeoapify';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/utils/firebase';
import { v4 as uuidv4 } from 'uuid';


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

const Info = () => {
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
    const [sitterData, setSitterData] = useState<CatSitter>();
    const [address, setAddress] = useState<string>('');
    const [query, setQuery] = useState<string>('')
    const geoSuggestions = useGeoapify(query);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [certificates, setCertificates] = useState<Partial<Certificate>[]>([])
    const [selectedPdf, setSelectedPdf] = useState<string>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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

    //get info
    useEffect(() => {
        try {
            axiosClient(`sitter-profiles/sitter/${userId}`)
                .then((res) => {
                    setSitterData(res.data)
                    if (res.data.location) {
                        setAddress(res.data.location);
                    }
                })
                .catch(() => { })
        } catch (error) {

        }
    }, [userId])

    //create profile
    // const handleCreate = () => {
    //     try {
    //         axiosClient.post("sitter-profiles", sitterData)
    //             .then(() => {
    //                 router.push("/sitter/setupservice")
    //             })
    //             .catch(() => {

    //             })
    //     } catch (error) {

    //     }
    // }

    const handleLocationChange = (lat: number, lng: number) => {
        console.log(lat);
        console.log(lng);

        setSitterData((prevData) => ({
            ...prevData,
            latitude: lat,
            longitude: lng,
        }) as CatSitter);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAddress = e.target.value;
        setAddress(newAddress);
        setQuery(newAddress);
        setShowSuggestions(true)
    };

    // Handle suggestion click
    const handleSuggestionClick = async (suggestion: Address) => {
        setAddress(suggestion.formatted);
        setQuery('');
        setShowSuggestions(false);

        handleLocationChange(suggestion.lat, suggestion.lon);
        setSitterData((prev) => ({
            ...prev,
            latitude: suggestion.lat,
            longitude: suggestion.lon
        }) as CatSitter);

        // const selectedSuggestion = geoSuggestions.find(s => s.properties.formatted === suggestion);
        // if (selectedSuggestion) {
        //     const { lat, lon } = selectedSuggestion.properties;
        //     handleLocationChange(lat, lon);
        //     // Update the sitterData location field:
        //     setSitterData((prev) => ({
        //         ...prev,
        //         location: formattedAddress
        //     }));
        // }
    };

    // Update profile
    const handleUpdate = async () => {
        try {
            const updatedCertificates = await Promise.all(
                certificates.map(async (certificate) => {
                    const fileName = `${uuidv4()}_${certificate.certificateName}`;
                    const storageRef = ref(storage, `certificates/${fileName}`);

                    // Check if the certificate has a file URL
                    if (certificate.certificateUrl?.startsWith("blob:")) {
                        // Convert local URL to Blob and upload to Firebase
                        const response = await fetch(certificate.certificateUrl);
                        const blob = await response.blob();

                        await uploadBytes(storageRef, blob);

                        // Get the download URL
                        const downloadUrl = await getDownloadURL(storageRef);

                        return {
                            ...certificate,
                            certificateUrl: downloadUrl,
                        };
                    }
                    return certificate; // Return as-is if already a valid URL
                })
            );

            // Store certificates in the database
            await Promise.all(
                updatedCertificates.map((certificate) =>
                    axiosClient.post("certificates", certificate)
                )
            );

            const updatedSitterData = {
                ...sitterData,
                location: address, // Include address as location
            };

            axiosClient.put(`sitter-profiles/${sitterData?.id}`, updatedSitterData)
                .then(() => {
                    toast.success("Cập nhật hồ sơ thành công");
                    router.push("/sitter/setupservice");
                })
                .catch((error) => {
                    console.error("Error updating profile:", error);
                });
        } catch (error) {
            console.error("Error in handleUpdate:", error);
        }
    };

    //certificate upload
    const handleCertificateClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleCertificateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);

            const newCertificates = filesArray.map((file) => ({
                certificateUrl: URL.createObjectURL(file),
                id: "",
                userId: sitterData?.sitterId,
                certificateName: file.name,
                institutionName: "",
            }));

            // Update the certificates state
            setCertificates((prevCertificates) => [...prevCertificates, ...newCertificates]);
        }
    };

    const handleRemoveCertificate = (index: number) => {
        setCertificates((prevCertificates) =>
            prevCertificates.filter((_, i) => i !== index)
        );
    };

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
                    <div className='flex overflow-x-auto'>
                        {sitterData?.profilePictures.map((photo, index) => (
                            <div key={index} className="relative w-36 h-36">
                                <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                                <button
                                    // onClick={() => handleRemovePhoto(index)}
                                    className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className='mt-5'>
                    <h2 className={styles.h2}>Giới thiệu</h2>
                    <Textarea value={sitterData?.bio} name='bio' onChange={handleInputChange} />
                </div>

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Kinh nghiệm</h2>
                    <Textarea placeholder="Hãy cho mọi người biết về kinh nghiệm chăm sóc mèo của bạn" value={sitterData?.experience} name='experience' onChange={handleInputChange} />
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

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Môi trường và chuồng cho mèo</h2>
                    <h3 className={styles.h3}>Mô tả</h3>
                    <Textarea placeholder="Hãy cho mọi người biết về môi trường sống và chuồng nuôi" value={sitterData?.environment} name='environment' onChange={handleInputChange} />
                    <h3 className={styles.h3}>Số lượng mèo bạn có thể chăm sóc</h3>
                    <Input placeholder="Số lượng mèo có thể chăm sóc" value={sitterData?.maximumQuantity.toString()} name='maximumQuantity' onChange={handleInputChange} />
                    <h3 className={styles.h3}>Hình ảnh mỗi trường và chuồng, lồng</h3>
                    <div className='flex overflow-x-auto gap-2'>
                        <button
                            className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                        // onClick={handleImageClick}

                        >
                            <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                            <p>Thêm hình ảnh</p>
                            {/* <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length}/3`}</p> */}
                        </button>
                        {sitterData?.profilePictures.map((photo, index) => (
                            <div key={index} className="relative w-36 h-36">
                                <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                                <button
                                    // onClick={() => handleRemovePhoto(index)}
                                    className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <h2 className={styles.h2}>Chứng chỉ</h2>
                    <div className="flex overflow-x-auto gap-2">
                        <button
                            className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                            onClick={handleCertificateClick}
                        >
                            <FontAwesomeIcon icon={faCamera} className="text-maincolor" size="2xl" />
                            <p>Thêm chứng chỉ</p>
                        </button>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={hiddenFileInput}
                            onChange={handleCertificateChange}
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
                                    onClick={() => handleRemoveCertificate(index)}
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


                {/* <Button onClick={handleCreate} className='text-white bg-maincolor'>Lưu</Button> */}
                <Button onClick={handleUpdate} className='text-white bg-maincolor'>Cập nhật</Button>
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

export default Info