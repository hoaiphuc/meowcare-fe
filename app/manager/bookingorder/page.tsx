"use client";

import { FormRegister } from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import { faBars, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<FormRegister[]>([]);
  const rowsPerPage = 10;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isOpenCer,
    onOpen: onOpenCer,
    onOpenChange: onOpenChangeCer,
  } = useDisclosure();
  const [selectedForm, setSelectedForm] = useState<FormRegister>();
  const [selectedPdf, setSelectedPdf] = useState<string>();

  const statusColors: { [key: string]: string } = {
    PENDING: "text-[#9E9E9E]", // Chờ duyệt - gray
    APPROVED: "text-[#4CAF50]", // Hoàn thành - green
    REJECTED: "text-[#DC3545]", // Đã hủy - Red
  };

  const statusLabels: { [key: string]: string } = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Đã từ chối",
  };

  const fetchForm = useCallback(() => {
    try {
      axiosClient("sitter-form-register")
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

  useEffect(() => {
    fetchForm();
  }, [fetchForm]);

  const pages = Math.ceil(data.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return [...data].reverse().slice(start, end);
  }, [page, data]);

  //open detail
  const handleDetail = async (item: FormRegister) => {
    setSelectedForm(item);
    onOpen();
  };

  //accept
  const handleAccept = async (userId: string, id: string) => {
    const data = { ...selectedForm, status: "APPROVED" };
    try {
      await axiosClient
        .put(`sitter-form-register/${id}`, data)
        .then(() => {})
        .catch(() => {});

      await axiosClient
        .post(`users/${userId}/roles?roleName=SITTER`)
        .then(() => {
          fetchForm();
          onOpenChange();
          toast.success("Người dùng này đã trở thành người chăm sóc");
        })
        .catch(() => {});
    } catch (error) {}
  };
  //reject
  const handleReject = (id: string) => {
    const data = { ...selectedForm, status: "REJECTED" };
    try {
      axiosClient
        .put(`sitter-form-register/${id}`, data)
        .then(() => {
          fetchForm();
          onOpenChange();
          toast.success("Bạn đã từ chối đơn đăng ký này");
        })
        .catch(() => {});
    } catch (error) {}
  };

  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Quản lý đặt dịch vụ</h1>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
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
          <TableColumn key="name">Người đăng ký</TableColumn>
          <TableColumn key="role">Email</TableColumn>
          <TableColumn key="role">Trạng thái</TableColumn>
          <TableColumn key="status">Hành động</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.email}</TableCell>
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
                    <DropdownItem onClick={() => handleDetail(item)}>
                      Xem chi tiết
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Đơn đăng ký của {selectedForm?.fullName}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-6 gap-3">
                  <div className="col-span-2 font-semibold">Email</div>
                  <div className="col-span-4 ">{selectedForm?.email}</div>
                  <div className="col-span-2 font-semibold">Số điện thoại</div>
                  <div className="col-span-4">{selectedForm?.phoneNumber}</div>
                  <div className="col-span-2 font-semibold">Địa chỉ</div>
                  <div className="col-span-4">{selectedForm?.address}</div>
                  <div className="col-span-2 font-semibold">Chứng chỉ</div>
                  <div className="col-span-4 flex gap-1 overflow-auto">
                    {selectedForm?.certificates.map((cer) => (
                      <div
                        key={cer.id}
                        onClick={() => {
                          setSelectedPdf(cer.certificateUrl!);
                          onOpenCer();
                        }}
                        className="flex flex-col items-center justify-center w-36 h-36 bg-gray-200 rounded-md shrink-0"
                      >
                        <FontAwesomeIcon icon={faFilePdf} size="2xl" />
                        <p className="text-center text-xs mt-2">
                          {cer.certificateName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                {selectedForm?.status === "PENDING" ? (
                  <div className="flex gap-2">
                    <Button
                      color="danger"
                      variant="light"
                      onPress={() =>
                        handleReject(selectedForm ? selectedForm.id : "")
                      }
                    >
                      Không duyệt
                    </Button>
                    <Button
                      color="primary"
                      onPress={() =>
                        handleAccept(
                          selectedForm ? selectedForm?.userId : "",
                          selectedForm ? selectedForm.id : ""
                        )
                      }
                    >
                      Duyệt
                    </Button>
                  </div>
                ) : (
                  <Button onPress={onClose} className="">
                    Đóng
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenCer}
        onOpenChange={onOpenChangeCer}
        size="5xl"
        className="z-[50] h-[800px] w-[1500px]"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Chứng chỉ
              </ModalHeader>
              <ModalBody>
                <iframe
                  src={selectedPdf}
                  title="PDF Viewer"
                  className="h-full"
                ></iframe>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
