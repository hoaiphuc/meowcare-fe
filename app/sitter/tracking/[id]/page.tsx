'use client'

import Chat from '@/app/components/Chat';
import DateFormat from '@/app/components/DateFormat';
import { CareSchedules, Order, PetProfile, Task } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { storage } from '@/app/utils/firebase';
import { faCamera, faCheck, faClipboardCheck, faPaw, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { formatDate } from 'date-fns';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import styles from "./tracking.module.css"
import { showConfirmationDialog } from '@/app/components/confirmationDialog';

interface TaskEvident {
    id?: string,
    file?: File;
    photoUrl?: string,
    videoUrl?: string,
    evidenceType: string
}

const Tracking = () => {
    const param = useParams();
    const router = useRouter();
    const [data, setData] = useState<CareSchedules>();
    const [dataOrder, setDataOrder] = useState<Order>()
    const [dateList, setDateList] = useState<Date[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const { isOpen: isOpenCat, onOpen: onOpenCat, onOpenChange: onOpenChangeCat } = useDisclosure();
    const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onOpenChange: onOpenChangeConfirm } = useDisclosure();
    const [selectedTask, setSelectedTask] = useState<Task>();
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const hiddenFileVideoInput = useRef<HTMLInputElement>(null);
    const [selectTaskEvidence, setSelectedTaskEvidence] = useState<TaskEvident[]>([])
    const [selectedCat, setSelectedCat] = useState<PetProfile | null>()
    //update 
    const [isUpdateMode, setIsUpdateMode] = useState(false)
    const [removeList, setRemoveList] = useState<TaskEvident[]>([]);
    const [addList, setAddList] = useState<TaskEvident[]>([]);
    const [description, setDescription] = useState("");

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


    //get evidence
    const handleOpenEvidenceTask = (task: Task) => {
        try {
            setSelectedTask(task);
            axiosClient(`task-evidences/task/${task.id}`)
                .then((res) => {
                    setSelectedTaskEvidence(res.data)
                })
                .catch(() => { })
        } catch (error) {
        }
        setDescription(task.description)
        onOpen();
        console.log(task)
    }

    //get evidence to update
    const handleOpenUpdate = (task: Task) => {
        try {
            setSelectedTask(task);
            axiosClient(`task-evidences/task/${task.id}`)
                .then((res) => {
                    setSelectedTaskEvidence(res.data)
                })
                .catch(() => { })
        } catch (error) {

        }
        setDescription(task.description)
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

    const handleAdd = async () => {
        try {
            if (description && description !== selectedTask?.description) {
                await axiosClient.put(`tasks/${selectedTask?.id}`, { description })
                    .then()
                    .catch((e) => {
                        console.log(e);
                    })
            }

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
                .then((res) => {
                    // Update the haveEvidence property for the selected task
                    const updatedTasks = data?.tasks?.map(task => {
                        if (task.id === selectedTask?.id) {
                            return { ...task, haveEvidence: res.data.length > 0 ? true : false }; // Or false, based on your needs
                        }
                        return task;
                    }) || [];

                    // Update data and filteredTasks state
                    setData(prevData => {
                        if (prevData) {
                            return {
                                ...prevData,
                                tasks: updatedTasks || [] // Ensure tasks is not undefined
                            };
                        }
                        return prevData;
                    });
                    setFilteredTasks(updatedTasks.filter(task => {
                        const taskDate = new Date(task.startTime);
                        return (
                            taskDate.getFullYear() === selectedDate?.getFullYear() &&
                            taskDate.getMonth() === selectedDate?.getMonth() &&
                            taskDate.getDate() === selectedDate?.getDate()
                        );
                    }));

                    onOpenChange();
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

    // update evidence
    const handleRemoveUpdate = (evident: TaskEvident) => {
        setSelectedTaskEvidence((prev) => prev.filter((item) => item !== evident));
        // setRemoveList((prev) => [...prev, evident])
        if (evident.id) {
            // Existing item fetched from the server, add to removeList
            setRemoveList((prev) => [...prev, evident]);
        } else {
            // Newly added item, remove from addList
            setAddList((prev) => prev.filter((item) => item !== evident));
        }
    }

    const handleImageUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newEvidences = filesArray.map((file) => ({
                file: file,
                photoUrl: URL.createObjectURL(file),
                evidenceType: 'PHOTO',
            }));

            // Update the selectedTaskEvidence to display the new images
            setSelectedTaskEvidence((prevImages) => [...prevImages, ...newEvidences]);

            // Add the new images to the addList for tracking
            setAddList((prevList) => [...prevList, ...newEvidences]);
        }
    };

    const handleVideoUpdateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newEvidences = filesArray.map((file) => ({
                file: file,
                videoUrl: URL.createObjectURL(file),
                evidenceType: 'VIDEO',
            }));

            // Update the selectedTaskEvidence to display the new videos
            setSelectedTaskEvidence((prevVideos) => [...prevVideos, ...newEvidences]);

            // Add the new videos to the addList for tracking
            setAddList((prevList) => [...prevList, ...newEvidences]);
        }
    };

    const handleUpdate = async () => {
        console.log(removeList);
        console.log(addList);
        try {
            if (description && description !== selectedTask?.description) {
                await axiosClient.put(`tasks/${selectedTask?.id}`, { description })
                    .then()
                    .catch((e) => {
                        console.log(e);
                    })
            }

            // Handle removal asynchronously using Promise.all
            if (removeList && removeList.length > 0) {
                await Promise.all(
                    removeList.map(async (item) => {
                        try {
                            if (item.id) {
                                await axiosClient.delete(`task-evidences/${item.id}`);
                            } else {
                                return;
                            }
                        } catch (error) {
                            toast.error("Lỗi khi gỡ ảnh");
                        }
                    })
                );
                setRemoveList([]);
            }

            // Handle addition asynchronously using a loop and async-await
            if (addList && addList.length > 0) {
                for (const item of addList) {
                    if (item.file) {
                        try {
                            const storageRef = ref(storage, `petProfiles/${uuidv4()}_${item.evidenceType}`);

                            // Upload the file
                            await uploadBytes(storageRef, item.file);

                            // Get the download URL
                            const profilePictureUrl = await getDownloadURL(storageRef);

                            // Prepare item data with the profile picture URL
                            const addItem = {
                                ...item,
                                photoUrl: profilePictureUrl,
                            };

                            await axiosClient.post(`task-evidences?taskId=${selectedTask?.id}`, addItem);
                        } catch (error) {
                            toast.error("Lỗi khi thêm ảnh");
                        }
                    }
                }
                setAddList([]);
            }

            // Update the local state instead of fetching
            const hasEvidence = (addList.length > 0 || selectTaskEvidence.length > removeList.length);
            setData((prevData) => {
                if (prevData) {
                    const updatedTasks = prevData.tasks.map(task => {
                        if (task.id === selectedTask?.id) {
                            return {
                                ...task,
                                haveEvidence: hasEvidence,
                            };
                        }
                        return task;
                    });
                    return {
                        ...prevData,
                        tasks: updatedTasks,
                    };
                }
                return prevData;
            });

            // Update filteredTasks based on the current selected date
            if (selectedDate) {
                setFilteredTasks((prevFilteredTasks) => {
                    const updatedFilteredTasks = prevFilteredTasks.map(task => {
                        if (task.id === selectedTask?.id) {
                            return {
                                ...task,
                                haveEvidence: hasEvidence,
                            };
                        }
                        return task;
                    });
                    return updatedFilteredTasks;
                });
            }

            // Provide user feedback and close the modal
            toast.success("Cập nhật thành công");
            setIsUpdateMode(false);
            onOpenChangeUpdate();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        }
    };
    // State for grouped tasks
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

    // Group tasks when filteredTasks change
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


    //complete booking
    // const completeBooking = () => {
    //     try {
    //         axiosClient.put(`booking-orders/status/${param.id}?status=COMPLETED`)
    //             .then(() => {
    //                 toast.success("Bạn đã hoàn thành dịch vụ này")
    //                 router.push("/sitter/managebooking")
    //             })
    //             .catch((e) => {
    //                 console.log(e);
    //             })
    //     } catch (error) {

    //     }
    // }

    const cancelBooking = () => {
        try {
            axiosClient.put(`booking-orders/status/${param.id}?status=CANCELLED`)
                .then(() => {
                    toast.success("Bạn đã hủy dịch vụ này")
                    router.push("/sitter/managebooking")
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {

        }
    }

    const handleConfirm = async () => {
        try {
            axiosClient.put(`booking-orders/status/${param.id}?status=COMPLETED`)
                .then(() => {
                    toast.success('Bạn đã hoàn thành')
                    router.push(`/sitter/managebooking`)
                })
                .catch(async (e) => {
                    if (e.response.data.status === 2013) {
                        const isConfirmed = await showConfirmationDialog({
                            title: "Bạn không đủ tiền trả cho phí giao dịch, bạn có muốn nạp ngay bây giờ không?",
                            confirmButtonText: "Có, chắc chắn",
                            denyButtonText: "Không",
                            confirmButtonColor: "#00BB00",
                        });
                        if (isConfirmed) {
                            router.push("/profile/wallet")
                            return;
                        } else {
                            return;
                        }

                    }
                    toast.error('Có lỗi xảy ra vui lòng thử lại sau')
                })
        } catch (error) {
            console.log(error);
        }
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
                                    {dataOrder &&
                                        <div className='bg-[#FFE3D5] text-black p-2 rounded-md'>
                                            <h2>Ngày bắt đầu: {DateFormat(dataOrder.startDate)}</h2>
                                            <h2>Ghi chú: {dataOrder.note}</h2>
                                            {dataOrder.status === "IN_PROGRESS" ?
                                                <Button className='w-full bg-maincolor text-white my-10' radius='sm' onClick={onOpenConfirm}>Hoàn thành dịch vụ</Button>
                                                :
                                                <Button className='w-full bg-red-600 text-white my-10' onClick={() => cancelBooking()}>Hủy dịch vụ</Button>
                                            }
                                        </div>
                                    }
                                </Tab>
                                {dataOrder.status !== "COMPLETED" &&
                                    <Tab key="chat" title="Nhắn tin">
                                        <div className='h-96'>
                                            <Chat userId={dataOrder.sitter.id} userName={dataOrder.sitter.fullName} orderId={dataOrder.id} />
                                        </div>
                                    </Tab>
                                }
                            </Tabs>
                        </div>
                    </div>
                ) : (
                    <div>

                    </div>
                )}
            </div>

            {/* tracking */}
            <div className='bg-white w-[900px] p-10 shadow-lg rounded-md'>
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
                                            <div className='flex items-start gap-2'>
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
                                                {task.haveEvidence ? (
                                                    <Button
                                                        className="bg-gradient-to-r from-btnbg to-[#5f91ec] text-white px-7"
                                                        onClick={() => handleOpenUpdate(task)}
                                                    >
                                                        <FontAwesomeIcon icon={faClipboardCheck} />
                                                        Xem hoạt động
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        isDisabled={task.status === 0}
                                                        className="bg-gradient-to-r from-btnbg to-[#5f91ec] text-white px-7"
                                                        onClick={() => handleOpenEvidenceTask(task)}
                                                    >
                                                        <FontAwesomeIcon icon={faClipboardCheck} />
                                                        Cập nhật hoạt động
                                                    </Button>
                                                )}
                                            </div>

                                        </div>
                                    ))}
                                </AccordionItem>
                            );
                        })}
                    </Accordion>
                ) : (
                    <div className='flex items-center justify-center my-7'>
                        <p className='font-semibold'>Vui lòng chọn ngày để xem lịch</p>
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
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
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
                                <Button
                                    color="danger"
                                    variant="light"
                                    onClick={() => {
                                        onClose();
                                        setIsUpdateMode(false);
                                        setAddList([]);
                                        setRemoveList([]);
                                    }}
                                >
                                    Trở lại
                                </Button>
                                <Button
                                    isDisabled={selectedTask?.status === 2 || selectedTask?.status === 3}
                                    color="primary"
                                    className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                                    onPress={() => { handleAdd() }}
                                >
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* View and Update modal  */}
            <Modal isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl' hideCloseButton>
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
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        disabled={!isUpdateMode}
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
                                                                    onClick={() => handleRemoveUpdate(evidence)}
                                                                    className={isUpdateMode ? "absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white" : "hidden"}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {isUpdateMode &&
                                                            <button
                                                                className={selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length < 3 ? "flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36" : "hidden"}
                                                                onClick={handleImageClick}

                                                            >
                                                                <FontAwesomeIcon icon={faCamera} className='text-maincolor' size='2xl' />
                                                                <p>Thêm hình ảnh</p>
                                                                <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'PHOTO').length}/3`}</p>
                                                            </button>
                                                        }
                                                        <input
                                                            type="file"
                                                            accept='image/*'
                                                            ref={hiddenFileInput}
                                                            onChange={handleImageUpdateChange}
                                                            style={{ display: 'none' }}
                                                            multiple
                                                        />
                                                        {isUpdateMode &&
                                                            <button
                                                                className={selectTaskEvidence.filter((e) => e.evidenceType === 'VIDEO').length < 1 ? "flex flex-col justify-center items-center p-3 bg-pink-100 border border-pink-300 rounded-md text-center w-36 h-36" : "hidden"}
                                                                onClick={handleVideoClick}
                                                            >
                                                                <FontAwesomeIcon icon={faVideo} className='text-maincolor' size='2xl' />
                                                                <p>Thêm video</p>
                                                                <p>{`${selectTaskEvidence.filter((e) => e.evidenceType === 'VIDEO').length}/1`}</p>
                                                            </button>
                                                        }
                                                        <input
                                                            type="file"
                                                            accept="video/mp4,video/x-m4v,video/*"
                                                            ref={hiddenFileVideoInput}
                                                            onChange={handleVideoUpdateChange}
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
                                <Button color="danger" variant="light" onClick={() => { onClose(), setIsUpdateMode(false), setAddList([]), setRemoveList([]) }}>
                                    Trở lại
                                </Button>
                                {isUpdateMode && selectedTask ?
                                    <Button
                                        isDisabled={selectedTask?.status === 2 || selectedTask?.status === 3}
                                        color="primary"
                                        className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                                        onClick={() => { handleUpdate() }}
                                    >
                                        Xác nhận
                                    </Button>
                                    :
                                    <Button
                                        isDisabled={selectedTask?.status === 2 || selectedTask?.status === 3}
                                        color="primary"
                                        className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
                                        onClick={() => setIsUpdateMode(true)}
                                    >
                                        Chỉnh sửa
                                    </Button>
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

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
                                                <h1 className={styles.h1}>Cân nặng:</h1> <p className={styles.p}>{selectedCat.weight} kg</p>
                                                <h1 className={styles.h1}>Những điều cần lưu ý:</h1> <p className={styles.p}>{selectedCat.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={() => { onClose(), setIsUpdateMode(false), setAddList([]), setRemoveList([]) }}>
                                    Trở lại
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Confirm modal  */}
            <Modal isOpen={isOpenConfirm} onOpenChange={onOpenChangeConfirm} isDismissable={false} isKeyboardDismissDisabled={true} size='3xl' hideCloseButton>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Xác nhận hoàn thành dịch vụ</ModalHeader>
                            <ModalBody>


                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onClick={onClose}>
                                    Trở lại
                                </Button>
                                <Button onClick={handleConfirm} className='bg-maincolor text-white'>Xác nhận hoàn thành</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default Tracking