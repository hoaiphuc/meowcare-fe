// import Image from "next/image";

import Image from "next/image";
import { Button } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons/faPhone";
import { faApple, faFacebookF, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons"

export default function Home() {
  return (
    <div className="mt-10">

      <div className="grid grid-cols-2">
        <div className="flex flex-col items-start justify-center ml-64">
          <h1 className="text-5xl font-semibold">Tìm kiếm người đồng hành đáng tín cậy cho bé cưng của bạn</h1>
          <h3 className="text-xl text-secondary font-semibold mt-10">Chúng tôi sẽ giúp bạn giải quyết nỗi lo gửi giữ thú cưng khi bạn bận rộn và không thể tự chăm sóc chúng.</h3>
          <div className="flex gap-10 justify-center items-center mt-16">
            <Button className="bg-[#FF5B2E] text-white rounded-full w-56 h-16 text-2xl font-semibold">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="h-5 w-5" />
              Tìm kiếm
            </Button>
            <Button className="bg-[#fffaf5] text-2xl font-semibold">
              <FontAwesomeIcon icon={faPhone} className="h-5 w-5 " />
              Liên hệ
            </Button>
          </div>
        </div>
        <div className="flex justify-end">
          <Image src="/image/cat1.png" alt="" width={374} height={551} className="mt-20" />
          <Image src="/image/cat7.png" alt="" width={235} height={350} className="mb-10 flex justify-end items-end" />
        </div>
      </div>

      <hr className="mt-20" />
      <div className="flex flex-row p-32">
        <Image src="/image/cat3.png" alt="" width={238} height={253} />
        <h1 className="text-4xl font-semibold flex items-center text-center px-32">Trong khi bạn đang đi nghỉ hoặc làm việc có thể khiến bạn trở nên lo lắng.</h1>
        <Image src="/image/cat4.png" alt="" width={248} height={178} />
      </div>

      <div className="bg-[#FFE3D5]  mx-64 rounded-3xl items-center flex p-8">
        <Image src="/image/cat5.png" alt="" width={328} height={554} />
        <div className="flex flex-col px-10 gap-12">
          <h1 className="text-5xl font-semibold">Làm thế nào để chăm sóc ____ hoàng thượng của bạn</h1>
          <div className="text-2xl font-semibold text-[#  ] gap-5 flex flex-col">
            <h1>Là cha mẹ của thú cưng, việc để thú cưng ở nhà khi bạn đi nghỉ hay đi làm có thể khiến bạn lo lắng.</h1>
            <h1>Tìm người chăm sóc mèo tưởng dễ nhưng thực ra khó. Bạn cần ai đó hiểu rõ tính cách, thói quen, nhu cầu của thú cưng và đáng tin cậy.</h1>
            <h1>Đây là lý do tại sao việc tìm kiếm một người chăm sóc thú cưng đáng tin cậy lại quan trọng đến vậy.</h1>
          </div>
        </div>
      </div>

      <div className="flex my-20 mx-60 font-semibold">
        <div className="">
          <h1 className="text-5xl">Dịch vụ của chúng tôi</h1>
          <h1 className="text-2xl text-[#666089] mt-5 mb-10">Với tư cách là một nhóm gồm những người chủ và người yêu mèo giàu kinh nghiệm, chúng tôi thực sự hiểu rõ bạn và thú cưng của bạn.</h1>
          <ul className="text-2xl text-[#666089] gap-5 flex flex-col">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
              Kết nối người chăm sóc mèo đáng tin cậy.
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
              Gửi mèo đến nơi chăm sóc an toàn.
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faCheck} className="text-[#FF6338] bg-[#FFF2E5] rounded-full p-2 mr-5" />
              Theo dõi tình hình thú cưng.
            </li>
          </ul>
        </div>
        <Image src="/image/cat6.png" alt="" width={575} height={366} className="ml-32" />
      </div>

      <div className="bg-[#FFE3D5] flex mx-72 my-20 rounded-3xl py-24 px-20">
        <Image src="/phoneIMG/phone.png" alt="" width={591} height={315} />
        <div className="items-center flex flex-col justify-center gap-10">
          <h1 className="text-5xl font-semibold text-center">Kết nối mọi nơi với ứng dụng MeowCare</h1>
          <div className="flex items-center justify-center gap-5">
            {/* <Link className="w-[188px] h-[56px]" href="#" >
              <Image src="/phoneIMG/apple2.png" alt="" width={188} height={56} className="" />
            </Link>
            <Link className="w-[188px] h-[56px]" href="#" >
              <Image src="/phoneIMG/chplay.png" alt="" width={188} height={100} className="" />
            </Link> */}
            <Button className="bg-black text-white w-56 h-20 ">
              <FontAwesomeIcon icon={faApple} className="size-10" />
              <div className="flex flex-col text-left text-xl">
                Tải về từ
                <p className="font-semibold">Apple Store</p>
              </div>
            </Button>
            <Button className="bg-black text-white w-56 h-20 px-10">
              <Image src="/phoneIMG/chplaylogo.png" alt="" width={50} height={50} />
              <div className="flex flex-col text-left text-sm">
                TẢI NỘI DUNG TRÊN
                <p className="font-semibold">Google Play</p>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 px-20 py-10">
        <div>
          <h1 className="text-3xl font-semibold">Sơ lượt về MeowCare</h1>
          <div className="text-2xl font-semibold text-[#666089] gap-2 mt-5 flex flex-col">
            <p>Về chúng tôi</p>
            <p>Q&A và cộng đồng</p>
            <p>Cửa hàng MeowCare</p>
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Thông tin liên hệ</h1>
          <div className="text-2xl font-semibold text-[#666089] gap-2 mt-5 flex flex-col">
            <p>SĐT: (+84) 905038520</p>
            <p>Email: MeowCare@gmail.com</p>
          </div>
        </div>
        <div>
          <Image src="/meow.png" alt="" width={240} height={110} />
          <div className="flex gap-10 mt-10">
            <FontAwesomeIcon icon={faFacebookF} className="size-10 bg-white rounded-full" />
            <FontAwesomeIcon icon={faInstagram} className="size-10 text-[#FF5B2D]" />
            <FontAwesomeIcon icon={faTwitter} className="size-10 text-[#70B5EC]" />
          </div>
        </div>
      </div>

    </div >
  );
}
