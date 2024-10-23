'use client'

import React, { useEffect, useState } from 'react'
import { NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { Navbar as MyNavbar } from "@nextui-org/react";
import Image from 'next/image';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = () => {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        { name: "Trang chủ", path: "/" },
        { name: "Dịch vụ", path: "/service" },
        { name: "Trở thành người chăm sóc", path: "/besitter" },
    ];
    const pathname = usePathname();
    const [isUser, setIsUser] = useState<boolean | null>(null);
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const authToken = localStorage.getItem('auth-token');
            setIsUser(Boolean(authToken));
        }
    }, []);

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
    return (
        <MyNavbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered maxWidth="full" className='min-h-24 bg-[#fffaf5] '>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="md:hidden"
                />

                <NavbarBrand >
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
                {isUser ?
                    <NavbarItem className="hidden lg:flex">
                        <Dropdown placement="bottom-start">
                            <DropdownTrigger>
                                <Avatar
                                    isBordered
                                    as="button"
                                    className="transition-transform"
                                    src="/User-avatar.png"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="User Actions" variant="flat">
                                <DropdownItem key="profile" className="h-14 gap-2">
                                    <p className="font-bold">Nguyễn Lê Đức Tấn</p>
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