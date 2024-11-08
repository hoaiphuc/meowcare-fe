"use client";

import { SideNavItem } from "@/app/constants/types/homeType";
import { navbarAdmin } from "@/app/lib/navbarAdmin";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
    return (
        <Navbar className="flex items-start bg-[#2B2B2B] text-white w-[350px] h-[800px] pt-10">
            <NavbarContent className="flex flex-col gap-8 items-start ">
                <NavbarItem className="text-xl">
                    <div className="flex flex-col space-y-2 ">
                        {navbarAdmin.map((item, idx: number) => {
                            return <MenuItem key={idx} item={item} />;
                        })}
                    </div>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};

export default Sidebar;

const MenuItem = ({ item }: { item: SideNavItem }) => {
    const pathname = usePathname();
    const [subMenuOpen, setSubMenuOpen] = useState(false);
    const toggleSubMenu = () => {
        setSubMenuOpen(!subMenuOpen);
    };

    return (
        <div className="">
            {item.subMenu ? (
                <>
                    <div
                        onClick={toggleSubMenu}
                        className={` cursor-pointer flex flex-row items-center p-2 rounded-lg w-full justify-between hover:text-[#FF0004] ${pathname.includes(item.path) ? "text-[#FF0004]" : ""
                            }`}
                    >
                        <div className=" flex-1  flex flex-row space-x-4 items-center">
                            {item.icon}
                            <span className="font-semibold text-xl flex">{item.title}</span>
                        </div>

                        <div className={`${subMenuOpen ? "-rotate-90" : ""} flex`}>
                            <FontAwesomeIcon icon={faChevronLeft} className="pl-4 w-7 h-7" />
                        </div>
                    </div>

                    {subMenuOpen && (
                        <div className="my-2 ml-12 flex flex-col space-y-4 ">
                            {item.subMenuItems?.map((subItem, idx) => {
                                return (
                                    <Link
                                        key={idx}
                                        href={subItem.path}
                                        className={`${subItem.path === pathname
                                            ? "font-bold text-[#FF0004]"
                                            : ""
                                            }`}
                                    >
                                        <span className="hover:text-[#FF0004]">
                                            {subItem.title}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <Link
                    href={item.path}
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:text-[#FF0004] ${item.path === pathname ? "text-[#FF0004]" : ""
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-xl flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};