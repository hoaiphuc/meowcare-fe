"use client";

import { ConfigService } from "@/app/constants/types/homeType";
import axiosClient from "@/app/lib/axiosClient";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Input,
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
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<ConfigService[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [updateService, setUpdateService] = useState({
    id: "",
    ceilPrice: 0,
    floorPrice: 0,
    name: "",
    actionDescription: "",
  });
  const rowsPerPage = 10;

  //convert type to VN
  const serviceTypeMapping: { [key: string]: string } = {
    "Main Service": "Dịch vụ chính",
    "Addition Service": "Dịch vụ thêm",
    "Child Service": "Dịch vụ dính kèm",
  };

  //get all service
  const fetchService = () => {
    try {
      axiosClient("config-services")
        .then((res) => {
          setServices(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchService();
  }, []);

  const pages = Math.ceil(services.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return services.slice(start, end);
  }, [page, services]);

  //Add new service
  // const handleAddService = () => { }

  //update service
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateService((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdateService = () => {
    try {
      axiosClient
        .put(`config-services/${updateService.id}`, updateService)
        .then(() => {
          fetchService();
          toast.success("Cập nhật thành công");
        })
        .catch(() => {
          toast.error("Có lỗi xảy ra vui lòng thử lại sau");
        });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Dịch vụ</h1>
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
          <TableColumn key="name">Tên dịch vụ</TableColumn>
          <TableColumn key="role">loại dịch vụ</TableColumn>
          <TableColumn key="status">Chi tiết</TableColumn>
          <TableColumn key="2">Giá thấp nhất</TableColumn>
          <TableColumn key="3">Giá cao nhất</TableColumn>
          <TableColumn key="4">Hành động</TableColumn>
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                {serviceTypeMapping[item.serviceType] || item.serviceType}
              </TableCell>
              <TableCell>{item.actionDescription}</TableCell>
              <TableCell>{item.floorPrice}</TableCell>
              <TableCell>{item.ceilPrice}</TableCell>
              <TableCell>
                <Button
                  onClick={() => {
                    setUpdateService(item);
                    onOpen();
                  }}
                >
                  <FontAwesomeIcon icon={faPen} />
                </Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Cập nhật dịch vụ</ModalHeader>
              <ModalBody>
                <div>
                  <h2>Tên dịch vụ</h2>
                  <Input
                    className="mb-4"
                    type="text"
                    variant="bordered"
                    name="name"
                    value={updateService.name}
                    onChange={handleInputChange}
                  />
                  <h2>Tên dịch vụ</h2>
                  <Input
                    className="mb-4"
                    type="text"
                    variant="bordered"
                    name="actionDescription"
                    value={updateService.actionDescription}
                    onChange={handleInputChange}
                  />
                  <h2>Giá thấp nhất</h2>
                  <Input
                    className="mb-4"
                    type="number"
                    variant="bordered"
                    value={updateService.floorPrice.toString()}
                    name="floorPrice"
                    onChange={handleInputChange}
                  />
                  <h2>Giá cao nhất</h2>
                  <Input
                    className="mb-4"
                    type="number"
                    variant="bordered"
                    value={updateService.ceilPrice.toString()}
                    name="ceilPrice"
                    onChange={handleInputChange}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Đóng
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    handleUpdateService();
                    onClose();
                  }}
                >
                  Cập nhật
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
