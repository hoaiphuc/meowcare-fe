'use client'

import Loading from '@/app/components/Loading';
import { Service, Slot, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faCircleInfo, faMinus, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Time } from '@internationalized/date';
import { Accordion, AccordionItem, Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TimeInput, TimeInputValue, useDisclosure } from '@nextui-org/react';
import { Key } from '@react-types/shared';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import styles from "./otherservice.module.css";
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
    const [expandedKeys, setExpandedKeys] = useState<Set<Key>>(new Set());
    // const [serviceSlots, setServiceSlot] = useState<Slot[]>([])
    // const [isPriceValid, setIsPriceValid] = useState(false);
    // const types = [
    //     { key: "time", label: "giờ" },
    //     { key: "turn", label: "lần" },
    // ];

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    // const fetchChildeService = useCallback(() => {
    //     try {
    //         axiosClient(`/services/sitter/${userId}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`)
    //             .then((res) => {
    //                 setAdditionServices(res.data);
    //             })
    //             .catch((e) => {
    //                 console.log(e);
    //             })
    //     } catch (error) {

    //     }
    // }, [userId])

    // useEffect(() => {
    //     fetchChildeService()
    // }, [fetchChildeService])

    const fetchSlot = useCallback(() => {
        try {
            axiosClient(`booking-slots?userId=${userId}`)
                .then((res) => {
                    const updatedSlots = res.data.map((slot: Slot) => ({
                        ...slot,
                        startTime: slot.startTime ? new Date(slot.startTime) : new Date(),
                        endTime: slot.endTime ? new Date(slot.endTime) : new Date()
                    }));
                    setSlots(updatedSlots)
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

    //get slot by each service
    const fetchData = useCallback(async () => {
        try {
            if (!userId) return;

            // 1. Fetch all addition services
            const serviceRes = await axiosClient(`/services/sitter/${userId}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`);
            const services: Service[] = serviceRes.data;

            // 2. Fetch all slots once
            const slotRes = await axiosClient(`booking-slots?userId=${userId}`);
            const allSlots: Slot[] = slotRes.data;

            // 3. For each service, fetch the slots that belong to it
            const servicesWithSlots = await Promise.all(
                services.map(async (service: Service) => {
                    // Fetch slots related to this particular service (adjust the endpoint as needed)
                    const serviceSlotRes = await axiosClient(`booking-slots/by-service-id?serviceId=${service.id}`);
                    const serviceSlotIds: string[] = serviceSlotRes.data.map((slotItem: Slot) => slotItem.id);

                    // 4. Compare and mark slots
                    // Add a new field `selected` to indicate if the slot belongs to the service
                    const updatedSlots = allSlots.map((slot: Slot) => {
                        return {
                            ...slot,
                            selected: serviceSlotIds.includes(slot.id),
                            wasSelected: serviceSlotIds.includes(slot.id),
                        }
                    });

                    return {
                        ...service,
                        slots: updatedSlots
                    };
                })
            );

            // Set the combined data to state
            setAdditionServices(servicesWithSlots);
            console.log(servicesWithSlots);

        } catch (error) {
            console.error(error);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


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
            const toAdd = additionServices.filter((service) => service.isNew && !service.isDeleted);
            const toUpdate = additionServices.filter((service) => !service.isNew && !service.isDeleted);
            const toDelete = additionServices.filter((service) => !service.isNew && service.isDeleted);
            // Handle new services
            const createdServices = await Promise.all(
                toAdd.map(async (service) => {
                    const response = await axiosClient.post("services", {
                        ...service,
                        id: undefined, // Remove ID for new services
                    });
                    return { ...service, id: response.data.id }; // Update the service with the returned ID
                })
            );

            // Update the state with newly created services (to include their new IDs)
            setAdditionServices((prevServices) =>
                prevServices.map((service) => {
                    const createdService = createdServices.find((created) => created.name === service.name);
                    return createdService ? { ...service, id: createdService.id } : service;
                })
            );

            // Handle slot updates
            const allServices = [...toUpdate, ...createdServices];
            const slotPromises = allServices.map((service) => {
                if (service.slots) {
                    // Check if any slot has changed
                    const assignSlots = service.slots.filter(
                        (slot) => slot.selected && !slot.wasSelected
                    );
                    const unassignSlots = service.slots.filter(
                        (slot) => !slot.selected && slot.wasSelected
                    );
                    // API calls for assigning and unassigning slots
                    const assignPromises = assignSlots.map((slot) =>
                        axiosClient.post(
                            `booking-slots/assign-service?bookingSlotTemplateId=${slot.id}&serviceId=${service.id}`
                        )
                    );

                    const unassignPromises = unassignSlots.map((slot) =>
                        axiosClient.post(
                            `booking-slots/unassign-service?bookingSlotTemplateId=${slot.id}&serviceId=${service.id}`
                        )
                    );
                    return [...assignPromises, ...unassignPromises];
                }
                return null;
            });

            // Perform API calls
            const updatePromises = toUpdate.map((service) =>
                axiosClient.put(`services/${service.id}`, service)
            );
            const deletePromises = toDelete.map((service) =>
                axiosClient.delete(`services/${service.id}`)
            );

            // Execute all operations concurrently
            await Promise.all([
                ...updatePromises,
                ...deletePromises,
                ...slotPromises.filter(Boolean), // Remove null entries
            ]);

            // Refetch the updated list from the server
            // fetchChildeService();

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

    const addNewAdditionService = () => {
        const newId = uuidv4();
        const newService: Service = {
            id: newId,
            name: `New Service ${additionServices.length + 1}`,
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
            serviceId: '',
            slots: slots,
        };

        setAdditionServices((prevState) => [...prevState, newService]);
        setExpandedKeys(prev => new Set(prev).add(newId));
    };

    //delete addition Service
    const markAsDeleted = (id: string) => {
        setAdditionServices((prev) =>
            prev.map((service) =>
                service.id === id
                    ? { ...service, isDeleted: true }
                    : service
            )
        );
    };

    //assign or unassign slot for service
    const handleServiceSlotChange = (serviceId: string, slotId: string) => {
        setAdditionServices((prevServices) =>
            prevServices.map((service) => {
                if (service.id === serviceId) {
                    return {
                        ...service,
                        slots: service.slots
                            ? service.slots.map((slot) =>
                                slot.id === slotId
                                    ? { ...slot, selected: !slot.selected }
                                    : slot
                            )
                            : [], // Default to an empty array if slots is undefined
                    };
                }
                return service;
            })
        );
    };



    //slot manage
    const addNewSlot = () => {
        const newSlot: Slot = {
            id: uuidv4(),
            name: "",
            startTime: new Date(),
            endTime: new Date(),
            duration: 0,
            isNew: true,
            isDeleted: false,
            selected: false
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
        // const currentDate = today.toISOString().split('T')[0];
        if (field === "startTime" || field === "endTime") {
            if (typeof value === "object" && "hour" in value && "minute" in value) {
                const updatedDate = new Date();
                updatedDate.setHours(value.hour);
                updatedDate.setMinutes(value.minute);
                updatedDate.setSeconds(0);
                setSlots((prev) =>
                    prev.map((slot) => {
                        if (slot.id === id) {
                            const updatedSlot = { ...slot, [field]: updatedDate };

                            if (field === "endTime" && updatedSlot.startTime) {
                                // Calculate duration if both startTime and endTime are set
                                const start = new Date(updatedSlot.startTime);
                                const end = new Date(updatedDate);
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
                startTime: (slot.startTime as Date).toISOString(),
                endTime: (slot.endTime as Date).toISOString(),
                id: undefined,
            })
        );
        const updatePromises = toUpdate.map((slot) =>
            axiosClient.put(`booking-slots/${slot.id}`, {
                ...slot,
                startTime: (slot.startTime as Date).toISOString(),
                endTime: (slot.endTime as Date).toISOString(),
            })
        );
        const deletePromises = toDelete.map((slot) =>
            axiosClient.delete(`booking-slots/${slot.id}`)
        );

        // Execute all operations concurrently
        await Promise.all([...addPromises, ...updatePromises, ...deletePromises]);

        // Refetch the updated list from the server
        // fetchChildeService();

        toast.success("Cập nhật slot thành công");
    }

    const parseTimeString = (dateValue: Date | undefined) => {
        if (!dateValue) {
            return new Time(0, 0); // Default to 00:00 if undefined
        }
        const date = new Date(dateValue);
        return new Time(date.getHours(), date.getMinutes()); // Extract hours and minutes
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
                    <Accordion
                        selectedKeys={expandedKeys}
                        onSelectionChange={(keys) => setExpandedKeys(new Set(keys))}
                        aria-label="Services Accordion"
                        selectionMode="multiple"
                    >
                        {additionServices.filter((service) => !service.isDeleted).map((additionService: Service) => (
                            <AccordionItem
                                key={additionService.id}
                                title={additionService.name || "Chưa có tên"}
                                subtitle={`${additionService.price.toLocaleString("de")}đ`}
                                startContent={
                                    <Avatar
                                        isBordered
                                        radius="lg"
                                        size='lg'
                                        src="/service/other.png"
                                    />
                                }
                            >
                                <div className='flex flex-col gap-3 border p-5 rounded-lg'>
                                    <Input
                                        label='Tên dịch vụ'
                                        variant='bordered'
                                        value={additionService.name}
                                        onChange={(e) =>
                                            handleInputChildChange(additionService.id, 'name', e.target.value)
                                        }
                                    />
                                    <Input
                                        label='Tiền cho dịch vụ này'
                                        variant='bordered'
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
                                    <Input
                                        label='Thời gian cần để hoàn thành'
                                        variant='bordered'
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
                                    <h1 className='font-semibold text-xl text-maincolor'>Vui lòng chọn slot hoạt động</h1>
                                    <div className="flex w-full gap-3">
                                        <div
                                            onClick={onOpen}
                                            className='border rounded-lg h-10 w-32 flex items-center justify-center cursor-pointer gap-3 bg-maincolor text-white'
                                        >
                                            <FontAwesomeIcon icon={faPlus} />
                                            <p>Thêm slot</p>
                                        </div>
                                        {additionService.slots ? additionService.slots.map((slot: Slot) => (
                                            <div
                                                key={slot.id}
                                                className={`border rounded-lg h-10 w-32 flex items-center justify-center cursor-pointer${slot.selected ? "border border-green-500" : ''}`}
                                                onClick={() => handleServiceSlotChange(additionService.id, slot.id)}
                                            >
                                                <h1 className='gap-2 flex justify-center items-center'>
                                                    {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                    <FontAwesomeIcon icon={faMinus} />
                                                    {new Date(slot.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                                </h1>
                                            </div>
                                        )) :

                                            <div></div>
                                        }
                                    </div>

                                    <Button onClick={() => markAsDeleted(additionService.id)} className='flex cursor-pointer self-end justify-center items-center gap-2 mt-5' color='danger'>
                                        <FontAwesomeIcon icon={faTrash} />
                                        <p>Xóa dịch vụ này</p>
                                    </Button>
                                </div>

                            </AccordionItem>
                        ))}
                    </Accordion>

                    <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2 w-full mt-10" onClick={addNewAdditionService}>
                        <FontAwesomeIcon icon={faPlus} /> Tạo thêm dịch vụ
                    </Button>
                </div>

                <div>
                    <div></div>
                    <Button onClick={() => handleUpdate()} className='bg-cyan-500 hover:bg-cyan-600 text-white'>
                        <FontAwesomeIcon icon={faPencil} />Cập nhật
                    </Button>
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
                                                            value={parseTimeString(slot.startTime as Date)}
                                                            onChange={(e) => handleInputSlotChange(slot.id, 'startTime', e)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className='w-28'>
                                                        <TimeInput
                                                            aria-label='endtime'
                                                            hourCycle={24}
                                                            value={parseTimeString(slot.endTime as Date)}
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
        </div>
    )
}

export default OtherService