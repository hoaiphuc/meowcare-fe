
'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

const NavbarVisibility = () => {
    const pathname = usePathname();
    const noNav = [
        '/login',
        '/register',
        '/dashboard',
        '/admin',
        '/forgetPassword',
        '/sendOTP',
        '/manager'
    ];

    const shouldHideNavbar = noNav.some((path) => pathname.startsWith(path));

    if (shouldHideNavbar) {
        return null;
    }

    return <Navbar />;
};

export default NavbarVisibility;
