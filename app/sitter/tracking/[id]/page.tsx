'use client'

import Chat from '@/app/components/Chat';
import DateFormat from '@/app/components/DateFormat';
import { CareSchedules, Order, Task } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { storage } from '@/app/utils/firebase';
import { faCamera, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { formatDate } from 'date-fns';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

interface TaskEvident {
    file?: File;
    photoUrl?: string,
    videoUrl?: string,
    evidenceType: string
}

const Tracking = () => {
    const param = useParams();
    const [data, setData] = useState<CareSchedules>();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [dateList, setDateList] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState<Task>();
    // const [selectedImage, setSelectedImage] = useState<File[]>([]);
    // const [selectedVideos, setSelectedVideos] = useState<File[]>([]);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const hiddenFileVideoInput = useRef<HTMLInputElement>(null);

    const [selectTaskEvidence, setSelectedTaskEvidence] = useState<TaskEvident[]>([])

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

    const TaskTimeRange = ({ startTime, endTime, status }: { startTime: Date; endTime: Date, status: number }) => {
        return (
            <div className='flex justify-between'>
                <p>
                    {new Date(startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })}{' '}
                    -{' '}
                    {new Date(endTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                    })}
                </p>
                <p className={statusColors[status]}>
                    {statusLabels[status]}
                </p>
            </div>
        );
    };

    //get evidence
    const handleOpenEvidenceTask = (task: Task) => {
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

    //get evidence
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
        onOpenUpdate();
        console.log(task)
    }

    //image upload
    const handleImageClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {

            const filesArray = Array.from(event.target.files);
            const newEvidences = filesArray.map((file) => ({
                file: file,
                photoUrl: URL.createObjectURL(file),
                evidenceType: 'PHOTO',
            }));
            setSelectedTaskEvidence((prevImages) => [...prevImages, ...newEvidences]);
        }
    };

    //video upload
    const handleVideoClick = () => {
        if (hiddenFileVideoInput.current) {
            hiddenFileVideoInput.current.click();
        }
    };

    const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newEvidences = filesArray.map((file) => ({
                file: file,
                photoUrl: URL.createObjectURL(file),
                evidenceType: 'VIDEO',
            }));
            setSelectedTaskEvidence((prevImages) => [...prevImages, ...newEvidences]);
        }
    };

    const handleRemoveEvidence = (index: number) => {
        setSelectedTaskEvidence((prevEvidence) => prevEvidence.filter((_, i) => i !== index));
    };


    // update evidence
    const handleAdd = async () => {
        try {
            let uploadedEvidences: TaskEvident[] = [];

            if (selectTaskEvidence && selectTaskEvidence.length > 0) {
                const uploadPromises = selectTaskEvidence.map((evident) => {
                    const file = evident.file;

                    if ((evident.evidenceType === "PHOTO" || evident.evidenceType === "VIDEO") && file) {
                        // Determine the folder and create a storage reference
                        const folderName = evident.evidenceType === "PHOTO" ? "imagesTask" : "videosTask";
                        const storageRef = ref(storage, `${folderName}/${uuidv4()}_${file.name}`);

                        // Upload the file
                        const uploadTask = uploadBytesResumable(storageRef, file);

                        // Return a promise that resolves with the download URL when upload is complete
                        return new Promise<TaskEvident>((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                null, // No progress callback
                                (error) => {
                                    reject(error);
                                },
                                async () => {
                                    try {
                                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                        if (evident.evidenceType === "PHOTO") {
                                            resolve({
                                                evidenceType: "PHOTO",
                                                photoUrl: downloadURL,
                                            });
                                        } else if (evident.evidenceType === "VIDEO") {
                                            resolve({
                                                evidenceType: "VIDEO",
                                                videoUrl: downloadURL,
                                            });
                                        }
                                    } catch (error) {
                                        reject(error);
                                    }
                                }
                            );
                        });
                    } else {
                        // Skip if evidenceType or file is not valid
                        return Promise.resolve(evident);
                    }
                });

                // Wait for all uploads to complete
                uploadedEvidences = await Promise.all(uploadPromises);
            }

            // Proceed to update the task evidence regardless of whether files were uploaded
            axiosClient
                .post(`task-evidences/list?taskId=${selectedTask?.id}`, uploadedEvidences)
                .then(() => {
                    toast.success("Cập nhật hoạt động thành công");
                })
                .catch(() => {
                    toast.error("Có lỗi xảy ra, vui lòng thử lại");
                });
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };


    const handleUpdate = async () => {
    }

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
                                    <div className='h-96'>
                                        <Chat userId={dataOrder.sitter.id} userName={dataOrder.sitter.fullName} orderId={dataOrder.id} />
                                    </div>
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
                                {formatDate(date.toLocaleDateString(), 'dd/MM/yyyy')}
                            </Button>
                        ))}
                    </div>
                ) : (
                    <p>Đang tải</p>
                )}


                {selectedDate && (
                    <div className='mt-4'>
                        {filteredTasks.length > 0 ? (
                            <Accordion key={selectedDate?.toISOString()} selectionMode="multiple">
                                {filteredTasks.map((task) => (
                                    <AccordionItem
                                        key={task.id}
                                        aria-label={task.id}
                                        className='mt-2'
                                        title={<TaskTimeRange startTime={task.startTime} endTime={task.endTime} status={task.status} />}
                                    >
                                        <h3 className='font-medium'>{task.description}</h3>
                                        <Button
                                            className='bg-btnbg text-white'
                                            onClick={() => handleOpenEvidenceTask(task)}>
                                            Xem hoạt động
                                        </Button>
                                        <Button
                                            className='bg-btnbg text-white'
                                            onClick={() => handleOpenUpdate(task)}>
                                            Xem hoạt động
                                        </Button>
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
                                                    <textarea
                                                        placeholder="Hãy ghi chú thông tin về mèo cưng cho chủ mèo yên tâm"
                                                        className="w-full p-2 border rounded-md border-gray-300 resize-none h-20"
                                                    ></textarea>
                                                </div>

                                                {/* Image and Video Section */}
                                                <div className="mb-4">
                                                    <label className="block mb-2 font-bold">Hình ảnh và video:</label>
                                                    <div className="flex gap-2">
                                                        {selectTaskEvidence.map((evidence, index) => (
                                                            <div key={index} className="relative w-36 h-36">
                                                                {evidence.evidenceType === 'VIDEO' && (
                                                                    <video className="w-full h-full" controls>
                                                                        <source src={evidence.videoUrl} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                )}
                                                                {evidence.evidenceType === 'PHOTO' && (
                                                                    <Avatar className="w-full h-full" radius="sm" src={evidence.photoUrl} />
                                                                )}
                                                                <button
                                                                    onClick={() => handleRemoveEvidence(index)}
                                                                    className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}

                                                        <button
                                                            className={selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length < 3 ? "flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36" : "hidden"}
                                                            onClick={handleImageClick}

                                                        >
                                                            <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                                                            <p>Thêm hình ảnh</p>
                                                            <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length}/3`}</p>
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept='image/*'
                                                            ref={hiddenFileInput}
                                                            onChange={handleImageChange}
                                                            style={{ display: 'none' }}
                                                            multiple
                                                        />
                                                        <button
                                                            className={selectTaskEvidence.filter((e) => e.evidenceType === 'VIDEO').length < 1 ? "flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36" : "hidden"}
                                                            onClick={handleVideoClick}
                                                        >
                                                            <FontAwesomeIcon icon={faVideo} className='text-maincolor' size='2xl' />
                                                            <p>Thêm video</p>
                                                            <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'VIDEO').length}/1`}</p>
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept="video/mp4,video/x-m4v,video/*"
                                                            ref={hiddenFileVideoInput}
                                                            onChange={handleVideoChange}
                                                            style={{ display: 'none' }}
                                                            multiple
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    }
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Trở lại
                                </Button>
                                <Button color="primary" className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600" onPress={() => { handleAdd(), onClose() }}>
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* View and Update modal  */}
            <Modal isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Cập nhật hoạt động</ModalHeader>
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
                                                    <textarea
                                                        placeholder="Hãy ghi chú thông tin về mèo cưng cho chủ mèo yên tâm"
                                                        className="w-full p-2 border rounded-md border-gray-300 resize-none h-20"
                                                    ></textarea>
                                                </div>

                                                {/* Image and Video Section */}
                                                <div className="mb-4">
                                                    <label className="block mb-2 font-bold">Hình ảnh và video:</label>
                                                    <div className="flex gap-2">
                                                        {selectTaskEvidence.map((evidence, index) => (
                                                            <div key={index} className="relative w-36 h-36">
                                                                {evidence.evidenceType === 'VIDEO' && (
                                                                    <video className="w-full h-full" controls>
                                                                        <source src={evidence.videoUrl} type="video/mp4" />
                                                                        Your browser does not support the video tag.
                                                                    </video>
                                                                )}
                                                                {evidence.evidenceType === 'PHOTO' && (
                                                                    <Avatar className="w-full h-full" radius="sm" src={evidence.photoUrl} />
                                                                )}
                                                                <button
                                                                    onClick={() => handleRemoveEvidence(index)}
                                                                    className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}

                                                        <button
                                                            className={selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length < 3 ? "flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36" : "hidden"}
                                                            onClick={handleImageClick}

                                                        >
                                                            <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                                                            <p>Thêm hình ảnh</p>
                                                            <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length}/3`}</p>
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept='image/*'
                                                            ref={hiddenFileInput}
                                                            onChange={handleImageChange}
                                                            style={{ display: 'none' }}
                                                            multiple
                                                        />
                                                        <button
                                                            className={selectTaskEvidence.filter((e) => e.evidenceType === 'VIDEO').length < 1 ? "flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36" : "hidden"}
                                                            onClick={handleVideoClick}
                                                        >
                                                            <FontAwesomeIcon icon={faVideo} className='text-maincolor' size='2xl' />
                                                            <p>Thêm video</p>
                                                            <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'VIDEO').length}/1`}</p>
                                                        </button>
                                                        <input
                                                            type="file"
                                                            accept="video/mp4,video/x-m4v,video/*"
                                                            ref={hiddenFileVideoInput}
                                                            onChange={handleVideoChange}
                                                            style={{ display: 'none' }}
                                                            multiple
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    }
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Trở lại
                                </Button>
                                <Button color="primary" className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600" onPress={() => { handleUpdate(), onClose() }}>
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