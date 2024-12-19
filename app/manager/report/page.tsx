'use client'

import { Report } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from '@nextui-org/react';
import React, { useEffect, useMemo, useState } from 'react'

const Page = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Report[]>([]);
    const rowsPerPage = 10;

    useEffect(() => {
        try {
            axiosClient('reports')
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

    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <div className='flex gap-5 items-center'>
                <h1 className='font-semibold text-3xl'>Báo cáo</h1>
                <Tooltip
                    content={
                        <div className="px-1 py-2 gap-3 flex flex-col">
                            <div className="flex gap-3">
                                <FontAwesomeIcon icon={faFlag} size='xl' className='text-yellow-400' />
                                <h1 className='font-semibold text-[14px]'>Báo cáo lỗi hệ thống</h1>
                            </div>
                            <div className="flex gap-3">
                                <FontAwesomeIcon icon={faFlag} size='xl' className='text-red-500' />
                                <h1 className='font-semibold text-[14px]'>Báo cáo có người vi phạm</h1>
                            </div>
                        </div>
                    }
                    placement="right-start"
                >
                    <FontAwesomeIcon icon={faQuestionCircle} size='xl' className='' />
                </Tooltip>
            </div>
            <Table
                aria-label="Example table with client side pagination"
                bottomContent={
                    pages > 2 &&
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
                    <TableColumn key="role">Loại báo cáo</TableColumn>
                    <TableColumn key="status">Ngày gửi báo cáo</TableColumn>
                    <TableColumn key="name">Người bị báo cáo</TableColumn>
                    <TableColumn key="status">Vấn đề</TableColumn>
                    <TableColumn key="status">Chi tiết</TableColumn>
                    <TableColumn key="status">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell><FontAwesomeIcon icon={faFlag} size='xl' className={item.reportedUserId ? 'text-red-500' : 'text-yellow-400'} /></TableCell>
                            <TableCell>{item.userEmail}</TableCell>
                            <TableCell>{item.reportedUserEmail}</TableCell>
                            <TableCell>{item.reason}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>
                                <Button>Xem chi tiết</Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Page