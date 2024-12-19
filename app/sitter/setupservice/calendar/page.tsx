"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import axiosClient from "@/app/lib/axiosClient";
import { UnavailableDate, UserLocal } from "@/app/constants/types/homeType";
import { toast } from "react-toastify";

const Calendar = () => {
    const [previousUnavailableDates, setPreviousUnavailableDates] = useState<UnavailableDate[]>([]);
    const [datesByMonth, setDatesByMonth] = useState<{ month: string; dates: { date: Date; isAvailable: boolean }[] }[]>([]);
    const [currentMonthIndex, setCurrentMonthIndex] = useState(0);

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
        const groupedDates = [];

        for (let i = 0; i < 3; i++) {
            const currentDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const month = currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });

            const dates = [];
            for (
                let d = new Date(currentDate);
                d.getMonth() === currentDate.getMonth();
                d.setDate(d.getDate() + 1)
            ) {
                dates.push({ date: new Date(d), isAvailable: true });
            }

            groupedDates.push({ month, dates });
        }

        setDatesByMonth(groupedDates);

    }, []);

    useEffect(() => {
        if (userId) {
            axiosClient(`sitter-unavailable-dates/sitter/${userId}`)
                .then((res) => {
                    const fetchedUnavailableDates = res.data;
                    setPreviousUnavailableDates(fetchedUnavailableDates);

                    setDatesByMonth((prevMonths) =>
                        prevMonths.map((month) => ({
                            ...month,
                            dates: month.dates.map((day) => {
                                const isUnavailable = fetchedUnavailableDates.some(
                                    (unavailableDate: UnavailableDate) =>
                                        new Date(unavailableDate.startDate).toDateString() === day.date.toDateString()
                                );
                                return { ...day, isAvailable: !isUnavailable };
                            }),
                        }))
                    );
                })
                .catch((error) => {
                    console.error("Error fetching unavailable dates:", error);
                });
        }
    }, [userId]);

    const toggleDateAvailability = (monthIndex: number, dateIndex: number) => {
        setDatesByMonth((prevMonths) =>
            prevMonths.map((month, i) =>
                i === monthIndex
                    ? {
                        ...month,
                        dates: month.dates.map((day, j) =>
                            j === dateIndex ? { ...day, isAvailable: !day.isAvailable } : day
                        ),
                    }
                    : month
            )
        );
    };

    const handleUpdate = async () => {
        try {
            const toAdd: { date: Date; isAvailable: boolean }[] = [];
            const toDelete: UnavailableDate[] = [];

            datesByMonth.forEach((month) => {
                month.dates.forEach((day) => {
                    const isPreviouslyUnavailable = previousUnavailableDates.some(
                        (prev) =>
                            new Date(prev.startDate).toDateString() === day.date.toDateString()
                    );

                    if (!day.isAvailable && !isPreviouslyUnavailable) {
                        toAdd.push(day);
                    }

                    if (day.isAvailable && isPreviouslyUnavailable) {
                        const matched = previousUnavailableDates.find(
                            (prev) =>
                                new Date(prev.startDate).toDateString() ===
                                day.date.toDateString()
                        );
                        if (matched) toDelete.push(matched);
                    }
                });
            });

            const deletePromises = toDelete.map((date) =>
                axiosClient.delete(`sitter-unavailable-dates/${date.id}`)
            );
            const addPromises = toAdd.map((day) =>
                axiosClient.post("sitter-unavailable-dates", {
                    startDate: day.date.toISOString(),
                    endDate: day.date.toISOString(),
                    dayOfWeek: "",
                    isRecurring: false,
                })
            );

            const results = await Promise.allSettled([...deletePromises, ...addPromises]);

            const successCount = results.filter((result) => result.status === "fulfilled").length;
            const failureCount = results.filter((result) => result.status === "rejected").length;

            if (failureCount === 0) {
                toast.success("Cập nhật thành công");
            } else if (successCount > 0) {
                toast.warning(`${successCount} yêu cầu thành công, ${failureCount} yêu cầu thất bại`);
            } else {
                toast.error("Cập nhật thất bại hoàn toàn");
            }
        } catch (error) {
            console.error("An unexpected error occurred during update:", error);
            toast.error("Cập nhật thất bại");
        }
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
                <div className="flex justify-between mb-6">
                    <Button
                        disabled={currentMonthIndex === 0}
                        onClick={() => setCurrentMonthIndex((prev) => prev - 1)}
                    >
                        Tháng trước
                    </Button>
                    <h2 className="text-xl font-semibold">
                        {datesByMonth[currentMonthIndex]?.month}
                    </h2>
                    <Button
                        disabled={currentMonthIndex === datesByMonth.length - 1}
                        onClick={() => setCurrentMonthIndex((prev) => prev + 1)}
                    >
                        Tháng sau
                    </Button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {datesByMonth[currentMonthIndex]?.dates.map((day, index) => (
                        <div
                            key={index}
                            className={`w-[130px] h-[70px] flex justify-center items-center cursor-pointer ${day.isAvailable ? "bg-green-500" : "bg-red-500"
                                }`}
                            onClick={() => toggleDateAvailability(currentMonthIndex, index)}
                        >
                            <p className="text-white font-semibold">
                                {day.date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-5">
                    <Button onClick={handleUpdate} className="bg-cyan-500 text-white">
                        Cập nhật
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
