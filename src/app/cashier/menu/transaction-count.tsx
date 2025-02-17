"use client";

import { useState } from "react";
import { FaCirclePlus, FaCircleMinus } from "react-icons/fa6";

interface QuantityCounterProps {
  initialQuantity?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

const QuantityCounter = ({ initialQuantity = 1, min = 1, max = 99, onChange }: QuantityCounterProps) => {
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
    <div className="border border-blue-500 flex gap-2 px-5 pb-5 items-center">
      <button
        onClick={decrement}
        className="h-6 w-6 flex items-center justify-center hover:opacity-80"
      >
        <FaCircleMinus className="h-full w-full text-white text-opacity-60" />
      </button>

      <p>{quantity}</p>

      <button
        onClick={increment}
        className="h-6 w-6 flex items-center justify-center hover:opacity-80"
      >
        <FaCirclePlus className="h-full w-full text-teal-400 text-opacity-60" />
      </button>
    </div>
  );
};

export default QuantityCounter;
