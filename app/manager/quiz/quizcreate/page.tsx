// 'use client'

// import { Quiz } from '@/app/constants/types/homeType'
// import axiosClient from '@/app/lib/axiosClient'
// import { faCheck, faPen, faPlus, faX, faXmark } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Button, Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, useDisclosure } from '@nextui-org/react'
// import { useParams, useRouter } from 'next/navigation'
// import { ChangeEvent, useCallback, useEffect, useState } from 'react'
// import { toast } from 'react-toastify'
// import styles from './quizcreate.module.css'
// import { v4 as uuidv4 } from 'uuid';
// import { showConfirmationDialog } from '@/app/components/confirmationDialog'

// interface Answer {
//     id: string;
//     answerText: string;
//     isCorrect: boolean;
// }

// interface Question {
//     questionText: string;
//     questionType: string;
//     quizAnswers: Answer[];
// }


// const QuizCreate = () => {
//     const router = useRouter()
//     const [quiz, setQuiz] = useState<Quiz>()
//     const { isOpen, onOpen, onOpenChange } = useDisclosure();
//     // const [answers, setAnswers] = useState([{ id: "1", answerText: '', isCorrect: false }]);
//     const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
//     const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
//     const [questionAdd, setQuestionAdd] = useState<Question>({
//         questionText: "",
//         questionType: "multiple-choice",
//         quizAnswers: [
//             {
//                 id: uuidv4(),
//                 answerText: "",
//                 isCorrect: false
//             }
//         ]
//     })

//     const handleSave = () => {
//         toast.success('Lưu bài kiểm tra thành công')
//         router.push(`/manager/quiz`)
//     }

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setQuestionAdd((prevState) => ({
//             ...prevState,
//             [name]: value,
//         }));
//     }

//     const handleAnswerChange = (id: string, value: string) => {
//         // setAnswers((prevAnswers) =>
//         //     prevAnswers.map((answer) =>
//         //         answer.id === id ? { ...answer, text: value } : answer
//         //     )
//         // );
//         setQuestionAdd((prevState) => ({
//             ...prevState,
//             quizAnswers: prevState.quizAnswers.map((answer) =>
//                 answer.id === id ? { ...answer, answerText: value } : answer
//             )
//         }));
//     };


//     const handleCheckboxChange = (id: string, isSelected: boolean) => {
//         setQuestionAdd((prevState) => ({
//             ...prevState,
//             quizAnswers: prevState.quizAnswers.map((answer) =>
//                 answer.id === id ? { ...answer, isCorrect: isSelected } : answer
//             ),
//         }));
//     };


//     //add answer
//     const addAnswer = () => {
//         const newAnswer = {
//             id: uuidv4(),
//             answerText: "",
//             isCorrect: false
//         };

//         setQuestionAdd((prevState) => ({
//             ...prevState,
//             quizAnswers: [...prevState.quizAnswers, newAnswer]
//         }));
//     };

//     //remove answer
//     const confirmRemoveAnswer = (id: string) => {
//         const answer = questionAdd.quizAnswers.find((a) => a.id === id);

//         if (answer && answer.answerText.trim() !== '') {
//             setSelectedAnswerId(id);
//             setIsConfirmationOpen(true);
//         } else {
//             removeAnswer(id);
//         }
//     };

//     const removeAnswer = (id: string) => {
//         setQuestionAdd((prevState) => ({
//             ...prevState,
//             quizAnswers: prevState.quizAnswers.filter(answer => answer.id !== id)
//         }));
//     };

//     //add new question
//     const handleAdd = () => {
//         const questionDataToPost = {
//             ...questionAdd,
//             quizAnswers: questionAdd.quizAnswers.map(({ answerText, isCorrect }) => ({
//                 answerText,
//                 isCorrect,
//             })),
//         };
//         try {
//             axiosClient.post(`quiz-questions/quiz-answer?quizId=${params.id}`, questionDataToPost)
//                 .then(() => {
//                     onOpenChange()
//                     toast.success('Tạo mới câu hỏi thành công')
//                 })
//                 .catch(() => {
//                     toast.error('Có lỗi xảy ra')
//                 })
//         } catch (error) {
//             console.log(error);
//         }
//     }

//     //Delete question
//     const handleDelete = async (id: string) => {
//         const isConfirmed = await showConfirmationDialog({
//             title: 'Bạn có muốn câu hỏi này không?',
//             confirmButtonText: 'Có',
//             denyButtonText: 'Không',
//             confirmButtonColor: '#00BB00',
//         });
//         if (isConfirmed) {
//             try {
//                 axiosClient.delete(`quiz-questions/${id}`)
//                     .then(() => {
//                         toast.success("Xóa thành công")
//                         fetchQuestions()
//                     })
//                     .catch(() => {
//                         toast.error("Đã xảy ra lỗi vui lòng kiểm tra lại sau")
//                     })
//             } catch (error) {

//             }
//         } else if (isConfirmed) {
//             return;
//         }
//     }

//     return (
//         <div className='flex flex-col gap-10 px-16 justify-start items-center text-black w-full my-10'>
//             <div className='flex flex-col gap-2 bg-white py-3 px-5 rounded-md shadow-md w-[945px]'>
//                 <h1 className='text-2xl font-semibold'>{quiz?.title}</h1>
//                 <h1 className='text-[16px]'>{quiz?.description}</h1>
//                 <hr className='mt-5' />
//                 <div className='flex gap-5'>
//                     <Button className='flex ' onPress={onOpen}>Tạo câu hỏi</Button>
//                     <Button className='flex bg-btnbg text-white' onClick={handleSave}>Lưu</Button>
//                     <Select
//                         labelPlacement='outside-left'
//                         label="Thời gian"
//                         className="max-w-xs"
//                     >
//                         <SelectItem key="1">25 phút</SelectItem>
//                         <SelectItem key="2">30 phút</SelectItem>
//                     </Select>
//                 </div>
//             </div>
//             <div className='w-[945px] gap-5 flex flex-col'>
//                 {quiz?.quizQuestions ? quiz.quizQuestions.map((question, index) => (
//                     <div className={styles.quiz} key={question.questionText} >
//                         <div className='flex justify-between items-center'>
//                             {index + 1}. {question.questionType}
//                             <div className='flex gap-3'>
//                                 <Button className={styles.showButton} variant='bordered'>
//                                     <FontAwesomeIcon icon={faPen} />
//                                     Chỉnh sửa
//                                 </Button>
//                                 <Button className={styles.showButton} variant='bordered' onClick={() => handleDelete(question.id)}>
//                                     <FontAwesomeIcon icon={faPen} />
//                                     Xóa
//                                 </Button>
//                             </div>
//                         </div>
//                         <h1 className='font-semibold'>{question.questionText}</h1>
//                         <div className='grid-cols-2 grid gap-2 '>
//                             {question.quizAnswers ? question.quizAnswers.map((answer, key) => (
//                                 <div key={key} className='flex items-center gap-3'>
//                                     {answer.isCorrect ? (<FontAwesomeIcon icon={faCheck} className='text-green-500' />) : <FontAwesomeIcon icon={faX} className='text-red-600' />}
//                                     <h2>{answer.answerText}</h2>
//                                 </div>
//                             )) : (
//                                 <div>
//                                     <h1 className='text-red-500'>Bộ này chưa có câu tra lời</h1>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 )) : (
//                     <div>
//                         <h1>Bộ này chưa có câu hỏi</h1>
//                     </div>
//                 )}
//             </div>

//             <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
//                 <ModalContent>
//                     {(onClose) => (
//                         <>
//                             <ModalHeader className="flex flex-col gap-1">Tạo câu hỏi mới</ModalHeader>
//                             <ModalBody className='flex flex-col gap-5  m-5 rounded-md'>
//                                 <div>
//                                     <h2 className={styles.h2}>Câu hỏi</h2>
//                                     <Textarea variant='bordered' minRows={1} name='questionText' value={questionAdd.questionText} onChange={(e) => handleInputChange(e)} />
//                                 </div>
//                                 <div className='flex flex-col gap-3 p-5 px-10 rounded-md bg-[#F4F4F5]'>
//                                     {questionAdd.quizAnswers.map((answer, index) => (
//                                         <div className='flex justify-center items-center gap-5' key={answer.id}>
//                                             <h2 className={styles.h2}>#{index + 1}</h2>
//                                             <Textarea variant='bordered' minRows={1} value={answer.answerText} onChange={(e) => handleAnswerChange(answer.id, e.target.value)} />
//                                             <Checkbox
//                                                 isSelected={answer.isCorrect}
//                                                 onChange={(e) => handleCheckboxChange(answer.id, e.target.checked)}
//                                             />
//                                             {questionAdd.quizAnswers.length > 1 && (
//                                                 <div onClick={() => confirmRemoveAnswer(answer.id)} className='cursor-pointer'>
//                                                     <FontAwesomeIcon icon={faXmark} />
//                                                 </div>
//                                             )}
//                                         </div>
//                                     ))}
//                                     <Button onClick={addAnswer}><FontAwesomeIcon icon={faPlus} /> Thêm câu hỏi</Button>
//                                 </div>
//                             </ModalBody>
//                             <ModalFooter>
//                                 <Button color="danger" variant="light" onPress={onClose}>
//                                     Đóng
//                                 </Button>
//                                 <Button color="primary" onPress={handleAdd}>
//                                     Tạo
//                                 </Button>
//                             </ModalFooter>
//                         </>
//                     )}
//                 </ModalContent>
//             </Modal>

//             <Modal isOpen={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
//                 <ModalContent>
//                     <ModalHeader>Xác nhận xóa</ModalHeader>
//                     <ModalBody>
//                         <p>Bạn có muốn xóa câu trả lời này không?</p>
//                     </ModalBody>
//                     <ModalFooter>
//                         <Button
//                             color="danger"
//                             onPress={() => {
//                                 if (selectedAnswerId !== null) {
//                                     removeAnswer(selectedAnswerId);
//                                 }
//                                 setIsConfirmationOpen(false);
//                             }}
//                         >
//                             Có
//                         </Button>
//                         <Button onPress={() => setIsConfirmationOpen(false)}>Không</Button>
//                     </ModalFooter>
//                 </ModalContent>
//             </Modal>
//         </div >
//     )
// }

// export default QuizCreate