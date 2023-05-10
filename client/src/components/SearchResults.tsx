import React, { useState } from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";
import { RxCross2 } from "react-icons/rx";
import PriceFilter from "./filtering/PriceFilter";

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
  const [priceFilterOn, setPriceFilterOn] = useState(false);
  const [priceFiltering, setPriceFiltering] = useState(false);
  const [tempSaleOffers, setTempSaleOffers] = useState<any>([]);

  const handlePriceFilterChange = (type: string) => {
    if (!priceFilterOn) {
      setTempSaleOffers(saleOffers);
      setPriceFilterOn(true);
    }

    // set midlertidig state til at være den gamle saleOffer
    // set saleOffers til at være filteret alt efter price ascending eller descending
    let filtered: any = [];
    if (type === "asc") {
      console.log("sorting asc");
      filtered = saleOffers.sort((a, b) => a.price - b.price);
    }

    if (type === "desc") {
      console.log("sorting desc");
      filtered = saleOffers.sort((a, b) => b.price - a.price);
    }
    setSaleOffers(filtered);
    setPriceFiltering(false);
  };

  const resetFilter = () => {
    setSaleOffers(tempSaleOffers.concat(saleOffers));
    setPriceFiltering(false);
    setPriceFilterOn(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {saleOffers.length ? (
        <>
          <p className="text-xl font-light text-center mt-4">
            Showing
            {page === pageCount && saleOfferCount !== 1 && (saleOfferCount - saleOffers.length) % 20 === 0
              ? ` ${saleOffers.length + 20} `
              : ` ${saleOffers.length} `}
            {saleOffers.length === 1 ? "result" : "results"} of {saleOfferCount}
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
        <div>
          {/* sort by price */}
          <div>
            <PriceFilter
              priceFiltering={priceFiltering}
              setPriceFiltering={setPriceFiltering}
              handlePriceFilterChange={handlePriceFilterChange}
            />
          </div>
          {/* sort by zip_code */}
          <div></div>
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
