'use client'

import { ConfigService } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React, { useEffect, useMemo, useState } from 'react'

const Page = () => {
    const [page, setPage] = useState(1);
    const [data, setData] = useState<ConfigService[]>([]);
    const rowsPerPage = 10;
    //get all service
    useEffect(() => {
        try {
            axiosClient('config-services')
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

    //Add new service
    // const handleAddService = () => { }

    //update service
    const handleUpdateService = () => {

    }
    return (
        <div className='flex flex-col justify-start w-full mx-10 gap-5 my-3'>
            <h1 className='font-semibold text-3xl'>Dịch vụ</h1>
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
                    <TableColumn key="status">Giá thấp nhất</TableColumn>
                    <TableColumn key="status">Giá cao nhất</TableColumn>
                    <TableColumn key="status">Hành động</TableColumn>
                </TableHeader>
                <TableBody items={items}>
                    {(item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.isBasicService ? "Dịch vụ chính" : "Dịch vụ phụ"}</TableCell>
                            <TableCell>Chua co chi tiet</TableCell>
                            <TableCell>{item.floorPrice}</TableCell>
                            <TableCell>{item.ceilPrice}</TableCell>
                            <TableCell>
                                <Button onClick={() => handleUpdateService()}>
                                    <FontAwesomeIcon icon={faPen} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default Page