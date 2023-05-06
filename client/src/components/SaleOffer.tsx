import React from "react";
import { SaleOfferBasicForRecentAndRandom } from "../types/saleOffer";
import { isValidHttpUrl } from "../utils/urlValidator";

const SaleOffer = ({ saleOffer }: SaleOfferBasicForRecentAndRandom) => {
  return (
    <div className=" sm:w-[200px] md:w-[240px] lg:w-[210px] inline-block cursor-pointer relative p-2 transition ease-out hover:scale-105 duration-200">
      <img
        className="h-40 w-40 block rounded-xl p-[1px] border object-cover cursor-pointer"
        src={isValidHttpUrl(saleOffer.imgs[0]) ? saleOffer.imgs[0] : `../../images/No-Image-Placeholder.svg.png`}
        alt="profile image"
      />
      <div className="absolute top-0 left-0 w-40 h-40 text-white  hover:bg-black/50 opacity-0 hover:opacity-100 rounded-xl m-2">
        <div className="white-space-normal text-xs md:text-sm flex flex-col justify-center items-center h-full text-center font-light gap-2">
          <p className="text-base">{saleOffer.description}</p>
          <p>{saleOffer.city.name}</p>
        </div>
      </div>
    </div>
  );
};

export default SaleOffer;
