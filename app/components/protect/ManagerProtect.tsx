"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserLocal } from "@/app/constants/types/homeType";


type LayoutProps = {
    children: React.ReactNode; // Typing the children prop
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userRole = user?.roles[0].roleName;



    useEffect(() => {
        if (userRole !== "MANAGER") {
            router.push("/");
        }
    }, [router, userRole]);

    //   if (userRole !== "ROLE_ADMIN") {
    //     return <></>;
    //   }

    return <>{children}</>;
};

export default Layout;