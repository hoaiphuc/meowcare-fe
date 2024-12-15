"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import axiosClient from "@/app/lib/axiosClient";
import { Config } from "@/app/constants/types/homeType";
import { toast } from "react-toastify";

const SystemSettings = () => {
  // const [config, setConfig] = useState<Config[]>([]);
  const [commission, setCommission] = useState<Config>(); // Commission value
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [initialCommissionValue, setInitialCommissionValue] = useState<string>("");

  const fetchConfig = useCallback(async () => {
    try {
      const res = await axiosClient("api/config");
      // setConfig(res.data);
      // Find and set the commission setting
      const commissionSetting = res.data.find(
        (data: Config) => data.configKey === "APP_COMMISSION_SETTING"
      );
      if (commissionSetting) {
        setCommission(commissionSetting);
        setInitialCommissionValue(commissionSetting.configValue);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]); // Run only once on mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (commission) {
      setCommission({
        ...commission,
        configValue: e.target.value,
      });
    }
  };

  const handleSaveSettings = () => {
    if (commission?.configValue !== initialCommissionValue) {
      onOpen();
    } else {
      toast.info("Không có thay đổi để cập nhật");
    }
  };
  const handleUpdate = () => {
    try {
      axiosClient.put(`api/config/${commission?.id}`, commission)
        .then(() => {
          toast.success("Cập nhật thành công")
        })
        .catch(() => {
          toast.error("Cập nhật thất bại")
        })
      onOpenChange()
    } catch (error) {

    }
  }

  return (
    <div className="flex flex-col justify-start w-full mx-10 gap-5 my-3">
      <h1 className="font-semibold text-3xl">Cài đặt hệ thống</h1>
      <div className="flex flex-col gap-5">
        {/* Phần trăm chiết khấu */}
        {commission && (
          <div>
            <h2 className="font-medium text-lg">
              Phần trăm chiết khấu mỗi dịch vụ hoàn thành
            </h2>
            <Input
              className="w-full"
              type="number"
              variant="bordered"
              name="discountPercentage"
              value={commission.configValue}
              onChange={(e) => handleInputChange(e)}
              placeholder="Nhập phần trăm chiết khấu"
            />
          </div>
        )}
      </div>

      {/* Nút Lưu */}
      <div className="flex justify-end mt-5">
        <Button color="primary" onClick={handleSaveSettings}>
          Lưu cài đặt
        </Button>
      </div>

      {/* Modal xác nhận */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Xác nhận cài đặt</ModalHeader>
              <ModalBody>
                <p>Bạn có chắc muốn lưu các cài đặt này không?</p>
                <div className="mt-3">
                  <p>
                    <strong>Phần trăm chiết khấu:</strong> {commission?.configValue}%
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={onClose}
                >
                  Hủy
                </Button>
                <Button
                  color="primary"
                  onClick={handleUpdate}>
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SystemSettings;
