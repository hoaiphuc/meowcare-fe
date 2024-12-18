'use client'

import Chat from '@/app/components/Chat';
import DateFormat from '@/app/components/DateFormat';
import { Order, PetProfile, Task } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { storage } from '@/app/utils/firebase';
import { faCamera, faCheck, faClipboardCheck, faPaw, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, AccordionItem, Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { format, formatDate } from 'date-fns';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import styles from "./trackingother.module.css";
import { showConfirmationDialog } from '@/app/components/confirmationDialog';

interface TaskEvident {
    id?: string,
    file?: File;
    photoUrl?: string,
    videoUrl?: string,
    evidenceType: string
}

const TrackingOther = () => {
    const param = useParams();
    const router = useRouter();
    const [data, setData] = useState<Task[]>([]);
    const [dataOrder, setDataOrder] = useState<Order>()
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();
    const { isOpen: isOpenCat, onOpen: onOpenCat, onOpenChange: onOpenChangeCat } = useDisclosure();
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
    const { isOpen: isOpenConfirm, onOpen: onOpenConfirm, onOpenChange: onOpenChangeConfirm } = useDisclosure();

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
                console.log(res.data.tasks);
                const scheduleData = res.data.tasks;
                const tasksArray = scheduleData.map((task: Task) => ({
                    ...task,
                    startTime: new Date(task.startTime),
                    endTime: new Date(task.endTime),
                }));

                setData(tasksArray);

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
            axiosClient(`task-evidences/task/${task.id}`)
                .then((res) => {
                    setSelectedTaskEvidence(res.data)
                })
                .catch(() => { })
        } catch (error) {
        }
        setSelectedTask(task);
        setDescription(task.description)
        onOpen();
        console.log(task)
    }

    //get evidence to update
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
                const uploadPromises = selectTaskEvidence.map(async (evident) => {
                    if (evident.file) {
                        const folderName = evident.evidenceType === "PHOTO" ? "imagesTask" : "videosTask";
                        const storageRef = ref(storage, `${folderName}/${uuidv4()}_${evident.file.name}`);

                        const snapshot = await uploadBytesResumable(storageRef, evident.file);
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        return await ({
                            evidenceType: evident.evidenceType,
                            photoUrl: evident.evidenceType === "PHOTO" ? downloadURL : undefined,
                            videoUrl: evident.evidenceType === "VIDEO" ? downloadURL : undefined,
                        } as TaskEvident);
                    }
                    return Promise.resolve(null);
                });

                uploadedEvidences = (await Promise.all(uploadPromises)) as TaskEvident[]; // Cast to TaskEvident[]
            }

            // Send uploaded data to the server
            await axiosClient.post(`task-evidences/list?taskId=${selectedTask?.id}`, uploadedEvidences);

            // Update the specific task in the 'data' array
            const updatedTasks = data.map((task) =>
                task.id === selectedTask?.id ? { ...task, haveEvidence: true } : task
            );

            setData(updatedTasks);
            onOpenChange();
            toast.success("Cập nhật hoạt động thành công");
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
        try {

            if (description && description !== selectedTask?.description) {
                await axiosClient.put(`tasks/${selectedTask?.id}`, { description })
                    .then()
                    .catch((e) => {
                        console.log(e);
                    })
            }

            // Handle removal of evidences
            if (removeList.length > 0) {
                await Promise.all(
                    removeList.map(async (evident) => {
                        if (evident.id) {
                            await axiosClient.delete(`task-evidences/${evident.id}`);
                        }
                    })
                );
            }

            // Upload new files
            const uploadPromises = addList.map((evident) => {
                if (evident.file) {
                    const folderName = evident.evidenceType === "PHOTO" ? "imagesTask" : "videosTask";
                    const storageRef = ref(storage, `${folderName}/${uuidv4()}_${evident.file.name}`);

                    return uploadBytes(storageRef, evident.file).then(async (snapshot) => {
                        const downloadURL = await getDownloadURL(snapshot.ref);
                        return {
                            evidenceType: evident.evidenceType,
                            photoUrl: evident.evidenceType === "PHOTO" ? downloadURL : undefined,
                            videoUrl: evident.evidenceType === "VIDEO" ? downloadURL : undefined,
                        } as TaskEvident; // Explicit type casting
                    });
                }
                return Promise.resolve(null);
            });

            const newEvidences = (await Promise.all(uploadPromises)) as TaskEvident[]; // Explicit type cast

            // Send new evidence to the server
            await axiosClient.post(`task-evidences/list?taskId=${selectedTask?.id}`, newEvidences);

            // Update the specific task in 'data'
            const updatedTasks = data.map((task) =>
                task.id === selectedTask?.id ? { ...task, haveEvidence: true } : task
            );

            setData(updatedTasks);
            toast.success("Cập nhật thành công");
            setIsUpdateMode(false);
            onOpenChangeUpdate();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        }
    };


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

    const cancelBooking = () => {
        try {
            axiosClient.put(`booking-orders/status/${param.id}?status=CANCELLED`)
                .then(() => {
                    toast.success("Bạn đã hoàn thành dịch vụ này")
                    router.push("/sitter/managebooking")
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {

        }
    }

    const formatTime = (date: Date) => {
        const adjustedDate = new Date(date);
        adjustedDate.setSeconds(0, 0); // Zero out seconds and milliseconds
        return adjustedDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        });
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
                {data.length > 0 ? (
                    <Accordion selectionMode="multiple">
                        {data.map((task) => (
                            <AccordionItem
                                key={task.id}
                                aria-label="task"
                                className="mt-2"
                                title={
                                    <TaskTimeRange
                                        startTimeStr={formatTime(new Date(task.startTime))}
                                        endTimeStr={formatTime(new Date(task.endTime))}
                                        status={task.status}
                                    />
                                }
                            >
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
                                                className="bg-gradient-to-r from-btnbg to-[#5f91ec] text-white px-7"
                                                onClick={() => handleOpenEvidenceTask(task)}
                                            >
                                                <FontAwesomeIcon icon={faClipboardCheck} />
                                                Cập nhật hoạt động
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className='flex items-center justify-center my-7'>
                        <p className='font-semibold'>Đang tải... nếu quá lâu có thể làm mới trang</p>
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
                                <Button color="primary" className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600" onPress={() => { handleAdd() }}>
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
                                                        disabled={!isUpdateMode}
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
                                {isUpdateMode ?
                                    <Button color="primary" className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600" onClick={() => { handleUpdate() }}>
                                        Xác nhận
                                    </Button>
                                    :
                                    <Button color="primary" className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600" onClick={() => setIsUpdateMode(true)}>
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
                            <ModalHeader className="flex items-center justify-center font-semibold text-2xl">
                                <h1>Xác nhận hoàn thành dịch vụ</h1>
                            </ModalHeader>
                            <ModalBody>
                                {dataOrder &&
                                    <div className="flex items-start justify-start flex-col w-full">
                                        <h2 className={styles.h2}>Thông tin đặt lịch của bạn</h2>
                                        <div className="grid grid-cols-2 w-80">
                                            <h3 className={styles.h3}>Dịch vụ</h3>{" "}
                                            <h3 className={styles.h3}>Gửi thú cưng</h3>
                                            <h3 className={styles.h3}>Ngày gửi</h3>{" "}
                                            <h3 className={styles.h3}>
                                                {format(new Date(dataOrder.startDate), "dd/MM/yyyy")}
                                            </h3>
                                            <h3 className={styles.h3}>Ngày Nhận</h3>{" "}
                                            <h3 className={styles.h3}>
                                                {format(new Date(dataOrder.startDate), "dd/MM/yyyy")}
                                            </h3>
                                            <h3 className={styles.h3}>Người chăm sóc</h3>{" "}
                                            <h3 className={styles.h3}>{dataOrder?.sitter?.fullName}</h3>
                                        </div>
                                    </div>
                                }
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

export default TrackingOther