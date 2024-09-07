'use client'

import React, { useState } from 'react'
import { NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link } from "@nextui-org/react";
import { Navbar as MyNavbar } from "@nextui-org/react";
import Image from 'next/image';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuItems = [
        "Trang chủ",
        "Dịch vụ",
        "Trở thành người chăm sóc",
        "Bài viết"
    ];
    return (
        <MyNavbar onMenuOpenChange={setIsMenuOpen} className='min-h-24 bg-[#fffaf5]'>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />

                <NavbarBrand >
                    <Image src="/meow.png" alt='' width={210} height={100} />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {menuItems.map((item, index) => (
                    <NavbarItem key={`${item}-${index}`}>
                        <Link
                            className="w-full text-[#000857]"
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#" className='text-[#000857]'>Đăng nhập <FontAwesomeIcon icon={faArrowRightToBracket} className='pl-2' /></Link>
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
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </MyNavbar>

    )
}

export default Navbar