import Image from "next/image";
import React from "react";

const Page = () => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Image alt="Mountains" src="/manager.png" width={2000} height={2000} />
    </div>
  );
};

export default Page;
