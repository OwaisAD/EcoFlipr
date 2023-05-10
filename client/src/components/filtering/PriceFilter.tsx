import React from "react";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

type Props = {
  priceFiltering: boolean;
  setPriceFiltering: React.Dispatch<React.SetStateAction<boolean>>;
};

const PriceFilter = ({ priceFiltering, setPriceFiltering }: Props) => {
  return (
    <div>
      <button
        className="p-2 shadow-lg rounded-lg bg-white hover:bg-slate-300 flex items-center gap-2"
        onClick={() => setPriceFiltering(!priceFiltering)}
      >
        Price
        <span className="text-[10px]">
          <AiOutlineArrowUp />
          <AiOutlineArrowDown />
        </span>
      </button>
      {priceFiltering && (
        <div className="absolute bg-white z-50 rounded-lg mt-2 flex flex-col p-1 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <button className="flex gap-3 items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-200  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer font-light">
            <AiOutlineArrowUp size={18} className="text-gray-500" /> Sort Ascending
          </button>
          <button className="flex gap-3 items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-200  dark:text-white dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer font-light">
            <AiOutlineArrowDown className="text-gray-500" /> Sort Descending
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceFilter;
