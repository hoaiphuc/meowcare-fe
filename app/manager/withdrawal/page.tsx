"use client";

import { RequestWithdrawal } from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<RequestWithdrawal[]>([]);
  const rowsPerPage = 10;

  // const statusColors: { [key: string]: string } = {
  //   PENDING: "text-[#9E9E9E]", // Chờ duyệt - gray
  //   COMPLETED: "text-[#4CAF50]", // Hoàn thành - green
  //   FAILED: "text-[#DC3545]", // Đã hủy - Red
  // };

  // const statusLabels: { [key: string]: string } = {
  //   PENDING: "Chờ thanh toán",
  //   COMPLETED: "Giao dịch thành công",
  //   FAILED: "Giao dịch thất bại",
  // };

  useEffect(() => {
    try {
      axiosClient("request-withdrawal/getAllRequests")
        .then((res) => {
          setData(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const pages = Math.ceil(data.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.slice(start, end);
  }, [page, data]);

  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Yêu cầu rút tiền</h1>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            {
              items.length > 10 &&
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            }
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">Người yêu cầu</TableColumn>
          <TableColumn key="bankName">Tên ngân hàng</TableColumn>
          <TableColumn key="bankNumber">Số tài khoản</TableColumn>
          <TableColumn key="date">Ngày thực hiện</TableColumn>
          <TableColumn key="role">Số tiền</TableColumn>
          <TableColumn key="status">Trạng thái</TableColumn>
          <TableColumn key="hoat">Hành đồng</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(request) => (
            <TableRow key={request.id}>
              <TableCell>{request.fullName}</TableCell>
              <TableCell>{request.bankName}</TableCell>
              <TableCell>{request.bankNumber}</TableCell>
              <TableCell>
                {format(new Date(request.createAt), "HH:mm | dd/MM/yyyy")}
              </TableCell>
              <TableCell>
                {request.balance.toLocaleString("de-DE")}đ
              </TableCell>
              <TableCell >
                {request.processStatus}
              </TableCell>
              <TableCell >
                <Button>Chi tiết</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
