'use client'

import { CareSchedules, Order, PetProfile, Task } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { faCheck, faClipboardCheck, faPaw } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, AccordionItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from '@nextui-org/react'
import { formatDate } from 'date-fns'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import styles from "./detail.module.css"
// Import Lightbox and the Video plugin
import Lightbox from 'yet-another-react-lightbox';
import Video from 'yet-another-react-lightbox/plugins/video';
import { Slide } from 'yet-another-react-lightbox';

// Import styles for Lightbox and Video plugin
import 'yet-another-react-lightbox/styles.css';
// import 'yet-another-react-lightbox/plugins/video.css';


interface TaskEvident {
    id?: string,
    file?: File;
    photoUrl?: string,
    videoUrl?: string,
    evidenceType: string
}

const Page = () => {
    const param = useParams();
    const [data, setData] = useState<CareSchedules>();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [dateList, setDateList] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [selectedCat, setSelectedCat] = useState<PetProfile | null>()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenCat, onOpen: onOpenCat, onOpenChange: onOpenChangeCat } = useDisclosure();
    const [selectTaskEvidence, setSelectedTaskEvidence] = useState<TaskEvident[]>([])
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

    const handleEvidenceClick = (index: number) => {
        setCurrentIndex(index);
        setOpenImage(true);
    };

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



    // Function to generate dates between two dates inclusive
    const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
        const dates: Date[] = [];
        const currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };
    const fetchTask = useCallback(() => {
        axiosClient(`care-schedules/booking/${param.id}`)
            .then((res) => {
                const scheduleData = res.data;
                setData(scheduleData);

                // Parse startTime and endTime
                const startDate = new Date(scheduleData.startTime);
                const endDate = new Date(scheduleData.endTime);

                // Generate list of dates
                const dates = generateDateRange(startDate, endDate);
                setDateList(dates);
            })
            .catch((e) => {
                console.log(e);
            })
    }, [param.id])

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

    // Handle date click
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        if (data && data.tasks) {
            // Filter tasks that have the selected date
            const tasksForDate = data.tasks.filter((task: Task) => {
                const taskDate = new Date(task.startTime);
                return (
                    taskDate.getFullYear() === date.getFullYear() &&
                    taskDate.getMonth() === date.getMonth() &&
                    taskDate.getDate() === date.getDate()
                );
            });
            tasksForDate.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
            setFilteredTasks(tasksForDate);
        }
    };
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

    // Group tasks when filteredTasks change
    const [groupedTasks, setGroupedTasks] = useState<{ timeRangeKey: string; tasks: Task[] }[]>([]);
    const formatTime = (date: Date) => {
        const adjustedDate = new Date(date);
        adjustedDate.setSeconds(0, 0); // Zero out seconds and milliseconds
        return adjustedDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
    };
    useEffect(() => {
        if (filteredTasks.length > 0) {
            const groupsMap = filteredTasks.reduce((acc, task) => {
                const startTimeKey = formatTime(new Date(task.startTime));
                const endTimeKey = formatTime(new Date(task.endTime));
                const timeRangeKey = `${startTimeKey} - ${endTimeKey}`;

                if (!acc[timeRangeKey]) {
                    acc[timeRangeKey] = [];
                }
                acc[timeRangeKey].push(task);
                return acc;
            }, {} as { [key: string]: Task[] });

            // Convert the groupsMap to an array and sort it
            const groupsArray = Object.keys(groupsMap)
                .map((timeRangeKey) => ({
                    timeRangeKey,
                    tasks: groupsMap[timeRangeKey],
                }))
                .sort((a, b) => {
                    const [aStartTime] = a.timeRangeKey.split(' - ');
                    const [bStartTime] = b.timeRangeKey.split(' - ');

                    const aDate = new Date(`1970-01-01T${aStartTime}:00`);
                    const bDate = new Date(`1970-01-01T${bStartTime}:00`);

                    return aDate.getTime() - bDate.getTime();
                });

            setGroupedTasks(groupsArray);
        } else {
            setGroupedTasks([]);
        }
    }, [filteredTasks]);

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


    return (
        <div className='w-[891px] bg-white rounded-2xl shadow-2xl'>
            {dataOrder &&
                <div key={dataOrder.id}>
                    <div className='m-2 shadow-2xl rounded-xl flex p-3 gap-3'>
                        <Avatar src={dataOrder.sitter.avatar} className='w-14  h-14 ' />
                        <div>
                            <h2 className='font-semibold'>{dataOrder.sitter.fullName}</h2>
                            <h1 className='text-[#559070] font-semibold text-xl'>Dịch vụ: {dataOrder.orderType === "OVERNIGHT" ? "Gửi thú cưng" : "Dịch vụ khác"}</h1>
                        </div>
                    </div>

                    {/* tracking */}
                    <div className='bg-white m-2 p-10 shadow-lg rounded-md'>
                        <h1 className='text-3xl font-semibold mb-5'>Theo dõi lịch chăm sóc</h1>
                        {dateList.length > 0 ? (
                            <div className='flex gap-3 flex-wrap'>
                                {dateList.map((date) => (
                                    <Button
                                        key={date.toISOString()}
                                        onClick={() => handleDateClick(date)}
                                        variant={selectedDate === date ? 'solid' : 'bordered'}
                                        className={selectedDate === date ? 'bg-maincolor text-white' : ''}
                                    >
                                        {formatDate(date.toLocaleDateString(), 'dd/MM/yyyy')}
                                    </Button>
                                ))}
                            </div>
                        ) : (
                            <p>Đang tải</p>
                        )}
                        <div className=' mt-7 shadow-2xl rounded-xl flex '>
                            {groupedTasks.length > 0 ? (
                                <Accordion key={selectedDate?.toISOString()} selectionMode="multiple">
                                    {groupedTasks.map((group) => {
                                        const { timeRangeKey, tasks } = group;
                                        const [startTimeStr, endTimeStr] = timeRangeKey.split(' - ');

                                        return (
                                            <AccordionItem
                                                key={timeRangeKey}
                                                aria-label={timeRangeKey}
                                                className="mt-2"
                                                title={
                                                    <TaskTimeRange
                                                        startTimeStr={startTimeStr}
                                                        endTimeStr={endTimeStr}
                                                        status={tasks[0].status}
                                                    />
                                                }
                                            >
                                                {tasks.map((task) => (
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
                                                ))}
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            ) : (
                                <div className='flex items-center justify-center w-full'>
                                    <p>Vui lòng chọn ngày để xem hoạt động</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            }

            {/* View Cat */}
            <Modal isOpen={isOpenCat} onOpenChange={onOpenChangeCat} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl' hideCloseButton>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cập nhật hoạt động</ModalHeader>
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

export default Page