import { SideNavItem } from "@/app/constants/types/homeType";
import {
  faHouse,
  faSliders,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const navbarAdmin: SideNavItem[] = [
  {
    title: "Trang chủ",
    path: "/admin",
    icon: <FontAwesomeIcon icon={faHouse} className="w-7 h-7 text-[#FF0004]" />,
  },
  {
    title: "Cài đặt hệ thống",
    path: "/admin/setting",
    icon: (
      <FontAwesomeIcon icon={faSliders} className="w-7 h-7 text-[#FF0004]" />
    ),
  },
];
