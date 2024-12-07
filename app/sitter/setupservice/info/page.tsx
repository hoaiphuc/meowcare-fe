'use client'

import React, { useEffect, useState } from 'react'
import styles from './info.module.css'
import { Autocomplete, AutocompleteItem, Avatar, Button, Chip, Input, Textarea } from '@nextui-org/react'
import CatSitterSkill from '@/app/lib/CatSitterSkill.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, UserLocal } from '@/app/constants/types/homeType'
import { useRouter } from 'next/navigation'
import "leaflet/dist/leaflet.css";
import useGeoapify from '@/app/hooks/useGeoapify';
import dynamic from 'next/dynamic';
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
                .then(() => {
                    router.push("/sitter/setupservice")
                })
                .catch(() => {

                })
        } catch (error) {

        }
    }

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
    return (
        <div className='flex items-center justify-center my-10'>
            <div className='flex flex-col gap-5 w-[754px]'>
                <div className=' text-center'>
                    <h1 className='text-4xl font-semibold mb-5'>Thông tin cá nhân của bạn</h1>
                    <h3 className={styles.h3}>
                        Hãy để cho người chủ thú cưng biết về bạn và tình yêu của bạn dành cho thú cưng
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
                    <div className='flex bg-white p-3 h-full rounded-md shadow-md items-start justify-start'>
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

                {/* location */}
                <div className={styles.location}>
                    <h2 className={styles.h2}>Địa chỉ</h2>
                    <Input
                        value={address}
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

                <MapComponent
                    onLocationChange={handleLocationChange}
                    location={{ lat: sitterData?.latitude ?? 10.8231, lng: sitterData?.longitude ?? 106.6297 }}
                />


                <Button onClick={handleCreate} className='text-white bg-maincolor'>Lưu</Button>
            </div>
        </div >
    )
}

export default Info