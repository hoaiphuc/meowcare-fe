'use client'

import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, useDisclosure } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import { profileSidebar } from '../lib/profileSidebar';
import { ProfileSidebarItem } from '../constants/types/homeType';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { fetchUserProfile, updateUserProfile } from '../lib/slices/userSlice';
import Loading from './Loading';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../utils/firebase';
import { v4 as uuidv4 } from 'uuid';

const ProfileSidebar = () => {
    // const router = useRouter();
    const { isOpen, onOpenChange } = useDisclosure();
    const dispatch = useAppDispatch();
    const { userProfile, loading } = useAppSelector((state) => state.user);
    // const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);

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

    if (loading) {
        return <Loading />;
    }

    //image upload
    const handleImageClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        let profilePictureUrl = '';

        if (file) {
            const storageRef = ref(storage, `avatar/${uuidv4()}_${file.name}`);

            // Upload the file
            await uploadBytes(storageRef, file);

            // Get the download URL
            profilePictureUrl = await getDownloadURL(storageRef);
            dispatch(updateUserProfile({ avatar: profilePictureUrl }));
        }
    };

    return (
        <div className="h-full">
            <div className="flex w-[387px] flex-col gap-2 ">
                <div className="rounded-2xl bg-white py-3 shadow-md">
                    <div className="flex flex-row">
                        <div className="relative ml-5 flex w-[100px] flex-col -space-x-2 overflow-hidden">
                            <Avatar
                                src={
                                    userProfile?.avatar &&
                                        (userProfile.avatar.startsWith('http://') ||
                                            userProfile.avatar.startsWith('https://') ||
                                            userProfile.avatar.startsWith('/'))
                                        ? userProfile.avatar
                                        : '/User-avatar.png'
                                }
                                // src={userProfile?.avatar || '/User-avatar.png'}
                                alt=""
                                className="h-[80px] w-[80px] rounded-full"
                            />

                            <div className="flex items-end justify-end">
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    className="absolute bg-[#902C6C]"
                                    onClick={handleImageClick}
                                >
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className="size-4 text-white"
                                    />
                                </Button>
                                <input
                                    type="file"
                                    accept='image/*'
                                    ref={hiddenFileInput}
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className="ml-3">
                            <p>Chào mừng bạn,</p>
                            <h2 className="font-bold">{userProfile?.fullName}</h2>
                            {/* <Button
                                className="border bg-[#F2F2F2]"
                                onClick={() => router.push('/profile/wallet')}
                            >
                                <FontAwesomeIcon
                                    icon={faCirclePlus}
                                    className="size-5 text-[#FF0004]"
                                />
                                {walletError ? 0 : wallet?.balance.toLocaleString()} VNĐ
                            </Button> */}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="rounded-2xl bg-white shadow-md">
                        <Navbar className="flex h-[455px] w-[350px] items-start rounded-2xl pt-10">
                            <NavbarContent className="flex flex-col items-start gap-8">
                                <NavbarItem className="text-xl">
                                    <div className="flex flex-col space-y-2 ">
                                        {profileSidebar.map((item, idx) => {
                                            return <MenuItem key={idx} item={item} />;
                                        })}
                                    </div>
                                </NavbarItem>
                            </NavbarContent>
                        </Navbar>
                    </div>
                </div>
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Cập nhật ảnh đại diện</ModalHeader>
                            <ModalBody>
                                <div>
                                    <input
                                        className="py-3"
                                        type="file"
                                        // onChange={(e) => uploadFile(e)}
                                        accept="image/jpeg, image/png"
                                    />
                                    {/* {uploading && <Spinner />} */}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button
                                    color="primary"
                                    // disabled={uploading}
                                    onClick={() => {
                                        // handleUpdateAvatar();
                                        onClose();
                                    }}
                                >
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default ProfileSidebar

const MenuItem = ({ item }: { item: ProfileSidebarItem }) => {
    const pathname = usePathname();

    return (
        <div className="py-2">
            <Link
                href={item.path}
                className={`flex flex-row items-center space-x-4 rounded-lg p-2 hover:text-[#902C6C] ${item.path === pathname ? 'text-[#902C6C]' : ''
                    }`}
            >
                {item.icon}
                <span className="flex text-xl font-semibold">{item.title}</span>
            </Link>
        </div>
    );
};