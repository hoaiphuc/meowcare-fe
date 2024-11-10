import { SideNavItem } from "@/app/constants/types/homeType";
import {
    faFile,
    faFlag,
    faHouse,
    faMoneyBillTransfer,
    faRectangleList,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const navbarManager: SideNavItem[] = [
    {
        title: "Trang chủ",
        path: "/manager",
        icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 " />,
    },
    {
        title: "Đơn đăng ký",
        path: "/manager/registrationform",
        icon: (
            <FontAwesomeIcon icon={faFile} className="w-7 h-7 " />
        ),
    },
    {
        title: "Người dùng",
        path: "/manager/user",
        icon: (
            <FontAwesomeIcon icon={faUser} className="w-7 h-7 " />
        ),
    },
    {
        title: "Bài kiểm tra",
        path: "/manager/quiz",
        icon: (
            <FontAwesomeIcon icon={faRectangleList} className="w-7 h-7" />
        ),
    },
    {
        title: "Báo cáo",
        path: "/manager/report",
        icon: (
            <FontAwesomeIcon icon={faFlag} className="w-7 h-7 " />
        ),
    },
    {
        title: "Giao dịch",
        path: "/manager/transaction",
        icon: (
            <FontAwesomeIcon icon={faMoneyBillTransfer} className="w-7 h-7" />
        ),
    },
];
