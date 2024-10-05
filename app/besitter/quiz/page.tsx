'use client'

import { Button } from '@nextui-org/react';
import React, { useState } from 'react'

const Page = () => {
    const questions = [
        {
            questionText: 'What is the capital of France?',
            answerOptions: [
                { answerText: 'New York', isCorrect: false },
                { answerText: 'London', isCorrect: false },
                { answerText: 'Paris', isCorrect: true },
                { answerText: 'Dublin', isCorrect: false },
            ],
        },
        {
            questionText: 'Who is CEO of Tesla?',
            answerOptions: [
                { answerText: 'Jeff Bezos', isCorrect: false },
                { answerText: 'Elon Musk', isCorrect: true },
                { answerText: 'Bill Gates', isCorrect: false },
                { answerText: 'Tony Stark', isCorrect: false },
            ],
        },
        {
            questionText: 'The iPhone was created by which company?',
            answerOptions: [
                { answerText: 'Apple', isCorrect: true },
                { answerText: 'Intel', isCorrect: false },
                { answerText: 'Amazon', isCorrect: false },
                { answerText: 'Microsoft', isCorrect: false },
            ],
        },
        {
            questionText: 'How many Harry Potter books are there?',
            answerOptions: [
                { answerText: '1', isCorrect: false },
                { answerText: '4', isCorrect: false },
                { answerText: '6', isCorrect: false },
                { answerText: '7', isCorrect: true },
            ],
        },
    ];
    // State to track selected answers
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);

    // Handle answer selection
    const handleAnswerChange = (questionIndex, answerIndex) => {
        setSelectedAnswers((prevSelectedAnswers) => ({
            ...prevSelectedAnswers,
            [questionIndex]: answerIndex,
        }));
    };

    // Handle form submission
    const handleSubmit = () => {
        let newScore = 0;
        questions.forEach((question, questionIndex) => {
            const selectedAnswerIndex = selectedAnswers[questionIndex];
            if (selectedAnswerIndex !== undefined) {
                const selectedAnswer = question.answerOptions[selectedAnswerIndex];
                if (selectedAnswer.isCorrect) {
                    newScore += 1;
                }
            }
        });
        setScore(newScore);
        setShowScore(true);
    };
    return (
        <div className='app'>
            {showScore ? (
                <div className='score-section'>
                    You scored {score} out of {questions.length}
                </div>
            ) : (
                <>
                    {questions.map((question, questionIndex) => (
                        <div key={questionIndex} className='question-section'>
                            <div className='question-count'>
                                <span>Question {questionIndex + 1}</span>/{questions.length}
                            </div>
                            <div className='question-text'>{question.questionText}</div>
                            <div className='answer-section'>
                                {question.answerOptions.map((answerOption, answerIndex) => (
                                    <div key={answerOption.id} className='answer-option'>
                                        <label>
                                            <input
                                                type='radio'
                                                name={`question-${questionIndex}`}
                                                value={answerIndex}
                                                checked={selectedAnswers[questionIndex] === answerIndex}
                                                onChange={() => handleAnswerChange(questionIndex, answerIndex)}
                                            />
                                            {answerOption.answerText}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <Button onClick={handleSubmit} className='submit-button'>
                        Submit
                    </Button>
                </>
            )}
        </div>
    )
}

export default Page