"use client";

import {
    Navbar,
    Button,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
    const router = useRouter();
    const logout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <Navbar maxWidth="full" isBordered className="px-8 min-h-24">
            <NavbarBrand className="">
                <a href="/manager">
                    <Image
                        src="/meow.png"
                        alt=""
                        width={200}
                        height={70}
                        priority
                    />
                </a>
            </NavbarBrand>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button
                        className="mr-2"
                        as={Link}
                        color="primary"
                        href="/profile"
                        variant="flat"
                    >
                        Profile
                    </Button>

                    <Button
                        color="primary"
                        variant="flat"
                        onClick={() => logout()}
                    >
                        Logout
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};

export default DashboardNavbar;