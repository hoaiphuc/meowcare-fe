'use client'

import { Checkbox } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import styles from './agreement.module.css'
interface AgreementProps {
    onAgreeChange: (isChecked: boolean) => void;
}

const Agreement: React.FC<AgreementProps> = ({ onAgreeChange }) => {

    const [formData, setFormData] = useState<{ fullName?: string }>({});
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onAgreeChange(e.target.checked);
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFormData = localStorage.getItem('formData');
            if (storedFormData) {
                setFormData(JSON.parse(storedFormData));
            }
        }
    }, []);

    return (
        <div className='m-10 w-[1300px]'>
            <div className='border p-5 gap-2 flex flex-col'>
                <h1 className={styles.h1}>THỎA THUẬN ĐỒNG Ý TRỞ THÀNH NGƯỜI CHĂM SÓC MÈO</h1>
                <p>Bằng cách sử dụng dịch vụ chăm sóc thú cưng trên MeowCare, tôi {formData.fullName}, đồng ý với các điều khoản và điều kiện sau đây:</p>

                <h2 className={styles.h2}>1. Thông tin thú cưng</h2>
                <ul className={styles.customList}>
                    <li>Tôi cam kết cung cấp thông tin chính xác và đầy đủ về sức khỏe, thói quen, và nhu cầu của thú cưng (bao gồm cả những vấn đề y tế hoặc hành vi đặc biệt nếu có).</li>
                </ul>

                <h2 className={styles.h2}>2. Quyền và trách nhiệm của người chăm sóc thú cưng</h2>
                <ul className={styles.customList}>
                    <li>Người chăm sóc thú cưng trên nền tảng sẽ đảm bảo cung cấp dịch vụ chăm sóc đúng theo thỏa thuận, bao gồm việc cho ăn, chơi, theo dõi sức khỏe, và các yêu cầu khác mà tôi đã đề cập.</li>
                    <li>Nếu người chăm sóc thú cưng gây ra bất kỳ vấn đề gì ảnh hưởng tiêu cực đến bản thân thú cưng hoặc các yếu tố bên ngoài (như người, tài sản), người chăm sóc sẽ chịu trách nhiệm phối hợp với chủ sở hữu để giải quyết. Việc này bao gồm đàm phán với chủ thú cưng về các biện pháp xử lý và chi phí liên quan nếu cần thiết.</li>
                </ul>

                <h2>3. Trách nhiệm về chi phí và thanh toán</h2>
                <ul className={styles.customList}>
                    <li>Tôi đồng ý thanh toán các khoản phí dịch vụ theo đúng thỏa thuận trên nền tảng.</li>
                    <li>Mọi giao dịch thanh toán sẽ được thực hiện qua MeowCare, và trang web sẽ thu phí 5% từ tổng thu nhập của người chăm sóc thú cưng cho mỗi giao dịch.</li>
                    <li>Các chi phí phát sinh khác (nếu có) trong quá trình chăm sóc thú cưng, chẳng hạn như thuốc men, thức ăn bổ sung, sẽ do tôi chi trả.</li>
                </ul>

                <h2>4. Cam kết an toàn</h2>
                <ul className={styles.customList}>
                    <li>Tôi xác nhận rằng thú cưng của mình không có hành vi hung hăng hoặc có nguy cơ gây hại cho người chăm sóc.</li>
                    <li>Nếu có vấn đề sức khỏe khẩn cấp xảy ra trong quá trình chăm sóc, tôi đồng ý rằng người chăm sóc có thể đưa thú cưng đến cơ sở thú y gần nhất và tôi sẽ chịu mọi chi phí phát sinh từ điều trị y tế.</li>
                </ul>

                <h2>5. Điều khoản khác</h2>
                <ul className={styles.customList}>
                    <li>Tôi hiểu và đồng ý rằng MeowCare chỉ là nền tảng kết nối và không chịu trách nhiệm trực tiếp về quá trình chăm sóc hoặc các vấn đề phát sinh trong quá trình này.</li>
                </ul>
            </div>
            <div className='flex w-full justify-end mt-3'>
                <Checkbox onChange={handleCheckboxChange} />
                <h3>Tôi đồng ý các điều khoản trên</h3>
            </div>
        </div>
    )
}

export default Agreement