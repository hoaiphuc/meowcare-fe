'use client'

import { Service, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Input, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, TimeInputValue } from '@nextui-org/react';
import { useParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import styles from "./otherservice.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faPencil, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from '@/app/components/Loading';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

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
    }]);

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

    return (
        <div className='flex flex-col justify-center items-center my-10 text-black'>
            <div className='w-[800px] flex flex-col gap-5'>
                <h1 className={styles.title}>Trông tại nhà</h1>
                <h2>Hãy thêm dịch vụ cho trông tại nhà</h2>
                <div className='flex bg-[#F3F5F7] p-5 rounded-2xl gap-2'>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    <h3>Chúng tôi đề xuất cho bạn đặt giá trung bình. Bạn có thể chỉnh sửa chúng ngay bây giờ hoặc bất kì lúc nào trong tương lai.</h3>
                </div>

                <div>
                    <h1 className={styles.title}>Dịch vụ hiện có</h1>
                    {/* <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-md shadow-md my-3">
                        {additionServices.filter((childService) => !childService.isDeleted).map((childService: Service) => (
                            <div
                                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-5"
                                key={childService.id}
                            >
                                <Input
                                    label="Tên dịch vụ"
                                    value={childService.name}
                                    onChange={(e) =>
                                        handleInputChildChange(childService.id, 'name', e.target.value)
                                    }
                                />
                                <Input
                                    label="Tên dịch vụ"
                                    value={childService.name}
                                />
                                <Select className="min-h-full max-w-20">
                                    {types.map((animal) => (
                                        <SelectItem key={animal.key}>{animal.label}</SelectItem>
                                    ))}
                                </Select>
                                <FontAwesomeIcon icon={faTrash} onClick={() => markAsDeleted(childService.id)} className='cursor-pointer' />
                            </div>
                        ))}
                        <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={addNewChildService}>
                            <FontAwesomeIcon icon={faPlus} /> Tạo thêm khung giờ
                        </Button>
                    </div> */}

                    <Table aria-label="Example static collection table"
                        bottomContent={
                            <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={addNewChildService}>
                                <FontAwesomeIcon icon={faPlus} /> Tạo thêm khung giờ
                            </Button>
                        }>
                        <TableHeader>
                            <TableColumn>Tên dịch vụ</TableColumn>
                            <TableColumn>Giá</TableColumn>
                            <TableColumn>Thời gian/ lần</TableColumn>
                            <TableColumn> </TableColumn>
                        </TableHeader>
                        <TableBody className='mt-3'>
                            {additionServices.filter((childService) => !childService.isDeleted).map((childService: Service) => (
                                <TableRow key={childService.id} className='border rounded-lg'>
                                    <TableCell className='pl-0'>
                                        <Input
                                            value={childService.name}
                                            onChange={(e) =>
                                                handleInputChildChange(childService.id, 'name', e.target.value)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className=''>
                                        <Input
                                            value={childService.name}
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
                                        <FontAwesomeIcon icon={faTrash} onClick={() => markAsDeleted(childService.id)} className='cursor-pointer' />
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
        </div>
    )
}

export default OtherService