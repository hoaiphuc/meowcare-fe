'use client'

import { faFacebookF, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react'

const Footer = () => {
    const current_year = new Date().getFullYear();

    const pathname = usePathname();
    const noFooter = [
        "/login",
        "/register",
        "/dashboard",
        "/admin",
        "/forgetPassword",
        "/sendOTP",
        "/manager"
    ];

    const shouldHideFirstFooter = noFooter.some((path) => pathname.startsWith(path));
    return (
        <div className={shouldHideFirstFooter ? `` : `mt-20`}>
            <div className={shouldHideFirstFooter ? `hidden` : `grid grid-cols-3 px-20 py-10`}>
                <div>
                    <h1 className="text-3xl font-semibold">Sơ lược về MeowCare</h1>
                    <div className="text-2xl font-semibold text-[#666089] gap-2 mt-5 flex flex-col">
                        <p>Về chúng tôi</p>
                        <p>Q&A và cộng đồng</p>
                        <p>Cửa hàng MeowCare</p>
                        <p>Báo cáo lỗi hệ thống</p>
                    </div>
                </div>
                <div>
                    <h1 className="text-3xl font-semibold">Thông tin liên hệ</h1>
                    <div className="text-2xl font-semibold text-[#666089] gap-2 mt-5 flex flex-col">
                        <p>SĐT: (+84) 905038520</p>
                        <p>Email: MeowCare@gmail.com</p>
                    </div>
                </div>
                <div>
                    <Image src="/meow.png" alt="" width={240} height={110} />
                    <div className="flex gap-10 mt-10">
                        <FontAwesomeIcon icon={faFacebookF} className="size-10 bg-white rounded-full" />
                        <FontAwesomeIcon icon={faInstagram} className="size-10 text-[#FF5B2D]" />
                        <FontAwesomeIcon icon={faTwitter} className="size-10 text-[#70B5EC]" />
                    </div>
                </div>
            </div>

            <div className='flex  bg-[#FFE3D5] h-20 justify-end items-center font-semibold text-xl text-[#666089] w-full'>
                <p className='m-10 hidden md:block'>Copyright © {current_year}, MeowCare</p>
            </div>
        </div>
    )
}

export default Footer