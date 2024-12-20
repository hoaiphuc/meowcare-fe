"use client";

import {
  faCat,
  faCircle,
  faFilePdf,
  faShieldCat,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Button,
  Calendar,
  DateValue,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
// import Image from 'next/image';
import React, { useEffect, useState } from "react";

import { Icon } from "@iconify/react";
import styles from "./sitterprofile.module.css";
import Link from "next/link";
import "yet-another-react-lightbox/styles.css";
import PhotoGallery from "@/app/components/PhotoGallery";
import axiosClient from "@/app/lib/axiosClient";
import { useParams } from "next/navigation";
import {
  CatSitter,
  Certificate,
  feedbackData,
  Report,
  ReportType,
  Service,
  UserLocal,
} from "@/app/constants/types/homeType";
import Loading from "@/app/components/Loading";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const IndividualMap = dynamic(() => import("@/app/components/IndividualMap"), {
  ssr: false,
});

interface Skill {
  id: number;
  skill: string;
}

const Page = () => {
  const params = useParams();
  const [sitterProfile, setSitterProfile] = useState<CatSitter | undefined>();
  const [isClicked, setIsClicked] = useState(false);
  const [isUser, setIsUser] = useState<boolean>();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [additionServices, setAdditionServices] = useState<Service[]>([]);
  const [childService, setChildService] = useState<Service[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onOpenChange: onImageOpenChange,
  } = useDisclosure();
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onOpenChange: onReportOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCancelOpen,
    onOpen: onCancelOpen,
    onOpenChange: onCancelOpenChange,
  } = useDisclosure();
  const {
    isOpen: isFeedbackOpen,
    onOpen: onFeedbackOpen,
    onOpenChange: onFeedbackOpenChange,
  } = useDisclosure();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType[]>([]);
  const [report, setReport] = useState<Report>({
    id: "",
    userId: "",
    reportTypeId: "",
    reportedUserId: "",
    reason: "",
    description: "",
  });
  const [feedback, setFeedback] = useState<feedbackData[]>([]);
  const [visibleFeedback, setVisibleFeedback] = useState<feedbackData[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

  // check user
  useEffect(() => {
    if (typeof window !== "undefined") {
      const authToken = localStorage.getItem("auth-token");
      setIsUser(Boolean(authToken));
    }
  }, []);

  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  };
  const user: UserLocal | null = getUserFromStorage();

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleImageCertificateClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    onImageOpen();
  };

  const handleClick = () => {
    setIsClicked(!isClicked); // Toggle the state
  };

  useEffect(() => {
    try {
      axiosClient(`sitter-profiles/sitter/${params.id}`)
        .then((res) => {
          if (res.data.skill) {
            const existingSkills = res.data.skill.split(";").map((skill: string, index: number) => ({
              id: index, // Assuming skills do not have unique IDs; use index as fallback
              skill,
            }));
            setSkills(existingSkills);
          }
          setSitterProfile(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, [params]);

  useEffect(() => {
    try {
      axiosClient("report-types")
        .then((res) => {
          setReportType(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sitterProfileRes,
          servicesRes,
          childServiceRes,
          additionServiceRes,
          certificateRes,
          feedbackRes,
          unavailableRes
        ] = await Promise.allSettled([
          axiosClient(`sitter-profiles/sitter/${params.id}`),
          axiosClient(
            `services/sitter/${params.id}/type?serviceType=MAIN_SERVICE&status=ACTIVE`
          ),
          axiosClient(
            `services/sitter/${params.id}/type?serviceType=CHILD_SERVICE&status=ACTIVE`
          ),
          axiosClient(
            `services/sitter/${params.id}/type?serviceType=ADDITION_SERVICE&status=ACTIVE`
          ),
          axiosClient(`certificates/user/${params.id}`),
          axiosClient(`reviews/sitter/${params.id}`),
          axiosClient(`sitter-unavailable-dates/sitter/${params.id}`),
        ]);

        // Handle sitter profile response
        if (sitterProfileRes.status === "fulfilled") {
          setSitterProfile(sitterProfileRes.value.data);
        } else {
          console.error(
            "Failed to fetch sitter profile:",
            sitterProfileRes.reason
          );
        }

        // Handle services response
        if (servicesRes.status === "fulfilled") {
          setServices(servicesRes.value.data);
        } else {
          console.error("Failed to fetch services:", servicesRes.reason);
        }

        if (childServiceRes.status === "fulfilled") {
          setChildService(childServiceRes.value.data);
        } else {
          console.error("Failed to fetch services:", childServiceRes.reason);
        }

        if (additionServiceRes.status === "fulfilled") {
          setAdditionServices(additionServiceRes.value.data);
        } else {
          console.error("Failed to fetch services:", additionServiceRes.reason);
        }

        if (certificateRes.status === "fulfilled") {
          setCertificates(certificateRes.value.data);
        } else {
          console.error("Failed to fetch services:", certificateRes.reason);
        }

        if (feedbackRes.status === "fulfilled") {
          setFeedback(feedbackRes.value.data);
          setVisibleFeedback(feedbackRes.value.data.slice(0, 4));
        } else {
          console.error("Failed to fetch services:", feedbackRes.reason);
        }

        if (unavailableRes.status === "fulfilled") {
          const unavailable = unavailableRes.value.data.map((item: { date: string }) =>
            new Date(item.date)
          );
          console.log(new Date(unavailableRes.value.data[0].date));
          setUnavailableDates(unavailable);
        } else {
          console.error("Failed to fetch unavailable dates:", unavailableRes.reason);
        }

      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (isLoading) {
    return <Loading />;
  }

  const handleReportDetailChange = (field: keyof Report, value: string) => {
    setReport((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSendReport = () => {
    if (!user || !sitterProfile) {
      toast.error("Bạn cần phải đăng nhập để báo cáo người dùng này");
      return;
    }

    if (!report.reportTypeId) {
      toast.error("Vui lòng chọn loại vi phạm");
      return;
    }

    if (!report.reason) {
      toast.error("Vui lòng nhập lí do");
      return;
    }

    if (!report.description) {
      toast.error("Vui lòng nhập nội dung vi phạm");
      return;
    }

    try {
      const finalReport = {
        ...report,
        userId: user.id, // Current user ID
        reportedUserId: sitterProfile.sitterId, // ID of the sitter being reported
      };
      axiosClient
        .post("reports", finalReport)
        .then(() => {
          toast.success("Báo cáo người dùng này thành công");
        })
        .catch(() => {
          toast.error("Đã xảy ra lỗi vui lòng thử lại sau");
        });
      setReport({
        id: "",
        userId: "",
        reportTypeId: "",
        reportedUserId: "",
        reason: "",
        description: "",
      });
      onReportOpenChange();
    } catch (error) { }
  };

  const isDateUnavailable = (date: DateValue) => {
    const dateToCheck = new Date(date.year, date.month - 1, date.day);
    return unavailableDates.some(
      (unavailableDate) =>
        unavailableDate.getFullYear() === dateToCheck.getFullYear() &&
        unavailableDate.getMonth() === dateToCheck.getMonth() &&
        unavailableDate.getDate() === dateToCheck.getDate()
    );
  };


  return (
    <div className="flex flex-cols-2 my-10 gap-10 justify-center">
      <div className="flex flex-col gap-2 w-[352px]">
        <div className="min-h-[300px]">
          <div className="flow-root">
            <Avatar
              src={sitterProfile?.avatar ?? "/User-avatar.png"}
              className="float-left h-20 w-20"
            />
          </div>
          <div className="gap-2 flex flex-col">
            <h1 className="text-[30px] font-semibold">
              {sitterProfile?.fullName}
            </h1>
            <h1 className="text-[16px] font-semibold">
              {sitterProfile?.location}
            </h1>
            <div className="flex gap-1 text-[10px] text-[#3b2f26] items-center">
              {sitterProfile && sitterProfile?.numberOfReview > 0 &&
                <>
                  <FontAwesomeIcon
                    size="xl"
                    icon={faStar}
                    className="text-[#F8B816] h-5 w-5"
                  />
                  <p className="text-[16px]">{sitterProfile?.rating ? sitterProfile.rating : "Chưa có đánh giá"}</p>
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-text size-1 self-center px-1"
                  />
                </>
              }
              <p className="text-[16px]">{sitterProfile?.numberOfReview ? sitterProfile.numberOfReview : "không có"} đánh giá</p>
            </div>
          </div>
          <div className="flex gap-3 w-full mt-7">
            <Button
              onClick={() => handleClick()}
              className="w-full rounded-full text-white bg-[#2E67D1] shadow-sm "
              isDisabled={user?.id === params.id}
            >
              <Icon
                icon="mdi:heart"
                className={`transition-colors w-10 h-10 ${isClicked ? "text-red-500  " : ""
                  }`}
              />
              <p className="text-[16px]">
                {isClicked ? "Đang yêu thích" : "Yêu thích"}
              </p>
            </Button>
          </div>
        </div>

        <div className="items-center shadow-xl p-4 border-[0.5px] rounded-md mt-20">
          <h1 className={styles.h1}>Loại dịch vụ</h1>
          <div className=" flex flex-col gap-3 my-3">
            {services &&
              services.map((ser) => (
                <div className="flex flex-col " key={ser.id}>
                  <div className="flex">
                    <Icon
                      icon="cbi:camera-pet"
                      className="text-black w-12 h-11"
                    />
                    <div className="text-secondary font-semibold">
                      <h1 className="text-text text-xl font-semibold">
                        Gửi thú cưng
                      </h1>
                      <p className={styles.p}>
                        Gửi thú cưng đến nhà người chăm sóc
                      </p>
                      <p className={styles.p}>
                        Giá{" "}
                        <span className="text-[#2B764F]">
                          {ser.price.toLocaleString("de")}đ
                        </span>{" "}
                        <span className="font-semibold">/ ngày</span>
                      </p>
                    </div>
                  </div>
                  <Button
                    as={Link}
                    href={
                      isUser
                        ? `/service/booking/${sitterProfile?.sitterId}`
                        : `/login`
                    }
                    className={styles.button}
                    isDisabled={user?.id === params.id}
                  >
                    Đặt lịch gửi thú cưng
                  </Button>
                </div>
              ))}
          </div>

          {/* other service */}
          {additionServices.length > 0 &&
            <div className="flex flex-col">
              <div className="flex">
                <Icon
                  icon="mdi:home-find-outline"
                  className="text-black w-12 h-11"
                />
                <div className="text-secondary font-semibold">
                  <h1 className="text-text text-xl font-semibold">Đặt dịch vụ</h1>
                  <p className={styles.p}>Dịch vụ chăm sóc mèo</p>
                </div>
              </div>
              <Button
                as={Link}
                href={
                  isUser
                    ? `/service/housesitting/${sitterProfile?.sitterId}`
                    : `/login`
                }
                className={styles.button}
                isDisabled={user?.id === params.id}
              >
                Đặt dịch vụ
              </Button>
            </div>
          }
          {/* Calender  */}
          <div className="w-full">
            <h1 className={styles.h1}>Thời gian làm việc</h1>
            <div className="flex justify-center">
              <Calendar
                isReadOnly
                aria-label="Date (Unavailable)"
                isDateUnavailable={isDateUnavailable}
                className=""
              />
            </div>
          </div>

          <div className="w-full">
            <h1 className={styles.h1}>Vị trí</h1>
            <h2>{sitterProfile?.location}</h2>
            <div className="w-[300px] h-[250px] flex">
              <IndividualMap
                defaultLat={sitterProfile?.latitude}
                defaultLng={sitterProfile?.longitude}
              />
            </div>
          </div>
          <div>
            {/* Chính sách hủy lịch */}
            <div className="flex text-xl gap-3 items-center py-5 ">
              <Icon icon="mdi:calendar-remove" />
              <p>Chính sách hủy lịch: </p>
              <p
                onClick={onCancelOpen}
                className="cursor-pointer font-semibold underline"
              >
                {sitterProfile?.fullRefundDay} ngày
              </p>
            </div>

            {/* Modal Chính sách hủy lịch */}
            <Modal
              isOpen={isCancelOpen}
              onOpenChange={onCancelOpenChange}
              size="md"
              closeButton
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="font-bold text-lg text-black">
                      Chính sách hủy lịch
                    </ModalHeader>
                    <ModalBody>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>
                          Hủy lịch{" "}
                          <b>trước {sitterProfile?.fullRefundDay} ngày</b> so
                          với ngày bắt đầu dịch vụ sẽ <b>không mất phí</b>.
                        </li>
                        <li>
                          Hủy lịch trong <b> ngày trước ngày bắt đầu</b> sẽ bị
                          tính phí <b>50%</b>.
                        </li>
                        <li>
                          Hủy lịch <b>vào ngày bắt đầu</b> hoặc{" "}
                          <b>sau khi dịch vụ diễn ra</b> sẽ bị tính phí{" "}
                          <b>100%</b>.
                        </li>
                      </ul>
                    </ModalBody>
                    <ModalFooter className="flex items-center justify-center">
                      <Button
                        onPress={onClose}
                        className="w-[120px] h-[40px] text-white font-semibold bg-blue-500 rounded-full hover:bg-blue-600"
                      >
                        Đóng
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          <div
            className="flex text-xl gap-3 items-center py-5 font-semibold cursor-pointer"
            onClick={onReportOpen}
          >
            <Icon icon="noto:warning" />
            <p>Báo cáo người dùng này</p>
          </div>
        </div>
      </div>

      {/* 2 */}
      <div className="w-[745px]">
        <div className="bg-transparent p-3">
          <PhotoGallery
            photos={sitterProfile?.profilePictures.filter(
              (photo) => photo.isCargoProfilePicture === false
            )}
          />
        </div>
        <div className="mt-20">
          <h1 className={styles.h1}>Giới thiệu</h1>
          <p className={styles.p}>{sitterProfile?.bio}</p>

          <h1 className={styles.h1}>Kinh nghiệm chăm sóc mèo:</h1>
          <p className={styles.p}>{sitterProfile?.experience}</p>
        </div>
        <hr className={styles.hr} />

        <div className="flex items-start justify-start gap-5">
          <div className="flex flex-col items-center justify-center">
            <h1 className={`${styles.h1} w-[170px]`}>Gửi thú cưng</h1>
            <Image
              src="/service/boarding.png"
              alt=""
              width={144}
              height={144}
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <h1 className={styles.h1}>Lịch trình chăm sóc dự kiến</h1>
            {childService &&
              childService.map((ser) => (
                <div key={ser.id} className="flex text-xl items-start gap-3">
                  <FontAwesomeIcon
                    icon={faCat}
                    className="text-xs mt-2"
                    size="2xs"
                  />
                  <div className={styles.time}>
                    {ser.startTime.split(":").slice(0, 2).join(":")} -{" "}
                    {ser.endTime.split(":").slice(0, 2).join(":")} :{" "}
                  </div>
                  <p className={styles.childService}>{ser.name}</p>
                </div>
              ))}
          </div>
        </div>
        <hr className={styles.hr} />

        {additionServices.length > 0 &&
          <div className="flex items-start justify-start gap-5">
            <div className="flex flex-col items-center justify-center">
              <h1 className={`${styles.h1} w-[170px]`}>Dịch vụ khác</h1>
              <Image src="/service/other.png" alt="" width={144} height={144} />
            </div>
            <div className="flex flex-col items-start justify-start gap-3">
              <h1 className={styles.h1}>Thông tin dịch vụ</h1>
              <div className="flex gap-x-10">
                <p className={styles.tableBlockTitle}>Tên dịch vụ</p>
                <p className={styles.tableBlockTitle}>Giá tiền</p>
                <p className={styles.tableBlockTitle}>Đơn vị</p>
              </div>
              {additionServices &&
                additionServices.map((ser) => (
                  <div
                    key={ser.id}
                    className="flex text-xl items-center justify-start"
                  >
                    <p className={styles.tableBlock}>
                      <FontAwesomeIcon
                        icon={faShieldCat}
                        size="2xs"
                        className="mr-2"
                      />
                      {ser.name}
                    </p>
                    <p className={styles.tableBlock}>
                      {ser.price.toLocaleString("de")}đ
                    </p>
                    <p className={styles.tableBlock}>1 lần</p>
                  </div>
                ))}
            </div>
          </div>
        }
        {additionServices.length > 0 && <hr className={styles.hr} />}

        {/* Feedback */}
        <h1 className={styles.h1}>Đánh giá</h1>
        {visibleFeedback.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-6">
              {visibleFeedback.map((feedback) => (
                <div
                  className="border rounded-lg p-4 shadow-md bg-white"
                  key={feedback.id}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex flex-col items-start">
                      <div className="flex gap-3 items-center">
                        <h2 className={styles.h2}>{feedback.user.fullName}</h2>
                        <div className="flex items-center">
                          <h2 className="text-[16px]">{feedback.rating}</h2>
                          <FontAwesomeIcon
                            icon={faStar}
                            className="text-[#F8B816] size-4"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 items-center mt-1">
                        {feedback.bookingOrder.orderType === "OVERNIGHT" ? (
                          <Icon
                            icon="cbi:camera-pet"
                            className="text-maincolor w-5 h-5"
                          />
                        ) : (
                          <Icon
                            icon="mdi:home-find-outline"
                            className="text-maincolor w-5 h-5"
                          />
                        )}
                        <p>
                          {feedback.bookingOrder.orderType === "OVERNIGHT"
                            ? "Gửi thú cưng"
                            : "Dịch vụ khác"}
                        </p>
                        <FontAwesomeIcon
                          icon={faCircle}
                          className="w-1 h-1 rounded-full"
                        />
                        <p>
                          {new Date(
                            feedback.bookingOrder.startDate
                          ).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <Avatar src={feedback.user.avatar} className="w-12 h-12" />
                  </div>
                  <p className={styles.p}>{feedback.comments}</p>
                </div>
              ))}
            </div>
            {feedback.length > 4 && (
              <Button
                className="mt-5 rounded-full text-white bg-[#2E67D1]"
                onClick={onFeedbackOpen}
              >
                Xem thêm
              </Button>
            )}
          </>
        ) : (
          <div>
            <p>Hiện không có đánh giá nào</p>
          </div>
        )}

        <hr className={styles.hr} />

        <h1 className={styles.h1}>Thông tin về người chăm sóc</h1>
        <h2 className="text-[18px] my-3 font-semibold">Kỹ năng</h2>
        {skills.length > 0 ?
          <div className="grid grid-cols-3 gap-3">
            {skills.map((item, index) => (
              <h3
                className="border items-center flex justify-center p-3 rounded-full border-[#666666] text-[12px]"
                key={index}
              >
                {item.skill}
              </h3>
            ))}
          </div>
          :
          <div className="text-secondary">Hiện người chăm sóc chưa cung cấp</div>
        }

        <h1 className="mt-10 text-xl font-semibold">
          An toàn, tin cậy & môi trường
        </h1>
        <p className={styles.p}>{sitterProfile?.environment}</p>
        <p className={styles.p}>
          Số lượng thú cưng có thể nhận: {sitterProfile?.maximumQuantity}
        </p>
        <div className="flex overflow-x-auto gap-2">
          {sitterProfile?.profilePictures
            .filter((photo) => photo.isCargoProfilePicture === true)
            .map((photo, index) => (
              <div
                key={index}
                className="relative w-36 h-36"
                onClick={() => handleImageClick(index)}
              >
                <Avatar
                  className="w-full h-full"
                  radius="sm"
                  src={photo.imageUrl}
                />
              </div>
            ))}
        </div>

        {/* Certificate  */}
        <h1 className="mt-10 text-xl font-semibold">Chứng chỉ</h1>
        <div className="flex overflow-x-auto gap-2">
          {certificates.map((certificate, index) => (
            <div key={index} className="relative w-36 h-36">
              {certificate.certificateType === "IMAGE" ? (
                <Avatar
                  onClick={() =>
                    handleImageCertificateClick(certificate.certificateUrl)
                  }
                  src={certificate.certificateUrl}
                  alt={`Certificate ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <div
                  onClick={() => {
                    setSelectedPdf(certificate.certificateUrl!);
                    onOpen();
                  }}
                  className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-md"
                >
                  <FontAwesomeIcon icon={faFilePdf} size="2xl" />
                  <p className="text-center text-xs mt-2">
                    {certificate.certificateName}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="5xl"
        className="z-[50] h-[800px] w-[1500px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chứng chỉ
              </ModalHeader>
              <ModalBody>
                <iframe
                  src={selectedPdf}
                  title="PDF Viewer"
                  className="h-full"
                ></iframe>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isImageOpen}
        onOpenChange={onImageOpenChange}
        size="lg"
        className="h-[800px] w-[1500px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Chứng chỉ</ModalHeader>
              <ModalBody>
                {selectedImage && (
                  <Avatar
                    src={selectedImage}
                    alt="Selected Certificate"
                    className="w-full h-auto object-contain"
                    radius="none"
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isReportOpen} onOpenChange={onReportOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-3">
                <Icon icon="noto:warning" />
                Báo cáo người dùng vi phạm
              </ModalHeader>
              <ModalBody>
                <h1>Loại vi phạm</h1>
                <Select
                  className=""
                  aria-label="report"
                  placeholder="Chọn loại report"
                  onChange={(event) =>
                    handleReportDetailChange("reportTypeId", event.target.value)
                  }
                >
                  {reportType.map((type: ReportType) => (
                    <SelectItem key={type.id}>{type.name}</SelectItem>
                  ))}
                </Select>
                <h1>Lí do</h1>
                <Input
                  value={report?.reason}
                  onChange={(e) =>
                    handleReportDetailChange("reason", e.target.value)
                  }
                />
                <h1>Nội dung vi phạm</h1>
                <Textarea
                  value={report?.description}
                  onChange={(e) =>
                    handleReportDetailChange("description", e.target.value)
                  }
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button color="primary" onPress={handleSendReport}>
                  Gửi báo cáo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* feedback  */}
      <Modal isOpen={isFeedbackOpen} onOpenChange={onFeedbackOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {feedback.map((feedback) => (
                  <div className="grid grid-cols-2 gap-5" key={feedback.id}>
                    <div className="">
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex flex-col items-start">
                          <div className="flex gap-3">
                            <h2 className={styles.h2}>
                              {feedback.user.fullName}
                            </h2>
                            <div className="flex items-center">
                              <h2 className="text-[16px]">{feedback.rating}</h2>
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-[#F8B816] size-4"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            {feedback.bookingOrder.orderType === "OVERNIGHT" ? (
                              <Icon
                                icon="cbi:camera-pet"
                                className="text-maincolor w-5 h-5"
                              />
                            ) : (
                              <Icon
                                icon="mdi:home-find-outline"
                                className="text-maincolor w-5 h-5"
                              />
                            )}
                            <p>
                              {feedback.bookingOrder.orderType === "OVERNIGHT"
                                ? "Gửi thú cưng"
                                : "Dịch vụ khác"}
                            </p>
                            <FontAwesomeIcon
                              icon={faCircle}
                              className="w-1 h-1 rounded-full"
                            />
                            <p>
                              {new Date(
                                feedback.bookingOrder.startDate
                              ).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        </div>
                        <Avatar
                          src={feedback.user.avatar}
                          className="w-12 h-12"
                        />
                      </div>
                      <div className={`${styles.h3} flex gap-2`}></div>
                      <p className={styles.p}>{feedback.comments}</p>
                    </div>
                  </div>
                ))}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={sitterProfile?.profilePictures
          .filter((photo) => photo.isCargoProfilePicture === true)
          .map((photo) => ({ src: photo.imageUrl }))}
      />
    </div>
  );
};

export default Page;
