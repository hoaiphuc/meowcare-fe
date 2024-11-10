"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/app/constants/types/homeType";


type LayoutProps = {
    children: React.ReactNode; // Typing the children prop
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const router = useRouter();
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const getUserFromStorage = () => {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        };

        const user = getUserFromStorage();

        if (user && user.roles) {
            const userRoles: Role[] = user.roles;
            const hasManagerRole = userRoles.some((role) => role.roleName === "MANAGER");

            if (hasManagerRole) {
                setUserRole("MANAGER");
            } else {
                setUserRole("OTHER");
            }
        } else {
            setUserRole(null);
        }
    }, []);

    if (userRole === null) {
        // Render a loading state or nothing during the initial render
        return null;
    }

    if (userRole !== "MANAGER") {
        router.push("/");

    }

    // useEffect(() => {
    //     if (userRole !== "MANAGER") {
    //         router.push("/");
    //     }
    // }, [router, userRole]);


    return <>{children}</>;
};

export default Layout;