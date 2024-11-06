'use client'

import { Order } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { Accordion, AccordionItem, Avatar, Button } from '@nextui-org/react'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Page = () => {
    const param = useParams();
    const [data, setData] = useState<Order>();
    useEffect(() => {
        try {
            axiosClient(`booking-orders/${param.id}`)
                .then((res) => {
                    setData(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [])

    return (
        <div className='w-[891px]  bg-white rounded-2xl shadow-2xl'>
            {data &&
                <div key={data.id}>
                    <div className='m-2 shadow-2xl rounded-xl flex p-3 gap-3'>
                        <Avatar src='' className='w-14  h-14 ' />
                        <div>
                            <h2 className='font-semibold'>{data.sitter.fullName}</h2>
                            <h1 className='text-[#559070] font-semibold text-xl'>Dịch vụ: {data.bookingDetailWithPetAndServices[0].service.serviceName}</h1>
                        </div>
                    </div>

                    <div className='m-2 mt-7 shadow-2xl rounded-xl flex '>
                        <Accordion>
                            <AccordionItem key="1" aria-label="1" title="6:00 - 7:00 AM">
                                <h1 className='font-semibold text-[#333877]'>🥣 Cho mèo ăn sáng và vệ sinh khay cát</h1>
                                <Button className='bg-btnbg text-white rounded-full'>Xem chi tiết</Button>
                            </AccordionItem>
                            <AccordionItem key="2" aria-label="2" title="7:00 - 9:00 AM">
                                2
                            </AccordionItem>
                            <AccordionItem key="3" aria-label="3" title="9:00 - 11:00 AM">
                                3
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            }


        </div>
    )
}

export default Page