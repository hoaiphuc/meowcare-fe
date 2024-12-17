'use client'

import { showConfirmationDialog } from '@/app/components/confirmationDialog'
import axiosClient from '@/app/lib/axiosClient'
import { Button } from '@nextui-org/react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'react-toastify'

const Confirm = () => {
    const params = useParams()
    const router = useRouter()

    //accept request
    const handleAccept = async () => {
        try {
            axiosClient.put(`booking-orders/status/${params.id}?status=COMPLETED`)
                .then(() => {
                    toast.success('Bạn đã chấp nhận yêu cầu này, vui lòng chăm sóc theo lịch')
                    router.push(`sitter/managebooking`)
                })
                .catch(async (e) => {
                    if (e.response.data.status === 2013) {
                        const isConfirmed = await showConfirmationDialog({
                            title: "Bạn không đủ tiền trả cho phí giao dịch, bạn có muốn nạp ngay bây giờ không?",
                            confirmButtonText: "Có, chắc chắn",
                            denyButtonText: "Không",
                            confirmButtonColor: "#00BB00",
                        });
                        if (isConfirmed) {
                            router.push("/profile/wallet")
                        } else {
                            return;
                        }

                    }
                    toast.error('Có lỗi xảy ra vui lòng thử lại sau')
                })
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <div>
            Xác nhận hoàn thành dịch vụ
            <Button onClick={handleAccept}>Xác nhận hoàn thành</Button>
        </div>
    )
}

export default Confirm