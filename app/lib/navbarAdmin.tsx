import { SideNavItem } from "@/app/constants/types/homeType";
import {
  faClipboardList,
  faHouse,
  faSliders,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const navbarAdmin: SideNavItem[] = [
  {
    title: "Trang chủ",
    path: "/admin",
    icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 " />,
  },

  {
    title: "Người dùng",
    path: "/admin/user",
    icon: <FontAwesomeIcon icon={faUser} className="w-7 h-7" />,
  },
  {
    title: "Cài đặt dịch vụ",
    path: "/admin/service",
    icon: <FontAwesomeIcon icon={faClipboardList} className="w-7 h-7" />,
  },
  {
    title: "Cài đặt hệ thống",
    path: "/admin/setting",
    icon: <FontAwesomeIcon icon={faSliders} className="w-7 h-7" />,
  },
];
