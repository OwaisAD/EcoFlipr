import React from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";

type SearchResultsProps = {
  page: number;
  pageCount: number;
  saleOffers: SaleOffers;
  handlePreviousPage: () => void;
  handleNextPage: () => void;
};

const SearchResults = ({ page, pageCount, saleOffers, handlePreviousPage, handleNextPage }: SearchResultsProps) => {
  console.log("SEARCHRESULTS", saleOffers);
  return (
    <div className="flex flex-col gap-4">
      {saleOffers.length ? (
        <p className="text-xl font-light text-center m-4">
          Found {saleOffers.length} {saleOffers.length === 1 ? "result" : "results"}
        </p>
      ) : (
        <></>
      )}
      {saleOffers.map((saleOffer, idx) => (
        <SaleOfferBox key={idx} data={saleOffer} />
      ))}
      {/* PAGINATION HERE */}
      <div>
        <button disabled={page === 1} onClick={handlePreviousPage}>
          {"< Prev"}
        </button>
        <button disabled={page === pageCount} onClick={handleNextPage}>
          {"Next >"}
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
