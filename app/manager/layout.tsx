"use client";

import React, { useState, useEffect } from "react";
import ManagerProtect from '@/app/components/protect/ManagerProtect';
import NavbarManager from '@/app/components/manager/NavbarManager';
import Sidebar from "../components/manager/SidebarManager";
import { Role } from "@/app/constants/types/homeType";

type LayoutProps = {
    children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
        return <ManagerProtect>{<></>}</ManagerProtect>;
    }

    return (
        <ManagerProtect>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <NavbarManager />
                </div>
                <div className="flex flex-row">
                    <Sidebar />
                    {children}
                </div>
            </div>
        </ManagerProtect>
    );
};

export default Layout;
