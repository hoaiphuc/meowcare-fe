"use client";

import React, { useState, useEffect } from "react";
import AdminProtect from '@/app/components/protect/AdminProtect';
import NavbarAdmin from '@/app/components/admin/NavbarAdmin';
import Sidebar from "../components/admin/SidebarAdmin";
import { UserLocal } from "@/app/constants/types/homeType";

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

        const user: UserLocal | null = getUserFromStorage();
        const role = user?.roles[0].roleName || null;
        setUserRole(role);
    }, []);

    if (userRole === null) {
        // Render a loading state or nothing during the initial render
        return null;
    }

    if (userRole !== "ADMIN") {
        return <AdminProtect>{<></>}</AdminProtect>;
    }

    return (
        <AdminProtect>
            <div className="flex flex-col">
                <div className="flex flex-row">
                    <NavbarAdmin />
                </div>
                <div className="flex flex-row">
                    <Sidebar />
                    {children}
                </div>
            </div>
        </AdminProtect>
    );
};

export default Layout;
