import { faCamera } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Navbar, NavbarContent, NavbarItem, useDisclosure } from '@nextui-org/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react'
import { profileSidebar } from '../lib/profileSidebar';
import { ProfileSidebarItem } from '../constants/types/homeType';
import Link from 'next/link';

const ProfileSidebar = () => {
    // const router = useRouter();
    const { isOpen, onOpenChange } = useDisclosure();
    return (
        <div className="h-full">
            <div className="flex w-[387px] flex-col gap-2 ">
                <div className="rounded-2xl bg-white py-3 shadow-md">
                    <div className="flex flex-row">
                        <div className="relative ml-5 flex w-[100px] flex-col -space-x-2 overflow-hidden">
                            <Image
                                //   key={avatar}
                                //   src={
                                //       profileData?.avatar ? profileData.avatar : '/User-avatar.png'
                                //   }
                                src='/User-avatar.png'
                                alt=""
                                width="0"
                                height="0"
                                sizes="100vw"
                                priority
                                className="h-[80px] w-[80px] rounded-full"
                            />

                            <div className="flex items-end justify-end">
                                <Button
                                    isIconOnly
                                    radius="full"
                                    size="sm"
                                    className="absolute bg-[#FF0004]"
                                //   onPress={onOpen}
                                >
                                    <FontAwesomeIcon
                                        icon={faCamera}
                                        className="size-4 text-white"
                                    />
                                </Button>
                            </div>
                        </div>
                        <div className="ml-3">
                            <p>Chào mừng bạn,</p>
                            {/* <h2 className="font-bold">{profileData?.userName}</h2> */}
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