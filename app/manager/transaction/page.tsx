'use client'

import { Transaction } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react'

const Page = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Transaction[]>([]);
    const [pages, setPages] = useState(1);

    const statusColors: { [key: string]: string } = {
        PENDING: 'text-[#9E9E9E]', // Chờ duyệt - gray
        COMPLETED: 'text-[#4CAF50]',        // Hoàn thành - green
        FAILED: 'text-[#DC3545]',        // Đã hủy - Red
    };

    const statusLabels: { [key: string]: string } = {
        PENDING: 'Chờ thanh toán',
        COMPLETED: 'Giao dịch thành công',
        FAILED: 'Giao dịch thất bại',
    };

    useEffect(() => {
        try {
            axiosClient(`transactions/search/pagination?page=${page}&size=10&sort=createdAt&direction=DESC`)
                .then((res) => {
                    setData(res.data.content)
                    setPages(res.data.page.totalPages)

                })
                .catch((e) => {
                    console.log(e);
                })
        } catch (error) {
            console.log(error);
        }
    }, [page])

    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <h1 className='font-semibold text-3xl'>Giao dịch</h1>
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    page ? (
                        <div className={pages < 2 ? "hidden" : "flex w-full justify-center"}>
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
                    ) : (
                        <div>???</div>
                    )
                }
                classNames={{
                    wrapper: "min-h-[222px]",
                }}
            >
                <TableHeader>
                    <TableColumn key="name">Người thực hiện</TableColumn>
                    <TableColumn key="name">Người nhận</TableColumn>
                    <TableColumn key="name">Loại giao dịch</TableColumn>
                    <TableColumn key="name">Ngày thực hiện</TableColumn>
                    <TableColumn key="role">Số tiền</TableColumn>
                    <TableColumn key="status">Trạng thái</TableColumn>
                </TableHeader>
                <TableBody items={data}>
                    {(transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>{transaction.fromUserEmail}</TableCell>
                            <TableCell>{transaction.toUserEmail}</TableCell>
                            <TableCell>{transaction.paymentMethod}</TableCell>
                            <TableCell>{format(new Date(transaction.updatedAt), 'HH:mm | dd/MM/yyyy')}</TableCell>
                            <TableCell>{transaction.amount.toLocaleString('de-DE')}đ</TableCell>
                            <TableCell className={statusColors[transaction.status]}>{statusLabels[transaction.status]}</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Page