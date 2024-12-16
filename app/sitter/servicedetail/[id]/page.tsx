"use client";

import {
  ConfigService,
  Service,
  UserLocal,
} from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import {
  Button,
  Input,
  TimeInput,
  TimeInputValue,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./servicedetail.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faPencil,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Loading from "@/app/components/Loading";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { Time } from "@internationalized/date";

const ServiceDetail = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [service, setService] = useState<Service>();
  const [configService, setConfigService] = useState<ConfigService>();
  const [serviceData, setServiceData] = useState({
    id: "",
    status: 0,
    name: "",
    price: "",
    serviceType: "",
    actionDescription: "",
  });
  const [childServices, setChildServices] = useState<Service[]>([
    {
      id: uuidv4(),
      name: "",
      serviceType: "CHILD_SERVICE",
      actionDescription: "",
      startTime: "",
      endTime: "",
      type: "",
      duration: 0,
      price: 0, // Default price value
      isBasicService: false, // Default boolean value
      isNew: true,
      isDeleted: false,
      serviceId: "",
    },
  ]);

  //check valid
  const [isPriceValid, setIsPriceValid] = useState(false);

  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  };

  const user: UserLocal | null = getUserFromStorage();
  const userId = user?.id;

  const parseTimeString = (timeString: string) => {
    const [hour, minute] = timeString.split(":").map(Number);
    return { hour, minute };
  };

  const fetchChildeService = useCallback(() => {
    try {
      axiosClient(
        `/services/sitter/${userId}/type?serviceType=CHILD_SERVICE&status=ACTIVE`
      )
        .then((res) => {
          setChildServices(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) { }
  }, [userId]);

  useEffect(() => {
    fetchChildeService();
  }, [fetchChildeService]);

  useEffect(() => {
    setIsLoading(true);
    try {
      axiosClient(`services/${params.id}`)
        .then((res) => {
          axiosClient("config-services").then((resConfig) => {
            const filter = resConfig.data.find(
              (config: ConfigService) => config.name === res.data.name
            );
            setConfigService(filter);
          });
          setService(res.data);
          setServiceData((prevState) => ({
            ...prevState,
            id: res.data.id,
            price: res.data.price,
            actionDescription: res.data.actionDescription,
            name: res.data.name,
            serviceType: res.data.serviceType,
          }));
          setIsLoading(false);
        })
        .catch((e) => {
          if (e.response.data.status === 2002) {
            console.log(e);

            axiosClient(`config-services/${params.id}`)
              .then((res) => {
                setConfigService(res.data);
                setServiceData((prevState) => ({
                  ...prevState,
                  actionDescription: res.data.actionDescription,
                  name: res.data.name,
                  serviceType: res.data.serviceType,
                }));
                setIsLoading(false);
              })
              .catch((e) => {
                console.log(e);
              });
          }
        });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [params.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const numericValue = Number(value);
    if (configService) {
      if (
        name === "price" &&
        (numericValue < configService?.floorPrice ||
          numericValue > configService?.ceilPrice)
      ) {
        setIsPriceValid(true);
      } else setIsPriceValid(false);
    }

    setServiceData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    const invalidServices = childServices.filter(
      (childService) => !childService.name.trim()
    );

    if (invalidServices.length > 0) {
      toast.error("Tên công việc không được để trống. Vui lòng kiểm tra lại!");
      return;
    }

    if (isPriceValid) {
      return;
    }

    if (childServices.length < 4) {
      toast.error("Bạn phải tạo ít nhất 4 khung làm việc cho dịch vụ này");
      return;
    }

    setIsLoading(true); // Show a loading indicator while requests are in progress

    try {
      // Post the main service data
      await axiosClient.post("services", serviceData);

      // Post all child services concurrently
      const childServiceRequests = childServices.map((childService) =>
        axiosClient.post("services", childService)
      );

      // Wait for all child service requests to complete
      await Promise.all(childServiceRequests);

      // If everything is successful
      toast.success("Bạn đã tạo dịch vụ và danh sách công việc thành công");
      router.push("/sitter/setupservice");
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi tạo dịch vụ, vui lòng kiểm tra lại");
    } finally {
      setIsLoading(false); // Hide the loading indicator
    }
  };

  const handleUpdate = async () => {
    const invalidServices = childServices.filter(
      (childService) => !childService.name.trim()
    );

    if (invalidServices.length > 0) {
      toast.error("Tên công việc không được để trống. Vui lòng kiểm tra lại!");
      return;
    }

    setIsLoading(true); // Show a loading indicator
    try {
      // Separate child services by their state
      const toAdd = childServices.filter((service) => service.isNew);
      const toUpdate = childServices.filter(
        (service) => !service.isNew && !service.isDeleted
      );
      const toDelete = childServices.filter((service) => service.isDeleted);

      await axiosClient.put(`services/${serviceData.id}`, serviceData);

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

      toast.success("Cập nhật thành công!");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      if (error.response.data.status === 2014) {
        toast.error("Thời gian của công việc tối thiểu 1 giờ và tối đa 3 giờ");
      } else toast.error("Có lỗi xảy ra trong quá trình cập nhật!");
    } finally {
      fetchChildeService();
      setIsLoading(false); // Hide loading indicator
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  // const handleInputServiceChange = (
  //     id: string,
  //     field: string,
  //     value: TimeInputValue
  // ) => {
  //     // const formattedTime = `${value.hour.toString().padStart(2, '0')}:${value.minute.toString().padStart(2, '0')}`;
  //     const formattedTime = `${value.hour.toString().padStart(2, '0')}`;
  //     setChildServices((prev) =>
  //         prev.map((service) =>
  //             service.id === id ? { ...service, [field]: formattedTime } : service
  //         )
  //     );
  // };
  // const handleInputTextChange = (
  //     id: string,
  //     field: string,
  //     value: string
  // ) => {
  //     setChildServices((prev) =>
  //         prev.map((service) =>
  //             service.id === id ? { ...service, [field]: value } : service
  //         )
  //     );
  // };

  const handleInputChildChange = (
    id: string,
    field: string,
    value: TimeInputValue | string
  ) => {
    if (field === "startTime" || field === "endTime") {
      // Check if `value` is of type `TimeInputValue`
      if (typeof value === "object" && "hour" in value && "minute" in value) {
        const formattedTime = `${value.hour
          .toString()
          .padStart(2, "0")}:${value.minute.toString().padStart(2, "0")}`;

        setChildServices((prev) =>
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

    setChildServices((prev) =>
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
      serviceType: "CHILD_SERVICE",
      actionDescription: "",
      startTime: "",
      endTime: "",
      type: "",
      duration: 0,
      price: 0,
      isBasicService: false,
      isNew: true,
      isDeleted: false,
      serviceId: "",
    };

    setChildServices((prevState) => [...prevState, newService]);
  };

  //delete child Service
  const markAsDeleted = (id: string) => {
    setChildServices((prev) =>
      prev.map((service) =>
        service.id === id ? { ...service, isDeleted: true } : service
      )
    );
  };

  return (
    <div className="flex flex-col justify-center items-center my-10 text-black">
      <div className="w-[800px] flex flex-col gap-5">
        <h1 className={styles.title}>
          {service ? service?.name : configService?.name}
        </h1>
        <h2>{service?.actionDescription}</h2>
        <div className="flex bg-[#F3F5F7] p-5 rounded-2xl gap-2">
          <FontAwesomeIcon icon={faCircleInfo} />
          <h3>
            Chúng tôi đề xuất cho bạn đặt giá trung bình. Bạn có thể chỉnh sửa
            chúng ngay bây giờ hoặc bất kì lúc nào trong tương lai.
          </h3>
        </div>

        <h1 className={styles.title}>Giá cả</h1>
        <h2 className="font-semibold">Giá gốc</h2>
        <Input
          type="number"
          name="price"
          placeholder="Giá hợp lý sẽ thu hút được nhiều người hơn"
          min={configService?.floorPrice}
          max={configService?.ceilPrice}
          value={serviceData.price}
          onChange={(e) => handleInputChange(e)}
          isInvalid={isPriceValid}
          errorMessage={`Giá phải từ: ${configService?.floorPrice} đến ${configService?.ceilPrice}`}
          labelPlacement="outside"
          endContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-default-400 text-small">VND</span>
            </div>
          }
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className={styles.title}>Lịch trình chăm sóc dự kiến</h1>
            <FontAwesomeIcon
              icon={faCircleInfo}
              className="text-blue-500 cursor-pointer"
              onClick={onOpen}
              title="Xem hướng dẫn"
            />
          </div>
          <Modal isOpen={isOpen} onClose={onClose} size="3xl" closeButton>
            <ModalContent>
              <ModalHeader className="text-lg font-semibold">
                Hướng dẫn tạo lịch trình chăm sóc dự kiến
              </ModalHeader>
              <ModalBody>
                <ul className="list-disc pl-4">
                  <li>
                    Chọn giờ bắt đầu và giờ kết thúc cho từng khung công việc.
                  </li>
                  <li>
                    Thêm miêu tả cụ thể về công việc dự kiến sẽ thực hiện cho
                    mèo.
                  </li>
                  <li>
                    Bạn có thể thêm hoặc xóa các khung giờ công việc bằng nút
                    <FontAwesomeIcon icon={faPlus} /> và biểu tượng thùng rác.
                  </li>
                  <li>
                    Số lượng khung giờ tối thiểu là <b>4</b> và tối đa là{" "}
                    <b>8</b>.
                  </li>
                  <li>
                    Thời gian của một công việc tối thiểu là <b>1</b> giờ và tối
                    đa là <b>3</b> giờ.
                  </li>
                </ul>
              </ModalBody>
            </ModalContent>
          </Modal>
          <div className="flex flex-col gap-6 p-6 bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-md shadow-md my-3">
            {childServices
              .filter((childService) => !childService.isDeleted)
              .map((childService: Service) => (
                <div
                  className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-5"
                  key={childService.id}
                >
                  <div className="flex justify-center items-center gap-3">
                    <TimeInput
                      className="w-28"
                      label="Giờ bắt đầu"
                      hourCycle={24}
                      granularity="minute"
                      value={
                        new Time(
                          parseTimeString(childService.startTime).hour,
                          parseTimeString(childService.startTime).minute
                        )
                      }
                      onChange={(e) =>
                        handleInputChildChange(childService.id, "startTime", e)
                      }
                    />
                    -
                    <TimeInput
                      className="w-28"
                      label="Giờ kết thúc"
                      hourCycle={24}
                      granularity="minute"
                      value={
                        new Time(
                          parseTimeString(childService.endTime).hour,
                          parseTimeString(childService.endTime).minute
                        )
                      }
                      onChange={(e) =>
                        handleInputChildChange(childService.id, "endTime", e)
                      }
                    />
                  </div>
                  <Input
                    label="Miêu tả công việc"
                    value={childService.name}
                    onChange={(e) =>
                      handleInputChildChange(
                        childService.id,
                        "name",
                        e.target.value
                      )
                    }
                    maxLength={80}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => markAsDeleted(childService.id)}
                    className="cursor-pointer"
                  />
                </div>
              ))}
            <Button
              className="flex items-center justify-center p-4 bg-white border border-gray-200 rounded-md shadow-sm gap-2"
              onClick={addNewChildService}
            >
              <FontAwesomeIcon icon={faPlus} /> Tạo thêm khung giờ
            </Button>
          </div>
        </div>

        {service ? (
          <div className="flex justify-end">
            <Button
              onClick={() => handleUpdate()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <FontAwesomeIcon icon={faPencil} />
              Cập nhật
            </Button>
          </div>
        ) : (
          <div className="flex justify-end">
            <Button
              onClick={() => handleAdd()}
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              <FontAwesomeIcon icon={faPlus} />
              Tạo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
