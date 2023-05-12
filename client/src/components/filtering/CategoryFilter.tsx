import React, { useState } from "react";
import { BiCategoryAlt } from "react-icons/bi";

type Props = {
  categoryFiltering: boolean;
  setCategoryFiltering: React.Dispatch<React.SetStateAction<boolean>>;
  handleCategoryFilterChange: (category: string) => void;
};

const CategoryFilter = ({ categoryFiltering, setCategoryFiltering, handleCategoryFilterChange }: Props) => {
  const [category, setCategory] = useState("");
  return (
    <div>
      <button
        className="p-2 shadow-md rounded-lg bg-white hover:bg-slate-300 flex items-center gap-2  text-gray-700"
        onClick={() => setCategoryFiltering(!categoryFiltering)}
      >
        Filter category
        <BiCategoryAlt className="text-[12px]" />
      </button>
      {categoryFiltering && (
        <div className="absolute bg-white z-50 rounded-lg mt-2 flex flex-col p-1 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCategoryFilterChange(category);
            }}
          >
            <input
              type="text"
              placeholder="Enter category"
              className="border-none rounded-lg"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
