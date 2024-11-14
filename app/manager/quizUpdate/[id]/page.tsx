'use client'

import { Quiz } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { faCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Select, SelectItem } from '@nextui-org/react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const Page = () => {
    const params = useParams();
    const [quiz, setQuiz] = useState<Quiz>()
    useEffect(() => {
        try {
            axiosClient(`quizzes/${params.id}`)
                .then((res) => {
                    setQuiz(res.data)
                })
        } catch (error) {

        }
    }, [params.id])

    return (
        <div className='flex flex-cols-2 my-10 gap-10 px-16 justify-center text-black'>
            <div className='flex flex-col gap-2 w-[352px] bg-white py-3 px-5 rounded-md shadow-md'>
                <h1 className='mb-5 text-2xl font-semibold'>Tạo bài kiểm</h1>
                <Button className='flex justify-start '>Tạo câu hỏi</Button>
                <Button className='flex justify-start bg-btnbg text-white'>Lưu</Button>
                <hr className='my-5' />
                <Select
                    labelPlacement='outside'
                    label="Thời gian cho bài kiểm tra"
                    className="max-w-xs"
                >
                    <SelectItem key="1">25 phút</SelectItem>
                    <SelectItem key="2">30 phút</SelectItem>

                </Select>
            </div>
            <div className='w-[745px] gap-5 flex flex-col'>
                {quiz?.quizQuestions ? quiz.quizQuestions.map((question) => (
                    <div className='bg-white gap-3 flex flex-col p-5 rounded-md shadow-md' key={question.questionText}>
                        <h1>{question.questionText}</h1>
                        <div className='grid-cols-2 grid gap-2 '>
                            {question.quizAnswers ? question.quizAnswers.map((answer, key) => (
                                <div key={key} className='flex items-center gap-3'>
                                    {answer.isCorrect ? <FontAwesomeIcon icon={faX} className='text-red-600' /> : (<FontAwesomeIcon icon={faCheck} className='text-green-500' />)}
                                    <h2>{answer.answerText}</h2>
                                </div>
                            )) : (
                                <div>
                                    <h1 className='text-red-500'>Bộ này chưa có câu tra lời</h1>
                                </div>
                            )}
                        </div>
                    </div>
                )) : (
                    <div>
                        <h1>Bộ này chưa có câu hỏi</h1>
                    </div>
                )}

            </div>
        </div >
    )
}

export default Page