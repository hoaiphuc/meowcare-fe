'use client'

import { Avatar, Button, Chip, DatePicker, DateValue, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Select, SelectItem, Textarea, useDisclosure } from '@nextui-org/react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './housesitting.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useParams, useRouter } from 'next/navigation'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, PetProfile, Service, Slot, UserType } from '@/app/constants/types/homeType'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { today, getLocalTimeZone } from '@internationalized/date';
import { faCat, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';
import Loading from '@/app/components/Loading'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import CatBreed from '@/app/lib/CatBreed.json';
import { storage } from '@/app/utils/firebase'

interface BookingDetail {
    quantity: number;
    petProfileId: string;
    serviceId: string;
    bookingSlotId: string;
}

const HouseSitting = () => {
    const router = useRouter()
    const params = useParams();
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedPet, setSelectedPet] = useState<string[]>([]);
    const [pets, setPets] = useState<PetProfile[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [services, setServices] = useState<Service[]>([])
    const [basedServices, setBasedServices] = useState<Service[]>([])
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('')
    const [note, setNote] = useState('')
    const todayDate = today(getLocalTimeZone());
    const maxDate = todayDate.add({ months: 3 });
    const [selectedDate, setSelectedDate] = useState<DateValue | null>(null);
    const [sitter, setSitter] = useState<CatSitter>()
    const [paymentMethod, setPaymentMethod] = useState("")
    const [userData, setUserData] = useState<UserType>()
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    const [userId, setUserId] = useState<string | null>(null);
    //image data
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [petData, setPetData] = useState({
        petName: '',
        profilePicture: '',
        age: '',
        breed: "",
        species: '',
        weight: '',
        gender: '',
        description: '',
    });
    const [isLoading, setIsLoading] = useState(false)

    const fetchData = useCallback(async () => {
        try {
            // 1. Fetch all addition services
            const serviceRes = await axiosClient(`services/sitter/${params.id}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`)
            const services: Service[] = serviceRes.data;
            setBasedServices(serviceRes.data)
            const updatedServices = await Promise.all(
                services.map(async (service) => {
                    const slotRes = await axiosClient(`/booking-slots/sitter-booking-slots-by-service?sitterId=${params.id}&serviceId=${service.id}&date=${selectedDate}&status=AVAILABLE`);
                    const slots: Slot[] = slotRes.data;

                    return {
                        ...service,
                        slots: slots, // Store slots in the service object
                    };
                })
            )
            console.log(updatedServices);

            setServices(updatedServices);

        } catch (error) {

        }
    }, [params.id, selectedDate])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    useEffect(() => {
        try {
            axiosClient(`sitter-profiles/sitter/${params.id}`)
                .then((res) => {
                    setSitter(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {

        }
    }, [params.id])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            if (user !== null) {
                try {
                    const userObj = JSON.parse(user);
                    setUserId(userObj.id);
                } catch (e) {
                    console.error('Failed to parse user from localStorage', e);
                }
            }
        }
    }, []);

    useEffect(() => {
        if (userData?.fullName) {
            setName(userData.fullName);
        }
        if (userData?.phoneNumber) {
            setPhoneNumber(userData.phoneNumber);
        }
        if (userData?.address) {
            setAddress(userData.address);
        }
    }, [userData]);

    // Handle service change
    // const handleServiceChange = (serviceId: string) => {
    //     setSelectedService(serviceId);
    //     const selected = services.find((service) => service.id === serviceId);
    //     if (selected) {
    //         setSelectedServiceName(selected.name);
    //     }
    // };

    const handlePetChange = (petIds: string) => {
        setSelectedPet(petIds.split(','));
    }

    //get pets
    const fetchPets = useCallback(() => {
        try {
            axiosClient(`/pet-profiles/user/${userId}`)
                .then((res) => {
                    setPets(res.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {

        }
    }, [userId])

    useEffect(() => {
        fetchPets()
    }, [fetchPets])

    //get pets
    useEffect(() => {
        try {
            axiosClient(`/users/${userId}`)
                .then((res) => {
                    setUserData(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [userId])

    const handleOpenBooking = async () => {
        if (!selectedDate) {
            toast.error("Vui lòng chọn ngày dịch vụ diễn ra");
            return;
        }
        console.log(convertDateValueToDate(selectedDate).toISOString());

        const missingName = selectedServices.some(service => !service.name);
        if (missingName) {
            toast.error("Vui lòng chọn dịch vụ");
            return;
        }

        if (selectedServices.length < 1) {
            toast.error("Vui lòng chọn dịch vụ ít nhất 1 dịch vụ");
            return;
        }

        if (selectedPet.length < 1) {
            toast.error("Vui lòng chọn 1 bé mèo");
            return;
        }

        if (phoneNumber.length !== 10) {
            toast.error("Số điện thoại không hợp lệ")
            return;
        }

        onOpen();
    }

    const handleBooking = () => {
        const bookingDetails: BookingDetail[] = [];

        if (!selectedDate) {
            toast.error("Vui lòng chọn ngày dịch vụ diễn ra");
            return;
        }

        selectedPet.map((petId) => {
            selectedServices.forEach((service) => {
                if (!service.selectedSlot) {
                    toast.error(`Vui lòng chọn slot cho dịch vụ ${service.name}`);
                    return; // Skip this service if `selectedSlot` is undefined
                }
                bookingDetails.push({
                    quantity: 1,
                    petProfileId: petId,
                    serviceId: service.serviceId,
                    bookingSlotId: service.selectedSlot
                });
            })
        });


        // Convert DateValue to Date
        const startDate = convertDateValueToDate(selectedDate).toISOString();

        const data = {
            bookingDetails: bookingDetails,
            sitterId: params.id,
            name: name,
            phoneNumber: phoneNumber,
            address: address,
            note: note,
            startDate,
            isHouseSitting: false,
            orderType: "BUY_SERVICE",
            paymentMethod:
                paymentMethod === "CAPTURE_WALLET" || paymentMethod === "PAY_WITH_ATM"
                    ? "MOMO"
                    : paymentMethod,
        }

        if (paymentMethod === "CAPTURE_WALLET" || paymentMethod === "PAY_WITH_ATM") {
            try {
                axiosClient.post(`booking-orders/with-details`, data)
                    .then((res) => {
                        axiosClient.post(`booking-orders/payment-url?id=${res.data.id}&requestType=${paymentMethod}&redirectUrl=${process.env.NEXT_PUBLIC_BASE_URL}/payment-result`)
                            .then((res) => {
                                window.open(res.data.payUrl, '_self');
                            })
                            .catch(() => {
                                toast.error("Thanh toán thất bại, vui lòng thử lại sau")
                            })
                    })
                    .catch((e) => {
                        if (e.response.data.status === 2014) {
                            toast.error("Bé mèo của bạn đang trong dịch vụ")
                            onOpenChange()
                        }
                        console.log(e);
                    })
            } catch (error) {
                console.log(error);
            }
        } else {
            axiosClient.post(`booking-orders/with-details`, data)
                .then(() => {
                    router.push("/payment-result?resultCode=0")
                    toast.success("Đã đặt lịch thành công, bạn có thể xem nó ở phần hoạt động")
                })
                .catch((e) => {
                    if (e.response.data.message === "Sitter is busy") {
                        toast.error("Người chăm sóc này đang bận, vui lòng chọn người khác")
                        onOpenChange()
                        return
                    }
                    router.push("/payment-result?resultCode=1")
                    toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
                })
        }
    }

    // Function to convert DateValue to Date
    const convertDateValueToDate = (dateValue: DateValue): Date => {
        return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
    };


    //calculate price
    const totalPrice = useMemo(() => {
        let totalPerNight = 0;

        // Get the selected basic service
        selectedServices.map((service: Service) => {
            totalPerNight += service.price;
        })
        console.log(selectedServices);

        return totalPerNight * selectedPet.length;
    }, [selectedPet.length, selectedServices]);

    //select service
    // const handleInputServiceChange = (id: string, field: string, value: TimeInputValue | string, duration: number) => {
    //     if (field === "startTime") {
    //         // Check if `value` is of type `TimeInputValue`
    //         if (typeof value === "object" && "hour" in value && "minute" in value) {
    //             const startHour = value.hour;
    //             const startMinute = value.minute;
    //             const startTimeInMinutes = startHour * 60 + startMinute;

    //             const endTimeInMinutes = duration ? startTimeInMinutes + duration : startTimeInMinutes;

    //             // Convert minutes back to hours and minutes
    //             const endHour = Math.floor(endTimeInMinutes / 60) % 24;
    //             const endMinute = endTimeInMinutes % 60;

    //             const formattedTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
    //             const formattedEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
    //             setSelectedServices((prev) =>
    //                 prev.map((service) =>
    //                     service.id === id
    //                         ? { ...service, startTime: formattedTime, endTime: formattedEndTime }
    //                         : service
    //                 )
    //             );
    //             return;
    //         } else {
    //             toast.error("Invalid time value");
    //             return;
    //         }
    //     }
    // };

    const removeService = (id: string) => {
        setSelectedServices((prev) => prev.filter((service) => service.id != id))
    };


    const addNewAdditionService = () => {
        if (!selectedDate) {
            toast.error("Vui lòng chọn ngày muốn đặt lịch trước");
            return;
        }

        const newService: Service = {
            id: uuidv4(),
            name: "",
            serviceId: "",
            serviceType: "ADDITION_SERVICE",
            actionDescription: "",
            endTime: "",
            startTime: "",
            type: "",
            price: 0,
            duration: 1,
            isBasicService: false,
            isNew: true,
            isDeleted: false,
            slots: [],
            selectedSlot: "",
        };

        setSelectedServices((prevState) => [...prevState, newService]);
    };

    //image upload
    const handleImageClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };


    const handleGenderChange = (value: string) => {
        setPetData({
            ...petData,
            gender: value,
        });
    };

    const handleAddPet = async () => {
        setIsLoading(true)
        try {
            let profilePictureUrl = '';
            if (selectedImage) {
                const storageRef = ref(storage, `petProfiles/${uuidv4()}_${selectedImage.name}`);

                // Upload the file
                await uploadBytes(storageRef, selectedImage);

                // Get the download URL
                profilePictureUrl = await getDownloadURL(storageRef);
            }

            // Prepare pet data with the profile picture URL
            const petDataWithImage = {
                ...petData,
                profilePicture: profilePictureUrl,
            };

            axiosClient.post('/pet-profiles', petDataWithImage)
                .then(() => {
                    onOpenChangeAdd();
                    setPetData({
                        petName: '',
                        age: '',
                        breed: '',
                        weight: '',
                        species: '',
                        gender: '',
                        description: '',
                        profilePicture: '',
                    });
                    fetchPets();
                    setIsLoading(false)
                })
                .catch((e) => {
                    console.log(e);
                    setIsLoading(false)
                })

        } catch (error) {
            console.log(error);
            setIsLoading(false)
        }
    }

    //handle breed change
    const handleBreedChange = (breedId: string) => {
        const selectedBreed = CatBreed.find((breed) => breed.id.toString() === breedId)?.breed || "";
        setPetData((prev) => ({
            ...prev,
            breed: selectedBreed,
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value
        });
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='flex flex-col items-center justify-start my-12'>
            <h1 className={styles.h1}>Đặt dịch vụ</h1>
            <div className='flex flex-row items-start justify-center gap-8 mt-10'>
                {/* 1 */}
                <div className='flex flex-col gap-3 w-[586px]'>
                    <div className='flex flex-col gap-3'>
                        <h2 className={styles.h2}>Chọn ngày</h2>
                        <DatePicker
                            label="Ngày bắt đầu"
                            minValue={todayDate}
                            maxValue={maxDate}
                            visibleMonths={2}
                            onChange={(e) => setSelectedDate(e)}
                        />

                        <h2 className={styles.h2}>Chọn dịch vụ</h2>
                        <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-md shadow-md my-3">
                            {selectedServices.map((selectedService: Service) => (
                                <div
                                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-5"
                                    key={selectedService.id}
                                >
                                    <Select
                                        aria-label='service'
                                        labelPlacement='outside'
                                        className="select"
                                        variant="bordered"
                                        name='service'
                                        value={selectedService.id || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            // If user selected empty value, reset the service fields
                                            if (!value) {
                                                setSelectedServices((prev) =>
                                                    prev.map((item) =>
                                                        item.id === selectedService.id
                                                            ? { ...item, serviceId: "", name: "", price: 0 }
                                                            : item
                                                    )
                                                );
                                                return;
                                            }

                                            const choseService = services.find(service => service.id === e.target.value);

                                            if (choseService) {
                                                setSelectedServices((prev) =>
                                                    prev.map((item) =>
                                                        item.id === selectedService.id
                                                            ? { ...item, serviceId: choseService.id, name: choseService.name, price: choseService.price, slots: choseService.slots }
                                                            : item
                                                    )
                                                );
                                            }
                                        }}
                                    >
                                        {services.map((service: Service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </Select>

                                    <div className='flex justify-center items-center gap-3'>
                                        <Select
                                            aria-label='slot'
                                            className="w-40"
                                            variant="bordered"
                                            placeholder="Giờ diễn ra"
                                            value={selectedService.selectedSlot}
                                            onChange={(e) => {
                                                const selectedSlotId = e.target.value;
                                                console.log("Selected Slot ID:", selectedSlotId);

                                                setSelectedServices((prevServices) =>
                                                    prevServices.map((service) =>
                                                        service.id === selectedService.id
                                                            ? {
                                                                ...service,
                                                                // Store only the ID instead of the entire slot object
                                                                selectedSlot: selectedSlotId,
                                                            }
                                                            : service
                                                    )
                                                );
                                            }}
                                        >
                                            {selectedService.slots && selectedService.slots.length > 0 ? (
                                                selectedService.slots.map((slot) => (
                                                    <SelectItem
                                                        key={slot.id}
                                                        value={slot.id}
                                                        textValue={`${new Date(slot.startTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })} - ${new Date(slot.endTime).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            hour12: false,
                                                        })}`}
                                                    >
                                                        <h1 className="gap-2 flex justify-center items-center">
                                                            {new Date(slot.startTime).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: false,
                                                            })}
                                                            <FontAwesomeIcon icon={faMinus} />
                                                            {new Date(slot.endTime).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                hour12: false,
                                                            })}
                                                        </h1>
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem isReadOnly>Hiện tại không có slot</SelectItem>
                                            )}
                                        </Select>
                                    </div>
                                    <FontAwesomeIcon icon={faTrash} onClick={() => removeService(selectedService.id)} className='cursor-pointer' />
                                </div>
                            ))}
                            <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={addNewAdditionService}>
                                <FontAwesomeIcon icon={faPlus} />Chọn thêm dịch vụ
                            </Button>
                        </div>

                        <h2 className={styles.h2}>Chọn mèo của bạn</h2>
                        <h3 className="flex gap-2">
                            Nếu bạn chưa thêm hồ sơ thú cưng, {" "}
                            <div onClick={onOpenAdd} className="underline font-semibold cursor-pointer">
                                thêm tại đây
                            </div>
                        </h3>
                        <Select
                            items={pets}
                            aria-label='pet'
                            labelPlacement='outside'
                            className="select min-w-full"
                            // selectionMode="multiple"
                            // isMultiline={true}
                            variant="bordered"
                            defaultSelectedKeys={selectedPet}
                            onChange={(event) => handlePetChange(event.target.value)}
                            renderValue={(items) => {
                                return (
                                    <div className="flex gap-2">
                                        {items.map((item) => (
                                            <Chip key={item.key}
                                                className='min-h-full'
                                                avatar={
                                                    <Avatar
                                                        name={item.data?.id}
                                                        src={item.data?.profilePicture}
                                                    />
                                                }>
                                                <p>{item.data?.petName}</p>

                                            </Chip>
                                        ))}
                                    </div>
                                );
                            }}
                        >
                            {(pet) => (
                                <SelectItem key={pet.id} value={pet.id} textValue={pet.petName}>
                                    <div className='flex gap-2 items-center'>
                                        <Avatar alt={pet.petName} className="flex-shrink-0" size="sm" src={pet.profilePicture} />
                                        <div className="flex flex-col">
                                            <span>{pet.petName}</span>
                                            <span>{pet.breed}</span>
                                        </div>
                                    </div>
                                </SelectItem>
                            )}

                        </Select>
                        {/* 
                        <h2 className={styles.h2}>Chọn thức ăn cho mèo</h2>
                        <Select
                            labelPlacement='outside'
                            className="select min-w-full"
                            variant="bordered"
                            aria-label='food'
                        >
                            {catFoods.map((food) => (
                                <SelectItem key={food.id} value={food.id}>
                                    {food.foodName}
                                </SelectItem>
                            ))}
                        </Select> */}

                        <h2 className={styles.h2}>Thông tin cá nhân</h2>
                        <Input placeholder='Họ và tên' variant='bordered' value={name} onChange={(e) => setName(e.target.value)} />
                        <Input type='number' placeholder='Số điện thoại' value={phoneNumber} variant='bordered' onChange={(e) => setPhoneNumber(e.target.value)} className="no-spinner" />
                        <Input placeholder='Địa chỉ của bạn' value={address} variant='bordered' onChange={(e) => setAddress(e.target.value)} />

                        <h2 className={styles.h2}>Lời nhắn</h2>
                        <Textarea placeholder='VD: chia sẽ về sở thích của mèo' variant='bordered' onChange={(e) => setNote(e.target.value)} />

                    </div>
                </div>
                <div className='w-[427px]'>
                    <div className='border flex flex-col p-3 rounded-lg gap-3 mb-10'>
                        <h2 className={styles.h2}>Bảng giá dịch vụ</h2>
                        {basedServices.map((service) => (
                            <div className='flex justify-between' key={service.id}>
                                <h3>{service.name}</h3>
                                <div className='flex flex-col left-0'>
                                    <h3 className='text-[#2B764F]'>{service.price.toLocaleString("de")}đ <span className='text-black'>/ lần</span></h3>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Final price */}
                    <div className='border flex flex-col p-3 rounded-lg gap-3'>
                        <h2 className={styles.h2}>Thông tin đặt lịch </h2>
                        Dịch vụ đã chọn
                        {selectedServices && selectedServices.map((service) => (
                            <h3 key={service.id} className='font-semibold'> {service.name}</h3>
                        ))}
                        <div className='flex flex-cols-3 justify-between'>
                            <div>
                                <h3>Ngày diễn ra</h3>
                                <h3>{selectedDate?.toString()}</h3>
                            </div>
                        </div>
                        <h3>Số lượng mèo: 1</h3>
                        <hr className='text-[#66696]' />
                        <div className='flex justify-between'>
                            <h3>Tổng giá:</h3>
                            <h3 className='text-[#2B764F]'>{totalPrice.toLocaleString("de")}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-10'>
                <Button onPress={handleOpenBooking} className='bg-[#2E67D1] text-white text-[16px] font-semibold rounded-full w-[483px]'>Đặt lịch và thanh toán</Button>
            </div>

            {/* Modal payment */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl' className='mt-32 h-[800px] overflow-auto'>
                <ModalContent>
                    {() => (
                        <>
                            {/* <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader> */}
                            <ModalBody>
                                <div className="flex justify-center items-center mt-3">
                                    <div className='flex flex-col justify-center items-center border border-black rounded-lg w-[650px] p-5 gap-5'>
                                        <h1 className={styles.h1}>Thanh toán dịch vụ</h1>
                                        <p className={styles.p}>Cảm ơn quý khách đã đặt lịch dich vụ của MeowCare. Xin vui lòng xem kỹ chi tiết đặt dịch vụ dưới đây và chọn phương thức thanh toán.</p>
                                        <div className='flex items-start justify-start flex-col w-full'>
                                            <h2 className={styles.h2}>Thông tin quý khách</h2>
                                            <div className={`${styles.h3} grid grid-cols-2 w-80`}>
                                                <h3 className={styles.h3}>Họ và tên: </h3>
                                                <h3 >{name}</h3>
                                                <h3 className={styles.h3}>Điện thoại: </h3>
                                                <h3 >{phoneNumber}</h3>
                                                <h3 className={styles.h3}>Điều cần lưu ý</h3>
                                                <h3 >{note}</h3>
                                            </div>
                                        </div>
                                        <div className='flex items-start justify-start flex-col w-full'>
                                            <h2 className={styles.h2}>Thông tin đặt lịch của bạn</h2>
                                            <div className='grid grid-cols-2 w-80'>
                                                <h3 className={styles.h3}>Người chăm sóc</h3> <h3>{sitter?.fullName}</h3>
                                                <h3 className={styles.h3}>Số lượng thú cưng</h3> <h3>1</h3>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-start justify-start w-full'>
                                            <h2 className={styles.h2}>Tổng giá dịch vụ</h2>
                                            <div>
                                                {selectedServices.map((service, index) => (
                                                    <div key={service.id} className='grid grid-cols-5 w-full'>
                                                        <div className={styles.money}>{index + 1}</div>
                                                        <div className={`${styles.money} col-span-2 w-60`}>{service.name}</div>
                                                        <div className={styles.money}>{service.price.toLocaleString("de")}</div>
                                                        <div className={styles.money}>VND</div>
                                                    </div>
                                                ))}
                                                <div>
                                                    <div className='grid grid-cols-5 w-full'>
                                                        <div className={`${styles.money} col-span-3 font-semibold`}>Tổng cộng</div>
                                                        <div className={styles.money}>{totalPrice.toLocaleString("de")}</div>
                                                        <div className={styles.money}>VND</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-start justify-start w-full gap-3'>
                                            <h2 className={styles.h2}>Chọn phương thức thanh toán</h2>
                                            <RadioGroup
                                                aria-label="Select payment"
                                                // color=""
                                                className='w-full flex flex-col '
                                            >
                                                <div className='border border-black p-3'>
                                                    <Radio value="qr" className='px-5' onClick={() => setPaymentMethod("CAPTURE_WALLET")}>
                                                        <div className='flex items-center'>
                                                            <Image src='/momo.png' alt='' width={90} height={50} className='mx-3 w-[70px] h-[40px]' />
                                                            <div>
                                                                <h1 className={styles.paymentHeading1}>Thanh toán qua Momo</h1>
                                                                <h2 className={styles.paymentHeading2}>Thanh toán qua mã QR</h2>
                                                            </div>
                                                        </div>
                                                    </Radio>
                                                </div>
                                                <div className='border border-black p-3'>
                                                    <Radio value="atm" className='px-5' onClick={() => setPaymentMethod("PAY_WITH_ATM")}>
                                                        <div className='flex items-center'>
                                                            <Image src='/nganhang.png' alt='' width={50} height={90} className='mx-3 w-[54px] h-[54px]' />
                                                            <div>
                                                                <h1 className={styles.paymentHeading1}>Thanh toán qua ngân hàng</h1>
                                                                <h2 className={styles.paymentHeading2}>Thanh toán bằng số tài khoản</h2>
                                                            </div>
                                                        </div>
                                                    </Radio>
                                                </div>
                                                <div className='border border-black p-3'>
                                                    <Radio value="wallet" className='px-5' aria-label='wallet' onClick={() => setPaymentMethod("WALLET")}>
                                                        <div className='flex items-center'>
                                                            <Image src='/ewallet.png' alt='' width={51} height={44} className='mx-3 w-[71px] h-[54px]' />
                                                            <div>
                                                                <h1 className={styles.paymentHeading1}>Thanh toán bằng ví</h1>
                                                                <h2 className={styles.paymentHeading2}>Thanh toán bằng ví của bạn</h2>
                                                            </div>
                                                        </div>
                                                    </Radio>
                                                </div>
                                                <div className='border border-black p-3'>
                                                    <Radio value="cash" className='px-5' aria-label='cash' onClick={() => setPaymentMethod("PAY_LATER")}>
                                                        <div className='flex items-center'>
                                                            <Image src='/cash.png' alt='' width={51} height={44} className='mx-3 w-[71px] h-[54px]' />
                                                            <div>
                                                                <h1 className={styles.paymentHeading1}>Thanh toán bằng tiền mặt</h1>
                                                                <h2 className={styles.paymentHeading2}>Sau khi hoàn thành dịch vụ</h2>
                                                            </div>
                                                        </div>
                                                    </Radio>
                                                </div>
                                            </RadioGroup>

                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter className='w-full flex justify-center'>
                                <Button className='bg-btnbg text-white w-[206px] rounded-full h-[42px]' onPress={() => handleBooking()}>
                                    Thanh toán
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* add new pet  */}
            <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} size='5xl'>
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader className="flex items-end gap-2">
                                <FontAwesomeIcon icon={faCat} className='fa-2x' />
                                <div className='items-end mb-[-6px]'>
                                    <h1 className='text-2xl font-bold'>Bé mèo của bạn</h1>
                                </div>
                            </ModalHeader>
                            <ModalBody className='flex gap-5 '>
                                <div className='flex gap-10'>
                                    <div className='relative group w-[200px] h-[200px]'>
                                        <Avatar className='w-full h-full' radius="sm" src={previewImage || '/noimagecat.jpg'} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Button
                                                onClick={handleImageClick}
                                                className=' bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300'
                                            >
                                                Chọn ảnh cho hồ sơ
                                            </Button>
                                        </div>
                                        <input
                                            type="file"
                                            accept='image/*'
                                            ref={hiddenFileInput}
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className='flex flex-col gap-5'>
                                        <div className='flex gap-5'>
                                            <Input label={<h1 className={styles.heading1}>Tên bé mèo</h1>} placeholder='Tên' labelPlacement='outside' name='petName' value={petData.petName} onChange={handleInputChange} />
                                            <Input label={<h1 className={styles.heading1}>Tuổi</h1>} placeholder='Nhập tuổi cho bé mèo' labelPlacement='outside' name='age' value={petData.age} onChange={handleInputChange} />
                                            <RadioGroup
                                                label={<h1 className={styles.heading1}>Giới tính</h1>}
                                                className='w-full'
                                                value={petData.gender}
                                                onValueChange={handleGenderChange}
                                            >
                                                <div className='flex gap-3'>
                                                    <Radio value="Bé đực">Bé đực</Radio>
                                                    <Radio value="Bé cái">Bé cái</Radio>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className='flex gap-5'>
                                            <Select
                                                label="Giống loài"
                                                labelPlacement='outside'
                                                placeholder="Giống mèo của bạn"
                                                className="select"
                                                variant="bordered"
                                                onChange={(event) => handleBreedChange(event.target.value)}
                                            >
                                                {CatBreed.map((breed) => (
                                                    <SelectItem key={breed.id} value={breed.id}>
                                                        {breed.breed}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Input label={<h1 className={styles.heading1}>Cân nặng</h1>} placeholder='Cân nặng' labelPlacement='outside' endContent="kg" name='weight' value={petData.weight} onChange={handleInputChange} />

                                        </div>
                                    </div>
                                </div>
                                <Textarea
                                    name='description'
                                    value={petData.description}
                                    onChange={handleInputChange}
                                    label={<h1 className={styles.heading1}>Những thông tin mà người chăm sóc mèo cần lưu ý</h1>}
                                    placeholder='Thêm hướng dẫn chăm sóc để phù hợp với bé mèo của bạn'
                                    labelPlacement='outside'
                                />
                            </ModalBody>
                            <ModalFooter className='flex justify-center items-center'>
                                <Button color="primary" onPress={handleAddPet} className='rounded-full'>
                                    Lưu
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div >
    )
}

export default HouseSitting