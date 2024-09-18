'use client'

import React, { useState } from 'react'
import { NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link } from "@nextui-org/react";
import { Navbar as MyNavbar } from "@nextui-org/react";
import Image from 'next/image';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        { name: "Trang chủ", path: "/" },
        { name: "Dịch vụ", path: "/service" },
        { name: "Trở thành người chăm sóc", path: "/besitter" },
    ];
    const pathname = usePathname();
    return (
        <MyNavbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered className='min-h-24 bg-[#fffaf5]'>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />

                <NavbarBrand >
                    <Image src="/meow.png" alt='' width={210} height={100} />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-10" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={`${item}-${index}`}>
                        <Link
                            className="w-full text-[#666089]"
                            href={item.path}
                            size="lg"
                        >
                            <div className='flex justify-center flex-col items-center'>

                                <div className={`${pathname === item.path ? "text-[#000857] font-semibold " : ""}`}>
                                    {item.name}
                                </div>
                                <div className={`${pathname === item.path ? "flex justify-center items-center w-full h-[2px] bg-[#666089]" : "hidden"}`}></div>
                                <div className={`${pathname === item.path ? "flex justify-center items-center w-[2px] h-8 bg-[#666089] mb-[-40px]" : "hidden"}`}>
                                </div>
                            </div>
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="/login" className='text-[#666089]'>Đăng nhập <FontAwesomeIcon icon={faArrowRightToBracket} className='pl-2' /></Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            className="w-full"
                            href="#"
                            size="lg"
                        >
                            <div className={`${pathname === item.path ? "text-[#e74c3c]" : ""}`}>
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