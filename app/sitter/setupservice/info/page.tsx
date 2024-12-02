'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './info.module.css'
import { Autocomplete, AutocompleteItem, Button, Chip, Input, Textarea } from '@nextui-org/react'
import CatSitterSkill from '@/app/lib/CatSitterSkill.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, UserLocal } from '@/app/constants/types/homeType'
import { useRouter } from 'next/navigation'
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Skill {
    id: number;
    skill: string
}

const Info = () => {
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<Skill[]>([]);
    const [sitterData, setSitterData] = useState<CatSitter>();
    const mapRef = useRef<L.Map | null>(null);

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

    // Map initialization
    useEffect(() => {
        if (mapRef.current) return; // Prevent map from being re-initialized

        // Ensure the map container exists
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.error("Map container not found");
            return;
        }

        // Initialize map centered on Ho Chi Minh City (coordinates: 10.8231, 106.6297)
        mapRef.current = L.map(mapContainer).setView([10.8231, 106.6297], 12);

        // Load and display tile layer (OpenStreetMap tiles)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);

        // Create a custom icon
        const icon = L.divIcon({
            html: `<div style="background-color: #2B764F; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold;">🐈</div>`,
            className: "", // Remove default class to prevent unwanted styles
            iconSize: [24, 24],
            iconAnchor: [12, 24],
        });

        // Add click event listener
        let marker: L.Marker | null = null;

        // Use a type guard to ensure mapRef.current is not null
        if (mapRef.current) {
            mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
                if (marker) {
                    mapRef.current?.removeLayer(marker);
                }
                console.log(e.latlng); // e.latlng contains the latitude and longitude
                setSitterData({
                    ...sitterData,
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng,
                } as CatSitter);
                marker = L.marker(e.latlng, { icon: icon }).addTo(mapRef.current!);
            });
        }

        // Cleanup on component unmount
        return () => {
            if (mapRef.current) {
                mapRef.current.off(); // Remove all event listeners
                mapRef.current.remove(); // Remove map instance
            }
            mapRef.current = null;
        };
    }, []);




    return (
        <div className='flex items-center justify-center my-10'>
            <div className='flex flex-col gap-5 max-w-[1000px]'>
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
                    <Input value={sitterData?.experience} name='experience' onChange={handleInputChange} />
                </div>

                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Kỹ năng của bạn</h2>
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
                            <Autocomplete
                                className="w-[300px] h-10 mt-2"
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
                        </div>

                    </div>
                </div>

                {/* location */}
                <div className='mt-5 flex flex-col gap-2'>
                    <h2 className={styles.h2}>Địa chỉ</h2>
                    <Input value={sitterData?.location} name='location' onChange={handleInputChange} />
                </div>

                <div></div>
                <div
                    id="map"
                    style={{ height: "500px", width: "100%", float: "right" }}
                />


                <Button onClick={handleCreate} className='text-white bg-maincolor'>Lưu</Button>
            </div>
        </div >
    )
}

export default Info