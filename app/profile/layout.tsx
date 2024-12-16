"use client";

// import { UserLocal } from "@/app/constants/types/homeType";
import ProfileSidebar from "@/app/components/ProfileSidebar";
import { ToastContainer } from "react-toastify";
// import dynamic from "next/dynamic";
// const ProfileProtect = dynamic(
//     () => import("@/app/components/protect/ProfileProtect")
// );

type LayoutProps = {
    children: React.ReactNode; // Typing the children prop
};

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        // <ProfileProtect>
        <div className="bg-custom-bg bg-cover">
            <ToastContainer />
            <div className="flex flex-row justify-center gap-10 pt-20 pb-[93px]">
                <ProfileSidebar />
                {children}
            </div>
        </div>
        // </ProfileProtect>
    );
};

export default Layout;