"use client";

import { useState } from "react";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

interface QuantityCounterProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const QuantityCounter = ({ initialQuantity = 0, min = 0, max = 99, onChange }: QuantityCounterProps) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => {
    setQuantity((prev) => {
      const newQuantity = prev + 1 > max ? max : prev + 1;
      if (onChange) onChange(newQuantity);
      return newQuantity;
    });
  };

  const decrement = () => {
    setQuantity((prev) => {
      const newQuantity = prev - 1 < min ? min : prev - 1;
      if (onChange) onChange(newQuantity);
      return newQuantity;
    });
  };

  return (
    <div className="bg-[#747474] flex gap-2 mt-4 p-2 rounded-full items-center w-32  justify-between">
      <button onClick={increment} className="h-8 w-8 flex items-center justify-center hover:opacity-80">
        <FaCirclePlus className="h-full w-full text-teal-400" />
      </button>

      <p className="sfprodisplay font-semibold text-white">{quantity}</p>

      <button onClick={decrement} className="h-8 w-8 flex items-center justify-center hover:opacity-80">
        <FaCircleMinus className="h-full w-full text-red-400" />
      </button>
    </div>
  );
};

export default QuantityCounter