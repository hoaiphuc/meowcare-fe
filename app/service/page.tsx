"use client";

import {
  Avatar,
  Button,
  DateRangePicker,
  DateValue,
  Input,
  RangeValue,
  Select,
  SelectItem,
  Slider,
} from "@nextui-org/react";
// import data from '@/app/lib/vietnam.json';
import {
  faCircle,
  faMagnifyingGlass,
  faRoad,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { Icon } from "@iconify/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CatSitter, UserLocal } from "../constants/types/homeType";
import useGeoapify from "../hooks/useGeoapify";
import axiosClient from "../lib/axiosClient";
import styles from "./service.module.css";
const Map = dynamic(() => import("../components/Map"), { ssr: false });
import { getLocalTimeZone, today } from "@internationalized/date";
import ComponentLoading from "../components/ComponentLoading";

interface CatSitterData {
  content: [CatSitter];
}

interface Address {
  lon: number;
  lat: number;
  formatted: string;
}

const Service = () => {
  const [selectedService, setSelectedService] = useState<string>("");
  const [catSitters, setCatSitters] = useState<CatSitterData>();
  const [price, setPrice] = useState<number[]>([20000, 2000000]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //search location
  const [address, setAddress] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const geoSuggestions = useGeoapify(query);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [lat, setLat] = useState<number>();
  const [lng, setLng] = useState<number>();
  const [startTime, setStartTime] = useState<string | null>(""); // Store start time
  const [endTime, setEndTime] = useState<string | null>(""); // Store end time
  const getUserFromStorage = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    }
  };
  const user: UserLocal | null = getUserFromStorage();

  useEffect(() => {
    if (user && user.address) {
      const fetchLatLng = async () => {
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
              user.address
            )}&apiKey=7eaa555d1d1f4dbe9b2792ee9c726f10`
          );
          const data = await response.json();
          if (data && data.features && data.features[0]) {
            setLat(data.features[0].geometry.coordinates[1]);
            setLng(data.features[0].geometry.coordinates[0]);
          }
        } catch (error) {
          console.error("Error fetching geocoding data:", error);
        }
      };
      fetchLatLng();
    }
    console.log("user change??");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setQuery(newAddress);
    setShowSuggestions(true);
  };
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: Address) => {
    setAddress(suggestion.formatted);
    setQuery("");
    setShowSuggestions(false);
    setLat(suggestion.lat);
    setLng(suggestion.lon);
  };

  const listItemRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Function to scroll to a list item
  const scrollToListItem = (id: string) => {
    const element = listItemRefs.current[id];
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const services = [
    { id: "MAIN_SERVICE", serviceName: "Gửi thú cưng" },
    { id: "ADDITION_SERVICE", serviceName: "Dịch vụ khác" },
  ];

  const [selectedCatNumber, setSelectedCatNumber] = useState<number>();
  const options = [
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3, name: "3+" }
  ];

  // Handle service change
  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  //fake favorites button
  // const [isClicked, setIsClicked] = useState(false);

  // // Function to handle click
  // const handleClick = () => {
  //   setIsClicked(!isClicked); // Toggle the state
  // };

  //change price range
  const handleInputChange = (index: number, value: string) => {
    const newPrice = [...price];
    newPrice[index] = Number(value);
    setPrice(newPrice);
  };

  //get cat sitters   
  useEffect(() => {
    setIsLoading(true)
    try {
      axiosClient(
        `sitter-profiles/search?latitude=${lat ?? 10.8231}&longitude=${lng ?? 106.6297}&page=1&size=10&sort=distance&direction=DESC`
      )
        .then((res) => {
          setCatSitters(res.data);
          setIsLoading(false)
        })
        .catch((e) => {
          setIsLoading(false)
          console.log(e);
        });
    } catch (error) {
      setIsLoading(false)
      console.log(error);
    }
  }, [lat, lng]);

  // Handle date range change
  const handleDateRangeChange = (range: RangeValue<DateValue> | null) => {
    if (range) {
      const { start, end } = range;
      setStartTime(
        start
          ? new Date(start.toString()).toISOString().split("T")[0] // Extract only YYYY-MM-DD
          : null
      );
      setEndTime(
        end
          ? new Date(end.toString()).toISOString().split("T")[0] // Extract only YYYY-MM-DD
          : null
      );
    }
  };

  const handleSearch = async () => {
    setIsLoading(true); // Show loading
    try {
      if (address) {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
            address
          )}&apiKey=7eaa555d1d1f4dbe9b2792ee9c726f10`
        );
        const data = await response.json();
        if (data && data.features && data.features[0]) {
          setLat(data.features[0].geometry.coordinates[1]);
          setLng(data.features[0].geometry.coordinates[0]);
        }
      }

      axiosClient(
        `sitter-profiles/search?latitude=${lat ?? 10.8231}&longitude=${lng ?? 106.6297
        }&serviceType=${selectedService}&minPrice=${price[0]}&maxPrice=${price[1]}&startTime=${startTime}&endTime=${endTime}&page=1&size=10&sort=distance&direction=DESC`
      )
        .then((res) => {
          setCatSitters(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
    } finally {
      setIsLoading(false); // Hide loading
    }
  };

  return (
    <div className="flex flex-cols-3 p-[5px] justify-center">
      {/* 1 */}
      <div className="bg-[#FFF6ED] w-[310px] h-auto flex flex-col gap-3 p-[10px] border-[1px] rounded-xl border-blue-100  hover: hover:border-blue-300 transition-all ">
        <Select
          label={<h2 className={styles.h2}>Loại dịch vụ</h2>}
          labelPlacement="outside"
          placeholder="Chọn dịch vụ"
          className={`${styles.h2} min-w-full`}
          variant="bordered"
          defaultSelectedKeys={selectedService}
          onChange={(event) => handleServiceChange(event.target.value)}
        >
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.serviceName}
            </SelectItem>
          ))}
        </Select>

        <h2 className={styles.h2}>Địa chỉ</h2>
        <div className="relative">
          <Input
            className={styles.searchInput}
            value={address}
            variant="bordered"
            onChange={handleAddressChange}
            placeholder="Nhập địa điểm bạn muốn tìm"
          />
          {showSuggestions && geoSuggestions.length > 0 && (
            <div className={styles.suggestionsDropdown}>
              {geoSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={styles.suggestionItem}
                  onClick={() =>
                    handleSuggestionClick(suggestion.properties as Address)
                  }
                >
                  <p>{suggestion.properties.formatted}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <h2 className={styles.h2}>Đặt lịch</h2>
        <DateRangePicker
          label="Stay duration"
          className="max-w-[388px]"
          variant="bordered"
          minValue={today(getLocalTimeZone()).add({ days: 1 })}
          onChange={handleDateRangeChange}
        />

        <div className="flex flex-col gap-3">
          <h2 className={styles.h2}>Số lượng thú cưng</h2>
          <div className={styles.optionsContainer}>
            {options.map((option) => (
              <div
                key={option.id}
                className={`${styles.option} ${selectedCatNumber === option.id ? `${styles.selected}` : ""
                  }`}
                onClick={() => setSelectedCatNumber(option.id)}
              >
                {option.name}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className={styles.h2}>Giá mỗi giờ</h2>
          <div className="flex gap-3 justify-center items-center">
            <Input
              aria-label="Giá tối thiểu"
              type="number"
              variant="bordered"
              value={price[0].toString().toLocaleString()}
              onChange={(e) => handleInputChange(0, e.target.value)}
              className={styles.input}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">đ</span>
                </div>
              }
            />
            <p>~</p>
            <Input
              aria-label="Giá tối đa"
              type="number"
              variant="bordered"
              value={price[1].toString().toLocaleString()}
              onChange={(e) => handleInputChange(1, e.target.value)}
              className={styles.input}
              endContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">đ</span>
                </div>
              }
            />
          </div>
          <Slider
            aria-label="price range"
            step={50}
            minValue={20000}
            maxValue={2000000}
            defaultValue={[100, 500]}
            value={price}
            // getValue={(price) => `${price}đ`}
            onChange={(value) => {
              const newValue = Array.isArray(value) ? value : [value];
              setPrice(newValue);
            }}
            formatOptions={{ style: "currency", currency: "VND" }}
            className="max-w-md"
          />
        </div>

        <div className="flex items-center justify-end">
          <Button
            className="h-12 w-28 font-semibold"
            variant="bordered"
            onClick={() => handleSearch()}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Tìm kiếm
          </Button>
        </div>
      </div>

      {/* 2 */}
      <div className="relative flex flex-col justify-start items-start w-[909px] rounded-xl text-black bg-[#FFF6ED] h-[900px] overflow-auto scrollbar-hide px-4">
        {isLoading && <ComponentLoading />}
        {catSitters && catSitters.content.length > 0 ? (
          catSitters.content.map((catSitter, index) => (
            <div
              key={catSitter.id}
              ref={(el) => {
                listItemRefs.current[catSitter.id] = el;
              }}
              className={`${styles.selectDiv} min-w-full border-b pb-3 bg-[#FFF6ED]`}
            >
              <Link href={`/service/sitterprofile/${catSitter.sitterId}`}>
                <div className="flex gap-3 cursor-pointer">
                  <Avatar
                    src={catSitter?.avatar || "/User-avatar.png"}
                    className="min-h-[80px] min-w-[80px]"
                  />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                      <p className="text-[26px] font-semibold">
                        <span className="font-bold">{index + 1}. </span>
                        {catSitter.fullName}
                      </p>
                      {/* <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClick();
                        }}
                      >
                        <Icon
                          icon="mdi:heart"
                          className={`transition-colors size-3 ${isClicked ? "text-red-500" : ""
                            }`}
                        />
                      </button> */}
                    </div>
                    {/* <p className="text-xs line-clamp-1">{catSitter.bio}</p> */}
                    <p className="text-[15px] ml-1">Địa chỉ: {catSitter.location}</p>
                  </div>
                  <div className="ml-auto flex flex-col text-right min-w-20">
                    <p className="text-xs font-semibold text-right">
                      Giá mỗi ngày
                    </p>
                    <p className="text-[20px] font-semibold text-[#2B764F]">
                      {catSitter.mainServicePrice ? catSitter.mainServicePrice.toLocaleString("de") : 0}đ
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 text-[#66625F] mt-3 mb-2x`">
                  <FontAwesomeIcon
                    icon={faStar}
                    className="text-[#F8B816] size-4"
                  />
                  <p className="text-[14px] font-normal">
                    {catSitter.rating ? catSitter.rating : "Chưa có đánh giá"}
                  </p>
                  <FontAwesomeIcon
                    icon={faCircle}
                    className="text-text size-1 self-center px-1"
                  />
                  {/* <p className=' text-[14px] font-normal'>{catSitter.reviews} Đánh giá</p> */}
                  <p className="text-[14px] font-normal">{catSitter.numberOfReview ? catSitter.numberOfReview : "không có"} đánh giá</p>
                </div>
                <p className="text-[14px] my-2 line-clamp-1">{catSitter.bio}</p>
                <div className="flex font-semibold text-[#66625F]">
                  <FontAwesomeIcon
                    icon={faRoad}
                    className="text-green-600 size-4 self-center px-1"
                  />
                  <p className="text-[13px]">
                    Khoảng cách đến đó: {Math.round(catSitter.distance)} km
                  </p>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="flex flex-col justify-center items-center px-32 py-10">
            <p className="text-xl font-semibold">
              Chúng tôi không tìm thấy người chăm sóc thú cưng nào.
            </p>
            <p className="text-[18px]">
              Hãy thử thay đổi tiêu chí tìm kiếm hoặc cập nhật vị trí của bạn.{" "}
            </p>
          </div>
        )}
      </div>
      {/* 3 */}
      <div className="w-[735px] flex">
        <Map
          markers={catSitters ? catSitters.content : []}
          onMarkerClick={scrollToListItem}
          defaultLat={lat}
          defaultLng={lng}
        />
      </div>
    </div>
  );
};

export default Service;
