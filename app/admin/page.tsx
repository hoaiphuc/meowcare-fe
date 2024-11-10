'use client'

import { faUsersLine } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import CardChart from '../components/admin/CardChart'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
const data = [{ name: 'Page A', uv: 400, pv: 2400, amt: 2400 }]

const Page = () => {
    return (
        <div className='flex flex-col items-center w-full m-10 gap-10'>
            <div className='grid grid-cols-3 gap-5'>
                <CardChart
                    number={20}
                    title="Người dùng"
                    icon={faUsersLine}
                    date="10/11/2024"
                    className="bg-gradient-to-r from-indigo-500 to-blue-500"
                />
                <CardChart
                    number={20}
                    title="Người dùng"
                    icon={faUsersLine}
                    date="10/11/2024"
                    className="bg-gradient-to-r from-lime-500 to-lime-300"
                />
                <CardChart
                    number={20}
                    title="Người dùng"
                    icon={faUsersLine}
                    date="10/11/2024"
                    className="bg-gradient-to-r from-amber-500 to-amber-300"
                />
            </div>
            <div>
                <LineChart width={1000} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                </LineChart>
            </div>

        </div>
    )
}

export default Page