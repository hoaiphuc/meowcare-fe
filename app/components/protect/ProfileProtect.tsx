"use client";
import { UserLocal } from "@/app/constants/types/homeType";
// import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

// export const dynamic = "force-dynamic";

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
    // const userRole = user?.data.data.roleName;

    // Check if the user role is not admin

    useEffect(() => {
        if (!user) {
            router.push("/");
        }
    }, [router, user]);

    return <>{children}</>;
};

export default Layout;