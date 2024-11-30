'use client'

import { CareSchedules, Order, PetProfile, Task } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { faCheck, faPaw } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Accordion, AccordionItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'
import { formatDate } from 'date-fns'
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import styles from "./detail.module.css"

const Page = () => {
    const param = useParams();
    const [data, setData] = useState<CareSchedules>();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [dateList, setDateList] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [selectedCat, setSelectedCat] = useState<PetProfile | null>()
    const { isOpen: isOpenCat, onOpen: onOpenCat, onOpenChange: onOpenChangeCat } = useDisclosure();

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

    return (
        <div className='w-[891px] bg-white rounded-2xl shadow-2xl'>
            {dataOrder &&
                <div key={dataOrder.id}>
                    <div className='m-2 shadow-2xl rounded-xl flex p-3 gap-3'>
                        <Avatar src='' className='w-14  h-14 ' />
                        <div>
                            <h2 className='font-semibold'>{dataOrder.sitter.fullName}</h2>
                            <h1 className='text-[#559070] font-semibold text-xl'>Dịch vụ: {dataOrder.bookingDetailWithPetAndServices[0].service.serviceName}</h1>
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
                                                    <div key={task.id} className="flex gap-3 items-center">
                                                        {task.haveEvidence && (
                                                            <FontAwesomeIcon icon={faCheck} className="text-green-500" />
                                                        )}
                                                        <h3 className={task.haveEvidence ? 'text-green-500' : ''}>
                                                            {task.description}
                                                        </h3>
                                                        <Button
                                                            className="bg-gradient-to-r from-maincolor to-[#db6eb3] text-white"
                                                            onClick={() => { setSelectedCat(task.petProfile), onOpenCat() }}
                                                        >
                                                            <FontAwesomeIcon icon={faPaw} />
                                                            Xem mèo
                                                        </Button>


                                                        <Button
                                                            className="bg-btnbg text-white px-7"
                                                        // onClick={() => handleOpenUpdate(task)}
                                                        >
                                                            Xem hoạt động
                                                        </Button>
                                                    </div>
                                                ))}
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            ) : (
                                <p>Hôm nay không có lịch chăm sóc phụ</p>
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
                                                <h1 className={styles.h1}>Cân nặng:</h1> <p className={styles.p}>{selectedCat.breed}</p>
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
        </div>
    )
}

export default Page