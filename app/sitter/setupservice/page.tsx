"use client";

import Loading from "@/app/components/Loading";
import {
  CatSitter,
  ConfigService,
  Service
} from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { fetchUserProfile } from "@/app/lib/slices/userSlice";
import {
  faCalendarDays,
  faCheck,
  faChevronRight,
  faCircle,
  faEye,
  faLock,
  faRectangleList,
  faStarHalfStroke,
  faUnlock,
  faUsers,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./setupservice.module.css";

const Page = () => {
  const router = useRouter();
  const [services, setServices] = useState<ConfigService[]>([]);
  const [createdServices, setCreatedServices] = useState<Service[]>([]);
  const dispatch = useAppDispatch();
  const { userProfile } = useAppSelector((state) => state.user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [sitterProfile, setSitterProfile] = useState<CatSitter>();
  const [sitterStatus, setSitterStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const statusColors: { [key: string]: string } = {
    ACTIVE: "text-[#4CAF50]", // Hoàn thành - green
    INACTIVE: "text-[#DC3545]", // Đã hủy - Red
  };

  const statusLabels: { [key: string]: string } = {
    ACTIVE: "ĐANG HOẠT ĐỘNG",
    INACTIVE: "KHÔNG HOẠT ĐỘNG",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sitterProfileRes, servicesRes, configServicesRes] =
          await Promise.allSettled([
            axiosClient(`sitter-profiles/sitter/${userProfile?.id}`),
            axiosClient(`services/sitter/${userProfile?.id}`),
            axiosClient("config-services"),
          ]);

        // Handle config services response
        if (configServicesRes.status === "fulfilled") {
          console.log(configServicesRes);

          setServices(configServicesRes.value.data);
        } else {
          console.error(
            "Failed to fetch config services:",
            configServicesRes.reason
          );
        }

        // Handle sitter profile response
        if (sitterProfileRes.status === "fulfilled") {
          setSitterProfile(sitterProfileRes.value.data);
          setSitterStatus(sitterProfileRes.value.data.status);
        } else {
          console.error(
            "Failed to fetch sitter profile:",
            sitterProfileRes.reason
          );
        }

        // Handle services response
        if (servicesRes.status === "fulfilled") {
          setCreatedServices(servicesRes.value.data);
        } else {
          console.error("Failed to fetch services:", servicesRes.reason);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("auth-token")) {
        return;
      }
    }
    if (!userProfile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, userProfile]);

  if (isLoading) {
    return <Loading />;
  }

  //Change status
  const handleChangeStatus = () => {
    if (!sitterStatus) {
      toast.error("Bạn cần thêm thông tin cơ bản trước");
      return;
    }

    if (!sitterProfile) {
      toast.error("Sitter profile is undefined");
      return;
    }

    const newStatus = sitterStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      axiosClient
        .put(`sitter-profiles/status/${sitterProfile.id}?status=${newStatus}`)
        .then(() => {
          setSitterProfile({
            ...sitterProfile,
            status: newStatus,
          });
          setSitterStatus(newStatus);
          toast.success(
            `Trạng thái đã được cập nhật thành ${newStatus === "ACTIVE" ? "Đang hoạt động" : "Đang ngoại tuyến"
            }`
          );
          onOpenChange();
        })
        .catch(() => {
          toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        });
    } catch (error) { }
  };

  const handleViewProfile = () => {
    if (!sitterStatus) {
      toast.error("Bạn cần thêm thông tin cơ bản trước");
      return;
    }
    router.push(`/service/sitterprofile/${userProfile?.id}`)

  }

  return (
    <div className="flex flex-col justify-center items-center text-black my-10">
      <div className="w-[600px]">
        <div className="flex gap-5">
          <Avatar
            src={
              userProfile?.avatar &&
                (userProfile.avatar.startsWith("http://") ||
                  userProfile.avatar.startsWith("https://") ||
                  userProfile.avatar.startsWith("/"))
                ? userProfile.avatar
                : "/User-avatar.png"
            }
            alt=""
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-3xl font-semibold">
              Chào mừng, {userProfile?.fullName}
            </h1>
            <Button onClick={onOpen} variant="bordered">
              <h1
                className={
                  sitterProfile?.status
                    ? statusColors[sitterProfile.status]
                    : "text-[#DC3545]"
                }
              >
                <FontAwesomeIcon icon={faCircle} className="mr-1" />
                {sitterProfile
                  ? statusLabels[sitterProfile.status]
                  : "Đang ngoại tuyến"}
              </h1>
            </Button>
          </div>
        </div>
        {/* Profile */}
        <div className="my-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Cài đặt hồ sơ
          </h1>
          <div className="flex flex-col gap-5">
            {/* Basic Information Button */}
            <Link
              href={
                sitterProfile
                  ? "/sitter/setupservice/info"
                  : "/sitter/setupservice/createinfo"
              }
              className="flex items-center justify-between px-6 py-4 bg-maincolor text-white rounded-lg shadow-md hover:bg-maincolor-dark transition-all"
            >
              <div className="flex items-center gap-3">
                {sitterProfile ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="text-green-400"
                    size="lg"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="text-red-400"
                    size="lg"
                  />
                )}
                <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-white" />
            </Link>

            {/* Work Schedule Button */}
            <Link
              href="/sitter/setupservice/calendar"
              className="flex items-center justify-between px-6 py-4 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  className=""
                  size="lg"
                />
                <h3 className="text-lg font-medium">Lịch làm việc</h3>
              </div>
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-600" />
            </Link>
          </div>
        </div>

        <div className="mt-10">
          <h1 className={styles.h1}>Cài đặt loại dịch vụ</h1>
          <div className="flex flex-col gap-5">
            {services
              .filter((service) => service.serviceType === "MAIN_SERVICE")
              .map((service) => {
                const createdService = createdServices.find(
                  (createdService) => createdService.name === service.name
                );
                const isActivated = Boolean(createdService);
                // Use the id from createdService if it exists, otherwise fallback to service.id
                const idToUse = createdService ? createdService.id : service.id;

                return (
                  <div
                    key={service.id}
                    className="flex justify-between py-4 border-b cursor-pointer"
                    onClick={(e) => {
                      if (!sitterProfile) {
                        e.preventDefault(); // Prevent the default navigation behavior
                        toast.error("Bạn cần tạo hồ sơ trước");
                      } else {
                        // Navigate to the link
                        router.push(`/sitter/servicedetail/${idToUse}`);
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      <Icon
                        icon="cbi:camera-pet"
                        className="text-[#902C6C] w-12 h-11 mr-2"
                      />
                      <div>
                        <h2 className={styles.h2}>{service.name}</h2>
                        {isActivated ? (
                          <h2 className="text-green-500">Đã kích hoạt</h2>
                        ) : (
                          <h2 className="text-[#A46950]">Chưa kích hoạt</h2>
                        )}
                      </div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                );
              })}
            <div
              className="flex justify-between border-b py-4 cursor-pointer"
              onClick={(e) => {
                if (!sitterProfile) {
                  e.preventDefault(); // Prevent the default navigation behavior
                  toast.error("Bạn cần tạo hồ sơ trước");
                } else {
                  // Navigate to the link
                  router.push(`/sitter/otherservice`);
                }
              }}
            >
              <div className="flex gap-3">
                <Icon
                  icon="mdi:home-find-outline"
                  className="text-[#902C6C] w-12 h-11 mr-2"
                />
                <div>
                  <h2 className={styles.h2}>Dịch vụ khác</h2>
                </div>
              </div>
              <FontAwesomeIcon icon={faChevronRight} />
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {() => (
            <>
              <ModalBody className="p-0">
                <div>
                  <div className={styles.headerModal}>
                    <Avatar src={userProfile?.avatar} className="w-20 h-20" />
                  </div>
                  <div className="px-10">
                    <div>
                      <h1 className="flex gap-2 text-2xl font-semibold">
                        Dịch vụ của bạn đang
                        <h1 className={statusColors[sitterProfile ? sitterProfile.status : "text-black"]}>{sitterProfile ? statusLabels[sitterProfile.status] : "Đang ngoại tuyến"}</h1>
                      </h1>
                      <h2 className="mb-4">
                        Mở hoạt động để mọi người có thể tìm thấy dịch vụ của
                        bạn
                      </h2>
                      <div className="flex justify-center items-center gap-32">
                        <div className="flex flex-col justify-center items-center gap-2">
                          <Button
                            className={styles.modalButton}
                            onClick={() => handleViewProfile()}
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              size="2x"
                              className="cursor-pointer p-0"
                            />
                          </Button>
                          <p className="text-[16px] font-semibold">Xem hồ sơ</p>
                        </div>
                        {sitterProfile?.status === "INACTIVE" ?
                          <div className="flex flex-col justify-center items-center gap-2">
                            <Button
                              className={styles.modalButton}
                              onClick={handleChangeStatus}
                            >
                              <FontAwesomeIcon
                                icon={faUnlock}
                                size="2x"
                                className="cursor-pointer"
                              />
                            </Button>
                            <p className="text-[16px] font-semibold">
                              Mở hoạt động
                            </p>
                          </div>
                          :
                          <div className="flex flex-col justify-center items-center gap-2">
                            <Button
                              className={styles.modalButton}
                              onClick={handleChangeStatus}
                            >
                              <FontAwesomeIcon
                                icon={faLock}
                                size="2x"
                                className="cursor-pointer"
                              />
                            </Button>
                            <p className="text-[16px] font-semibold">
                              Đóng hoạt động
                            </p>
                          </div>
                        }
                      </div>
                      <hr className="my-10" />
                      <div className="flex flex-col gap-3">
                        <div className="flex gap-3 items-center">
                          <FontAwesomeIcon icon={faUsers} size="2x" />
                          <p className={styles.modalList}>
                            Mọi người có thể tìm và xem dịch của bạn
                          </p>
                        </div>
                        <div className="flex gap-3 items-center">
                          <FontAwesomeIcon icon={faRectangleList} size="2x" />
                          <p className={styles.modalList}>
                            Mọi người có thể tìm và đặt dịch vụ của bạn
                          </p>
                        </div>
                        <div className="flex gap-3 items-center">
                          <FontAwesomeIcon icon={faStarHalfStroke} size="2x" />
                          <p className={styles.modalList}>
                            Mọi người xem và đánh giá dịch vụ
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div >
  );
};

export default Page;
