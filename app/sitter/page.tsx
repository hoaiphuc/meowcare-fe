import React from 'react';
// import styles from './sitter.module.css';
import Link from 'next/link';
import Image from 'next/image';

const Page = () => {
    return (
        <div className=" flex flex-col justify-center items-center bg-gradient-to-b from-maincolor to-blue-200 py-20 px-5">
            <div className="bg-white shadow-lg rounded-lg p-10 flex flex-col items-center gap-8 w-full max-w-lg text-center">
                <div className="flex flex-col items-center">
                    <Image
                        src="/cathappy.png"
                        alt="Cat sitter illustration"
                        width={150}
                        height={150}
                        className="rounded-full mb-4"
                    />
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">MeowCare - Quản lý dịch vụ của bạn</h1>
                    <p className="text-gray-600 text-center">Hãy chọn các hành động để quản lý dịch vụ của bạn một cách dễ dàng và tiện lợi hơn.</p>
                </div>
                <div className="flex flex-col gap-5 w-full">
                    <Link href="/sitter/setupservice">
                        <p className="text-lg font-semibold text-center text-white bg-blue-500 py-3 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 ease-in-out">Quản lý hồ sơ</p>
                    </Link>
                    <Link href="/sitter/managebooking">
                        <p className="text-lg font-semibold text-center text-white bg-green-500 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all duration-300 ease-in-out">Quản lý đặt lịch</p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Page;