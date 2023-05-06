import React from "react";
import { SaleOfferBasicForRecentAndRandom } from "../types/saleOffer";
import { isValidHttpUrl } from "../utils/urlValidator";

const SaleOffer = ({ saleOffer }: SaleOfferBasicForRecentAndRandom) => {
  return (
    <div className="transition ease-out hover:scale-105 duration-200 p-3 pb-4">
      <img
        className="h-40 w-40 p-[1.5px] border-2 object-cover cursor-pointer"
        src={isValidHttpUrl(saleOffer.imgs[0]) ? saleOffer.imgs[0] : `../../images/No-Image-Placeholder.svg.png`}
        alt="profile image"
      />
      <p className="text-xs w-16 truncate text-center">{saleOffer.description}</p>
    </div>
  );
};

export default SaleOffer;
