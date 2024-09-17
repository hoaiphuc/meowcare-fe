import React from 'react'

const Footer = () => {
    const current_year = new Date().getFullYear();
    return (
        <div className='flex  bg-[#FFE3D5] h-20 justify-end items-center font-semibold text-xl text-[#666089] w-full'>
            <p className='m-10 hidden md:block'>Copyright © {current_year}, MeowCare</p>
        </div>
    )
}

export default Footer