"use client";

import { SideNavItem } from "@/app/constants/types/homeType";
import { navbarManager } from "@/app/lib/navbarManager";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Sidebar = () => {
    return (
        <Navbar className="flex items-start bg-transparent w-[350px] h-[800px] pt-10 border-r">
            <NavbarContent className="flex flex-col gap-8 items-start ">
                <NavbarItem className="text-xl">
                    <div className="flex flex-col space-y-2 ">
                        {navbarManager.map((item, idx: number) => {
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
                        className={` cursor-pointer flex flex-row items-center p-2 rounded-lg w-full justify-between hover:text-maincolor ${pathname.includes(item.path) ? "text-maincolor" : ""
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
                                            ? "font-bold maincolor"
                                            : ""
                                            }`}
                                    >
                                        <span className="hover:text-maincolor">
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
                    className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:text-maincolor ${item.path === pathname ? "text-maincolor" : ""
                        }`}
                >
                    {item.icon}
                    <span className="font-semibold text-xl flex">{item.title}</span>
                </Link>
            )}
        </div>
    );
};