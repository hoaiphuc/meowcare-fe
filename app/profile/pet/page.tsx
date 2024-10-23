'use client'

import { faCat, faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Textarea, useDisclosure } from '@nextui-org/react';
import React from 'react'
import styles from './pet.module.css';
const Page = () => {
    const { isOpen: isOpenAdd, onOpen: onOpenAdd, onOpenChange: onOpenChangeAdd } = useDisclosure();
    // const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();x
    return (
        <div className="w-[891px] bg-white rounded-2xl shadow-2xl p-5 flex flex-col items-start justify-start">
            <h1 className='text-2xl font-bold'>Thú cưng của bạn</h1>
            <h2>Thêm mèo cưng của bạn hoặc chỉnh sửa thông tin</h2>
            <div
                className='flex flex-col items-center justify-center w-[338px] h-[230px] border-dashed border-2 gap-3 mt-4 cursor-pointer'
                onClick={onOpenAdd}
            >
                <FontAwesomeIcon icon={faCirclePlus} className='fa-2x text-[#902C6C]' />
                <h1 className='text-xl'>Thêm thú cưng </h1>
            </div>

            <Modal isOpen={isOpenAdd} onOpenChange={onOpenChangeAdd} size='5xl'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex items-center gap-2">
                                <FontAwesomeIcon icon={faCat} className='fa-2x' />
                                <h1 className='text-2xl font-bold'>Bé mèo của bạn</h1>
                            </ModalHeader>
                            <ModalBody className='gap-5 flex'>
                                <div className='flex gap-5'>
                                    <Input label={<h1 className={styles.heading1}>Tên bé mèo</h1>} placeholder='Tên' labelPlacement='outside' />
                                    <Input label={<h1 className={styles.heading1}>Sinh nhật</h1>} placeholder='20/20/2020' labelPlacement='outside' />
                                </div>
                                <div className='flex gap-5'>
                                    <Input label={<h1 className={styles.heading1}>Giống loài</h1>} placeholder='Tên giống mèo của bạn' labelPlacement='outside' />
                                    <Input label={<h1 className={styles.heading1}>Cân nặng</h1>} placeholder='Kg' labelPlacement='outside' />
                                    <RadioGroup
                                        label={<h1 className={styles.heading1}>Giới tính</h1>}
                                    >
                                        <div className='flex gap-3'>
                                            <Radio value="buenos-aires">Nam</Radio>
                                            <Radio value="sydney">Nữ</Radio>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Textarea label={<h1 className={styles.heading1}>Thông tin về mèo của bạn</h1>} placeholder='Thêm mô tả mèo của bạn' labelPlacement='outside' />
                                <Textarea label={<h1 className={styles.heading1}>Những thông tin mà người chăm sóc mèo cần lưu ý</h1>} placeholder='Thêm hướng dẫn chăm sóc để phù hợp với bé mèo của bạn' labelPlacement='outside' />
                            </ModalBody>
                            <ModalFooter className='flex justify-center items-center'>
                                <Button color="primary" onPress={onClose}>
                                    Lưu
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