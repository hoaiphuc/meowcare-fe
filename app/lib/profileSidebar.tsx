import { ProfileSidebarItem } from '@/app/constants/types/homeType';
import {
    faAddressCard,
    faLock,
    faWallet,
    faFileSignature,
    faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const profileSidebar: ProfileSidebarItem[] = [
    {
        title: 'Hồ sơ',
        path: '/profile',
        icon: (
            <FontAwesomeIcon
                icon={faAddressCard}
                className="h-7 w-7 text-[#902C6C]"
            />
        ),
    },
    {
        title: 'Đổi mật khẩu',
        path: '/profile/changepassword',
        icon: <FontAwesomeIcon icon={faLock} className="h-7 w-7 text-[#902C6C]" />,
    },
    {
        title: 'Hoạt động',
        path: '/profile/activity',
        icon: (
            <FontAwesomeIcon icon={faWallet} className="h-7 w-7 text-[#902C6C]" />
        ),
    },

    {
        title: 'Thú cưng của bạn',
        path: '/profile/pet',
        icon: (
            <FontAwesomeIcon
                icon={faFileSignature}
                className="h-7 w-7 text-[#902C6C]"
            />
        ),
    },

    {
        title: 'Lịch sử giao dịch',
        path: '/profile/transactionhistory',
        icon: (
            <FontAwesomeIcon
                icon={faClockRotateLeft}
                className="h-7 w-7 text-[#902C6C]"
            />
        ),
    },

];