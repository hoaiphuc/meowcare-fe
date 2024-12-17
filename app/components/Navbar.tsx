'use client'

import { faArrowRightToBracket, faBell, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link, Navbar as MyNavbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, Skeleton } from "@nextui-org/react";
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserLocal } from '../constants/types/homeType';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
import { fetchUserProfile, logout } from '../lib/slices/userSlice';
import useNotifications from './Notification';
// import { differenceInMinutes } from 'date-fns';

const Navbar = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { userProfile } = useAppSelector((state) => state.user);
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    // const [isSitter, setIsSitter] = useState<boolean | null>(null);
    const [user, setUser] = useState<UserLocal | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [menuItems, setMenuItems] = useState([
        { name: 'Trang chủ', path: '/' },
        { name: 'Dịch vụ', path: '/service' },
        { name: 'Trở thành người chăm sóc', path: '/besitter' },
    ]);

    // get notifications
    // const currentDate = new Date();
    const { notifications, fetchNotifications, hasMore, loading } = useNotifications(user?.id);

    useEffect(() => {
        const fetchUser = async () => {
            if (typeof window !== 'undefined') {
                const userJson = localStorage.getItem('user');
                const user: UserLocal | null = userJson ? JSON.parse(userJson) : null;
                setUser(user);

                const userRoles = user?.roles ?? [];
                if (userRoles.some(role => role.roleName === 'SITTER')) {
                    // setIsSitter(true);
                    setMenuItems([
                        { name: 'Trang chủ', path: '/' },
                        { name: 'Dịch vụ', path: '/service' },
                        { name: 'Quản lý dịch vụ', path: '/sitter' },
                    ]);
                } else {
                    // setIsSitter(false);
                    setMenuItems([
                        { name: 'Trang chủ', path: '/' },
                        { name: 'Dịch vụ', path: '/service' },
                        { name: 'Trở thành người chăm sóc', path: '/besitter' },
                    ]);
                }
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            if (typeof window !== 'undefined') {
                if (!localStorage.getItem('auth-token')) {
                    setIsLoading(false); // User is not logged in
                    return;
                }
            }
            if (!userProfile) {
                await dispatch(fetchUserProfile());
                setIsLoading(false); // Loading complete
            }
            setIsLoading(false); // Loading complete
        };

        fetchProfile();
    }, [dispatch, userProfile]);

    const isActive = (path: string) => {
        if (path === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(path);
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
        dispatch(logout());
        router.push('/login');
    };

    // Show Skeleton Loader if still loading
    if (isLoading) {
        return <Skeleton className="flex w-full h-[96px]" />;
    }

    return (
        <div>
            <MyNavbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll isBordered maxWidth="full" className='min-h-24 bg-[#fffaf5]'>
                <NavbarContent>
                    <NavbarMenuToggle
                        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        className="md:hidden"
                    />
                    <NavbarBrand as={Link} href='/'>
                        <Image src="/meow.png" alt='' width={210} height={100} priority />
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="hidden md:flex gap-20" justify="center">
                    {menuItems.map((item, index) => (
                        <NavbarItem key={`${item}-${index}`}>
                            <Link
                                className="w-full text-[#666089]"
                                href={item.path}
                                size="lg"
                            >
                                <div className='flex justify-center flex-col items-center'>
                                    <div className={`${isActive(item.path) ? "text-[#000857] font-semibold " : ""}`}>
                                        {item.name}
                                    </div>
                                    <div className={`${isActive(item.path) ? "flex justify-center items-center w-full h-[2px] bg-[#666089]" : "hidden"}`}></div>
                                    <div className={`${isActive(item.path) ? "flex justify-center items-center w-[2px] h-8 bg-[#666089] mb-[-40px]" : "hidden"}`} />
                                </div>
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>
                <NavbarContent justify="end" className='flex gap-5'>
                    {userProfile ? (
                        <NavbarItem className="lg:flex flex gap-5">
                            <Dropdown placement="bottom-start">
                                <DropdownTrigger>
                                    <FontAwesomeIcon icon={faBell} size='2xl' className='cursor-pointer' />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Notifications" variant="flat" className='max-h-96 overflow-y-auto' closeOnSelect={false}>
                                    <>
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <DropdownItem key={notification.id} className="w-96 h-20">
                                                    <div className="flex justify-between">
                                                        <p>{notification.message}</p>
                                                        {!notification.isRead && (
                                                            <FontAwesomeIcon icon={faCircle} className="text-blue-600" />
                                                        )}
                                                    </div>
                                                </DropdownItem>
                                            ))
                                        ) : (
                                            <DropdownItem className="text-center">
                                                Hiện không có thông báo nào
                                            </DropdownItem>
                                        )}
                                        {loading && (
                                            <DropdownItem className="text-center">Đang tải...</DropdownItem>
                                        )}
                                        {hasMore && (
                                            <DropdownItem
                                                onClick={() => fetchNotifications(true)}
                                                className="text-center"
                                            >
                                                <button className="text-blue-600 underline w-full">
                                                    Xem thêm
                                                </button>
                                            </DropdownItem>
                                        )}
                                        {!hasMore && !loading && (
                                            <DropdownItem className="text-center">

                                            </DropdownItem>
                                        )}
                                    </>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown placement="bottom-start">
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        src={userProfile?.avatar && (userProfile.avatar.startsWith('http://') || userProfile.avatar.startsWith('https://'))
                                            ? userProfile.avatar
                                            : '/User-avatar.png'}
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="User Actions" variant="flat">
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <p className="font-bold">{userProfile?.fullName}</p>
                                    </DropdownItem>
                                    <DropdownItem key="profile">
                                        <Link href="/profile" className="text-black w-full py-3 text-[17px]">
                                            Hồ sơ
                                        </Link>
                                    </DropdownItem>
                                    <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </NavbarItem>
                    ) : (
                        <NavbarItem className="hidden lg:flex">
                            <Link href="/login" className='text-[#666089]'>Đăng nhập <FontAwesomeIcon icon={faArrowRightToBracket} className='pl-2 w-5 h-5' /></Link>
                        </NavbarItem>
                    )}
                </NavbarContent>
                <NavbarMenu className='pt-10'>
                    {menuItems.map((item, index) => (
                        <NavbarMenuItem key={`${item}-${index}`}>
                            <Link className="w-full text-secondary font-semibold" href={item.path} size="lg">
                                <div className={`${pathname === item.path ? "text-text" : ""}`}>{item.name}</div>
                            </Link>
                        </NavbarMenuItem>
                    ))}
                </NavbarMenu>
            </MyNavbar>
        </div>
    );
};

export default Navbar;
