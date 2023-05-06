import React from "react";
import { SaleOfferBasicForRecentAndRandom } from "../types/saleOffer";

const SaleOffer = ({saleOffer}: SaleOfferBasicForRecentAndRandom) => {
  return (
    <div className="w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2">
      <img
        className="h-40 w-40 rounded-xl object-cover  transition duration-300 ease-in-out hover:scale-110 block"
        src={saleOffer.imgs[0]}
        alt={saleOffer.description}
      />
      <div className="absolute top-0 left-0 w-full h-full hover:bg-black/50 opacity-0 hover:opacity-100 text-white">
        <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full text-center">
          {saleOffer.description}
        </p>
    
      </div>
    </div>
  );
};

export default SaleOffer;
