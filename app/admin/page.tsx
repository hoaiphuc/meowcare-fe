'use client';

import { faUsersLine } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import CardChart from '../components/admin/CardChart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axiosClient from '../lib/axiosClient';
import { getFirstDateOfMonth, getLastDateOfMonth } from '../utils/date-util';

const Page = () => {
  const [totalUser, setTotalUser] = useState<number>();
  const [catOwner, setCatOwner] = useState<number>();
  const [manager, setManager] = useState<number>();
  const [sitter, setSitter] = useState<number>();
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState<number>(0);
  const [totalDiscountEarned, setTotalDiscountEarned] = useState<number>(0);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [discountData, setDiscountData] = useState<any[]>([]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // // Data giả lập (có thể thay thế bằng API)
  // const bookingData = [
  //   { month: 'Tháng 1', bookings: 150 },
  //   { month: 'Tháng 2', bookings: 200 },
  //   { month: 'Tháng 3', bookings: 180 },
  //   { month: 'Tháng 4', bookings: 220 },
  // ];

  const withdrawalData = [
    { name: 'Người chăm sóc', value: 3000 },
    { name: 'Người nuôi mèo', value: 1000 },
  ];

  // const discountData = [
  //   { name: 'Tháng 1', value: 100000 },
  //   { name: 'Tháng 2', value: 500000 },
  //   { name: 'Tháng 3', value: 300000 },
  //   { name: 'Tháng 4', value: 240000 },
  //   { name: 'Tháng 5', value: 400000 },
  //   { name: 'Tháng 6', value: 100000 },
  //   { name: 'Tháng 7', value: 50000 },
  //   { name: 'Tháng 8', value: 100000 },
  //   { name: 'Tháng 9', value: 200000 },
  //   { name: 'Tháng 10', value: 500000 },
  //   { name: 'Tháng 11', value: 300000 },
  //   { name: 'Tháng 12', value: 200000 },
  // ];

  useEffect(() => {
    try {
      // Tổng người dùng
      axiosClient('/users/count')
        .then((res: { data: React.SetStateAction<number | undefined> }) => {
          setTotalUser(res.data);
        })
        .catch(() => {});

      // Người nuôi mèo
      axiosClient(`users/count/USER`)
        .then((res: { data: React.SetStateAction<number | undefined> }) => {
          setCatOwner(res.data);
        })
        .catch((e: any) => {
          console.log(e);
        });
      // Người chăm sóc mèo
      axiosClient(`users/count/MANAGER`)
        .then((res: { data: React.SetStateAction<number | undefined> }) => {
          setManager(res.data);
        })
        .catch((e: any) => {
          console.log(e);
        });

      // Người chăm sóc mèo
      axiosClient(`users/count/SITTER`)
        .then((res: { data: React.SetStateAction<number | undefined> }) => {
          setSitter(res.data);
        })
        .catch((e: any) => {
          console.log(e);
        });

      // Thống kê rút tiền
      axiosClient('/withdrawals/total')
        .then((res: { data: React.SetStateAction<number> }) => {
          setTotalWithdrawals(res.data);
        })
        .catch(() => {});

      // Tổng số tiền chiết khấu website có được
      axiosClient('/discounts/total')
        .then((res: { data: React.SetStateAction<number> }) => {
          setTotalDiscountEarned(res.data);
        })
        .catch(() => {});
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    const fetchBookingData = async () => {
      const year = new Date().getFullYear();
      const monthlyBookingData = [];

      for (let month = 0; month < 12; month++) {
        const startDate = getFirstDateOfMonth(year, month);
        const endDate = getLastDateOfMonth(year, month);

        try {
          const res = await axiosClient.get(`/booking-orders/count`, {
            params: {
              from: startDate.toISOString(),
              to: endDate.toISOString(),
            },
          });

          console.log('booking ' + res.data);
          if (typeof res.data === 'number') {
            monthlyBookingData.push({
              month: `Tháng ${month + 1}`,
              bookings: res.data,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }

      setBookingData(monthlyBookingData);
    };

    const fetchDiscountData = async () => {
      const year = new Date().getFullYear();
      const monthlyDiscountData = [];

      for (let month = 0; month < 12; month++) {
        const startDate = getFirstDateOfMonth(year, month);
        const endDate = getLastDateOfMonth(year, month);

        try {
          const res = await axiosClient.get(`/transactions/search/total-amount`, {
            params: {
              fromTime: startDate.toISOString(),
              toTime: endDate.toISOString(),
              transactionType: 'COMMISSION',
            },
          });

          if (typeof res.data === 'number') {
            monthlyDiscountData.push({
              name: `Tháng ${month + 1}`,
              value: res.data,
            });
          } else {
            monthlyDiscountData.push({
              name: `Tháng ${month + 1}`,
              value: 0,
            });
          }
        } catch (e) {
          console.log(e);
        }
      }

      setDiscountData(monthlyDiscountData);
    };

    fetchBookingData();
    fetchDiscountData();
  }, []);

  // Tính số lượng chủ mèo
  const catOwners = totalUser && sitter ? totalUser - sitter : 0;

  useEffect(() => {
    console.log(catOwner);
    console.log(catOwners);
    console.log(totalBookings);
    console.log(totalWithdrawals);
    console.log(totalDiscountEarned);
  }, []);
  return (
    <div className="flex flex-col w-full m-10 gap-10">
      {/* Tổng quan */}
      <div className="grid grid-cols-4 gap-5">
        <CardChart
          number={totalUser || 0}
          title="Tổng người dùng"
          icon={faUsersLine}
          date="10/11/2024"
          className="bg-gradient-to-r from-indigo-500 to-blue-500"
        />
        <CardChart number={manager || 0} title="Quản lý" icon={faUsersLine} date="10/11/2024" className="bg-gradient-to-r from-red-500 to-red-300" />
        <CardChart
          number={sitter || 0}
          title="Người chăm sóc mèo"
          icon={faUsersLine}
          date="10/11/2024"
          className="bg-gradient-to-r from-lime-500 to-lime-300"
        />
        <CardChart
          number={totalUser && sitter && manager ? totalUser - sitter - manager : 0}
          title="Các chủ mèo"
          icon={faUsersLine}
          date="10/11/2024"
          className="bg-gradient-to-r from-amber-500 to-amber-300"
        />
      </div>

      {/* Biểu đồ thống kê */}
      <div className="flex flex-col gap-10 mt-10">
        {/* Tổng đặt lịch */}
        <div className="bg-white p-5 rounded-md shadow-md">
          <h2 className="font-semibold text-lg mb-5">Thống kê tổng đặt lịch</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Thống kê rút tiền */}
        <div>
          <h2 className="font-semibold text-2xl">Thống kê rút tiền</h2>
          <PieChart width={400} height={400}>
            <Pie data={withdrawalData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" label>
              {withdrawalData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        {/* Tổng số tiền chiết khấu */}
        <div>
          <h2 className="font-semibold text-2xl">Tổng số tiền chiết khấu mà website có được</h2>
          <BarChart width={1500} height={600} data={discountData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Page;
