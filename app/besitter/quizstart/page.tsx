'use client'

import React, { useEffect, useState } from 'react'
import './quiz.css'
import { Button } from '@nextui-org/react'
import Link from 'next/link'
import { Quiz, UserLocal } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
const Page = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [historyQuiz, setHistoryQuiz] = useState([])
    const today = new Date()
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };
    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    useEffect(() => {
        try {
            axiosClient('quizzes/with-questions')
                .then((res) => {
                    setQuizzes(res.data)
                })
                .catch(() => { })
        } catch (error) {
            console.log(error);
        }
    }, [])

    useEffect(() => {
        try {
            axiosClient(`/user-quiz-results/user/${userId}/month?month=${currentMonth}&year=${currentYear}`)
                .then((res) => {
                    setHistoryQuiz(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
        }
    }, [currentMonth, currentYear, userId])

    return (
        <div className='flex gap-20 flex-col items-start justify-center m-10'>
            <div className=''>
                <h1 className='text-3xl font-semibold'>Bài kiểm tra kiến thức</h1>
            </div>
            <div className='flex items-center flex-col mx-96 text-center gap-3'>
                <h2>Nhấn nút dưới đây để bắt đầu ngay – mỗi câu hỏi là cơ hội để bạn khám phá thêm những điều thú vị về loài mèo. Bạn đã sẵn sàng chưa? Cùng thử thách bản thân và xem bạn hiểu mèo đến mức nào!</h2>
                <h2>Số lần đã làm trong tháng: {historyQuiz.length}/3</h2>
                <h2>Thời gian giới hạn: 20 phút</h2>
                {quizzes[Math.floor(Math.random() * quizzes.length)] && (
                    <Button
                        as={Link}
                        href={`/besitter/quiz/${quizzes[0].id}`}
                        className="button bg-[#2E67D1] text-white my-3"
                    >
                        Bắt đầu
                    </Button>
                )}
                <Button as={Link} href='/besitter/sitter/2' className='button bg-transparent border'>Trở lại</Button>
            </div>
        </div>
    )
}

export default Page