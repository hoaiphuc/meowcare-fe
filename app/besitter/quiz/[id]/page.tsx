'use client'

import { Quiz } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Pagination } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import styles from './quiz.module.css'

type UserAnswers = {
    [key: string]: {
        answerId: string;
        isCorrect: boolean;
    };
};

const Page = () => {
    const params = useParams()
    const [quiz, setQuiz] = useState<Quiz>();
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
    const [score, setScore] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const start = (page - 1) * rowsPerPage;

    useEffect(() => {
        try {
            axiosClient(`quizzes/${params.id}`)
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
    const handleAnswerSelect = (questionId: string, answerId: string, isCorrect: boolean) => {
        setUserAnswers((prevAnswers) => ({
            ...prevAnswers,
            [questionId]: { answerId, isCorrect },
        }));
    };


    // Calculate the score on submit
    const handleSubmit = () => {
        let newScore = 0;
        if (quiz && quiz.quizQuestions) {
            quiz.quizQuestions.forEach((question) => {
                const userAnswer = userAnswers[question.id];
                if (userAnswer && userAnswer.isCorrect) {
                    newScore += 1;
                }
            });
            setScore(newScore);
            setSubmitted(true);
        }
    };

    const pages = Math.ceil(((quiz?.quizQuestions.length) ?? 0) / rowsPerPage);

    const items = useMemo(() => {
        const end = start + rowsPerPage;

        return quiz?.quizQuestions.slice(start, end);
    }, [quiz?.quizQuestions, start]);

    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <h1 className='text-4xl font-semibold mb-5'>Bài kiểm tra</h1>
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
                                            <input
                                                type="radio"
                                                name={question.id}
                                                value={answer.id}
                                                onChange={() =>
                                                    handleAnswerSelect(
                                                        question.id,
                                                        answer.id,
                                                        answer.isCorrect
                                                    )
                                                }
                                                checked={
                                                    userAnswers[question.id]?.answerId === answer.id
                                                }
                                                disabled={submitted}
                                            />
                                            {answer.answerText}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}

                        {submitted && (
                            <div>
                                <h2>
                                    Your score is: {score}/{items.length}
                                </h2>
                            </div>
                        )}
                    </form>
                ) : (
                    <p>Loading quiz...</p>
                )}
            </div>
            <button type="button" onClick={handleSubmit}>
                Submit
            </button>
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
