'use client'

import Chat from '@/app/components/Chat';
import DateFormat from '@/app/components/DateFormat';
import { CareSchedules, Order, Task } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Accordion, AccordionItem, Avatar, Button, Tab, Tabs } from '@nextui-org/react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Tracking = () => {
    const param = useParams();
    const [data, setData] = useState<CareSchedules>();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [dateList, setDateList] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

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
                                    <div className='bg-[#60666b] text-white p-2 rounded-md'>
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
                                        {task.petProfiles && task.petProfiles.length > 0 && (
                                            <div>
                                                <h4 className='font-medium mt-2'>Pet Profiles:</h4>
                                                <ul className='list-disc pl-5'>
                                                    {task.petProfiles.map((pet) => (
                                                        <li key={pet.id}>{pet.description}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <p>Hôm nay không có lịch chăm sóc phụ</p>
                        )}
                    </div>
                )}
            </div>

        </div>
    )
}

export default Tracking