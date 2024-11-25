'use client'

import { QuizQuestions } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, useDisclosure } from '@nextui-org/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import styles from './quiz.module.css'
import { toast } from 'react-toastify';

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
    const [quiz, setQuiz] = useState<QuizQuestions[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;
    const [userAnswers, setUserAnswers] = useState<UserAnswersState>({
        id: params.id,
        questions: []
    });
    const start = (page - 1) * rowsPerPage;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter()

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
                    onOpen();
                    toast.success('Nộp bài thành công')
                    router.push(`/besitter/result/${res.data.score}`)
                })
                .catch(() => {
                    toast.error('Đã xảy ra lỗi vùi lòng thử lại')
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

    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <h1 className='text-4xl font-semibold mb-5'>Bài kiểm tra</h1>
            <div className='flex gap-10'>
                <div>
                    <Button onClick={handleSubmit}>Nộp bài</Button>
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

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Đơn đăng ký của </ModalHeader>
                            <ModalBody>

                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" >
                                    Không duyệt
                                </Button>
                                <Button color="primary" >
                                    Duyệt
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page;
