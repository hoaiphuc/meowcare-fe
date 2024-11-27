'use client'

import { Transaction, UserLocal } from '@/app/constants/types/homeType';
import axiosClient from '@/app/lib/axiosClient'
import React, { useEffect, useMemo, useState } from 'react'
import styles from './transaction.module.css'
import { Pagination } from '@nextui-org/react';
import { format } from 'date-fns';

const Page = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [page, setPage] = useState(1);
    const rowsPerPage = 5;

    const getUserFromStorage = () => {
        if (typeof window !== "undefined") {
            const storedUser = localStorage.getItem("user");
            return storedUser ? JSON.parse(storedUser) : null;
        }
    };

    const user: UserLocal | null = getUserFromStorage();
    const userId = user?.id;

    useEffect(() => {
        try {
            axiosClient(`transactions/user/${userId}`)
                .then((res) => {
                    setTransactions(res.data)
                })
                .catch(() => { })
        } catch (error) {

        }
    }, [userId])

    const pages = Math.ceil(transactions.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return transactions.slice(start, end);
    }, [page, transactions]);

    return (
        <div className="w-[891px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col items-start justify-start text-black">
            <h1 className='text-2xl font-bold'>Lịch sử giao dịch</h1>
            {items.length > 0 ?
                <div className='flex flex-col w-full mt-5'>
                    {items.map((transaction) => (
                        <div key={transaction.id} >
                            {transaction.toUserId === userId?.toString() ?
                                <div className='flex items-center justify-between w-full'>
                                    <div className='flex flex-col'>
                                        <h1 className={styles.h2}>Tiền nhận được</h1>
                                        <h3 className={styles.h3}>
                                            {format(new Date(transaction.updatedAt), 'HH:mm | dd/MM/yyyy')}
                                        </h3>
                                    </div>
                                    <div className='flex flex-col justify-start items-end'>
                                        <h2 className={`${styles.h1} text-green-500`}>+{transaction.amount.toLocaleString('de-DE')}đ</h2>
                                        <p className={styles.p}>Thành công</p>
                                    </div>
                                </div>
                                :
                                <div className='flex items-center'>
                                    <div className='flex items-center justify-between w-full'>
                                        <div className='flex flex-col'>

                                            {transaction.transactionType === "COMMISSION" ?
                                                <h1 className={styles.h2}>Phí nền tảng</h1>
                                                :
                                                <h1 className={styles.h2}>Thanh toán dịch vụ chăm sóc</h1>
                                            }
                                            {format(new Date(transaction.updatedAt), 'HH:mm | dd/MM/yyyy')}

                                        </div>
                                        <div className='flex flex-col justify-start items-end'>
                                            <h2 className={styles.h1}>-{transaction.amount.toLocaleString('de-DE')}đ</h2>
                                            <p className={styles.p}>Thành công</p>
                                        </div>
                                    </div>
                                </div>}
                            <hr className='my-3' />
                        </div>
                    ))}
                    {transactions.length > 5 &&
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
                </div>
                :
                <div className='flex justify-center items-center w-full text-2xl mt-36'>Hiện tại chưa có giao dịch nào</div>
            }
        </div>
    )
}

export default Page