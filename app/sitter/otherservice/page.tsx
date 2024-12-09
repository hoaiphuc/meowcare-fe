'use client'

import { Service, Slot, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TimeInput, TimeInputValue, useDisclosure } from '@nextui-org/react';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import styles from "./otherservice.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { Time } from '@internationalized/date';

const OtherService = () => {
    // const router = useRouter();
    const params = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [configService, setConfigService] = useState<ConfigService>()
    const [additionServices, setAdditionServices] = useState<Service[]>([{
        id: uuidv4(),
        name: "",
        serviceType: "ADDITION_SERVICE",
        actionDescription: "",
        startTime: "",
        endTime: "",
        type: "",
        duration: 0,
        price: 0, // Default price value
        isBasicService: false, // Default boolean value
        isNew: true,
        isDeleted: false,
        serviceId: ''
    }]);
    const [slots, setSlots] = useState<Slot[]>([])
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    //check valid
    // const [isPriceValid, setIsPriceValid] = useState(false);
    const types = [
        { key: "time", label: "giờ" },
        { key: "turn", label: "lần" },
    ];

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    const fetchChildeService = useCallback(() => {
        try {
            axiosClient(`/services/sitter/${userId}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`)
                .then((res) => {
                    setAdditionServices(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {

        }
    }, [userId])

    useEffect(() => {
        fetchChildeService()
    }, [fetchChildeService])

    const fetchSlot = useCallback(() => {
        try {
            axiosClient(`booking-slots?userId=${userId}`)
                .then((res) => {
                    setSlots(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {

        }
    }, [userId])
    useEffect(() => {
        fetchSlot()
    }, [fetchSlot])

    useEffect(() => {
        setIsLoading(true)
        try {
            axiosClient(`config-services`)
                .then(() => {
                    // const filteredData = res.data.filter((service: Service) => service.serviceType === "ADDITION_SERVICE")
                    // setConfigService(filteredData)
                    setIsLoading(false);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    }, [params.id])

    const handleUpdate = async () => {
        setIsLoading(true); // Show a loading indicator
        try {
            // Separate child services by their state
            const toAdd = additionServices.filter((service) => service.isNew);
            const toUpdate = additionServices.filter((service) => !service.isNew && !service.isDeleted);
            const toDelete = additionServices.filter((service) => service.isDeleted);

            // Perform API calls
            const addPromises = toAdd.map((service) =>
                axiosClient.post("services", {
                    ...service,
                    id: undefined, // Remove ID for new services
                })
            );
            const updatePromises = toUpdate.map((service) =>
                axiosClient.put(`services/${service.id}`, service)
            );
            const deletePromises = toDelete.map((service) =>
                axiosClient.delete(`services/${service.id}`)
            );

            // Execute all operations concurrently
            await Promise.all([...addPromises, ...updatePromises, ...deletePromises]);

            // Refetch the updated list from the server
            fetchChildeService();

            toast.success("Cập nhật thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra trong quá trình cập nhật!");
        } finally {
            setIsLoading(false); // Hide loading indicator
        }
    };

    if (isLoading) {
        return <Loading />;
    }

    const handleInputChildChange = (id: string, field: string, value: TimeInputValue | string) => {
        if (field === "startTime" || field === "endTime") {
            // Check if `value` is of type `TimeInputValue`
            if (typeof value === "object" && "hour" in value && "minute" in value) {
                const formattedTime = `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`;

                setAdditionServices((prev) =>
                    prev.map((service) =>
                        service.id === id ? { ...service, [field]: formattedTime } : service
                    )
                );
                return;
            } else {
                toast.error("Invalid time value");
                return;
            }
        }

        setAdditionServices((prev) =>
            prev.map((service) =>
                service.id === id
                    ? { ...service, [field]: value, isNew: service.isNew ?? false }
                    : service
            )
        );
    };

    const addNewChildService = () => {
        const newService: Service = {
            id: uuidv4(),
            name: "",
            serviceType: "ADDITION_SERVICE",
            actionDescription: "",
            startTime: "",
            endTime: "",
            type: "",
            price: 0,
            duration: 0,
            isBasicService: false,
            isNew: true,
            isDeleted: false,
            serviceId: ''
        };

        setAdditionServices((prevState) => [...prevState, newService]);
    };

    //delete child Service
    const markAsDeleted = (id: string) => {
        setAdditionServices((prev) =>
            prev.map((service) =>
                service.id === id
                    ? { ...service, isDeleted: true }
                    : service
            )
        );
    };


    //slot manage
    const addNewSlot = () => {
        const newSlot: Slot = {
            id: uuidv4(),
            name: "",
            startTime: "",
            endTime: "",
            duration: 0,
            isNew: true,
            isDeleted: false,
        };

        setSlots((prevState) => [...prevState, newSlot]);
    };

    const markAsDeletedSlot = (id: string) => {
        setAdditionServices((prev) =>
            prev.map((service) =>
                service.id === id
                    ? { ...service, isDeleted: true }
                    : service
            )
        );
    };
    const handleInputSlotChange = (id: string, field: string, value: TimeInputValue | string) => {
        const today = new Date(); // Get today's date
        const currentDate = today.toISOString().split('T')[0];
        if (field === "startTime" || field === "endTime") {
            if (typeof value === "object" && "hour" in value && "minute" in value) {
                const formattedTime = `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`;
                const isoTime = `${currentDate}T${formattedTime}:00.000Z`;
                setSlots((prev) =>
                    prev.map((slot) => {
                        if (slot.id === id) {
                            const updatedSlot = { ...slot, [field]: isoTime };

                            if (field === "endTime" && updatedSlot.startTime) {
                                // Calculate duration if both startTime and endTime are set
                                const start = new Date(updatedSlot.startTime);
                                const end = new Date(isoTime);
                                const duration = Math.round((end.getTime() - start.getTime()) / 60000); // Convert milliseconds to minutes

                                if (duration >= 0) {
                                    updatedSlot.duration = duration;
                                } else {
                                    toast.error("Giờ kết thúc phải sau giờ bắt đầu");
                                }
                            }
                            return updatedSlot;
                        }
                        return slot;
                    })
                );
                return;
            } else {
                toast.error("Invalid time value");
                return;
            }
        }

        setSlots((prev) =>
            prev.map((slot) =>
                slot.id === id
                    ? { ...slot, [field]: value, isNew: slot.isNew ?? false }
                    : slot
            )
        );
    }

    const handleUpdateSlot = async () => {
        onOpenChange()
        // Separate child services by their state
        const toAdd = slots.filter((slot) => slot.isNew);
        const toUpdate = slots.filter((slot) => !slot.isNew && !slot.isDeleted);
        const toDelete = slots.filter((slot) => slot.isDeleted);

        // Perform API calls
        const addPromises = toAdd.map((slot) =>
            axiosClient.post("booking-slots", {
                ...slot,
                id: undefined, // Remove ID for new services
            })
        );
        const updatePromises = toUpdate.map((slot) =>
            axiosClient.put(`booking-slots/${slot.id}`, slot)
        );
        const deletePromises = toDelete.map((slot) =>
            axiosClient.delete(`booking-slots/${slot.id}`)
        );

        // Execute all operations concurrently
        await Promise.all([...addPromises, ...updatePromises, ...deletePromises]);

        // Refetch the updated list from the server
        fetchChildeService();

        toast.success("Cập nhật slot thành công");
    }

    const parseTimeString = (isoString: string | undefined) => {
        if (!isoString) {
            return new Time(0, 0); // Default to 00:00 if undefined
        }
        const date = new Date(isoString);
        return new Time(date.getUTCHours(), date.getUTCMinutes()); // Extract hours and minutes
    };




    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <div className='w-[1000px] flex flex-col gap-5'>
                <h1 className={styles.title}>Trông tại nhà</h1>
                <h2>Hãy thêm dịch vụ cho trông tại nhà</h2>
                <div className='flex bg-[#F3F5F7] p-5 rounded-2xl gap-2'>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    <h3>Chúng tôi đề xuất cho bạn đặt giá trung bình. Bạn có thể chỉnh sửa chúng ngay bây giờ hoặc bất kì lúc nào trong tương lai.</h3>
                </div>

                <div>
                    <h1 className={styles.title}>Dịch vụ hiện có</h1>
                    <h2>Nếu bạn chưa có slot, <span onClick={onOpen} className='underline cursor-pointer'>thêm tại đây</span></h2>
                    <Table aria-label="Example static collection table"
                        className='mt-3'
                        bottomContent={
                            <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={addNewChildService}>
                                <FontAwesomeIcon icon={faPlus} /> Tạo thêm dịch vụ
                            </Button>
                        }>
                        <TableHeader>
                            <TableColumn>Tên dịch vụ</TableColumn>
                            <TableColumn>Giá</TableColumn>
                            <TableColumn>Thời gian/ lần</TableColumn>
                            <TableColumn>Loại</TableColumn>
                            <TableColumn>Slot</TableColumn>
                            <TableColumn> </TableColumn>
                        </TableHeader>
                        <TableBody className='mt-3'>
                            {additionServices.map((additionService: Service) => (
                                <TableRow key={additionService.id} >
                                    <TableCell className='pl-0'>
                                        <Input
                                            value={additionService.name}
                                            onChange={(e) =>
                                                handleInputChildChange(additionService.id, 'name', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className='w-32'>
                                        <Input
                                            type='number'
                                            className='no-spinner'

                                            value={additionService.price.toString()}
                                            onChange={(e) =>
                                                handleInputChildChange(additionService.id, 'price', e.target.value)
                                            }
                                            endContent={
                                                <p>đ</p>
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className='w-28'>
                                        <Input
                                            type='number'
                                            className='no-spinner'
                                            value={additionService.duration.toString()}
                                            onChange={(e) =>
                                                handleInputChildChange(additionService.id, 'duration', e.target.value)
                                            }
                                            endContent={
                                                <p>phút</p>
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className=''>
                                        <Select className="min-h-full max-w-20">
                                            {types.map((animal) => (
                                                <SelectItem key={animal.key}>{animal.label}</SelectItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell className=''>
                                        <Select className="min-h-full max-w-20">
                                            {slots.map((slot: Slot) => (
                                                <SelectItem key={slot.id}>{slot.name}</SelectItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell className=''>
                                        <FontAwesomeIcon icon={faTrash} onClick={() => markAsDeleted(additionService.id)} className='cursor-pointer' />
                                    </TableCell>
                                </TableRow>

                            ))}

                        </TableBody>
                    </Table>
                </div>

                <div>
                    <div></div>
                    <Button onClick={() => handleUpdate()} className='bg-cyan-500 hover:bg-cyan-600 text-white'>
                        <FontAwesomeIcon icon={faPencil} />Cập nhật
                    </Button>
                </div>
            </div>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false} size='3xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Danh sách slot hiện tại</ModalHeader>
                            <ModalBody>
                                <Table aria-label="Example static collection table"
                                    className='mt-3'
                                    bottomContent={
                                        <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={addNewSlot}>
                                            <FontAwesomeIcon icon={faPlus} /> Tạo thêm slot
                                        </Button>
                                    }>
                                    <TableHeader>
                                        <TableColumn aria-label='he'>Tên slot</TableColumn>
                                        <TableColumn>Thời gian slot bắt đầu</TableColumn>
                                        <TableColumn>Thời gian slot kết thúc</TableColumn>
                                        <TableColumn> </TableColumn>
                                    </TableHeader>
                                    <TableBody className='mt-3'>
                                        {slots.map((slot: Slot) => (
                                            <TableRow key={slot.id} >
                                                <TableCell className='pl-0'>
                                                    <Input
                                                        aria-label='name'
                                                        value={slot.name}
                                                        onChange={(e) =>
                                                            handleInputSlotChange(slot.id, 'name', e.target.value)
                                                        }
                                                    />
                                                </TableCell>
                                                <TableCell className='w-28'>
                                                    <TimeInput
                                                        aria-label='starttime'
                                                        hourCycle={24}
                                                        value={parseTimeString(slot.startTime)}
                                                        onChange={(e) => handleInputSlotChange(slot.id, 'startTime', e)}
                                                    />
                                                </TableCell>
                                                <TableCell className='w-28'>
                                                    <TimeInput
                                                        aria-label='endtime'
                                                        hourCycle={24}
                                                        value={parseTimeString(slot.endTime)}
                                                        onChange={(e) => handleInputSlotChange(slot.id, 'endTime', e)}
                                                    />
                                                </TableCell>
                                                <TableCell className=''>
                                                    <FontAwesomeIcon icon={faTrash} className='cursor-pointer' onClick={() => markAsDeletedSlot(slot.id)} />
                                                </TableCell>
                                            </TableRow>

                                        ))}

                                    </TableBody>
                                </Table>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={handleUpdateSlot}>
                                    Cập nhật
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default OtherService