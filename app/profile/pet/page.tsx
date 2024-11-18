'use client'

import { faCat, faCirclePlus, faEye, faMars, faPenClip, faVenus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Select, SelectItem, Textarea, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './pet.module.css';
import axiosClient from '@/app/lib/axiosClient';
import { PetProfile } from '@/app/constants/types/homeType';
import CatBreed from '@/app/lib/CatBreed.json';
import { toast } from 'react-toastify';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '@/app/utils/firebase';
import { showConfirmationDialog } from '@/app/components/confirmationDialog';

const Page = () => {
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const [selectBreed, setSelectBreed] = useState<string>('');
    //image data
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    //update image
    const [selectedUpdateImage, setSelectedUpdateImage] = useState<File | null>(null);
    const [previewUpdateImage, setPreviewUpdateImage] = useState<string | null>(null);
    const hiddenUpdateFileInput = useRef<HTMLInputElement>(null);

    const [pets, setPets] = useState<PetProfile[]>([]);
    const [petData, setPetData] = useState({
        petName: '',
        profilePicture: '',
        age: '',
        breed: selectBreed,
        species: '',
        weight: '',
        gender: '',
        description: '',
    });
    const [updatePet, setUpdatePet] = useState({
        id: '',
        petName: '',
        profilePicture: '',
        age: '',
        breed: '',
        species: '',
        weight: '',
        gender: '',
        description: '',
    });
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user !== null) {
                try {
                    const userObj = JSON.parse(user);
                    setUserId(userObj.id);
                } catch (e) {
                    console.error('Failed to parse user from localStorage', e);
                }
            }
        }
    }, []);

    //get data
    const fetchPets = useCallback(() => {
        if (userId != null) {
            axiosClient(`/pet-profiles/user/${userId}`)
                .then((res) => {
                    console.log('API Response:', res.data);
                    setPets(res.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    }, [userId]);

    useEffect(() => {
        fetchPets();
    }, [fetchPets])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value
        });
    };

    const handleGenderChange = (value: string) => {
        setPetData({
            ...petData,
            gender: value,
        });
    };

    //add pet
    const handleAddPet = async () => {
        try {
            let profilePictureUrl = '';
            if (selectedImage) {
                const storageRef = ref(storage, `petProfiles/${uuidv4()}_${selectedImage.name}`);

                // Upload the file
                await uploadBytes(storageRef, selectedImage);

                // Get the download URL
                profilePictureUrl = await getDownloadURL(storageRef);
            }

            // Prepare pet data with the profile picture URL
            const petDataWithImage = {
                ...petData,
                profilePicture: profilePictureUrl,
            };

            axiosClient.post('/pet-profiles', petDataWithImage)
                .then(() => {
                    onOpenChangeAdd();
                    setPetData({
                        petName: '',
                        age: '',
                        breed: '',
                        weight: '',
                        species: '',
                        gender: '',
                        description: '',
                        profilePicture: '',
                    });
                    fetchPets();
                })
                .catch((e) => {
                    console.log(e);
                })

        } catch (error) {
            console.log(error);
        }
    }

    const handleOpenUpdatePet = (id: string) => {
        onOpenUpdate()
        try {
            axiosClient(`pet-profiles/${id}`)
                .then((res) => {
                    setUpdatePet(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdatePet({
            ...updatePet,
            [name]: value,
        });
    };

    const handleUpdateGenderChange = (value: string) => {
        setUpdatePet({
            ...updatePet,
            gender: value,
        });
    };

    //update pet
    const handleUpdatePet = async () => {
        try {
            let profilePictureUrl = updatePet.profilePicture; // Keep existing image URL by default

            // If a new image has been selected
            if (selectedUpdateImage) {
                const storageRef = ref(storage, `petProfiles/${uuidv4()}_${selectedUpdateImage.name}`);

                // Upload the new image
                await uploadBytes(storageRef, selectedUpdateImage);

                // Get the download URL
                profilePictureUrl = await getDownloadURL(storageRef);
            }

            // Prepare updated pet data with the new or existing profile picture URL
            const updatedPetData = {
                ...updatePet,
                profilePicture: profilePictureUrl,
            };

            // Send PUT request to update the pet profile
            await axiosClient.put(`/pet-profiles/${updatePet.id}`, updatedPetData);

            toast.success('Hồ sơ đã được cập nhật');
            onOpenChangeUpdate(); // Close the update modal
            fetchPets(); // Refresh the pet list

            // Reset state variables
            setUpdatePet({
                id: '',
                petName: '',
                age: '',
                breed: '',
                species: '',
                weight: '',
                gender: '',
                description: '',
                profilePicture: '',
            });
            setSelectedUpdateImage(null);
            setPreviewUpdateImage(null);
        } catch (error) {
            console.log(error);
            toast.error('Đã xảy ra lỗi khi cập nhật hồ sơ');
        }
    };


    //handle breed change
    const handleBreedChange = (breedId: string) => {
        setSelectBreed(breedId);
    };

    //delete pet profile
    const handleDelete = async (petId: string) => {
        const isConfirmed = await showConfirmationDialog({
            title: 'Bạn có muốn xóa hồ sơ này không?',
            confirmButtonText: 'Có',
            denyButtonText: 'Không',
            confirmButtonColor: '#00BB00',
        });
        if (isConfirmed) {
            try {
                axiosClient.delete(`pet-profiles/${petId}`)
                    .then(() => {
                        toast.success('Bạn đã xóa hồ sơ này');
                        fetchPets();
                    })
                    .catch((e) => {
                        console.log(e);
                        if (e.response.data.status === 2003) {
                            toast.error('Bé mèo này hiện tại đang trong dịch vụ!')
                        }
                    })
            } catch (error) {
                console.log(error);
            }
        } else if (isConfirmed) {
            return;
        }

    }

    //clean the image, revoke the object URL to prevent memory leaks
    useEffect(() => {
        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Clean up the previewUpdateImage when the component unmounts or when the image changes
    useEffect(() => {
        return () => {
            if (previewUpdateImage) {
                URL.revokeObjectURL(previewUpdateImage);
            }
        };
    }, [previewUpdateImage]);

    //image upload
    const handleImageClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        console.log(file);

        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    //update image
    // Function to handle the image click
    const handleUpdateImageClick = () => {
        if (hiddenUpdateFileInput.current) {
            hiddenUpdateFileInput.current.click();
        }
    };

    // Function to handle image change
    const handleUpdateImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedUpdateImage(file);
            setPreviewUpdateImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="w-[891px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col items-start justify-start">
            <h1 className='text-2xl font-bold'>Thú cưng của bạn</h1>
            <h2 className='mb-4'>Thêm mèo cưng của bạn hoặc chỉnh sửa thông tin</h2>
            <div className='grid grid-cols-2 gap-5'>
                <div
                    className='flex flex-col items-center justify-center w-[416px] h-[295px] border-dashed border-2 gap-3 cursor-pointer rounded-lg'
                    onClick={onOpenAdd}
                >
                    <FontAwesomeIcon icon={faCirclePlus} className='fa-2x text-[#902C6C]' />
                    <h1 className='text-xl'>Thêm thú cưng </h1>
                </div>

                {pets && pets.slice().reverse().map((pet) => (
                    <div className={styles.pet} key={pet.id}>
                        <div
                            className={`${styles.petWrap} `}
                            style={
                                pet.profilePicture
                                    ? {
                                        backgroundImage: `url("${pet.profilePicture}")`,
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundRepeat: 'no-repeat',
                                    }
                                    : {
                                        backgroundColor: '#333',
                                    }}
                        >
                            <div className={styles.petInfoWrap}>
                                <div className={styles.petInfo}>
                                    <h1 className='text-2xl font-bold'>{pet.petName}</h1>
                                    <h2 className='text-[18px]'>{pet.breed}</h2>
                                    <h3 className='text-[16px]'>{pet.age} năm tuổi, {pet.weight}kg {pet.gender === "Bé đực" ? <FontAwesomeIcon icon={faMars} className='text-[#5183CF]' /> : <FontAwesomeIcon icon={faVenus} className='text-[#F5559F]' />}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-start'>
                            <Button onClick={() => handleOpenUpdatePet(pet.id)} className='bg-transparent text-[#902C6C] hover:underline'>
                                <FontAwesomeIcon icon={faPenClip} />
                                <h1>Chỉnh sửa</h1>
                            </Button>
                            <Button className='bg-transparent text-[#902C6C] hover:underline'>
                                <FontAwesomeIcon icon={faEye} />
                                <h1 className=''>Xem</h1>
                            </Button>
                        </div>
                    </div>
                ))}


            </div>

            <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} size='5xl'>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex items-end gap-2">
                                <FontAwesomeIcon icon={faCat} className='fa-2x' />
                                <div className='items-end mb-[-6px]'>
                                    <h1 className='text-2xl font-bold'>Bé mèo của bạn</h1>
                                </div>
                            </ModalHeader>
                            <ModalBody className='flex gap-5 '>
                                <div className='flex gap-10'>
                                    <div className='relative group w-[200px] h-[200px]'>
                                        <Avatar className='w-full h-full' radius="sm" src={previewImage || '/noimagecat.jpg'} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Button
                                                onClick={handleImageClick}
                                                className=' bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                            >
                                                Chọn ảnh cho hồ sơ
                                            </Button>
                                        </div>
                                        <input
                                            type="file"
                                            accept='image/*'
                                            ref={hiddenFileInput}
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex gap-5'>
                                            <Input label={<h1 className={styles.heading1}>Tên bé mèo</h1>} placeholder='Tên' labelPlacement='outside' name='petName' value={petData.petName} onChange={handleInputChange} />
                                            <Input label={<h1 className={styles.heading1}>Tuổi</h1>} placeholder='Nhập tuổi cho bé mèo' labelPlacement='outside' name='age' value={petData.age} onChange={handleInputChange} />
                                            <RadioGroup
                                                label={<h1 className={styles.heading1}>Giới tính</h1>}
                                                className='w-full'
                                                value={petData.gender}
                                                onValueChange={handleGenderChange}
                                            >
                                                <div className='flex gap-3'>
                                                    <Radio value="Bé đực">Bé đực</Radio>
                                                    <Radio value="Bé cái">Bé cái</Radio>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className='flex gap-5'>
                                            <Select
                                                label="Giống loài"
                                                labelPlacement='outside'
                                                placeholder="Giống mèo của bạn"
                                                className="select"
                                                variant="bordered"
                                                onChange={(event) => handleBreedChange(event.target.value)}
                                            >
                                                {CatBreed.map((breed) => (
                                                    <SelectItem key={breed.id} value={breed.id}>
                                                        {breed.breed}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Input label={<h1 className={styles.heading1}>Cân nặng</h1>} placeholder='Kg' labelPlacement='outside' name='weight' value={petData.weight} onChange={handleInputChange} />

                                        </div>
                                    </div>
                                </div>


                                <Textarea label={<h1 className={styles.heading1}>Những thông tin mà người chăm sóc mèo cần lưu ý</h1>} placeholder='Thêm hướng dẫn chăm sóc để phù hợp với bé mèo của bạn' labelPlacement='outside' />
                            </ModalBody>
                            <ModalFooter className='flex justify-center items-center'>
                                <Button color="primary" onPress={handleAddPet} className='rounded-full'>
                                    Lưu
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* update modal */}
            <Modal isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate} size='5xl'>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCat} className='fa-2x' />
                                <h1 className='text-2xl font-bold'>Bé mèo của bạn</h1>
                            </ModalHeader>
                            <ModalBody className='gap-5 flex'>
                                <div className='flex gap-10'>
                                    <div className='relative group w-[200px] h-[200px]'>
                                        <Avatar
                                            className='w-full h-full'
                                            radius="sm"
                                            src={previewUpdateImage || updatePet.profilePicture || '/noimagecat.jpg'}
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Button
                                                onClick={handleUpdateImageClick}
                                                className='bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                            >
                                                Chọn ảnh mới
                                            </Button>
                                        </div>
                                        <input
                                            type="file"
                                            accept='image/*'
                                            ref={hiddenUpdateFileInput}
                                            onChange={handleUpdateImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex gap-5'>
                                            <Input label={<h1 className={styles.heading1}>Tên bé mèo</h1>} placeholder='Tên' labelPlacement='outside' name='petName' value={updatePet.petName} onChange={handleUpdateInputChange} />
                                            <Input label={<h1 className={styles.heading1}>Tuổi</h1>} placeholder='Nhập tuổi cho bé mèo' labelPlacement='outside' name='age' value={updatePet.age} onChange={handleUpdateInputChange} />
                                            <RadioGroup
                                                label={<h1 className={styles.heading1}>Giới tính</h1>}
                                                className='w-full'
                                                value={updatePet.gender}
                                                onValueChange={handleUpdateGenderChange}
                                            >
                                                <div className='flex gap-3'>
                                                    <Radio value="buenos-aires">Bé đực</Radio>
                                                    <Radio value="sydney">Bé cái</Radio>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className='flex gap-5'>
                                            <Select
                                                label={<h1 className={styles.heading1}>Giống loài</h1>}
                                                labelPlacement='outside'
                                                placeholder="Giống mèo của bạn"
                                                className="select"
                                                variant="bordered"
                                                onChange={(event) => handleBreedChange(event.target.value)}
                                            >
                                                {CatBreed.map((breed) => (
                                                    <SelectItem key={breed.id} value={breed.id}>
                                                        {breed.breed}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Input label={<h1 className={styles.heading1}>Cân nặng</h1>} placeholder='Kg' labelPlacement='outside' />
                                        </div>
                                    </div>
                                </div>
                                <Textarea label={<h1 className={styles.heading1}>Những thông tin mà người chăm sóc mèo cần lưu ý</h1>} placeholder='Thêm hướng dẫn chăm sóc để phù hợp với bé mèo của bạn' labelPlacement='outside' />
                            </ModalBody>
                            <ModalFooter className='flex justify-center items-center flex-col'>
                                <Button color="primary" onPress={() => handleUpdatePet()} className='rounded-full'>
                                    Cập nhật
                                </Button>
                                <Button className='rounded-full bg-transparent hover:bg-gray-200' onClick={() => handleDelete(updatePet.id)}>
                                    Xóa hồ sơ này
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default Page