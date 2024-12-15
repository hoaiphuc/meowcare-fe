"use client";

import React, { useEffect, useState } from "react";

type ServiceData = {
  date: string;
  type: "pet-boarding" | "other";
  amount: number;
};

const TAX_AND_DISCOUNT_RATE = 0.15;

const Page = () => {
  // const [services, setServices] = useState<ServiceData[]>([]);
  const [filteredServices, setFilteredServices] = useState<ServiceData[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("2024-12");
  const [summary, setSummary] = useState({
    totalServices: 0,
    petBoardingServices: 0,
    otherServices: 0,
    grossRevenue: 0,
    discountAndTax: 0,
    netIncome: 0,
  });

  // Dữ liệu giả lập từ API
  useEffect(() => {
    const data: ServiceData[] = [
      { date: "2024-11-01", type: "pet-boarding", amount: 400000 },
      { date: "2024-11-10", type: "other", amount: 150000 },
      { date: "2024-12-01", type: "pet-boarding", amount: 500000 },
      { date: "2024-12-03", type: "pet-boarding", amount: 300000 },
      { date: "2024-12-05", type: "other", amount: 200000 },
      { date: "2024-12-10", type: "other", amount: 150000 },
      { date: "2024-12-15", type: "pet-boarding", amount: 700000 },
    ];

    // setServices(data);
    filterDataByMonth(data, selectedMonth);
  }, [selectedMonth]);

  // Lọc dữ liệu theo tháng
  const filterDataByMonth = (data: ServiceData[], month: string) => {
    const filtered = data.filter((service) => service.date.startsWith(month));
    setFilteredServices(filtered);

    const totalServices = filtered.length;
    const petBoardingServices = filtered.filter(
      (item) => item.type === "pet-boarding"
    ).length;
    const otherServices = filtered.filter(
      (item) => item.type === "other"
    ).length;
    const grossRevenue = filtered.reduce((sum, item) => sum + item.amount, 0);
    const discountAndTax = grossRevenue * TAX_AND_DISCOUNT_RATE;
    const netIncome = grossRevenue - discountAndTax;

    setSummary({
      totalServices,
      petBoardingServices,
      otherServices,
      grossRevenue,
      discountAndTax,
      netIncome,
    });
  };

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
            <strong>Tổng số dịch vụ được đặt:</strong> {summary.totalServices}
          </li>
          <li>
            <strong>Tổng số dịch vụ gửi thú cưng:</strong>{" "}
            {summary.petBoardingServices}
          </li>
          <li>
            <strong>Tổng số dịch vụ khác:</strong> {summary.otherServices}
          </li>
          <li>
            <strong>Doanh số:</strong>{" "}
            <span className="text-green-600 font-bold">
              {summary.grossRevenue.toLocaleString()} VND
            </span>
          </li>
          <li>
            <strong>Chiết khấu + thuế:</strong>{" "}
            <span className="text-red-500 font-bold">
              {summary.discountAndTax.toLocaleString()} VND
            </span>
          </li>
          <li>
            <strong>Thu nhập ròng:</strong>{" "}
            <span className="text-blue-600 font-bold">
              {summary.netIncome.toLocaleString()} VND
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
              <th className="py-3 px-4 text-left">Ngày</th>
              <th className="py-3 px-4 text-left">Loại dịch vụ</th>
              <th className="py-3 px-4 text-right">Số tiền (VND)</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } border-b border-gray-200`}
                >
                  <td className="py-3 px-4">{service.date}</td>
                  <td className="py-3 px-4 capitalize">
                    {service.type === "pet-boarding"
                      ? "Gửi Thú Cưng"
                      : "Dịch Vụ Khác"}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {service.amount.toLocaleString()}
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
        </table>
      </div>
    </div>
  );
};

export default Page;
