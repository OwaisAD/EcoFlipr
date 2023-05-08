import React from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";

type SearchResultsProps = {
  page: number;
  pageCount: number;
  searchQuery: string;
  saleOfferCount: number;
  saleOffers: SaleOffers;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getSaleOffers: any;
};

const SearchResults = ({
  page,
  pageCount,
  searchQuery,
  saleOfferCount,
  saleOffers,
  setPage,
  getSaleOffers,
}: SearchResultsProps) => {
  return (
    <div className="flex flex-col gap-4">
      {saleOffers.length ? (
        <p className="text-xl font-light text-center m-4">
          Found {saleOfferCount} {saleOfferCount === 1 ? "result" : "results"}
        </p>
      ) : (
        <></>
      )}
      {saleOffers.map((saleOffer, idx) => (
        <SaleOfferBox key={idx} data={saleOffer} />
      ))}
      {/* PAGINATION HERE */}
      <div>
        <button
          disabled={page === 1}
          onClick={() => {
            setPage((page) => {
              if (page === 1) return page;
              return page - 1;
            });
            getSaleOffers({ variables: { searchQuery, page: page - 1 } });
          }}
          className="bg-white shadow-md rounded-md p-3"
        >
          {"< Prev"}
        </button>
        <p>Page: {page}</p>
        <p>Page count: {pageCount}</p>

        <button
          disabled={page === pageCount}
          onClick={() => {
            setPage((page) => {
              if (page === pageCount) return page;
              return page + 1;
            });
            getSaleOffers({ variables: { searchQuery, page: page + 1 } });
          }}
          className="bg-white shadow-md rounded-md p-3"
        >
          {"Next >"}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
