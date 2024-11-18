'use client'

import { Quiz } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
// import { Button } from '@nextui-org/react';

const Page = () => {
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>()

    useEffect(() => {
        try {
            axiosClient(`quizzes/with-questions${params.id}`)
                .then((res) => {
                    setQuiz(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    })



    return (
        <div className=''>
            {quiz ? (
                <div></div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default Page;
