'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './info.module.css'
import { Autocomplete, AutocompleteItem, Avatar, Button, Chip, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react'
import CatSitterSkill from '@/app/lib/CatSitterSkill.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faCheck, faFilePdf, faXmark } from '@fortawesome/free-solid-svg-icons'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, Certificate, ProfilePicture, UserLocal } from '@/app/constants/types/homeType'
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
    const hiddenImageInput = useRef<HTMLInputElement>(null);
    const hiddenCargoInput = useRef<HTMLInputElement>(null);
    const [certificates, setCertificates] = useState<Certificate[]>([])
    const [selectedPdf, setSelectedPdf] = useState<string>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    //for update certificates
    const [removeList, setRemoveList] = useState<Certificate[]>([]);
    const [addList, setAddList] = useState<Certificate[]>([]);
    const [selectPicture, setSelectPicture] = useState<ProfilePicture[]>([
        //     {
        //     id: uuidv4(),
        //     imageName: "",
        //     imageUrl: "",
        //     isCargoProfilePicture: true,
        //     isNew: true,
        //     isDeleted: false,
        // }
    ])

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
                    if (res.data.profilePictures) {
                        setSelectPicture(res.data.profilePictures)
                    }
                    if (res.data.location) {
                        setAddress(res.data.location);
                    }
                })
                .catch(() => { })

            axiosClient(`certificates/user/${userId}`)
                .then((res) => {
                    setCertificates(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {

        }
    }, [userId])



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
            if (removeList && removeList.length > 0) {
                await Promise.all(
                    removeList.map(async (item) => {
                        try {
                            if (item.id) {
                                await axiosClient.delete(`certificates/${item.id}`);
                            } else {
                                return;
                            }
                        } catch (error) {
                            toast.error("Lỗi khi gỡ chứng chỉ");
                        }
                    })
                );
                setRemoveList([]);
            }

            if (addList && addList.length > 0) {
                for (const item of addList) {
                    if (item.certificateUrl.startsWith("blob:")) {
                        try {
                            // Convert the local URL (blob) to a Blob object
                            const response = await fetch(item.certificateUrl);
                            const blob = await response.blob();

                            const fileName = `${uuidv4()}_${item.certificateName}`;
                            const storageRef = ref(storage, `certificates/${fileName}`);

                            // Upload the Blob
                            await uploadBytes(storageRef, blob);

                            // Get the download URL
                            const downloadUrl = await getDownloadURL(storageRef);

                            // Prepare item data with the download URL
                            const newCertificate = {
                                ...item,
                                certificateUrl: downloadUrl,
                            };

                            // Save the certificate data to the database
                            await axiosClient.post("certificates", newCertificate);
                        } catch (error) {
                            toast.error("Lỗi khi thêm chứng chỉ");
                        }
                    }
                }
                setAddList([]);
            }

            //profile picture
            // const toAdd = selectPicture.filter((picture) => picture.isNew && !picture.isDeleted);
            // const toDelete = selectPicture.filter((picture) => !picture.isNew && picture.isDeleted);

            const uploadedPictures = await Promise.all(
                selectPicture.map(async (picture) => {
                    if (picture.isNew) {
                        const response = await fetch(picture.imageUrl);
                        const blob = await response.blob();
                        const fileName = `${uuidv4()}_profile_picture`;
                        const storageRef = ref(storage, `sitterprofilepictures/${fileName}`);
                        await uploadBytes(storageRef, blob);
                        const downloadUrl = await getDownloadURL(storageRef);

                        return {
                            ...picture,
                            imageUrl: downloadUrl,
                            isNew: false, // Mark as no longer new
                        };
                    }
                    return picture; // For existing pictures, return as is
                })
            );

            // await axiosClient.put(`sitter-profiles/${sitterData?.id}/profile-pictures`, uploadedPictures);



            // // Delete profile pictures
            // if (toDelete.length > 0) {
            //     try {
            //         await axiosClient.delete(`sitter-profiles/${sitterData?.id}/profile-pictures`, {
            //             data: toDelete, // Pass the array in the `data` field
            //         });
            //     } catch (error) {
            //         console.error("Error deleting profile pictures:", error);
            //         toast.error("Lỗi khi xóa hình ảnh hồ sơ.");
            //     }
            // }

            const updatedSitterData = {
                ...sitterData,
                location: address, // Include address as location
                profilePictures: uploadedPictures
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

    // const handleRemoveEvidence = (index: number) => {
    //     setSelectedTaskEvidence((prevEvidence) => prevEvidence.filter((_, i) => i !== index));
    // };

    //certificate upload
    const handleCertificateClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    // const handleCertificateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     if (event.target.files) {
    //         const filesArray = Array.from(event.target.files);

    //         const newCertificates = filesArray.map((file) => ({
    //             id: "",
    //             userId: sitterData?.sitterId || "",
    //             certificateType: file.type.includes("pdf") ? "PDF" : "IMAGE",
    //             certificateName: file.name,
    //             institutionName: "",
    //             certificateUrl: URL.createObjectURL(file),
    //             description: ""
    //         }));

    //         // Update the certificates state
    //         setCertificates((prevCertificates) => [...prevCertificates, ...newCertificates]);
    //     }
    // };
    const handleImageUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

            // Add the new images to the addList for tracking
            setAddList((prevList) => [...prevList, ...newCertificates]);
        }
    };

    const handleRemoveUpdateCertificate = (certificate: Certificate) => {
        setCertificates((prev) => prev.filter((item) => item !== certificate));
        if (certificate.id) {
            // Existing item fetched from the server, add to removeList
            setRemoveList((prev) => [...prev, certificate]);
        } else {
            // Newly added item, remove from addList
            setAddList((prev) => prev.filter((item) => item !== certificate));
        }
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
                id: uuidv4(),
                name: "",
                imageUrl: URL.createObjectURL(file),
                isCargoProfilePicture: isCargo,
                description: "",
                isNew: true,
                isDeleted: false
            }));
            setSelectPicture((prevImages) => [...prevImages, ...newPictures]);
        }
    };

    const markAsDeleted = (id?: string) => {
        if (!id) {
            console.error("ID is undefined");
            return; // Exit if the ID is undefined
        }

        // Update the list to exclude the item with the matching ID
        setSelectPicture((prevPictures) => prevPictures.filter((picture) => picture.id !== id));
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
                    <div className='flex overflow-x-auto gap-2'>
                        <button
                            className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                            onClick={handleImageClick}
                        >
                            <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                            <p>Thêm hình ảnh</p>
                            <p>{`${selectPicture.filter((e) => e.isCargoProfilePicture === false && !e.isDeleted).length}/5`}</p>
                        </button>
                        <input
                            type="file"
                            accept='image/*'
                            ref={hiddenImageInput}
                            onChange={(e) => handlePictureChange(e, false)}
                            style={{ display: 'none' }}
                            multiple
                        />
                        {selectPicture && selectPicture.filter((picture) => picture.isCargoProfilePicture === false && !picture.isDeleted).map((photo) => (
                            <div key={photo.id} className="relative w-36 h-36">
                                <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                                <button
                                    onClick={() => markAsDeleted(photo.id)}
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

                {/* Cargo  */}
                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Môi trường và chuồng cho mèo</h2>
                    <h3 className={styles.h3}>Mô tả</h3>
                    <Textarea placeholder="Hãy cho mọi người biết về môi trường sống và chuồng nuôi" value={sitterData?.environment} name='environment' onChange={handleInputChange} />
                    <h3 className={styles.h3}>Số lượng mèo bạn có thể chăm sóc</h3>
                    <Input placeholder="Số lượng mèo có thể chăm sóc" value={sitterData?.maximumQuantity !== undefined ? sitterData.maximumQuantity.toString() : ""} name='maximumQuantity' onChange={handleInputChange} />
                    <h3 className={styles.h3}>Hình ảnh môi trường và chuồng, lồng</h3>
                    <div className='flex overflow-x-auto gap-2'>
                        <button
                            className="flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36"
                            onClick={handleCargoClick}
                        >
                            <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                            <p>Thêm hình ảnh</p>
                            <p>{`${selectPicture.filter((e) => e.isCargoProfilePicture && !e.isDeleted).length}/5`}</p>
                        </button>
                        <input
                            type="file"
                            accept='image/*'
                            ref={hiddenCargoInput}
                            onChange={(e) => handlePictureChange(e, true)}
                            style={{ display: 'none' }}
                            multiple
                        />
                        {selectPicture.filter((picture) => picture.isCargoProfilePicture && !picture.isDeleted).map((photo) => (
                            <div key={photo.id} className="relative w-36 h-36">
                                <Avatar className="w-full h-full" radius="sm" src={photo.imageUrl} />
                                <button
                                    onClick={() => markAsDeleted(photo.id)}
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
                            <FontAwesomeIcon icon={faFilePdf} className="text-maincolor" size="2xl" />
                            <p>Thêm chứng chỉ</p>
                        </button>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            ref={hiddenFileInput}
                            onChange={handleImageUpdateChange}
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