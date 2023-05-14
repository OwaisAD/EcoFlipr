import React, { useEffect, useState } from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";
import { RxCross2 } from "react-icons/rx";
import PriceFilter from "./filtering/PriceFilter";
import CityFilter from "./filtering/CityFilter";
import CategoryFilter from "./filtering/CategoryFilter";

type SearchResultsProps = {
  page: number;
  pageCount: number;
  saleOfferCount: number;
  searchQuery: string;
  saleOffers: SaleOffers;
  setSaleOffers: React.Dispatch<React.SetStateAction<any>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getSaleOffers: any;
};

function scrollToTop() {
  window.scrollTo(0, 0);
}

const SearchResults = ({
  page,
  pageCount,
  saleOfferCount,
  searchQuery,
  saleOffers,
  setSaleOffers,
  setPage,
  getSaleOffers,
}: SearchResultsProps) => {
  // price filtering
  const [priceFilterOn, setPriceFilterOn] = useState(false);
  const [priceFiltering, setPriceFiltering] = useState(false);
  // city filtering
  const [cityFiltering, setCityFiltering] = useState(false);
  const [cityFilteringOn, setCityFilteringOn] = useState(false);
  // category filtering
  const [categoryFiltering, setCategoryFiltering] = useState(false);
  const [categoryFilteringOn, setCategoryFilteringOn] = useState(false);

  const [tempSaleOffers, setTempSaleOffers] = useState<any>([]);

  const handlePriceFilterChange = (type: string) => {
    if (!priceFilterOn) {
      setTempSaleOffers([...saleOffers]);
      setPriceFilterOn(true);
    }

    let filtered: any = [];
    if (type === "asc") {
      filtered = saleOffers.sort((a, b) => a.price - b.price);
    }

    if (type === "desc") {
      filtered = saleOffers.sort((a, b) => b.price - a.price);
    }
    setSaleOffers(filtered);
    setPriceFiltering(false);
  };

  const handleCityFilterChange = (city: string) => {
    if (!cityFilteringOn) {
      setTempSaleOffers([...saleOffers]);
      setCityFilteringOn(true);
    }

    let filtered = saleOffers.filter(
      (saleOffer) => saleOffer.city.name.includes(city) || saleOffer.city.zip_code.includes(city)
    );
    setSaleOffers(filtered);
    setCityFiltering(false);
  };

  const handleCategoryFilterChange = (category: string) => {
    if (!categoryFilteringOn) {
      setTempSaleOffers(saleOffers);
      setCategoryFilteringOn(true);
    }

    let filtered = saleOffers.filter((saleOffer) =>
      saleOffer.category.name.toLowerCase().includes(category.toLowerCase())
    );
    setSaleOffers(filtered);
    setCategoryFiltering(false);
  };

  const resetFilter = () => {
    setSaleOffers([...tempSaleOffers]);
    setPriceFiltering(false);
    setPriceFilterOn(false);
    setCityFiltering(false);
    setCategoryFiltering(false);
    setCategoryFilteringOn(false);
    setCityFilteringOn(false);
  };

  const [displayCount, setDisplayCount] = useState(saleOffers.length + (page - 1) * 10);
  const calculateCount = () => {
    setDisplayCount(saleOffers.length + (page - 1) * 10);
  };

  useEffect(() => {
    calculateCount();
  }, [saleOffers]);

  return (
    <div className="flex flex-col gap-4">
      {saleOffers.length ? (
        <>
          <p className="text-xl font-light text-center mt-4">
            Showing {displayCount} results of {saleOfferCount}
          </p>
        </>
      ) : (
        <></>
      )}

      {/* PAGINATION TOP */}
      <div className="flex items-center gap-3 justify-center m-3">
        <button
          disabled={page === 1}
          onClick={() => {
            setPage((page) => {
              if (page === 1) return page;
              return page - 1;
            });
            getSaleOffers({ variables: { searchQuery, page: page - 1 } });
          }}
          className={`bg-white shadow-md rounded-md p-3 ${page === 1 ? "cursor-not-allowed text-gray-400" : ""}`}
        >
          {"< Prev"}
        </button>
        <p>
          Page: {page} / {pageCount}
        </p>

        <button
          disabled={page === pageCount}
          onClick={() => {
            setPage((page) => {
              if (page === pageCount) return page;
              return page + 1;
            });
            getSaleOffers({ variables: { searchQuery, page: page + 1 } });
          }}
          className={`bg-white shadow-md rounded-md p-3 ${
            page === pageCount ? "cursor-not-allowed text-gray-400" : ""
          }`}
        >
          {"Next >"}
        </button>
      </div>

      {/* filtering */}
      <div className="flex items-center w-[500px] h-16 rounded-lg justify-between">
        <div className="flex gap-2">
          {/* sort by price */}
          <div>
            <PriceFilter
              priceFiltering={priceFiltering}
              setPriceFiltering={setPriceFiltering}
              handlePriceFilterChange={handlePriceFilterChange}
            />
          </div>
          {/* sort by city */}
          <div>
            <CityFilter
              cityFiltering={cityFiltering}
              setCityFiltering={setCityFiltering}
              handleCityFilterChange={handleCityFilterChange}
            />
          </div>
          {/* sort by category */}
          <div>
            <CategoryFilter
              categoryFiltering={categoryFiltering}
              setCategoryFiltering={setCategoryFiltering}
              handleCategoryFilterChange={handleCategoryFilterChange}
            />
          </div>
          {/* sort by is_shippable */}
          <div>
            {(priceFilterOn || categoryFilteringOn || cityFilteringOn) && (
              <p className="my-2 font-light text-sm">Filtering on</p>
            )}
          </div>
        </div>
        {/* RESET */}
        <div className="bg-gray-400 rounded-full p-[2px] cursor-pointer hover:scale-110" onClick={resetFilter}>
          <RxCross2 className="text-white text-xs" />
        </div>
      </div>

      {/* DISPLAYING SALE OFFER BOXES */}
      {saleOffers.map((saleOffer, idx) => (
        <SaleOfferBox key={idx} data={saleOffer} />
      ))}

      {/* PAGINATION BOTTOM */}
      <div className="flex items-center gap-3 justify-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => {
            setPage((page) => {
              if (page === 1) return page;
              return page - 1;
            });
            getSaleOffers({ variables: { searchQuery, page: page - 1 } });
            scrollToTop();
          }}
          className={`bg-white shadow-md rounded-md p-3 ${page === 1 ? "cursor-not-allowed text-gray-400" : ""}`}
        >
          {"< Prev"}
        </button>
        <p>
          Page: {page} / {pageCount}
        </p>

        <button
          disabled={page === pageCount}
          onClick={() => {
            setPage((page) => {
              if (page === pageCount) return page;
              return page + 1;
            });
            getSaleOffers({ variables: { searchQuery, page: page + 1 } });
            scrollToTop();
          }}
          className={`bg-white shadow-md rounded-md p-3 ${
            page === pageCount ? "cursor-not-allowed text-gray-400" : ""
          }`}
        >
          {"Next >"}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
