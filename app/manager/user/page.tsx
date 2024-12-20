"use client";

import { UserType } from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import {
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./user.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { showConfirmationDialog } from "@/app/components/confirmationDialog";
import { toast } from "react-toastify";
import Loading from "@/app/components/Loading";
const Page = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<UserType[]>([]);
  const rowsPerPage = 10;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<UserType>();
  const [isLoading, setIsLoading] = useState(false)

  const statusColors: { [key: string]: string } = {
    INACTIVE: "text-[#9E9E9E]", // Chờ duyệt - gray
    ACTIVE: "text-[#4CAF50]", // Hoàn thành - green
    DELETED: "text-[#DC3545]", // Hoàn thành - green
  };

  const statusLabels: { [key: string]: string } = {
    INACTIVE: "Ngừng hoạt động",
    ACTIVE: "Đang hoạt động",
    DELETED: "Đã xóa",
  };

  const namesLables: { [key: string]: string } = {
    USER: "Người nuôi mèo",
    SITTER: "Người chăm sóc",
  };

  const fetchUser = useCallback(() => {
    setIsLoading(true)
    try {
      axiosClient("users")
        .then((res) => {
          setData(res.data);
          setIsLoading(false)
        })
        .catch((e) => {
          setIsLoading(false)
          console.log(e);
        });
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser]);

  const pages = Math.ceil(data.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return data.reverse().slice(start, end);
  }, [page, data]);

  const handleOpen = (id: string) => {
    try {
      setIsLoading(true)
      axiosClient(`users/${id}`)
        .then((res) => {
          setSelectedUser(res.data);
          setIsLoading(false)
        })
        .catch((e) => {
          setIsLoading(false)
          console.log(e);
        });
      onOpen();
    } catch (error) {
      toast.error("Lỗi mạng")
      setIsLoading(false)
    }
  };

  const handleInactive = async (id: string) => {
    try {
      const isConfirmed = await showConfirmationDialog({
        title: "Bạn muốn khóa tài khoản này?",
        confirmButtonText: "Có, chắc chắn",
        denyButtonText: "Không",
        confirmButtonColor: "#00BB00",
      });
      if (isConfirmed) {
        setIsLoading(true)
        axiosClient.put(`users/${id}/status?status=INACTIVE`)
          .then(() => {
            toast.success("Bạn đã khóa tài khoản này")
            fetchUser()
            setIsLoading(false)
          })
          .catch(() => {
            setIsLoading(false)
            toast.error("Lỗi mạng")
          })
      } else {
        setIsLoading(false)
        return;
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };

  const handleActive = async (id: string) => {
    try {
      const isConfirmed = await showConfirmationDialog({
        title: "Bạn có muốn mở khóa tài khoản này?",
        confirmButtonText: "Có",
        denyButtonText: "Không",
        confirmButtonColor: "#00BB00",
      });
      if (isConfirmed) {
        setIsLoading(true)
        axiosClient.put(`users/${id}/status?status=ACTIVE`)
          .then(() => {
            setIsLoading(false)
            toast.success("Bạn đã mở khóa tài khoản này")
            fetchUser()
          })
          .catch(() => {
            setIsLoading(false)
            toast.error("Lỗi mạng")
          })
      } else {
        setIsLoading(false)
        return;
      }
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Người Dùng Trên Hệ Thống</h1>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          data.length > 10 && (
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
          )
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
      >
        <TableHeader>
          <TableColumn key="name">Tên</TableColumn>
          <TableColumn key="role">Email</TableColumn>

          <TableColumn key="status">Trạng thái</TableColumn>
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
                <Button onClick={() => handleOpen(item.id)}>
                  Xem chi tiết
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                {selectedUser && (
                  <div>
                    <div className="flex justify-start items-center gap-3">
                      <Avatar src={selectedUser.avatar} className="h-24 w-24" />
                      <div className="font-semibold">
                        <h1>{selectedUser.fullName}</h1>
                        <h1>{selectedUser.email}</h1>
                      </div>
                    </div>
                    <div className="bg-[#FFE3D5] mt-3 rounded-sm">
                      <div className="p-5">
                        <h1 className={styles.title}>Thông tin chi tiết</h1>
                        <div className="my-5">
                          <div className="flex">
                            <p className={styles.info}>Số điện thoại:</p>

                            <p className={styles.description}>
                              {selectedUser.phoneNumber
                                ? selectedUser.phoneNumber
                                : "Không có"}
                            </p>
                          </div>
                          <div className="flex">
                            <p className={styles.info}>Địa chỉ:</p>
                            <p className={styles.description}>
                              {selectedUser.address
                                ? selectedUser.address
                                : "Không có"}
                            </p>
                          </div>
                          <div className="flex flex-col mt-5">
                            <div className="flex flex-col gap-3">
                              {selectedUser.roles.map((role) => (
                                <Button
                                  key={role.id}
                                  className="w-full text-green-500 bg-white"
                                >
                                  <FontAwesomeIcon icon={faCircle} />{" "}
                                  {namesLables[role.roleName]}
                                </Button>
                              ))}
                              {selectedUser.status === "ACTIVE" ?
                                <Button
                                  className="bg-red-500 text-white"
                                  onClick={() => handleInactive(selectedUser.id)}
                                >
                                  Khóa tài khoản này
                                </Button>
                                :
                                <Button
                                  className="bg-red-500 text-white"
                                  onClick={() => handleActive(selectedUser.id)}
                                >
                                  Mở khóa tài khoản này
                                </Button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
