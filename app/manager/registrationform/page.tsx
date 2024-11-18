'use client'

import { FormRegister } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react';
import React, { useEffect, useMemo, useState } from 'react'

const Page = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<FormRegister[]>([]);
    const rowsPerPage = 10;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedForm, setSelectedForm] = useState<FormRegister>();

    useEffect(() => {
        try {
            axiosClient('sitter-form-register')
                .then((res) => {
                    setData(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [])

    const pages = Math.ceil(data.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return data.slice(start, end);
    }, [page, data]);

    //open detail
    const handleDetail = async (item: FormRegister) => {
        setSelectedForm(item);
        onOpen();
    }

    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <h1 className='font-semibold text-3xl'>Đơn đăng ký trở thành người chăm sóc</h1>
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
                    <TableColumn key="status">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.fullName}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleDetail(item)}>
                                    Xem chi tiết
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Đơn đăng ký của {selectedForm?.fullName}</ModalHeader>
                            <ModalBody>
                                <div className="grid grid-cols-6 gap-3">
                                    <div className="col-span-2">Email</div>
                                    <div className="col-span-4">{selectedForm?.email}</div>
                                    <div className="col-span-2">Số điện thoại</div>
                                    <div className="col-span-4">{selectedForm?.phoneNumber}</div>
                                    <div className="col-span-2">Địa chỉ</div>
                                    <div className="col-span-4">{selectedForm?.address}</div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Không duyệt
                                </Button>
                                <Button color="primary" onPress={() => onClose}>
                                    Duyệt
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    )
}

export default Page