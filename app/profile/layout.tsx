"use client";

// import { UserLocal } from "@/app/constants/types/homeType";
import ProfileSidebar from "@/app/components/ProfileSidebar";
// import dynamic from "next/dynamic";
// const ProfileProtect = dynamic(
//     () => import("@/app/components/protect/ProfileProtect")
// );

type LayoutProps = {
    children: React.ReactNode; // Typing the children prop
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
    // const getUserFromStorage = () => {
    //     if (typeof window !== "undefined") {
    //         const storedUser = localStorage.getItem("user");
    //         return storedUser ? JSON.parse(storedUser) : null;
    //     }
    // };

    // const user: UserLocal | null = getUserFromStorage();
    // if (!user) return <ProfileProtect>{<></>}</ProfileProtect>;

    return (
        // <ProfileProtect>
        <div className="bg-custom-bg bg-cover">
            <div className="flex flex-row justify-center gap-10 pt-20 pb-[93px]">
                <ProfileSidebar />
                {children}
            </div>
        </div>
        // </ProfileProtect>
    );
};

export default Layout;