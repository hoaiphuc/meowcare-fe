'use client'

import React, { useEffect, useState } from 'react'
// import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import Link from 'next/link';


const PaymentResult = () => {
    // const searchParams = useSearchParams();
    const [isPaymentSuccess, setIsPaymentSuccess] = useState<boolean>();

    const paymentType = [
        { id: 'success', title: 'thành công' },
        { id: 'fail', title: 'thất bại' },
    ];


    useEffect(() => {
        // setHasMounted(true);

        // Ensure this code runs only on the client
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            const resultCode = searchParams.get('resultCode');
            if (resultCode !== null) {
                if (resultCode === '0') {
                    setIsPaymentSuccess(true);
                } else {
                    setIsPaymentSuccess(false);
                }
            }
        }
    }, []);


    return (
        <div className='flex justify-center items-center my-10 '>
            {isPaymentSuccess !== undefined && (
                <div className='flex flex-col items-center gap-3'>
                    <Image src={isPaymentSuccess ? `/cathappy.png` : `/catsad.png`} alt='' width={300} height={300} />
                    <h1 className={`text-5xl font-bold ${isPaymentSuccess ? `text-[#3CB878]` : `text-red-600`}`} >
                        Thanh toán {paymentType[isPaymentSuccess ? 0 : 1].title}
                    </h1>
                    <div className='flex gap-5'>
                        <Button as={Link} href='/' className='bg-maincolor text-white'>Quay về trang chủ</Button>
                        <Button as={Link} href='/profile/activity' className='text-maincolor' variant='bordered'>Đến hoạt động</Button>
                    </div>
                </div>

            )
            }
        </div >
    )
}

export default PaymentResult