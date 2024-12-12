"use client";

import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Chip,
  DateRangePicker,
  DateValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  useDisclosure
} from "@nextui-org/react";
import { useEffect, useMemo, useState } from "react";
import styles from "./booking.module.css";
// import Link from 'next/link'
import {
  CatSitter,
  PetProfile,
  Service,
  UserType,
} from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import { getLocalTimeZone, today } from "@internationalized/date";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface BookingDetail {
  quantity: number;
  petProfileId: string;
  serviceId: string;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedPet, setSelectedPet] = useState<string[]>([]);
  // const [isRequireFood, setIsRequireFood] = useState(false);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [childServices, setChildServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const todayDate = today(getLocalTimeZone());
  const [dateRange, setDateRange] = useState<{
    startDate: DateValue | null;
    endDate: DateValue | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [sitter, setSitter] = useState<CatSitter>();
  const [paymentMethod, setPaymentMethod] = useState("");
  // const [selectedServiceName, setSelectedServiceName] = useState("")
  const [userData, setUserData] = useState<UserType>();
  // const catFoods = [
  //   { id: "1", foodName: "Cá" },
  //   { id: "2", foodName: "Thịt" },
  // ];

  const [selectedPetNames, setSelectedPetNames] = useState<string[]>([]);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    axiosClient(
      `services/sitter/${params.id}/type?serviceType=CHILD_SERVICE&status=ACTIVE`
    )
      .then((res) => {
        setChildServices(res.data);
      })
      .catch(() => { });
    axiosClient(`sitter-profiles/sitter/${params.id}`)
      .then((res) => {
        setSitter(res.data);
      })
      .catch(() => { });
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (user !== null) {
        try {
          const userObj = JSON.parse(user);
          setUserId(userObj.id);
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
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
  //   setSelectedService(serviceId);
  //   // const selected = services.find((service) => service.id === serviceId);
  //   // if (selected) {
  //   //     setSelectedServiceName(selected.name);
  //   // }
  // };

  const handlePetChange = (petIds: string) => {
    if (petIds) {
      const selectedIds = petIds.split(",");
      setSelectedPet(selectedIds);

      // Map selected IDs to pet names and filter out undefined values
      const names = selectedIds
        .map((petId) => pets.find((pet) => pet.id === petId)?.petName)
        .filter((name): name is string => name !== undefined); // Explicitly assert type
      setSelectedPetNames(names);
    } else {
      setSelectedPet([]);
      setSelectedPetNames([]);
    }
  };

  //get basic service
  useEffect(() => {
    try {
      axiosClient(
        `services/sitter/${params.id}/type?serviceType=MAIN_SERVICE&status=ACTIVE`
      )
        .then((res) => {
          setServices(res.data);
          setSelectedService(res.data[0].id);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, [params.id]);

  //get pets
  useEffect(() => {
    try {
      axiosClient(`/pet-profiles/user/${userId}`)
        .then((res) => {
          setPets(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
      axiosClient(`/users/${userId}`)
        .then((res) => {
          setUserData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const handleOpenBooking = () => {
    if (!name) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (phoneNumber.length !== 10) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    if (phoneNumber)
      if (!dateRange.startDate || !dateRange.endDate) {
        toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
        return;
      }
    if (selectedPet.length < 1) {
      toast.error("Vui lòng chọn ít nhất 1 bé mèo");
      return;
    }
    onOpen();
  };

  const handleBooking = () => {
    const bookingDetails: BookingDetail[] = [];

    selectedPet.map((petId) => {
      bookingDetails.push({
        quantity: 1,
        petProfileId: petId,
        serviceId: selectedService,
      });

      childServices.forEach((service) => {
        bookingDetails.push({
          quantity: 1,
          petProfileId: petId,
          serviceId: service.id,
        });
      });
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
      endDate,
      isHouseSitting: true,
      orderType: "OVERNIGHT",
      paymentMethod:
        paymentMethod === "CAPTURE_WALLET" || paymentMethod === "PAY_WITH_ATM"
          ? "MOMO"
          : "WALLET",
    };

    if (
      paymentMethod === "CAPTURE_WALLET" ||
      paymentMethod === "PAY_WITH_ATM"
    ) {
      try {
        axiosClient
          .post(`booking-orders/with-details`, data)
          .then((res) => {
            axiosClient
              .post(
                `booking-orders/payment-url?id=${res.data.id}&requestType=${paymentMethod}&redirectUrl=${process.env.NEXT_PUBLIC_BASE_URL}/payment-result`
              )
              .then((res) => {
                window.open(res.data.payUrl, "_self");
              })
              .catch(() => {
                toast.error("Thanh toán thất bại, vui lòng thử lại sau");
              });
          })
          .catch((e) => {
            console.log(e);
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      axiosClient
        .post(`booking-orders/with-details`, data)
        .then(() => {
          router.push("/payment-result?resultCode=0");
          toast.success(
            "Đã đặt lịch thành công, hãy chờ người chăm sóc chấp nhận"
          );
        })
        .catch(() => {
          router.push("/payment-result?resultCode=1");
          toast.error("Có lỗi xảy ra, vui lòng thử lại sau");
        });
    }
  };

  // Function to convert DateValue to Date
  const convertDateValueToDate = (dateValue: DateValue): Date => {
    return new Date(dateValue.year, dateValue.month - 1, dateValue.day);
  };

  const bookingDetails = useMemo(() => {
    let numberOfNights = 0;
    let formattedStartDate = "Chưa chọn";
    let formattedEndDate = "Chưa chọn";
    let priceForPet = 0;

    if (dateRange.startDate && dateRange.endDate) {
      const start = convertDateValueToDate(dateRange.startDate);
      const end = convertDateValueToDate(dateRange.endDate);
      const diffTime = end.getTime() - start.getTime();
      numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (numberOfNights <= 0) numberOfNights = 1;
      priceForPet = services[0].price * numberOfNights;
      formattedStartDate = start.toLocaleDateString();
      formattedEndDate = end.toLocaleDateString();
    }

    return {
      numberOfNights,
      formattedStartDate,
      formattedEndDate,
      priceForPet,
    };
  }, [dateRange.endDate, dateRange.startDate, services]);

  //calculate price
  const totalPrice = useMemo(() => {
    let totalPerNight = 0;

    // Get the selected basic service
    const basicService = services.find(
      (service) => service.id === selectedService
    );
    if (basicService) {
      totalPerNight += basicService.price;
    }
    return totalPerNight * bookingDetails.numberOfNights * selectedPet.length;
  }, [
    services,
    bookingDetails.numberOfNights,
    selectedPet.length,
    selectedService,
  ]);

  useEffect(() => { }, [dateRange]);

  return (
    <div className="flex flex-col items-center justify-start my-12">
      <h1 className={styles.h1}>Gửi thú cưng</h1>
      <div className="flex flex-row items-start justify-center gap-8 mt-10">
        {/* 1 */}
        <div className="flex flex-col gap-3 w-[486px]">
          <div className="flex flex-col gap-3">
            {/* <h2 className={styles.h2}>Loại dịch vụ</h2>
                        {services.map((service) => (
                            <h1 key={service.id} >
                                {service.name}
                            </h1>
                        ))} */}

            <h2 className={styles.h2}>Chọn ngày</h2>
            <DateRangePicker
              label="Ngày đặt lịch"
              minValue={todayDate}
              visibleMonths={2}
              onChange={(range) =>
                setDateRange({ startDate: range.start, endDate: range.end })
              }
            />

            <h2 className={styles.h2}>Chọn mèo của bạn</h2>
            <h3>
              Nếu bạn chưa thêm hồ sơ thú cưng,{" "}
              <Link href="/profile/pet" className="underline font-semibold">
                thêm tại đây
              </Link>{" "}
            </h3>
            <Select
              items={pets}
              aria-label="pet"
              labelPlacement="outside"
              className="select min-w-full"
              selectionMode="multiple"
              isMultiline={true}
              variant="bordered"
              defaultSelectedKeys={selectedPet}
              onChange={(event) => handlePetChange(event.target.value)}
              renderValue={(items) => {
                return (
                  <div className="flex gap-2">
                    {items.map((item) => (
                      <Chip
                        key={item.key}
                        className="min-h-full"
                        avatar={
                          <Avatar
                            name={item.data?.id}
                            src={item.data?.profilePicture}
                          />
                        }
                      >
                        <p>{item.data?.petName}</p>
                      </Chip>
                    ))}
                  </div>
                );
              }}
            >
              {(pet) => (
                <SelectItem key={pet.id} value={pet.id} textValue={pet.petName}>
                  <div className="flex gap-2 items-center">
                    <Avatar
                      alt={pet.petName}
                      className="flex-shrink-0"
                      size="sm"
                      src={pet.profilePicture}
                    />
                    <div className="flex flex-col">
                      <span>{pet.petName}</span>
                      <span>{pet.breed}</span>
                    </div>
                  </div>
                </SelectItem>
              )}
            </Select>

            {/* <h2 className={styles.h2}>Chọn thức ăn cho mèo</h2>
                        <Select
                            labelPlacement='outside'
                            className="select min-w-full"
                            variant="bordered"
                            aria-label='food'
                            defaultSelectedKeys={selectedService}
                            onChange={(event) => handleServiceChange(event.target.value)}
                        >
                            {catFoods.map((food) => (
                                <SelectItem key={food.id} value={food.id}>
                                    {food.foodName}
                                </SelectItem>
                            ))}
                        </Select> */}
            {/* 
            <Checkbox
              isSelected={isRequireFood}
              onValueChange={setIsRequireFood}
              radius="none"
            >
              Thức ăn theo yêu cầu
            </Checkbox>
            <Input
              placeholder="Nhập loại thức ăn cụ thể"
              isDisabled={!isRequireFood}
              variant="bordered"
              className="input"
            /> */}

            <h2 className={styles.h2}>Thông tin cá nhân</h2>
            <Input
              placeholder="Họ và tên"
              variant="bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Số điện thoại"
              value={phoneNumber}
              variant="bordered"
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="no-spinner"
            />
            <Input
              placeholder="Địa chỉ của bạn"
              value={address}
              variant="bordered"
              onChange={(e) => setAddress(e.target.value)}
            />

            <h2 className={styles.h2}>Lời nhắn</h2>
            <Textarea
              placeholder="VD: chia sẽ về sở thích của mèo"
              variant="bordered"
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <div className="w-[427px]">
          {/* Final price */}
          <div className="border flex flex-col p-3 rounded-lg gap-3">
            <h2 className={styles.h2}>Thông tin đặt lịch </h2>
            <h3>
              Dịch vụ:{" "}
              <span className="font-semibold">
                {services.map((service) => service.name)}
              </span>
            </h3>
            <div className="flex flex-cols-3 justify-between">
              <div>
                <h3>Ngày nhận</h3>
                <h3>{bookingDetails.formattedStartDate}</h3>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-[#902C6C]">
                  {bookingDetails.numberOfNights}
                </h3>
                <FontAwesomeIcon icon={faClock} className="text-[#A65587]" />
              </div>
              <div>
                <h3>Ngày trả</h3>
                <h3>{bookingDetails.formattedEndDate}</h3>
              </div>
            </div>
            <h3>Số lượng mèo: 1</h3>
            <hr className="text-[#66696]" />
            <div className="flex justify-between">
              <h3>Tổng giá:</h3>
              <h3 className="text-[#2B764F]">{totalPrice.toLocaleString()}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <Button
          onPress={() => handleOpenBooking()}
          className="bg-[#2E67D1] text-white text-[16px] font-semibold rounded-full w-[483px]"
        >
          Đặt lịch và thanh toán
        </Button>
      </div>

      {/* Modal payment */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        className="mt-32 h-[800px] overflow-auto"
      >
        <ModalContent>
          {() => (
            <>
              {/* <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader> */}
              <ModalBody>
                <div className="flex justify-center items-center mt-3">
                  <div className="flex flex-col justify-center items-center border border-black rounded-lg w-[650px] p-5 gap-5">
                    <h1 className={styles.h1}>Thanh toán dịch vụ</h1>
                    <p className={styles.p}>
                      Cảm ơn quý khách đã đặt lịch dich vụ của MeowCare. Xin vui
                      lòng xem kỹ chi tiết đặt dịch vụ dưới đây và chọn phương
                      thức thanh toán.
                    </p>
                    <div className="flex items-start justify-start flex-col w-full">
                      <h2 className={styles.h2}>Thông tin quý khách</h2>
                      <div className={`${styles.h3} grid grid-cols-2 w-80`}>
                        <h3 className={styles.h3}>Họ và tên: </h3>
                        <h3>{name}</h3>
                        <h3 className={styles.h3}>Điện thoại: </h3>
                        <h3>{phoneNumber}</h3>
                        <h3 className={styles.h3}>Điều cần lưu ý</h3>
                        <h3>{note}</h3>
                      </div>
                    </div>
                    <div className="flex items-start justify-start flex-col w-full">
                      <h2 className={styles.h2}>Thông tin đặt lịch của bạn</h2>
                      <div className="grid grid-cols-2 w-80">
                        <h3 className={styles.h3}>Dịch vụ</h3>{" "}
                        <h3 className={styles.h3}>Gửi thú cưng</h3>
                        <h3 className={styles.h3}>Ngày gửi</h3>{" "}
                        <h3 className={styles.h3}>
                          {format(
                            new Date(bookingDetails.formattedStartDate),
                            "dd/MM/yyyy"
                          )}
                        </h3>
                        <h3 className={styles.h3}>Ngày Nhận</h3>{" "}
                        <h3 className={styles.h3}>
                          {format(
                            new Date(bookingDetails.formattedEndDate),
                            "dd/MM/yyyy"
                          )}
                        </h3>
                        <h3 className={styles.h3}>Người chăm sóc</h3>{" "}
                        <h3 className={styles.h3}>{sitter?.fullName}</h3>
                        <h3 className={styles.h3}>Số lượng thú cưng</h3>{" "}
                        <h3 className={styles.h3}>{selectedPet.length}</h3>
                      </div>
                    </div>

                    <div className="flex flex-col items-start justify-start w-full">
                      <h2 className={styles.h2}>Tổng giá dịch vụ</h2>
                      {selectedPetNames.map((name, index) => (
                        <div key={index} className="grid grid-cols-5 w-full">
                          <div className={`${styles.money}`}>Tên bé mèo</div>
                          <div
                            className={`${styles.money} col-span-2 font-semibold`}
                          >
                            {name}
                          </div>
                          <div className={styles.money}>
                            {bookingDetails.priceForPet.toLocaleString("de")}
                          </div>
                          <div className={styles.money}>VND</div>
                        </div>
                      ))}
                      <div className="grid grid-cols-5 w-full">
                        <div className={`${styles.money} col-span-3`}>
                          Tổng cộng
                        </div>
                        <div className={styles.money}>
                          {totalPrice.toLocaleString("de")}
                        </div>
                        <div className={styles.money}>VND</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-start justify-start w-full gap-3">
                      <h2 className={styles.h2}>Chọn phương thức thanh toán</h2>
                      <RadioGroup
                        aria-label="Select payment"
                        // color=""
                        className="w-full flex flex-col "
                      >
                        <div className="border border-black p-3">
                          <Radio
                            value="qr"
                            className="px-5"
                            onClick={() => setPaymentMethod("CAPTURE_WALLET")}
                          >
                            <div className="flex items-center">
                              <Image
                                src="/momo.png"
                                alt=""
                                width={90}
                                height={50}
                                className="mx-3 w-[70px] h-[40px]"
                              />
                              <div>
                                <h1 className={styles.paymentHeading1}>
                                  Thanh toán qua Momo
                                </h1>
                                <h2 className={styles.paymentHeading2}>
                                  Thanh toán qua mã QR
                                </h2>
                              </div>
                            </div>
                          </Radio>
                        </div>
                        <div className="border border-black p-3">
                          <Radio
                            value="atm"
                            className="px-5"
                            onClick={() => setPaymentMethod("PAY_WITH_ATM")}
                          >
                            <div className="flex items-center">
                              <Image
                                src="/nganhang.png"
                                alt=""
                                width={50}
                                height={90}
                                className="mx-3 w-[54px] h-[54px]"
                              />
                              <div>
                                <h1 className={styles.paymentHeading1}>
                                  Thanh toán qua ngân hàng
                                </h1>
                                <h2 className={styles.paymentHeading2}>
                                  Thanh toán bằng số tài khoản
                                </h2>
                              </div>
                            </div>
                          </Radio>
                        </div>
                        <div className="border border-black p-3">
                          <Radio
                            value="wallet"
                            className="px-5"
                            aria-label="wallet"
                            onClick={() => setPaymentMethod("WALLET")}
                          >
                            <div className="flex items-center">
                              <Image
                                src="/ewallet.png"
                                alt=""
                                width={51}
                                height={44}
                                className="mx-3 w-[71px] h-[54px]"
                              />
                              <div>
                                <h1 className={styles.paymentHeading1}>
                                  Thanh toán bằng ví
                                </h1>
                                <h2 className={styles.paymentHeading2}>
                                  Thanh toán bằng ví của bạn
                                </h2>
                              </div>
                            </div>
                          </Radio>
                        </div>
                        <div className="border border-black p-3">
                          <Radio
                            value="cash"
                            className="px-5"
                            aria-label="cash"
                            onClick={() => setPaymentMethod("CASH")}
                          >
                            <div className="flex items-center">
                              <Image
                                src="/cash.png"
                                alt=""
                                width={51}
                                height={44}
                                className="mx-3 w-[71px] h-[54px]"
                              />
                              <div>
                                <h1 className={styles.paymentHeading1}>
                                  Thanh toán bằng tiền mặt
                                </h1>
                                <h2 className={styles.paymentHeading2}>
                                  Sau khi hoàn thành dịch vụ
                                </h2>
                              </div>
                            </div>
                          </Radio>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="w-full flex justify-center">
                <Button
                  className="bg-btnbg text-white w-[206px] rounded-full h-[42px]"
                  onPress={() => handleBooking()}
                >
                  Thanh toán
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
