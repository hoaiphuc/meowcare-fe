'use client'

import { Quiz } from '@/app/constants/types/homeType'
import axiosClient from '@/app/lib/axiosClient'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import Link from 'next/link'
// import { Accordion, AccordionItem } from '@nextui-org/react'
import React, { useEffect, useMemo, useState } from 'react'

const Page = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([])
    const [page, setPage] = useState(1);
    const rowsPerPage = 10;

    useEffect(() => {
        try {
            axiosClient('quizzes')
                .then((res) => {
                    setQuizzes(res.data)
                })
        } catch (error) {

        }
    })

    const pages = Math.ceil(quizzes.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return quizzes.slice(start, end);
    }, [page, quizzes]);

    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <h1 className='font-semibold text-3xl'>Quản lí bài kiểm tra</h1>
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
                    <TableColumn key="name">Bộ câu hỏi</TableColumn>
                    <TableColumn key="role">Chi tiết</TableColumn>
                    <TableColumn key="status">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell>{item.description}</TableCell>
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
                                        <DropdownItem as={Link} key="edit" href={`/manager/quizUpdate/${item.id}`}>Cập nhật</DropdownItem>
                                        <DropdownItem key="delete" className="text-danger" color="danger">
                                            Xóa
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Page