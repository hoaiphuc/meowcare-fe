'use client'

import React, { useEffect, useState } from 'react'
import styles from './info.module.css'
import { Autocomplete, AutocompleteItem, Button, Chip, Input, Textarea } from '@nextui-org/react'
import CatSitterSkill from '@/app/lib/CatSitterSkill.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, UserLocal } from '@/app/constants/types/homeType'

interface Skill {
    id: number;
    skill: string
}

const Info = () => {
    const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
    const [sitterData, setSitterData] = useState<CatSitter>();

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
                })
                .catch(() => { })
        } catch (error) {

        }
    }, [userId])

    //create profile
    const handleCreate = () => {
        try {
            axiosClient.post("sitter-profiles", sitterData)
                .then(() => { })
                .catch(() => {

                })
        } catch (error) {

        }
    }

    return (
        <div className='flex items-center justify-center my-10'>
            <div className='flex flex-col gap-5 '>
                <div className=' text-center'>
                    <h1 className='text-4xl font-semibold mb-5'>Thông tin cá nhân của bạn</h1>
                    <h3 className={styles.h3}>
                        Hãy để cho người chủ thú cưng biết về bạn và tình yêu của bạn dành cho thú cưng
                    </h3>
                </div>

                <div className='mt-5'>
                    <h2 className={styles.h2}>Giới thiệu</h2>
                    <Textarea value={sitterData?.bio} name='bio' onChange={handleInputChange} />
                </div>

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Kinh nghiệm</h2>
                    <h3 className={styles.h3}>Số năm kinh nghiệm của bạn</h3>
                    <Input />
                </div>

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Kỹ năng của bạn</h2>
                    <Autocomplete
                        className=""
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
                    <div className="flex mt-2 flex-wrap w-[800px]">
                        {selectedItems.map((item: Skill) => (
                            <Chip
                                key={item.id}
                                color={"primary"}
                                className="mr-2 mt-2"
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
                <Button onClick={handleCreate} className='text-white bg-maincolor'>Lưu</Button>
            </div>
        </div>
    )
}

export default Info