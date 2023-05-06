import React from "react";
import { SaleOffers } from "../types/saleOffer";
import SaleOfferBox from "./SaleOfferBox";

const SearchResults = ({ saleOffers }: SaleOffers) => {
  return (
    <div>
      <p>Found {saleOffers.length} results</p>
      {saleOffers.map((saleOffer, idx) => (
        <SaleOfferBox key={idx} data={saleOffer} />
      ))}
    </div>
  );
};

export default SearchResults;
