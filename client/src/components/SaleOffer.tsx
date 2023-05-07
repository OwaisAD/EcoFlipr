import React, { useState } from "react";
import { isValidHttpUrl } from "../utils/urlValidator";
import { SaleOfferBasic } from "../types/saleOffer";
import { useNavigate, Link } from "react-router-dom";

type SaleOfferProps = {
  saleOffer: SaleOfferBasic;
};

const SaleOffer = ({ saleOffer }: SaleOfferProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <Link to={`/offer/${saleOffer.id}`}>
      <div className=" sm:w-[190px] md:w-[200px] lg:w-[210px] inline-block cursor-pointer relative p-2 transition ease-out hover:scale-105 duration-200">
        <img
          className="h-40 w-40 block rounded-xl p-[1px] border object-cover cursor-pointer"
          src={isValidHttpUrl(saleOffer.imgs[0]) ? saleOffer.imgs[0] : `../../images/No-Image-Placeholder.svg.png`}
          alt="profile image"
        />
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="absolute top-0 left-0 w-40 h-40 text-white  hover:bg-black/60 opacity-0 hover:opacity-100 rounded-xl m-2 z-50"
        >
          <div className="white-space-normal text-xs md:text-sm flex flex-col justify-center items-center h-full text-center font-light gap-2">
            <p className="text-base">{saleOffer.description}</p>
            <p className="text-xl">{saleOffer.price},-</p>
            <p className="mt-2">{saleOffer.city.name}</p>
          </div>
        </div>
        {!isHovered && (
          <div className="absolute bottom-3 right-7 text-blue rounded-xl m-2">
            <div className="white-space-normal flex flex-col justify-center items-center h-full text-center font-bold gap-2">
              <p className="bg-white rounded-md shadow-md shadow-gray-400 text-sm p-[1px]">{saleOffer.price},-</p>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SaleOffer;
