import React from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";

const SearchResults = ({ saleOffers }: SaleOffers) => {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-xl font-light text-center">Found {saleOffers.length} results</p>
      {saleOffers.map((saleOffer, idx) => (
        <SaleOfferBox key={idx} data={saleOffer} />
      ))}
      s {/* PAGINATION HERE */}
    </div>
  );
};

export default SearchResults;
