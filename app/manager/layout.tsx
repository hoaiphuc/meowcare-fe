"use client";

import ManagerProtect from '@/app/components/protect/ManagerProtect'
import NavbarAdmin from '@/app/components/admin/NavbarAdmin'
import { UserLocal } from "@/app/constants/types/homeType";

type LayoutProps = {
    children: React.ReactNode; // Typing the children prop
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userRole = user?.roles[0].roleName;
    if (userRole != "MANAGER") return <ManagerProtect>{<></>}</ManagerProtect>;

    return (
        <ManagerProtect>
            <div className="flex flex-col">
                <div className="flex flex-cow">
                    <NavbarAdmin />
                </div>
                <div className="flex flex-cow">
                    {/* <Sidebar /> */}
                    {children}
                </div>
            </div>
        </ManagerProtect>
    );
};

export default Layout;