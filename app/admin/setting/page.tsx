"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    catSittersPerPage: 10, // Default value for cat sitters per page
    discountPercentage: 5, // Default percentage for completed services
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prevState) => ({
      ...prevState,
      [name]: parseInt(value, 10), // Ensure numeric values
    }));
  };

  const handleSaveSettings = () => {
    setIsModalOpen(true); // Show confirmation modal
  };

  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Cài đặt hệ thống</h1>
      <div className="flex flex-col gap-5">
        {/* Số lượng Cat Sitter mỗi trang */}
        <div>
          <h2 className="font-medium text-lg">
            Số lượng Cat Sitter trong mỗi trang
          </h2>
          <Input
            className="w-full"
            type="number"
            variant="bordered"
            name="catSittersPerPage"
            value={settings.catSittersPerPage.toString()}
            onChange={handleInputChange}
            placeholder="Nhập số lượng cat sitter mỗi trang"
          />
        </div>

        {/* Phần trăm chiết khấu */}
        <div>
          <h2 className="font-medium text-lg">
            Phần trăm chiết khấu mỗi dịch vụ hoàn thành
          </h2>
          <Input
            className="w-full"
            type="number"
            variant="bordered"
            name="discountPercentage"
            value={settings.discountPercentage.toString()}
            onChange={handleInputChange}
            placeholder="Nhập phần trăm chiết khấu"
          />
        </div>
      </div>

      {/* Nút Lưu */}
      <div className="flex justify-end mt-5">
        <Button color="primary" onClick={handleSaveSettings}>
          Lưu cài đặt
        </Button>
      </div>

      {/* Modal xác nhận */}
      <Modal isOpen={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent>
          <ModalHeader>Xác nhận cài đặt</ModalHeader>
          <ModalBody>
            <p>Bạn có chắc muốn lưu các cài đặt này không?</p>
            <div className="mt-3">
              <p>
                <strong>Số lượng Cat Sitter mỗi trang:</strong>{" "}
                {settings.catSittersPerPage}
              </p>
              <p>
                <strong>Phần trăm chiết khấu:</strong>{" "}
                {settings.discountPercentage}%
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => setIsModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              color="primary"
              onClick={() => {
                setIsModalOpen(false);
                console.log("Cài đặt đã lưu:", settings);
              }}
            >
              Xác nhận
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SystemSettings;
