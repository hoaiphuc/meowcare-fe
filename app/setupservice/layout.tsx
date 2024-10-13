"use client";
import NavbarSitter from "../components/sitter/NavbarSitter";



type LayoutProps = {
    children: React.ReactNode; // Typing the children prop
};

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (

        <div className="flex flex-col">
            <NavbarSitter />

            <div className="flex flex-cow">
                {children}
            </div>
        </div>
    );
};

export default Layout;