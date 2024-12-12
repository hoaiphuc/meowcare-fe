import { Certificate } from '@/app/constants/types/homeType';
import { faFilePdf, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useEffect, useRef, useState } from 'react';

const Information = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        address: '',
        certificates: [] as Certificate[],
    });
    const [isInitialized, setIsInitialized] = useState(false);
    const hiddenFileInput = useRef<HTMLInputElement>(null);
    const [selectedPdf, setSelectedPdf] = useState<string>();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedData = localStorage.getItem('formData');
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                setFormData(() => ({
                    ...parsedData,
                    certificates: parsedData.certificates || [], // Ensure certificates is an array
                }));
            }
            setIsInitialized(true);
        }
    }, []);



    useEffect(() => {
        if (typeof window !== 'undefined' && isInitialized) {
            localStorage.setItem('formData', JSON.stringify(formData));
        }
    }, [formData, isInitialized]);

    //certificate upload
    const handleCertificateClick = () => {
        if (hiddenFileInput.current) {
            hiddenFileInput.current.click();
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const filesArray = Array.from(event.target.files);
            const newCertificates = filesArray.map((file) => ({
                id: "",
                userId: "",
                certificateType: file.type.includes("pdf") ? "PDF" : "IMAGE",
                certificateName: file.name,
                institutionName: "",
                certificateUrl: URL.createObjectURL(file),
                description: "",
            }));

            setFormData((prevData) => ({
                ...prevData,
                certificates: [...(prevData.certificates || []), ...newCertificates], // Ensure prevData.certificates is iterable
            }));
        }
    };


    const handleRemoveUpdateCertificate = (certificate: Certificate) => {
        setFormData((prevData) => ({
            ...prevData,
            certificates: (prevData.certificates || []).filter((item) => item !== certificate),
        }));
    };


    return (
        <div className='flex justify-center items-center'>
            <div className=' w-[700px] text-center'>
                <h1 className='font-semibold text-xl py-10'>Vui lòng điền đầy đủ thông tin để chúng tôi đảm bảo thông tin để xác nhận bạn trở thành người chăm sóc mèo</h1>
                <div className='flex flex-col justify-center items-start gap-6'>
                    {/* <h2>Họ và tên</h2> */}
                    <Input placeholder="Nhập họ và tên" label="Họ và tên" labelPlacement='outside' variant="bordered" className='input' name="fullName" value={formData.fullName} onChange={handleInputChange} />
                    <Input placeholder="Nhập họ và tên" label="Email" labelPlacement='outside' variant="bordered" className='input' name="email" value={formData.email} onChange={handleInputChange} />
                    <Input placeholder="Nhập số điện thoại" label="Số điện thoại" labelPlacement='outside' variant="bordered" className='input' name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} />
                    <Input placeholder="Nhập địa chỉ của bạn" label="Địa chỉ của bạn" labelPlacement='outside' variant="bordered" className='input' name="address" value={formData.address} onChange={handleInputChange} />

                    <h2 className='text-black'>Bằng cấp và chứng chỉ liên quan thú cưng (nếu có)</h2>
                    <div className="flex overflow-x-auto gap-2 w-full max-w-full">
                        {formData.certificates && formData.certificates.map((certificate, index) => (
                            <div key={index} className="relative w-36 h-36 flex-shrink-0">
                                {certificate.certificateType === "IMAGE" ? (
                                    <Avatar
                                        src={certificate.certificateUrl}
                                        alt={`Certificate ${index + 1}`}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-200 rounded-md">
                                        <FontAwesomeIcon icon={faFilePdf} size="2xl" />
                                        <p className="text-center text-xs mt-2">{certificate.certificateName}</p>
                                        <button
                                            className="text-maincolor underline mt-2"
                                            onClick={() => {
                                                setSelectedPdf(certificate.certificateUrl!);
                                                onOpen()
                                            }}
                                        >
                                            Xem chứng chỉ
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemoveUpdateCertificate(certificate)}
                                    className="absolute top-0 right-0 p-1 rounded-full w-8 h-8 bg-black bg-opacity-50 text-white"
                                >
                                    ✕
                                </button>

                            </div>
                        ))}
                    </div>
                    {formData.certificates.length < 6 &&
                        <button
                            className="flex flex-col justify-center items-center p-3 border border-dashed rounded-md text-center w-full gap-3 py-5"
                            onClick={handleCertificateClick}
                        >
                            <div className='flex items-center gap-3'>
                                <FontAwesomeIcon icon={faUpload} className="text-maincolor" size="2xl" />
                                <p>Tải bằng cấp và chứng chỉ từ máy tính</p>
                            </div>
                            <h1>Hỗ trợ định dạng .doc .docx .pdf có kích thước 5MB</h1>
                        </button>
                    }
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        ref={hiddenFileInput}
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        multiple
                    />

                </div>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='5xl' className='z-[50] h-[800px] w-[1500px]'>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Chứng chỉ</ModalHeader>
                                <ModalBody>
                                    <iframe
                                        src={selectedPdf}
                                        title="PDF Viewer"
                                        className="h-full"
                                    ></iframe>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Đóng
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>

        </div >
    )
}

export default Information
