'use client'

import { Avatar, Button, Chip, DateRangePicker, DateValue, Input, Modal, ModalBody, ModalContent, ModalFooter, Radio, RadioGroup, Select, SelectItem, Textarea, TimeInput, TimeInputValue, useDisclosure } from '@nextui-org/react'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './housesitting.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { useParams } from 'next/navigation'
import axiosClient from '@/app/lib/axiosClient'
import { CatSitter, PetProfile, Service, UserType } from '@/app/constants/types/homeType'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { today, getLocalTimeZone, Time } from '@internationalized/date';
import { format } from 'date-fns'
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';

interface BookingDetail {
    quantity: number;
    petProfileId: string;
    serviceId: string;
}

const HouseSitting = () => {
    const params = useParams();
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    const [selectedPet, setSelectedPet] = useState<string[]>([]);
    const [pets, setPets] = useState<PetProfile[]>([]);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [bookingId, setBookingId] = useState();
    const [services, setServices] = useState<Service[]>([])
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('')
    const [note, setNote] = useState('')
    const todayDate = today(getLocalTimeZone());
    const [dateRange, setDateRange] = useState<{ startDate: DateValue | null; endDate: DateValue | null }>({
        startDate: null,
        endDate: null,
    });
    const [sitter, setSitter] = useState<CatSitter>()
    const [paymentMethod, setPaymentMethod] = useState("")
    // const [selectedServiceName, setSelectedServiceName] = useState("")
    const [userData, setUserData] = useState<UserType>()
    const catFoods = [
        { id: '1', foodName: 'Cá' },
        { id: '2', foodName: 'Thịt' },
    ];


    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        axiosClient(`sitter-profiles/sitter/${params.id}`)
            .then((res) => {
                setSitter(res.data)
            })
            .catch(() => { })
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

    //get basic service
    useEffect(() => {
        try {
            axiosClient(`services/sitter/${params.id}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`)
                .then((res) => {
                    setServices(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [params.id])

    //get pets
    useEffect(() => {
        try {
            axiosClient(`/pet-profiles/user/${userId}`)
                .then((res) => {
                    setPets(res.data);
                })
                .catch((e) => {
                    console.log(e);
                })
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

    const handleBooking = () => {
        console.log(selectedServices);

        const bookingDetails: BookingDetail[] = [];


        selectedPet.map((petId) => {
            selectedServices.forEach((service) => {
                bookingDetails.push({
                    quantity: 1,
                    petProfileId: petId,
                    serviceId: service.id,
                });
            })
        });

        //add date
        if (!dateRange.startDate || !dateRange.endDate) {
            toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
            return;
        }

        // Convert DateValue to Date
        const startDate = convertDateValueToDate(dateRange.startDate).toISOString();
        const endDate = convertDateValueToDate(dateRange.endDate).toISOString();

        const data = {
            bookingDetails: bookingDetails,
            sitterId: params.id,
            name: name,
            phoneNumber: phoneNumber,
            address: address,
            note: note,
            startDate,
            endDate
        }

        try {
            axiosClient.post(`booking-orders/with-details`, data)
                .then((res) => {
                    setBookingId(res.data.id)
                    onOpen();
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }

    const handlePay = () => {
        try {
            axiosClient.post(`booking-orders/payment-url?id=${bookingId}&requestType=${paymentMethod}&redirectUrl=${process.env.NEXT_PUBLIC_BASE_URL}/payment-result`)
                .then((res) => {
                    window.open(res.data.payUrl, '_self');
                })
                .catch(() => {
                    toast.error("Thanh toán thất bại, vui lòng thử lại sau")
                })
        } catch (error) {
            console.log(error);
        }
    }

    // Function to convert DateValue to Date
    const convertDateValueToDate = (dateValue: DateValue): Date => {
        return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
    };

    const bookingDetails = useMemo(() => {
        let numberOfNights = 1;
        let formattedStartDate = 'Chưa chọn';
        let formattedEndDate = 'Chưa chọn';

        if (dateRange.startDate && dateRange.endDate) {
            const start = convertDateValueToDate(dateRange.startDate);
            const end = convertDateValueToDate(dateRange.endDate);
            const diffTime = end.getTime() - start.getTime();
            numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            if (numberOfNights <= 0) numberOfNights = 1;

            formattedStartDate = start.toLocaleDateString();
            formattedEndDate = end.toLocaleDateString();
        }

        return { numberOfNights, formattedStartDate, formattedEndDate };
    }, [dateRange]);

    //calculate price
    const totalPrice = useMemo(() => {
        let totalPerNight = 0;

        // Get the selected basic service
        selectedServices.map((service: Service) => {
            totalPerNight += service.price;
        })

        return totalPerNight * bookingDetails.numberOfNights * selectedPet.length;
    }, [bookingDetails.numberOfNights, selectedPet.length, selectedServices]);

    useEffect(() => {

    }, [dateRange])

    //select service
    const handleInputServiceChange = (id: string, field: string, value: TimeInputValue | string, duration: number) => {

        if (field === "startTime") {
            // Check if `value` is of type `TimeInputValue`
            if (typeof value === "object" && "hour" in value && "minute" in value) {
                const startHour = value.hour;
                const startMinute = value.minute;
                const startTimeInMinutes = startHour * 60 + startMinute;

                const endTimeInMinutes = duration ? startTimeInMinutes + duration : startTimeInMinutes;

                // Convert minutes back to hours and minutes
                const endHour = Math.floor(endTimeInMinutes / 60) % 24;
                const endMinute = endTimeInMinutes % 60;

                const formattedTime = `${startHour.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
                const formattedEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
                setSelectedServices((prev) =>
                    prev.map((service) =>
                        service.id === id
                            ? { ...service, startTime: formattedTime, endTime: formattedEndTime }
                            : service
                    )
                );
                return;
            } else {
                toast.error("Invalid time value");
                return;
            }
        }
    };

    const removeService = (id: string) => {
        setSelectedServices((prev) => prev.filter((service) => service.id != id))
    };


    const addNewChildService = () => {
        const newService: Service = {
            id: uuidv4(),
            name: "",
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
        };

        setSelectedServices((prevState) => [...prevState, newService]);
    };

    const parseTimeString = (timeString: string) => {
        const [hour, minute] = timeString.split(':').map(Number);
        return { hour, minute };
    };

    return (
        <div className='flex flex-col items-center justify-start my-12'>
            <h1 className={styles.h1}>Đặt lịch</h1>
            <div className='flex flex-row items-start justify-center gap-8 mt-10'>
                {/* 1 */}
                <div className='flex flex-col gap-3 w-[586px]'>
                    <div className='flex flex-col gap-3'>
                        <h2 className={styles.h2}>Chọn dịch vụ</h2>
                        <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-md shadow-md my-3">
                            {selectedServices.filter((service) => !service.isDeleted).map((selectedService: Service) => (
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
                                        onChange={(e) => {
                                            const chosenService = services.find(service => service.id === e.target.value);
                                            if (chosenService) {
                                                // Update the selected service in `selectedServices` with the chosen duration from `services`
                                                setSelectedServices((prev) =>
                                                    prev.map((item) =>
                                                        item.id === selectedService.id
                                                            ? { ...item, serviceId: chosenService.id, duration: chosenService.duration }
                                                            : item
                                                    )
                                                );
                                            }
                                        }}
                                    >
                                        {services.map((service) => (
                                            <SelectItem key={service.id} value={service.id}>
                                                {service.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                    <div className='flex justify-center items-center gap-3'>
                                        <TimeInput
                                            className='w-28'
                                            label="Giờ bắt đầu"
                                            hourCycle={24}
                                            granularity="minute"
                                            value={new Time(parseTimeString(selectedService.startTime).hour, parseTimeString(selectedService.startTime).minute)}
                                            onChange={(e) => handleInputServiceChange(selectedService.id, 'startTime', e, selectedService.duration)}
                                        />
                                        -
                                        <TimeInput
                                            className='w-28'
                                            isDisabled
                                            label="Giờ kết thúc"
                                            hourCycle={24}
                                            granularity="minute"
                                            value={new Time(parseTimeString(selectedService.endTime).hour, parseTimeString(selectedService.endTime).minute)}
                                        />
                                    </div>
                                    <FontAwesomeIcon icon={faTrash} onClick={() => removeService(selectedService.id)} className='cursor-pointer' />
                                </div>
                            ))}
                            <Button className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2" onClick={addNewChildService}>
                                <FontAwesomeIcon icon={faPlus} />Chọn thêm dịch vụ
                            </Button>
                        </div>
                        <h2 className={styles.h2}>Chọn ngày</h2>
                        <DateRangePicker
                            label="Ngày đặt lịch"
                            minValue={todayDate}
                            visibleMonths={2}
                            onChange={(range) => setDateRange({ startDate: range.start, endDate: range.end })}
                        />

                        <h2 className={styles.h2}>Thêm thú cưng của bạn</h2>
                        <Select
                            items={pets}
                            aria-label='pet'
                            labelPlacement='outside'
                            className="select min-w-full"
                            selectionMode="multiple"
                            variant="bordered"
                            isMultiline={true}
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
                        </Select>

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
                        {services.map((service) => (
                            <div className='flex justify-between' key={service.id}>
                                <h3>{service.name}</h3>
                                <div className='flex flex-col left-0'>
                                    <h3 className='text-[#2B764F]'>{service.price.toLocaleString()}đ</h3>
                                    <h4>giá mỗi đêm</h4>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Final price */}
                    <div className='border flex flex-col p-3 rounded-lg gap-3'>
                        <h2 className={styles.h2}>Thông tin đặt lịch </h2>
                        {/* <h3>Dịch vụ: {selectedServiceName}</h3> */}
                        <div className='flex flex-cols-3 justify-between'>
                            <div>
                                <h3>Ngày nhận</h3>
                                <h3>{bookingDetails.formattedStartDate}</h3>
                            </div>
                            <div className='flex flex-col items-center'>
                                <h3 className='text-[#902C6C]'>{bookingDetails.numberOfNights}</h3>
                                <FontAwesomeIcon icon={faClock} className='text-[#A65587]' />
                            </div>
                            <div>
                                <h3>Ngày trả</h3>
                                <h3>{bookingDetails.formattedEndDate}</h3>
                            </div>
                        </div>
                        <h3>Số lượng mèo: 1</h3>
                        <h3>Số ngày lễ: 0</h3>
                        <hr className='text-[#66696]' />
                        <div className='flex justify-between'>
                            <h3>Tổng giá:</h3>
                            <h3 className='text-[#2B764F]'>{totalPrice.toLocaleString()}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-10'>
                <Button onPress={handleBooking} className='bg-[#2E67D1] text-white text-[16px] font-semibold rounded-full w-[483px]'>Đặt lịch và thanh toán</Button>
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
                                                <h3 className={styles.h3}>Mã đặt hàng</h3> <h3>123</h3>
                                                {/* <h3 className={styles.h3}>Dịch vụ</h3> <h3>{selectedServiceName}</h3> */}
                                                <h3 className={styles.h3}>Ngày gửi</h3> <h3>{format(new Date(bookingDetails.formattedStartDate), 'dd/MM/yyyy')}</h3>
                                                <h3 className={styles.h3}>Ngày Nhận</h3> <h3>{format(new Date(bookingDetails.formattedEndDate), 'dd/MM/yyyy')}</h3>
                                                <h3 className={styles.h3}>Người chăm sóc</h3> <h3>{sitter?.fullName}</h3>
                                                <h3 className={styles.h3}>Số lượng thú cưng</h3> <h3>1</h3>
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-start justify-start w-full'>
                                            <h2 className={styles.h2}>Tổng giá dịch vụ</h2>
                                            <div className='grid grid-cols-5 w-full'>
                                                <div className={styles.money}>123</div>
                                                <div className={`${styles.money} col-span-2`}>Đức Tấn</div>
                                                <div className={styles.money}>150.000</div>
                                                <div className={styles.money}>VND</div>

                                                <div className={`${styles.money} col-span-3`}>Tổng cộng</div>
                                                <div className={styles.money}>{totalPrice.toLocaleString("de")}</div>
                                                <div className={styles.money}>VND</div>
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
                                                    <Radio value="cash" className='px-5' aria-label='j'>
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
                                <Button className='bg-btnbg text-white w-[206px] rounded-full h-[42px]' onPress={() => handlePay()}>
                                    Thanh toán
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