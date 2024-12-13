'use client'

import { UserType } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Avatar, Button, Modal, ModalBody, ModalContent, ModalFooter, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react';
import { useEffect, useMemo, useState } from 'react';
import styles from "./user.module.css";
const Page = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<UserType[]>([]);
    const rowsPerPage = 10;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [selectedUser, setSelectedUser] = useState<UserType>()
    useEffect(() => {
        try {
            axiosClient('users')
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

        return data.reverse().slice(start, end);
    }, [page, data]);

    const handleOpen = (id: string) => {
        try {
            axiosClient(`users/${id}`)
                .then((res) => {
                    setSelectedUser(res.data)
                })
                .catch((e) => {
                    console.log(e);
                })
            onOpen()
        } catch (error) {

        }
    }
    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <h1 className='font-semibold text-3xl'>Người Dùng Trên Hệ Thống</h1>
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
                    <TableColumn key="name">Tên</TableColumn>
                    <TableColumn key="role">Email</TableColumn>
                    <TableColumn key="status">Số điện thoại</TableColumn>
                    <TableColumn key="status">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.fullName}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.phoneNumber}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleOpen(item.id)}>Xem chi tiết</Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='2xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody>
                                {selectedUser &&
                                    <div>
                                        <div className='flex justify-start items-center gap-3'>
                                            <Avatar src={selectedUser.avatar} className='h-24 w-24' />
                                            <div className='font-semibold'>
                                                <h1>{selectedUser.fullName}</h1>
                                                <h1>{selectedUser.email}</h1>
                                            </div>
                                        </div>
                                        <div className='bg-[#FFE3D5] mt-3 rounded-sm'>
                                            <div className='p-5'>
                                                <h1 className={styles.title}>Thông tin chi tiết</h1>
                                                <div className='my-5'>
                                                    <div className='flex'>
                                                        <p className={styles.info}>Số điện thoại:</p>

                                                        <p className={styles.description}>{selectedUser.password ? selectedUser.password : "Không có"}</p>
                                                    </div>
                                                    <div className='flex'>
                                                        <p className={styles.info}>Địa chỉ:</p>
                                                        <p className={styles.description}>{selectedUser.address ? selectedUser.address : "Không có"}</p>
                                                    </div>
                                                    <div className='flex flex-col'>
                                                        <p className={styles.info}>Vị trí hiện tại: </p>
                                                        <p></p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={onClose}>
                                    Cập nhật
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