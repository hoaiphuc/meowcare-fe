"use client";

import { Order } from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";

const Page = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Order[]>([]);
  const [pages, setPages] = useState(1);

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
  const bookingColors: { [key: string]: string } = {
    OVERNIGHT: "text-maincolor",
    BUY_SERVICE: "Dịch vụ khác",
  };

  const bookingLabels: { [key: string]: string } = {
    OVERNIGHT: "Gửi thú cưng",
    BUY_SERVICE: "Dịch vụ khác",
  };

  const fetchForm = useCallback(() => {
    try {
      axiosClient(`booking-orders/pagination?page=${page}&size=10&sort=createdAt&direction=DESC`)
        .then((res) => {
          setData(res.data.content);
          setPages(res.data.page.totalPages)
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Quản lý đặt lịch</h1>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          pages > 10 &&
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
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">Người thực hiện</TableColumn>
          <TableColumn key="role">Loại dịch vụ</TableColumn>
          <TableColumn key="role">Trạng thái</TableColumn>
          <TableColumn key="status">Hành động</TableColumn>
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell className={bookingColors[item.orderType]}>
                {bookingLabels[item.orderType]}
              </TableCell>
              <TableCell className={statusColors[item.status]}>
                {statusLabels[item.status]}
              </TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button variant="bordered">
                      <FontAwesomeIcon icon={faBars} />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Example with disabled actions">
                    <DropdownItem>
                      Xem chi tiết
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
