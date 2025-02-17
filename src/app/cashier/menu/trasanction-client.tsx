"use client";

import { useState } from "react";
import Image from "next/image";
import { IMenu } from "@/app/types";
import { BASE_IMAGE_MENU } from "../../../../global";
import { AlertInfo } from "@/components/alert";
import QuantityCounter from "./transaction-count";

interface TransactionClientProps {
  menu: IMenu[];
}

const TransactionClient = ({ menu }: TransactionClientProps) => {
  const [quantities, setQuantities] = useState<number[]>(menu.map(() => 1));

  const handleQuantityChange = (index: number, value: number) => {
    const updatedQuantities = [...quantities];
    updatedQuantities[index] = value;
    setQuantities(updatedQuantities);
  };

  return (
    <div className="w-full h-hit flex justify-center">
      <div className="w-[60%] h-fit">
        {menu.length === 0 ? (
          <AlertInfo title="informasi">No data Available</AlertInfo>
        ) : (
          <div className="w-full flex flex-wrap ">
            {menu.map((data, index) => (
              <div
                key={`menuItem-${index}`}
                className="flex flex-col w-[30%] h-80 cursor-pointer bg-[#5e606c] mr-5 mb-4 rounded"
              >
                <div className="h-48 w-full overflow-hidden flex items-end justify-center rounded">
                  <Image
                    width={40}
                    height={40}
                    src={`${BASE_IMAGE_MENU}/${data.picture}`}
                    className="w-full h-48 object-cover rounded"
                    alt="preview"
                    unoptimized
                  />
                </div>

                <div className="w-full h-full sfprodisplay relative">
                  <div className="text-white text-opacity-60 pt-4 ml-4 w-full">
                    {data.category}
                  </div>
                  <div className="w-full text-white text-2xl tracking-wide py-1 font-semibold ml-4">
                    {data.name}
                  </div>
                  <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-11/12 flex justify-between ml-4">
                    <p className="mr-2">{data.description}</p>
                  </div>
                  <div className="text-white text-opacity-70 text-sm tracking-wide pt-2 w-full flex justify-between ml-4">
                    <p className="text-xl">Rp {data.price}</p>
                  </div>
                </div>

                <QuantityCounter
                  initialQuantity={quantities[index]}
                  min={1}
                  max={10}
                  onChange={(value) => handleQuantityChange(index, value)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* cart  */}
      <div className="w-[25%] h-[75dvh] relative ">
        <div className="h-[75dvh] w-[25%] fixed top-40 bg-[#f5f5f5] rounded"></div>
      </div>
    </div>
  );
};

export default TransactionClient;
