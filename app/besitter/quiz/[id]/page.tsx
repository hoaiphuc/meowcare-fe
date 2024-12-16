'use client'

import { QuizQuestions } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Checkbox, Pagination } from '@nextui-org/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import styles from './quiz.module.css';

interface UserAnswer {
    id: string; // question ID
    answersId: string[]; // array of selected answer IDs
}

interface UserAnswersState {
    id: unknown; // quiz ID
    questions: UserAnswer[];
}


const Page = () => {
    const params = useParams()
    const router = useRouter()
    const [quiz, setQuiz] = useState<QuizQuestions[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const [userAnswers, setUserAnswers] = useState<UserAnswersState>({
        id: params.id,
        questions: []
    });
    const start = (page - 1) * rowsPerPage;
    const [timeLeft, setTimeLeft] = useState(15 * 60);

    useEffect(() => {
        try {
            axiosClient(`quiz-questions/quiz/${params.id}`)
                .then((res) => {
                    setQuiz(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [params.id])

    // Handle answer selection
    const handleAnswerSelect = (questionId: string, answerId: string, isSelected: boolean) => {
        setUserAnswers((prevAnswers) => {
            // Copy previous questions
            const questions = [...prevAnswers.questions];
            // Find the index of the question
            const questionIndex = questions.findIndex((q) => q.id === questionId);

            if (questionIndex === -1) {
                // If the question is not in the state, add it
                questions.push({
                    id: questionId,
                    answersId: isSelected ? [answerId] : [],
                });
            } else {
                // Update the answersId array
                const answersId = [...questions[questionIndex].answersId];
                if (isSelected) {
                    // Add the answerId if it's not already selected
                    if (!answersId.includes(answerId)) {
                        answersId.push(answerId);
                    }
                } else {
                    // Remove the answerId if it's deselected
                    const index = answersId.indexOf(answerId);
                    if (index > -1) {
                        answersId.splice(index, 1);
                    }
                }
                questions[questionIndex].answersId = answersId;
            }
            return {
                ...prevAnswers,
                questions: questions,
            };
        });
    };

    const handleSubmit = () => {
        try {
            axiosClient.post(`user-quiz-results/submit`, userAnswers)
                .then((res) => {
                    toast.success('Nộp bài thành công')
                    router.push(`/besitter/result/${res.data.score}`)
                })
                .catch((e) => {
                    console.log(e);
                    if (e.response.data.status === 2014)
                        toast.error('Bạn phải hoàn thành hết tất cả câu hỏi')
                })
        } catch (error) {
            console.log(error);
        }
    };

    const pages = Math.ceil(quiz.length / rowsPerPage);

    const items = useMemo(() => {
        const end = start + rowsPerPage;

        return quiz?.slice(start, end);
    }, [quiz, start]);


    //count down time
    useEffect(() => {
        // Load or initialize the expiration time
        const storedExpirationTime = localStorage.getItem('quizExpirationTime');
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

        if (storedExpirationTime) {
            const remainingTime = parseInt(storedExpirationTime, 10) - currentTime;
            if (remainingTime > 0) {
                setTimeLeft(remainingTime); // Use the remaining time
            } else {
                handleSubmit(); // Auto-submit if time expired
            }
        } else {
            const expirationTime = currentTime + 15 * 60; // 20 minutes from now
            localStorage.setItem('quizExpirationTime', expirationTime.toString());
        }
    }, []);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit(); // Auto-submit when time is up
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval
    }, [timeLeft]);

    // Format time in mm:ss format
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <div className='flex gap-10'>
                <div className='bg-white p-10 h-[260px] shadow-md rounded-sm'>
                    <h1 className='text-4xl font-semibold mb-5'>Bài kiểm tra</h1>
                    <div className="mb-5 font-bold text-xl">
                        Thời gian làm bài: 15 phút
                    </div>
                    <div className="mb-5 text-red-500 font-bold text-xl">
                        <span className='text-black'>Thời gian còn lại:</span> {formatTime(timeLeft)}
                    </div>
                    <div className='flex justify-end'>
                        <Button onClick={handleSubmit} className='bg-maincolor text-white'>Nộp bài</Button>
                    </div>
                </div>
                <div className={styles.quizContainer}>
                    {items ? (
                        <form>
                            {items.map((question, index) => (
                                <div key={question.id} className={styles.questionBlock}>
                                    <h3 className={styles.question}>
                                        {start + index + 1}. {question.questionText}
                                    </h3>
                                    {question.quizAnswers.map((answer) => (
                                        <div key={answer.id} className={styles.answerOption}>
                                            <label className='flex gap-3'>
                                                <Checkbox
                                                    name={question.id}
                                                    value={answer.id}
                                                    isSelected={
                                                        userAnswers.questions.find((q) => q.id === question.id)?.answersId.includes(answer.id) ?? false
                                                    }
                                                    onChange={(e) => handleAnswerSelect(question.id, answer.id, e.target.checked)}
                                                >
                                                    {answer.answerText}
                                                </Checkbox>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </form>
                    ) : (
                        <p>Loading quiz...</p>
                    )}
                </div>
            </div>

            <div className="flex w-full justify-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                />
            </div>

        </div>
    )
}

export default Page;
