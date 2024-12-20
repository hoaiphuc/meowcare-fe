"use client";

import Loading from "@/app/components/Loading";
import { Orders } from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import { useAppSelector } from "@/app/lib/hooks";
import { Pagination } from "@nextui-org/react";
import { formatDate } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>("2024-12");
  const [isLoading, setIsLoading] = useState(true);
  const { userProfile } = useAppSelector((state) => state.user);
  const [allService, setAllService] = useState<number>(0)
  const [overNight, setOverNight] = useState<number>(0)
  const [buyService, setBuyService] = useState<number>(0)
  const [totalMoney, setTotalMoney] = useState<number>(0)
  const [commission, setCommission] = useState<number>(0)
  const [booking, setBooking] = useState<Orders>()
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  useEffect(() => {
    const fetchData = async () => {

      if (!userProfile?.id) {
        // If userProfile.id is undefined, exit early
        console.warn("UserProfile ID is undefined. Skipping API calls.");
        return;
      }

      try {
        const [allServiceRes, overNightRes, buyServiceRes, totalMoneyRes, commissionRes, bookingRes] =
          await Promise.allSettled([
            axiosClient(`booking-orders/count-by-sitter?id=${userProfile?.id}&status=COMPLETED`),
            axiosClient(`booking-orders/count-by-sitter?id=${userProfile?.id}&status=COMPLETED&orderType=OVERNIGHT`),
            axiosClient(`booking-orders/count-by-sitter?id=${userProfile?.id}&status=COMPLETED&orderType=BUY_SERVICE`),
            axiosClient(`booking-orders/total-amount?sitterId=${userProfile?.id}&status=COMPLETED`),
            axiosClient(`transactions/search/total-amount?userId=${userProfile?.id}&transactionType=COMMISSION`),
            axiosClient(`booking-orders/sitter/status?sitterId=${userProfile?.id}&status=COMPLETED&page=0&size=10&prop=createdAt&direction=DESC`),
          ]);

        // Handle config services response
        if (allServiceRes.status === "fulfilled") {
          setAllService(allServiceRes.value.data || 0);

        } else {
          console.error(
            "Failed to fetch config services:",
            allServiceRes.reason
          );
        }

        // Handle sitter profile response
        if (overNightRes.status === "fulfilled") {
          setOverNight(overNightRes.value.data);
        } else {
          console.error(
            "Failed to fetch sitter profile:",
            overNightRes.reason
          );
        }

        // Handle services response
        if (buyServiceRes.status === "fulfilled") {
          setBuyService(buyServiceRes.value.data || 0);
        } else {
          console.error("Failed to fetch services:", buyServiceRes.reason);
        }

        if (totalMoneyRes.status === "fulfilled") {
          setTotalMoney(totalMoneyRes.value.data || 0);
        } else {
          console.error("Failed to fetch services:", totalMoneyRes.reason);
        }

        if (commissionRes.status === "fulfilled") {
          setCommission(commissionRes.value.data || 0);
        } else {
          console.error("Failed to fetch services:", commissionRes.reason);
        }

        if (bookingRes.status === "fulfilled") {
          setBooking(bookingRes.value.data);
          console.log(bookingRes.value.data);

          setPages(bookingRes.value.data.page.totalPages)
        } else {
          console.error("Failed to fetch services:", bookingRes.reason);
        }

      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userProfile?.id]);

  const netIncome = useMemo(() => {
    const money = totalMoney - commission
    return isNaN(money) || !isFinite(money) ? 0 : money;
  }, [commission, totalMoney])

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      {/* Chọn tháng */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gradient bg-gradient-to-r from-indigo-500 to-pink-500 text-transparent bg-clip-text">
          Thống kê thu nhập
        </h1>
        <div>
          <label className="mr-2 font-semibold text-gray-700">
            Chọn tháng:
          </label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 text-gray-700"
          />
        </div>
      </div>

      {/* Tổng hợp */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Tổng hợp:</h2>
        <ul className="space-y-3 text-gray-700">
          <li>
            <strong>Tổng số dịch vụ được đặt:</strong>{" "}
            {typeof allService === "number" ? allService.toLocaleString() : 0}
          </li>
          <li>
            <strong>Tổng số dịch vụ gửi thú cưng:</strong>{" "}
            {typeof overNight === "number" ? overNight.toLocaleString() : 0}
          </li>
          <li>
            <strong>Tổng số dịch vụ khác:</strong>{" "}
            {typeof buyService === "number" ? buyService.toLocaleString() : 0}

          </li>
          <li>
            <strong>Doanh số:</strong>{" "}
            <span className="text-green-600 font-bold">
              {typeof totalMoney === "number" ? totalMoney.toLocaleString("de") : 0} VND
            </span>
          </li>
          <li>
            <strong>Chiết khấu + thuế:</strong>{" "}
            <span className="text-red-500 font-bold">
              {typeof commission === "number" ? commission.toLocaleString() : 0} VND
            </span>
          </li>
          <li>
            <strong>Thu nhập ròng:</strong>{" "}
            <span className="text-blue-600 font-bold">
              {typeof netIncome === "number" ? netIncome.toLocaleString() : 0} VND
            </span>
          </li>
        </ul>
      </div>

      {/* Chi tiết dịch vụ */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Chi tiết dịch vụ:
        </h2>
        <table className="w-full border-collapse border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
              <th className="py-3 px-4 text-left">Ngày bắt đầu</th>
              <th className="py-3 px-4 text-left">Ngày kết thúc</th>
              <th className="py-3 px-4 text-left">Loại dịch vụ</th>
              <th className="py-3 px-4 text-right">Số tiền (VND)</th>
            </tr>
          </thead>
          <tbody>
            {booking?.content ? (
              booking.content.map((booking, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b border-gray-200`}
                >
                  <td className="py-3 px-4">{formatDate(new Date(booking.startDate), "dd/MM/yyyy")}</td>
                  <td className="py-3 px-4">{booking.endDate ? formatDate(new Date(booking.endDate), "dd/MM/yyyy") : formatDate(new Date(booking.startDate), "dd/MM/yyyy")}</td>
                  <td className="py-3 px-4 capitalize">
                    {booking.orderType === "OVERNIGHT"
                      ? "Gửi Thú Cưng"
                      : "Dịch Vụ Khác"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {typeof booking.totalAmount === "number" ? booking.totalAmount.toLocaleString() : 0} VND

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-3 px-4 text-center text-gray-500">
                  Không có dịch vụ nào trong tháng này.
                </td>
              </tr>
            )}
          </tbody>
          {pages > 10 && (
            <div className="flex w-full justify-center">
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
          )}
        </table>
      </div>
    </div>
  );
};

export default Page;
