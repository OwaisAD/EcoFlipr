import React from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";

const SearchResults = ({ saleOffers }: SaleOffers) => {
  return (
    <div className="flex flex-col gap-4">
      {saleOffers.length ? <p className="text-xl font-light text-center m-4">Found {saleOffers.length} {saleOffers.length === 1 ? "result" : "results"}</p> : <></>}
      {saleOffers.map((saleOffer, idx) => (
        <SaleOfferBox key={idx} data={saleOffer} />
      ))}
      {/* PAGINATION HERE */}
    </div>
  );
};

export default SearchResults;
