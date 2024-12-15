'use client'

import { Order, PetProfile, Task } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faCheck, faClipboardCheck, faMessage, faPaw } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionItem, Avatar, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import styles from './detailother.module.css'
import { formatDate } from 'date-fns';
import Lightbox, { Slide } from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import Chat from '@/app/components/Chat';

interface TaskEvident {
    id?: string,
    file?: File;
    photoUrl?: string,
    videoUrl?: string,
    evidenceType: string
}

const DetailOther = () => {
    const param = useParams();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [tasks, setTask] = useState<Task[]>([])
    const [selectedCat, setSelectedCat] = useState<PetProfile | null>()
    const { isOpen: isOpenCat, onOpen: onOpenCat, onOpenChange: onOpenChangeCat } = useDisclosure();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectTaskEvidence, setSelectedTaskEvidence] = useState<TaskEvident[]>([])
    const { isOpen: isOpenChat, onOpen: onOpenChat, onOpenChange: onOpenChangeChat } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState<Task>();
    const [openImage, setOpenImage] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [slides, setSlides] = useState<Slide[]>([]);

    const statusColors: { [key: number]: string } = {
        0: 'text-[#9E9E9E]',
        1: 'text-[#FFC107]',
        2: 'text-[#4CAF50]',
        3: 'text-[#DC3545]',
    };

    const statusLabels: { [key: number]: string } = {
        0: 'Chờ diễn ra',
        1: 'Đang diễn ra',
        2: 'Hoàn thành',
        3: 'Chưa hoàn thành',
    };

    const fetchTask = useCallback(() => {
        axiosClient(`care-schedules/booking/${param.id}`)
            .then((res) => {
                setTask(res.data.tasks);
            })
            .catch((e) => {
                console.log(e);
            })
    }, [param.id])

    useEffect(() => {
        const slidesData: Slide[] = selectTaskEvidence.map((evidence) => {
            if (evidence.evidenceType === 'PHOTO') {
                return { src: evidence.photoUrl ?? '/path/to/default-image.jpg' };
            } else if (evidence.evidenceType === 'VIDEO') {
                return {
                    type: 'video',
                    sources: [
                        {
                            src: evidence.videoUrl ?? '/path/to/default-video.mp4',
                            type: 'video/mp4',
                        },
                    ],
                };
            }
            throw new Error('Invalid evidenceType');
        });
        setSlides(slidesData);
    }, [selectTaskEvidence]);

    useEffect(() => {
        try {
            axiosClient(`booking-orders/${param.id}`)
                .then((res) => {
                    setDataOrder(res.data)
                })
                .catch()
            fetchTask()

        } catch (error) {
            console.log(error);
        }
    }, [fetchTask, param.id])

    const TaskTimeRange = ({
        startTimeStr,
        endTimeStr,
        status,
    }: {
        startTimeStr: string;
        endTimeStr: string;
        status: number;
    }) => {
        return (
            <div className="flex justify-between">
                <p>
                    {startTimeStr} - {endTimeStr}
                </p>
                <p className={statusColors[status]}>{statusLabels[status]}</p>
            </div>
        );
    };

    const formatTime = (date: Date) => {
        const adjustedDate = new Date(date);
        adjustedDate.setSeconds(0, 0); // Zero out seconds and milliseconds
        return adjustedDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };

    const handleOpenUpdate = (task: Task) => {
        try {
            axiosClient(`task-evidences/task/${task.id}`)
                .then((res) => {
                    setSelectedTaskEvidence(res.data)
                })
                .catch(() => { })
        } catch (error) {

        }
        setSelectedTask(task);
        onOpen();
        console.log(task)
    }

    const handleEvidenceClick = (index: number) => {
        setCurrentIndex(index);
        setOpenImage(true);
    };

    return (
        <div className='w-[891px] bg-white rounded-2xl shadow-2xl'>
            {dataOrder &&
                <div key={dataOrder.id}>
                    <div className='m-2 shadow-2xl rounded-xl flex justify-between items-center'>
                        <div className='flex  p-3 gap-3'>
                            <Avatar src={dataOrder.sitter.avatar} className='w-14  h-14 ' />
                            <div>
                                <h2 className='font-semibold'>{dataOrder.sitter.fullName}</h2>
                                <h1 className='text-[#559070] font-semibold text-xl'>Dịch vụ: {dataOrder.orderType === "OVERNIGHT" ? "Gửi thú cưng" : "Dịch vụ khác"}</h1>
                            </div>
                        </div>
                        <Button onPress={onOpenChat} variant='bordered' className='text-maincolor'>
                            <FontAwesomeIcon icon={faMessage} />
                        </Button>
                    </div>
                    <div className='bg-white m-2 p-10 shadow-lg rounded-md'>
                        {tasks && (
                            <Accordion selectionMode="multiple">
                                {tasks.map((task) => (
                                    <AccordionItem
                                        key={task.id}
                                        aria-label={task.id}
                                        title={
                                            <TaskTimeRange
                                                startTimeStr={formatTime(new Date(task.startTime))}
                                                endTimeStr={formatTime(new Date(task.endTime))}
                                                status={task.status}
                                            />
                                        }
                                    >
                                        <div key={task.id} className="flex gap-2 items-center justify-between">
                                            <div>
                                                {task.haveEvidence && (
                                                    <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                )}
                                                <h3 className={task.haveEvidence ? 'text-green-500' : ''}>
                                                    {task.name}
                                                </h3>
                                            </div>
                                            <div className='flex gap-1'>
                                                <Button
                                                    className="bg-gradient-to-r from-maincolor to-[#db6eb3] text-white"
                                                    onClick={() => { setSelectedCat(task.petProfile), onOpenCat() }}
                                                >
                                                    <FontAwesomeIcon icon={faPaw} />
                                                    Xem mèo
                                                </Button>
                                                <Button
                                                    className="bg-gradient-to-r from-btnbg to-[#5f91ec] text-white px-7"
                                                    onClick={() => handleOpenUpdate(task)}

                                                >
                                                    <FontAwesomeIcon icon={faClipboardCheck} />
                                                    Xem hoạt động
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>
                </div>
            }
            <Modal isOpen={isOpenCat} onOpenChange={onOpenChangeCat} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl' hideCloseButton>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Thông tin mèo</ModalHeader>
                            <ModalBody>
                                {selectedCat &&
                                    <div className='flex gap-10'>
                                        <div className=' w-[200px] h-[200px]'>
                                            <Avatar
                                                className='w-full h-full'
                                                radius="sm"
                                                src={selectedCat?.profilePicture}
                                            />

                                        </div>
                                        <div className='flex flex-col gap-5'>
                                            <div className='grid grid-cols-2 gap-3'>
                                                <h1 className={styles.h1}>Tên:</h1> <p className={styles.p}>{selectedCat.petName}</p>
                                                <h1 className={styles.h1}>Tuổi:</h1> <p className={styles.p}>{selectedCat.age}</p>
                                                <h1 className={styles.h1}>Giống loài:</h1> <p className={styles.p}>{selectedCat.breed}</p>
                                                <h1 className={styles.h1}>Cân nặng:</h1> <p className={styles.p}>{selectedCat.weight}</p>
                                                <h1 className={styles.h1}>Những điều cần lưu ý:</h1> <p className={styles.p}>{selectedCat.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={() => { onClose() }}>
                                    Trở lại
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Theo dõi hoạt động</ModalHeader>
                            <ModalBody>
                                <div className=" font-sans">
                                    {selectedTask &&
                                        <div className="p-4">
                                            {/* Time and Status */}
                                            <div className="mb-4 text-sm">
                                                <div className='flex'>
                                                    <strong className='whitespace-pre'>Khung giờ: </strong>
                                                    <p>
                                                        {new Date(selectedTask.startTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false,
                                                        })}{' '}
                                                        -{' '}
                                                        {new Date(selectedTask.endTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: false,
                                                        })}
                                                    </p>
                                                </div>
                                                <div>
                                                    <strong className='whitespace-pre'>Ngày: </strong>{formatDate(new Date(selectedTask.startTime).toLocaleDateString(), 'dd/MM/yyyy')}
                                                </div>
                                                <div className='flex'>
                                                    <strong className='whitespace-pre'>Trạng thái: </strong>
                                                    <p className={statusColors[selectedTask.status]}>
                                                        {statusLabels[selectedTask.status]}
                                                    </p>
                                                </div>
                                            </div>


                                            <div>

                                                {/* Notes Section */}
                                                <div className="mb-4">
                                                    <label className="block mb-2 font-bold">Ghi chú từ người chăm sóc:</label>
                                                    <Textarea
                                                        isReadOnly
                                                        placeholder="Hãy ghi chú thông tin về mèo cưng cho chủ mèo yên tâm"
                                                        // className="w-full p-2 border rounded-md border-gray-300 resize-none h-20"
                                                        variant='bordered'
                                                    ></Textarea>
                                                </div>

                                                {/* Image and Video Section */}
                                                <div className="mb-4">
                                                    <label className="block mb-2 font-bold">Hình ảnh và video:</label>
                                                    <div className="flex gap-2">
                                                        {selectTaskEvidence.map((evidence, index) => (
                                                            <div key={index} className="relative w-36 h-36 cursor-pointer" onClick={() => handleEvidenceClick(index)}>
                                                                {evidence.evidenceType === 'VIDEO' && (
                                                                    <video className="w-full h-full" controls>
                                                                        <source src={evidence.videoUrl} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                )}
                                                                {evidence.evidenceType === 'PHOTO' && (
                                                                    <Avatar className="w-full h-full" radius="sm" src={evidence.photoUrl} />
                                                                )}

                                                            </div>
                                                        ))}

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    Trở lại
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Drawer isOpen={isOpenChat} onOpenChange={onOpenChangeChat}>
                <DrawerContent>
                    {() => (
                        <>
                            <DrawerHeader className="flex flex-col gap-1">Nhắn tin cho người chăm sóc</DrawerHeader>
                            <DrawerBody>
                                {dataOrder &&
                                    <div className='h-full'>
                                        <Chat userId={dataOrder.user.id} userName={dataOrder.user.fullName} orderId={dataOrder.id} />
                                    </div>
                                }
                            </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
            {openImage && (
                <Lightbox
                    open={openImage}
                    close={() => setOpenImage(false)}
                    slides={slides}
                    index={currentIndex}
                    plugins={[Video]}
                />
            )}
        </div>
    )
}

export default DetailOther