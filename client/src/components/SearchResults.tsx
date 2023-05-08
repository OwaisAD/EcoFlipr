import React from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";

type SearchResultsProps = {
  page: number;
  pageCount: number;
  saleOfferCount: number;
  searchQuery: string;
  saleOffers: SaleOffers;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getSaleOffers: any;
};

const SearchResults = ({
  page,
  pageCount,
  saleOfferCount,
  searchQuery,
  saleOffers,
  setPage,
  getSaleOffers,
}: SearchResultsProps) => {
  console.log(page === pageCount);
  console.log(saleOfferCount - saleOffers.length);

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
    </div>
  );
};

export default SearchResults;
