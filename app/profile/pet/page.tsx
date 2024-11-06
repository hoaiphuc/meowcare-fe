'use client'

import { faCat, faCirclePlus, faEye, faPenClip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Textarea, useDisclosure } from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react'
import styles from './pet.module.css';
import axiosClient from '@/app/lib/axiosClient';
import { PetProfile } from '@/app/constants/types/homeType';
const Page = () => {
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    // const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const [pets, setPets] = useState<PetProfile[]>([]);
    const [petData, setPetData] = useState({
        petName: '',
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

    const handleAddPet = () => {
        try {
            axiosClient.post('/pet-profiles', petData)
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

                {pets && pets.map((pet) => (
                    <div className={styles.pet} key={pet.id}>
                        <div className={styles.petWrap}>
                            <div className={styles.petInfoWrap}>
                                <div className={styles.petInfo}>
                                    <h1 className='text-2xl font-bold'>{pet.petName}</h1>
                                    <h2 className='text-[18px]'>{pet.breed}</h2>
                                    <h3 className='text-[16px]'>{pet.age}, {pet.weight}kg {pet.gender}</h3>
                                </div>
                            </div>
                        </div>
                        <div className='flex items-center justify-start'>
                            <Button className='bg-transparent text-[#902C6C] hover:underline'>
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
                            <ModalHeader className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCat} className='fa-2x' />
                                <h1 className='text-2xl font-bold'>Bé mèo của bạn</h1>
                            </ModalHeader>
                            <ModalBody className='gap-5 flex'>
                                <div className='flex gap-5'>
                                    <Input label={<h1 className={styles.heading1}>Tên bé mèo</h1>} placeholder='Tên' labelPlacement='outside' name='petName' value={petData.petName} onChange={handleInputChange} />
                                    <Input label={<h1 className={styles.heading1}>Tuổi</h1>} placeholder='Nhập tuổi cho bé mèo' labelPlacement='outside' name='age' value={petData.age} onChange={handleInputChange} />
                                </div>
                                <div className='flex gap-5'>
                                    <Input label={<h1 className={styles.heading1}>Giống loài</h1>} placeholder='Tên giống mèo của bạn' labelPlacement='outside' name='species' value={petData.species} onChange={handleInputChange} />
                                    <Input label={<h1 className={styles.heading1}>Cân nặng</h1>} placeholder='Kg' labelPlacement='outside' />
                                    <RadioGroup
                                        label={<h1 className={styles.heading1}>Giới tính</h1>}
                                    >
                                        <div className='flex gap-3'>
                                            <Radio value="buenos-aires">Nam</Radio>
                                            <Radio value="sydney">Nữ</Radio>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Textarea label={<h1 className={styles.heading1}>Thông tin về mèo của bạn</h1>} placeholder='Thêm mô tả mèo của bạn' labelPlacement='outside' />
                                <Textarea label={<h1 className={styles.heading1}>Những thông tin mà người chăm sóc mèo cần lưu ý</h1>} placeholder='Thêm hướng dẫn chăm sóc để phù hợp với bé mèo của bạn' labelPlacement='outside' />
                            </ModalBody>
                            <ModalFooter className='flex justify-center items-center'>
                                <Button color="primary" onPress={handleAddPet}>
                                    Lưu
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