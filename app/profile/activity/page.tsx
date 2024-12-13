'use client'

import { Button, Pagination, Skeleton } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import styles from './activity.module.css'
import { Orders, UserLocal } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { Icon } from '@iconify/react/dist/iconify.js'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus } from '@fortawesome/free-solid-svg-icons'
import { formatDate } from 'date-fns'

const Page = () => {
  const [data, setData] = useState<Orders>();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  };
  const statusColors: { [key: string]: string } = {
    AWAITING_PAYMENT: 'text-[#e67e22]', // Chờ 
    // AWAITING_CONFIRM: 'text-[#9E9E9E]', // Chờ duyệt - gray
    CONFIRMED: 'text-[#2E67D1]',        // Xác nhận - blue
    IN_PROGRESS: 'text-[#FFC107]',      // yellow
    COMPLETED: 'text-[#4CAF50]',        // Hoàn thành - green
    CANCELLED: 'text-[#DC3545]',        // Đã hủy - Red
  };

  const statusLabels: { [key: string]: string } = {
    AWAITING_PAYMENT: 'Chờ thanh toán',
    // AWAITING_CONFIRM: 'Chờ xác nhận',
    CONFIRMED: 'Đã xác nhận',
    IN_PROGRESS: 'Đang diễn ra',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
  };

  const menuItems = [
    { name: "Tất cả", status: null },
    { name: 'Chờ thanh toán', status: 'AWAITING_PAYMENT' },
    // { name: "Chờ xác nhận", status: "AWAITING_CONFIRM" },
    { name: "Đã xác nhận", status: "CONFIRMED" },
    { name: "Đang diễn ra", status: "IN_PROGRESS" },
    { name: "Đã hoàn thành", status: "COMPLETED" },
    { name: "Đã hủy", status: "CANCELLED" },
    // Add more menu items as needed
  ];
  const user: UserLocal | null = getUserFromStorage();
  const userId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // Construct the API URL dynamically based on selectedStatus
        const url = selectedStatus
          ? `booking-orders/user/status?userId=${userId}&status=${selectedStatus}&page=${page - 1}&size=10&prop=createdAt&direction=DESC`
          : `booking-orders/user/status?userId=${userId}&page=${page - 1}&size=10&prop=createdAt&direction=DESC`;

        const res = await axiosClient(url);
        setData(res.data);
        setPages(res.data.totalPages);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.log(error);

      }
    };

    fetchData();
  }, [userId, page, selectedStatus]);

  return (
    <div className="w-[891px] bg-white rounded-2xl shadow-2xl py-10">
      <div className="ml-20 w-full gap-5 flex flex-col">
        <h1 className="text-2xl font-bold">Hoạt động</h1>
        <div className="flex gap-3">
          {menuItems.map((item) => (
            <Button
              key={item.status}
              className={`${styles.button} ${selectedStatus === (item.status) ? styles.activeButton : ''}`}
              onClick={() => {
                setSelectedStatus(item.status);
                setPage(1); // Reset to page 1 when changing status
              }}
            >
              {item.name}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <div><Skeleton /></div>
        ) : (
          <div className=''>
            {
              data ? (
                data.content
                  .map((activity) => {
                    // Check if bookingDetailWithPetAndServices exists and has data
                    if (
                      activity.bookingDetailWithPetAndServices.length < 1
                    ) {
                      return null; // Skip rendering this activity
                    }

                    return (
                      <div key={activity.id} className='border w-[700px] p-3 rounded-lg flex justify-between my-3'>
                        <div>
                          <div className='flex'>
                            <Icon icon="cbi:camera-pet" className='text-[#902C6C] w-12 h-11 mr-2' />
                            <div>
                              <h2>
                                <span className={styles.title}>Dịch vụ: </span>
                                {activity.orderType === "OVERNIGHT" ? "Gửi thú cưng" : "Dịch vụ khác"}
                              </h2>
                              <h2>
                                <span className={styles.title}>Người chăm sóc: </span>
                                {activity.sitter.fullName}
                              </h2>
                              <h2>
                                <span className={styles.title}>Mèo của bạn: </span>
                                {activity.bookingDetailWithPetAndServices
                                  .filter(detail => detail.service.serviceType === "MAIN_SERVICE")
                                  .map(detail => detail.pet.petName)
                                  .join(", ") || "Không có"}
                              </h2>
                              <div className='flex items-center gap-2'>
                                <h2 className={styles.title}>Thời gian: </h2>
                                {activity.startDate && activity.endDate ? (
                                  <>
                                    {formatDate(new Date(activity.startDate), 'dd/MM/yyyy')}
                                    <FontAwesomeIcon icon={faMinus} />
                                    {formatDate(new Date(activity.endDate), 'dd/MM/yyyy')}
                                  </>
                                ) : (
                                  activity.startDate
                                    ?
                                    <span>{formatDate(new Date(activity.startDate), 'dd/MM/yyyy')}</span>
                                    :
                                    "Lỗi hiện thị ngày"
                                )}

                              </div>
                            </div>
                          </div>
                          <Button as={Link} href={`/profile/activity/detail/${activity.id}`} className='bg-btnbg text-white rounded-lg mt-3'>Theo dõi lịch</Button>
                        </div>
                        <h2 className={`${statusColors[activity.status] || 'text-black'}`}>
                          {statusLabels[activity.status] || 'Trạng thái không xác định'}
                        </h2>
                      </div>
                    );
                  })
              ) : (
                <div className='flex justify-center items-center'>
                  <h1 className=''>Hiện tại không có hoạt động nào</h1>
                </div>
              )}
            {page ? (
              <div className={pages <= 1 ? "hidden" : "flex w-full justify-center"}>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="secondary"
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            ) : (
              <div></div>
            )}
          </div>
        )
        }
      </div>
    </div >
  )
}

export default Page