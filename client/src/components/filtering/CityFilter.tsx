import React, { useState } from "react";
import { FaCity } from "react-icons/fa";

type Props = {
  cityFiltering: boolean;
  setCityFiltering: React.Dispatch<React.SetStateAction<boolean>>;
  handleCityFilterChange: (city: string) => void;
};

const CityFilter = ({ cityFiltering, setCityFiltering, handleCityFilterChange }: Props) => {
  const [city, setCity] = useState("");
  return (
    <div>
      <button
        className="p-2 shadow-md rounded-lg bg-white hover:bg-slate-300 flex items-center gap-2  text-gray-700"
        onClick={() => setCityFiltering(!cityFiltering)}
      >
        Filter city
        <FaCity className="text-[12px]" />
      </button>
      {cityFiltering && (
        <div className="absolute bg-white z-50 rounded-lg mt-2 flex flex-col p-1 dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCityFilterChange(city);
            }}
          >
            <input
              type="text"
              placeholder="Enter zip or city name"
              className="border-none rounded-lg"
              onChange={(e) => setCity(e.target.value)}
              value={city}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export default CityFilter;
