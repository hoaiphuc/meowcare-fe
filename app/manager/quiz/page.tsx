'use client'

import { Quiz } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { faBars, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from "./quiz.module.css"
import { toast } from 'react-toastify'
import { showConfirmationDialog } from '@/app/components/confirmationDialog'

const Page = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [titleQuiz, setTitleQuiz] = useState("")
    const [description, setDescription] = useState("")

    const fetchQuiz = useCallback(() => {
        try {
            axiosClient('quizzes')
                .then((res) => {
                    setQuizzes(res.data)
                })
        } catch (error) {

        }
    }, [])

    useEffect(() => {
        fetchQuiz()
    }, [fetchQuiz])

    const pages = Math.ceil(quizzes.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return quizzes.slice(start, end);
    }, [page, quizzes]);

    const handleCreateQuiz = () => {
        try {
            const data = {
                title: titleQuiz,
                description,
                isActive: false
            }
            axiosClient.post("quizzes", data)
                .then(() => {
                    toast.success("Tạo bài kiểm tra thành công")
                    fetchQuiz()
                    onOpenChange
                })
                .catch(() => {
                    toast.error("Tạo bài kiểm tra mới thất bại")
                })
        } catch (error) {

        }
    }

    const handleDelete = async (id: string) => {
        const isConfirmed = await showConfirmationDialog({
            title: 'Bạn có muốn xóa bài kiểm tra này không?',
            confirmButtonText: 'Có',
            denyButtonText: 'Không',
            confirmButtonColor: '#00BB00',
        });
        if (isConfirmed) {
            try {
                axiosClient.delete(`quizzes/${id}`)
                    .then(() => {
                        fetchQuiz()
                        toast.success("Đã xóa thành công bài kiểm tra này")
                    })
                    .catch(() => {
                        toast.error("Đã có lỗi xảy ra khi xóa!")
                    })
            } catch (error) {
                console.log(error);
            }
        } else {
            return
        }
    }

    const handleUpdateStatus = async (id: string, isActive: boolean) => {
        try {
            const isConfirmed = await showConfirmationDialog({
                title: 'Bạn có muốn thay đổi trạng thái của bài kiểm tra này không?',
                confirmButtonText: 'Có',
                denyButtonText: 'Không',
                confirmButtonColor: '#00BB00',
            });
            if (isConfirmed) {
                const active = !isActive
                try {
                    axiosClient.put(`quizzes/${id}`, { isActive: active })
                        .then(() => {
                            fetchQuiz()
                            toast.success("Đã cập nhật thành công")
                        })
                        .catch(() => {
                            toast.error("Đã có lỗi xảy ra khi cập nhật!")
                        })
                } catch (error) {
                    console.log(error);
                }
            } else {
                return
            }
        } catch (error) {

        }
    }

    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-3xl'>Quản lý bài kiểm tra</h1>
                {/* <Button as={Link} href='quiz/quizcreate' className='bg-btnbg text-white'>
                    <FontAwesomeIcon icon={faPlus} />
                    Tạo mới bài viết
                </Button> */}
                <Button onClick={onOpen} className='bg-btnbg text-white'>
                    <FontAwesomeIcon icon={faPlus} />
                    Tạo bài kiểm tra
                </Button>
            </div>
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    <div className="flex w-full justify-center">
                        {
                            quizzes.length > 10 &&
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
                    <TableColumn key="name">Bộ câu hỏi</TableColumn>
                    <TableColumn key="role">Chi tiết</TableColumn>
                    <TableColumn key="role">Trạng thái</TableColumn>
                    <TableColumn key="status">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className={item.isActive ? "text-[#4CAF50]" : "text-[#9E9E9E]"}>
                                {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                            </TableCell>
                            <TableCell>
                                <Dropdown >
                                    <DropdownTrigger>
                                        <Button
                                            variant="bordered"
                                        >
                                            <FontAwesomeIcon icon={faBars} />
                                        </Button>
                                    </DropdownTrigger>
                                    <DropdownMenu aria-label="Example with disabled actions">
                                        <DropdownItem key="edit" onClick={() => window.location.href = `/manager/quiz/quizupdate/${item.id}`}>Cập nhật</DropdownItem>
                                        <DropdownItem key="update" className="text-primary" color="primary" onClick={() => handleUpdateStatus(item.id, item.isActive)}>{item.isActive ? "Tắt hoạt động" : "Mở hoạt động"}</DropdownItem>
                                        <DropdownItem key="delete" className="text-danger" color="danger" onClick={() => handleDelete(item.id)}>
                                            Xóa
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-2xl font-semibold">Tạo bài kiểm tra</ModalHeader>
                            <ModalBody>
                                <h1 className={styles.h1}>Tên bài kiểm tra</h1>
                                <Input value={titleQuiz} onChange={(e) => setTitleQuiz(e.target.value)} />
                                <h1 className={styles.h1}>Chi tiết</h1>
                                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="primary" onPress={handleCreateQuiz}>
                                    Tạo bài kiểm tra
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