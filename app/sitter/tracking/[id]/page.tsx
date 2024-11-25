'use client'

import Chat from '@/app/components/Chat';
import DateFormat from '@/app/components/DateFormat';
import { CareSchedules, Order, Task } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Tracking = () => {
    const param = useParams();
    const [data, setData] = useState<CareSchedules>();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [dateList, setDateList] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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


    useEffect(() => {
        try {
            axiosClient(`booking-orders/${param.id}`)
                .then((res) => {
                    setDataOrder(res.data)
                })
                .catch()

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
        } catch (error) {
            console.log(error);
        }
    }, [param.id])

    // Handle date click
    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        console.log(date);

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

    return (
        <div className='flex justify-center items-start my-10 gap-3'>
            {/* user info */}
            <div className='w-[400px] bg-white h-full shadow-lg rounded-md p-5'>
                {dataOrder ? (
                    <div className='flex flex-col gap-3'>
                        <div className='flex gap-5'>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform"
                                src={dataOrder.user.avatar || '/User-avatar.png'}
                            />
                            <h1>{dataOrder.user.fullName}</h1>
                        </div>
                        <div className='w-full'>
                            <Tabs aria-label="Options" className='w-full' fullWidth>
                                <Tab key="info" title=" Thông tin đặt lịch">
                                    <div className='bg-[#FFE3D5] text-black p-2 rounded-md'>
                                        <h2>Ngày bắt đầu: {DateFormat(dataOrder.startDate)}</h2>
                                        <h2>Ngày kết thúc: {DateFormat(dataOrder.endDate)}</h2>
                                        <h2>Ghi chú: {dataOrder.note}</h2>
                                    </div>
                                </Tab>
                                <Tab key="chat" title="Nhắn tin">
                                    <Chat userId={dataOrder.sitter.email} userName={dataOrder.sitter.fullName} />
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                ) : (
                    <div>

                    </div>
                )}
            </div>

            {/* tracking */}
            <div className='bg-white w-[700px] p-10 shadow-lg rounded-md'>
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
                                {date.toLocaleDateString()}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p>Đang tải</p>
                )}


                {selectedDate && (
                    <div className='mt-4'>
                        {filteredTasks.length > 0 ? (
                            <Accordion key={selectedDate?.toISOString()}>
                                {filteredTasks.map((task) => (
                                    <AccordionItem
                                        key={task.id}
                                        aria-label={task.id}
                                        className='mt-2'
                                        title={<p>
                                            {new Date(task.startTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}{' '}
                                            -{' '}
                                            {new Date(task.endTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false,
                                            })}
                                        </p>}
                                    >
                                        <h3 className='font-medium'>{task.description}</h3>
                                        {/* {task.petProfiles && task.petProfiles.length > 0 && (
                                            <div>
                                                <h4 className='font-medium mt-2'>Pet Profiles:</h4>
                                                <ul className='list-disc pl-5'>
                                                    {task.petProfiles.map((pet) => (
                                                        <li key={pet.id}>{pet.description}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )} */}
                                        <Button className='bg-btnbg text-white' onClick={onOpen}>Cập nhật hoạt động</Button>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p>Hôm nay không có lịch chăm sóc phụ</p>
                        )}
                    </div>
                )}
            </div>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cập nhật hoạt động</ModalHeader>
                            <ModalBody>
                                <div className=" font-sans">
                                    <div className="p-4">
                                        {/* Time and Status */}
                                        <div className="mb-4 text-sm">
                                            <div>
                                                <strong>Khung giờ:</strong> 7:00 - 9:00 AM
                                            </div>
                                            <div>
                                                <strong>Ngày:</strong> 27/09/2024
                                            </div>
                                            <div className="text-orange-500 font-bold mt-2">Đang diễn ra</div>
                                        </div>

                                        {/* Notes Section */}
                                        <div className="mb-4">
                                            <label className="block mb-2 font-bold">Ghi chú từ người chăm sóc:</label>
                                            <textarea
                                                placeholder="Hãy ghi chú thông tin về mèo cung cho chủ mèo yên tâm"
                                                className="w-full p-2 border rounded-md border-gray-300 resize-none h-20"
                                            ></textarea>
                                        </div>

                                        {/* Image and Video Section */}
                                        <div className="mb-4">
                                            <label className="block mb-2 font-bold">Hình ảnh và video:</label>
                                            <div className="flex gap-2">
                                                <button className="flex justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center gap-3">
                                                    <FontAwesomeIcon icon={faCamera} className='text-maincolor' />
                                                    <p>Thêm hình ảnh</p>
                                                </button>
                                                <button className="flex justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center gap-3">
                                                    <FontAwesomeIcon icon={faVideo} className='text-maincolor' />
                                                    <p>Thêm video</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Trở lại
                                </Button>
                                <Button color="primary" className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600" onPress={onClose}>
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default Tracking