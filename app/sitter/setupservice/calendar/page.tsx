"use client";

import { useEffect, useState } from "react";
import styles from "./calendar.module.css";
import { Button } from "@nextui-org/react";
import axiosClient from "@/app/lib/axiosClient";
import { UserLocal } from "@/app/constants/types/homeType";

const Calendar = () => {
  // const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [daysOfWeek, setDaysOfWeek] = useState([
    { key: "monday", name: "Thứ 2", isAvailable: true },
    { key: "tuesday", name: "Thứ 3", isAvailable: true },
    { key: "wednesday", name: "Thứ 4", isAvailable: true },
    { key: "thursday", name: "Thứ 5", isAvailable: true },
    { key: "friday", name: "Thứ 6", isAvailable: true },
    { key: "saturday", name: "Thứ 7", isAvailable: true },
    { key: "sunday", name: "Chủ nhật", isAvailable: true },
  ]);
  const [next15Days, setNext15Days] = useState<
    { date: Date; isAvailable: boolean }[]
  >([]);
  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  };
  const user: UserLocal | null = getUserFromStorage();
  const userId = user?.id;

  useEffect(() => {
    const today = new Date();
    const days = [];
    for (let i = 0; i <= 13; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      days.push({ date, isAvailable: true });
    }
    setNext15Days(days);
  }, []);

  useEffect(() => {
    try {
      axiosClient(`sitter-unavailable-dates/sitter/${userId}`);
    } catch (error) {}
  }, [userId]);

  const toggleDateAvailability = (index: number) => {
    setNext15Days((prevDays) =>
      prevDays.map((day, i) =>
        i === index ? { ...day, isAvailable: !day.isAvailable } : day
      )
    );
  };

  const handleUpdate = () => {
    try {
      const unavailable = next15Days
        .filter((day) => !day.isAvailable)
        .map((day) => day.date);
      // setUnavailableDates(unavailable);
      console.log("Unavailable Dates:", unavailable);
      // axiosClient("sitter-unavailable-dates", unavailableDates)
    } catch (error) {}
  };

  return (
    <div className="flex items-center justify-center my-10">
      <div className="w-[1000px] flex flex-col bg-white shadow-lg rounded-lg p-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-purple-700">
            Thời gian nhận đặt lịch
          </h1>
          <h2 className="text-lg text-gray-600 mt-2">
            Hãy chọn những ngày bạn không muốn nhận việc
          </h2>
        </div>
        {/* Ghi chú */}
        <div className="flex justify-center items-center mb-6 space-x-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-600">: Ngày hoạt động</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-500 rounded-full mr-2"></div>
            <span className="text-gray-600">: Ngày không hoạt động</span>
          </div>
        </div>

        {/* Days of the Week Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                {daysOfWeek.map((day) => (
                  <th
                    key={day.key}
                    className="border border-gray-300 px-4 py-2 text-center bg-gray-100 text-gray-700"
                  >
                    {day.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {next15Days.slice(0, 7).map((day, index) => (
                  <td
                    key={index}
                    className={`border border-gray-300 px-4 py-2 text-center cursor-pointer transition-all ${
                      day.isAvailable
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-red-500 hover:bg-red-400"
                    }`}
                    onClick={() => toggleDateAvailability(index)}
                  >
                    <span className="text-white font-semibold">
                      {day.date.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                {next15Days.slice(7, 14).map((day, index) => (
                  <td
                    key={index}
                    className={`border border-gray-300 px-4 py-2 text-center cursor-pointer transition-all ${
                      day.isAvailable
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-red-500 hover:bg-red-400"
                    }`}
                    onClick={() => toggleDateAvailability(index + 7)}
                  >
                    <span className="text-white font-semibold">
                      {day.date.toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6">
          <Button
            className="bg-[#902C6C] hover:bg-[#7B255E] text-white font-semibold px-6 py-3 rounded-lg transition-all"
            onClick={handleUpdate}
          >
            Cập nhật
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
