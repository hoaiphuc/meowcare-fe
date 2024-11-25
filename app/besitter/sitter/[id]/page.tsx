'use client'

import { Button } from '@nextui-org/react';
import React, { useEffect, useState } from 'react'
import './sitter.scss'
import CatKnowledge from '@/app/components/beSitterStep/CatKnowledge';
import { useParams, useRouter } from 'next/navigation';
import axiosClient from '@/app/lib/axiosClient';
import { QuizResult, UserLocal } from '@/app/constants/types/homeType';
import Information from '@/app/components/beSitterStep/Information';
import Agreement from '@/app/components/beSitterStep/Agreement';

const Sitter = () => {
    const params = useParams<{ id: string }>();
    const router = useRouter()
    const [isCompleteQuiz, setIsCompleteQuiz] = useState(true)
    const today = new Date()
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };
    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    const [step, setStep] = useState(Number(params.id) ? Number(params.id) : 1);

    //get history quiz
    useEffect(() => {
        if (!userId) return;

        try {
            axiosClient(`/user-quiz-results/user/${userId}/month?month=${currentMonth}&year=${currentYear}`)
                .then((res) => {
                    if (res.data.find((q: QuizResult) => (q.score >= 70))) {
                        setIsCompleteQuiz(true)
                    } else {
                        setIsCompleteQuiz(false)
                    }
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
        }
    }, [currentMonth, currentYear, userId])

    //send form
    const handleSubmit = () => {
        if (typeof window !== "undefined") {
            const storedFormData = localStorage.getItem("formData");
            const formData = storedFormData ? JSON.parse(storedFormData) : {};

            const data = {
                ...formData,
                userId: userId,
            };

            try {
                axiosClient.post("sitter-form-register", data)
                    .then(() => {
                        router.push('/besitter/success')
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
            }
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <Information />
                )
            case 2:
                return (
                    <div>
                        <CatKnowledge isCompleteQuiz={isCompleteQuiz} />
                    </div>
                )
            default:
                return <Agreement onAgreeChange={setIsCheckboxChecked} />;
        }
    }

    return (
        <div className='my-10 flex justify-center flex-col items-center'>
            <h1 className='flex justify-center items-center text-[32px] font-semibold'>Các bước xác minh hồ sơ</h1>
            <div className='flex justify-center items-center mt-10'>
                <div className={step === 1 ? "circle-done" : "circle-pending"}>1</div>
                <div className='circle-hr'></div>
                <div className={step === 2 ? "circle-done" : "circle-pending"}>2</div>
                <div className='circle-hr'></div>
                <div className={step === 3 ? "circle-done" : "circle-pending"}>3</div>
            </div>
            {renderStep()}
            <div className='flex gap-20'>
                <Button onClick={() => setStep(step - 1)} className={step === 1 ? `hidden` : `w-[228px] h-[47px] text-[16px] font-bold bg-transparent border-text border rounded-full mt-5`}>Trở lại</Button>
                {step === 3 ? (
                    <Button isDisabled={!isCheckboxChecked} onClick={handleSubmit} className='w-[228px] h-[47px] text-[16px] font-bold text-white bg-btnbg rounded-full mt-5'>Hoàn thành</Button>
                ) : (
                    <Button isDisabled={(step === 2 && !isCompleteQuiz) || (step === 3 && !isCheckboxChecked)} onClick={() => setStep(step + 1)} className='w-[228px] h-[47px] text-[16px] font-bold text-white bg-btnbg rounded-full mt-5'>Tiếp theo</Button>
                )}
            </div>
        </div >
    )

}

export default Sitter