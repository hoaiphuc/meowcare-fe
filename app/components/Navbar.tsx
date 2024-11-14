'use client'

import React, { useEffect, useState } from 'react'
import { NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Navbar as MyNavbar } from "@nextui-org/react";
import Image from 'next/image';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { fetchUserProfile } from '../lib/slices/userSlice';
import { UserLocal } from '../constants/types/homeType';
import Loading from './Loading';

const Navbar = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userProfile, loading } = useAppSelector((state) => state.user);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    const [isSitter, setIsSitter] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userJson = localStorage.getItem('user');
            const user: UserLocal | null = userJson ? JSON.parse(userJson) : null;

            const userRoles = user?.roles ?? [];

            if (userRoles.some(role => role.roleName === 'SITTER')) {
                setIsSitter(true);
            } else {
                setIsSitter(false);
            }
        }
    }, []);

    //Items on Navbar
    const menuItems = [
        { name: 'Trang chủ', path: '/' },
        { name: 'Dịch vụ', path: '/service' },
    ];

    if (isSitter === true) {
        menuItems.push({ name: 'Quản lí dịch vụ', path: '/sitter' });
    } else if (isSitter === false) {
        menuItems.push({ name: 'Trở thành người chăm sóc', path: '/besitter' });
    }

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

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(path);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        router.push('/login')
    }



    if (loading) {
        return Loading;
    }

    return (
        <MyNavbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered maxWidth="full" className='min-h-24 bg-[#fffaf5] '>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                />

                <NavbarBrand as={Link} href='/'>
                    <Image src="/meow.png" alt='' width={210} height={100} priority />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden md:flex gap-20" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={`${item}-${index}`}>
                        <Link
                            className="w-full text-[#666089]"
                            href={item.path}
                            size="lg"
                        >
                            <div className='flex justify-center flex-col items-center'>

                                <div className={`${isActive(item.path) ? "text-[#000857] font-semibold " : ""}`}>
                                    {item.name}
                                </div>
                                <div className={`${isActive(item.path) ? "flex justify-center items-center w-full h-[2px] bg-[#666089]" : "hidden"}`}></div>
                                <div className={`${isActive(item.path) ? "flex justify-center items-center w-[2px] h-8 bg-[#666089] mb-[-40px]" : "hidden"}`}>
                                </div>
                            </div>
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                {userProfile ?
                    <NavbarItem className="hidden lg:flex">
                        <Dropdown placement="bottom-start">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    src={userProfile?.avatar || '/User-avatar.png'}
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-bold">{userProfile?.fullName}</p>
                                </DropdownItem>
                                <DropdownItem key="profile">
                                    <Link
                                        href="/setupservice"
                                        className="text-black w-full py-3 text-[17px]"
                                    >
                                        Quản lí dịch vụ
                                    </Link>
                                </DropdownItem>
                                <DropdownItem key="profile">
                                    <Link
                                        href="/profile"
                                        className="text-black w-full py-3 text-[17px]"
                                    >
                                        Hồ sơ
                                    </Link>
                                </DropdownItem>

                                <DropdownItem key="logout" color="danger" onClick={() => handleLogout()}>
                                    Log Out
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                    :
                    <NavbarItem className="hidden lg:flex">
                        <Link href="/login" className='text-[#666089]'>Đăng nhập <FontAwesomeIcon icon={faArrowRightToBracket} className='pl-2 w-5 h-5' /></Link>
                    </NavbarItem>
                }
            </NavbarContent>
            <NavbarMenu className='pt-10'>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full text-secondary font-semibold"
                            href={item.path}
                            size="lg"
                        >
                            <div className={`${pathname === item.path ? "text-text" : ""}`}>
                                {item.name}
                            </div>
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </MyNavbar>
    )
}

export default Navbar