'use client'

import { Feedback, Order } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { faCalendarCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Textarea } from '@nextui-org/react';
import { Rating } from '@smastrom/react-rating';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import '@smastrom/react-rating/style.css';
import { toast } from 'react-toastify';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { showConfirmationDialog } from '@/app/components/confirmationDialog';

const Page = () => {
    const param = useParams();
    const router = useRouter()
    const [data, setData] = useState<Order>();
    const [feedback, setFeedback] = useState<Feedback>({
        id: "",
        comments: '',
        rating: 0,
        userId: "",
        bookingOrderId: ""
    });
    const [hasFeedback, setHasFeedback] = useState(false);

    const statusIconColor: { [key: string]: string } = {
        COMPLETED: "text-green-400",
        CANCELLED: "text-yellow-400",
        CONFIRMED: "text-[#2E67D1]",
    };

    const statusIcon: { [key: string]: IconProp } = {
        COMPLETED: faCircleCheck,
        CANCELLED: faTriangleExclamation,
        CONFIRMED: faCalendarCheck,
    };

    const statusLabels: { [key: string]: string } = {
        COMPLETED: "Dịch vụ này đã hoàn thành",
        CANCELLED: "Yêu cầu này đã bị hủy",
        CONFIRMED: "Yêu cầu này đã được xác nhận",
    };

    useEffect(() => {
        try {
            axiosClient(`booking-orders/${param.id}`)
                .then((res) => {
                    setData(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
            axiosClient(`reviews/booking-order/${param.id}`)
                .then((res) => {
                    const responseData = res.data[0]; // Extract the first feedback item
                    if (responseData) {
                        setFeedback({
                            id: responseData.id,
                            comments: responseData.comments,
                            rating: responseData.rating,
                            userId: responseData.user.id,
                            bookingOrderId: responseData.bookingOrder.id,
                        });
                        setHasFeedback(true); // Set to true if feedback exists
                    } else {
                        setHasFeedback(false); // No feedback found
                    }
                })
                .catch((e) => {
                    console.error("Error fetching feedback:", e);
                    setHasFeedback(false); // Handle failure
                });
        } catch (error) {
            console.log(error);
        }
    }, [param.id])

    const handleInputChange = (field: string, value: string | number) => {
        setFeedback((prevFeedback) => ({
            ...prevFeedback,
            [field]: value,
        }));
    }

    const handleRatingSubmit = () => {
        if (!feedback) {
            alert('Vui lòng đánh giá bằng sao');
            return;
        }

        const ratingData = {
            ...feedback,
            userId: data?.user.id,
            bookingOrderId: data?.id

        };

        axiosClient.post('/reviews', ratingData)
            .then(() => {
                toast.success("Đánh giá thành công")
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau")
            });
    };

    const handleFeedbackUpdate = () => {
        if (!feedback) {
            toast.error("Vui lòng đánh giá bằng sao");
            return;
        }

        axiosClient
            .put(`/reviews/${feedback.id}`, feedback) // Use PUT for update
            .then(() => {
                toast.success("Cập nhật đánh giá thành công!");
            })
            .catch(() => {
                toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
            });
    };

    const handleCancel = async () => {
        try {
            const isConfirmed = await showConfirmationDialog({
                title: "Bạn có muốn hủy dịch vụ này",
                confirmButtonText: "Có, chắc chắn",
                denyButtonText: "Không",
                confirmButtonColor: "#00BB00",
            });
            if (isConfirmed) {
                axiosClient(`booking-orders/status/${param.id}?status=CANCELLED`)
                    .then(() => {
                        router.push("/profile/activity")
                    })
                    .catch(() => {
                        toast.error("Lỗi mạng")
                    })

            } else {
                return
            }
        } catch (error) {
            toast.error("Lỗi mạng")
        }
    }

    return (
        <div className='flex justify-center items-start w-[891px]'>
            {data &&
                <div key={data.id} className='flex flex-col gap-5 w-full'>
                    <div className='flex flex-col gap-5'>
                        <div className='bg-white rounded-md shadow-xl flex justify-center items-center'>
                            <FontAwesomeIcon icon={statusIcon[data.status]} size='2xl' className={statusIconColor[data.status]} />
                            <h1 className='text-black p-5 text-2xl font-semibold'>{statusLabels[data.status]}</h1>
                        </div>
                        <div className='bg-[#FFE3D5] text-black p-5 py-10 rounded-md shadow-xl font-medium flex items-start justify-between gap-3'>
                            <div className='flex flex-col gap-3'>
                                <div>
                                    <h1 className='font-semibold text-xl'>Người chăm sóc</h1>
                                    <h1>{data.sitter.fullName}</h1>
                                </div>
                                <div>
                                    <h1 className='font-semibold text-xl'>{data.orderType === "OVERNIGHT" ? "Gửi thú cưng" : "Dịch vụ khác"}</h1>
                                    <h1>15 tháng 10 - 16 tháng 10</h1>
                                    <h1>Bé mèo: {data.bookingDetailWithPetAndServices[0].pet.petName}</h1>
                                </div>
                            </div>

                            <div className='bg-white rounded-md text-black p-5 w-96'>
                                <h1>Bé mèo</h1>
                                <hr className='my-2' />
                                <div className='flex justify-between'>
                                    <div>
                                        <h1 className='text-lg'>{data.bookingDetailWithPetAndServices[0].pet.petName}</h1>
                                    </div>
                                </div>
                                <hr className='my-2' />
                                <div className='flex justify-between'>
                                    <h1>Tổng tiền:</h1>
                                    <h1>{typeof data.totalAmount === "number" ? data.totalAmount.toLocaleString() : 0}đ</h1>
                                </div>
                            </div>
                            {data.status === "CONFIRMED" &&
                                <div>
                                    <Button onClick={handleCancel}>Hủy dịch vụ</Button>
                                </div>
                            }
                        </div>
                    </div>
                    {data.status === "COMPLETED" &&
                        <div className=' flex flex-col gap-3 w-full'>
                            <div className='bg-white h-full shadow-2xl rounded-md p-5'>
                                <h1 className='font-semibold text-2xl my-3'>Đánh giá dịch vụ</h1>
                                <div className='bg-from-[#d8ab95] bg-gradient-to-r from-[#fab1a0] to-blue-[#FFE3D5] p-3 rounded-xl'>
                                    <Rating value={feedback.rating} onChange={(e: number) => handleInputChange("rating", e)} />

                                    <Textarea
                                        className='bg-white rounded-xl'
                                        variant='bordered'
                                        value={feedback.comments}
                                        maxLength={500}
                                        placeholder={`Đánh giá dịch vụ của ${data.sitter.fullName}`}
                                        onChange={(e) => handleInputChange("comments", e.target.value)}
                                    />
                                    <div className='flex justify-end mt-3 mb-5'>
                                        {hasFeedback ? (
                                            <Button
                                                className="bg-btnbg rounded-full text-white text-xl"
                                                onClick={handleFeedbackUpdate} // Call update API
                                            >
                                                Cập nhật
                                            </Button>
                                        ) : (
                                            <Button
                                                className="bg-btnbg rounded-full text-white text-xl"
                                                onClick={handleRatingSubmit} // Call submit API
                                            >
                                                Đánh giá
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>

            }
        </div >
    )
}
export default Page