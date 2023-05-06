import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { SaleOffersBasic } from "../types/saleOffer";
import SaleOffer from "./SaleOffer";

const slideLeft = () => {
  var slider = document.getElementById("slider");
  slider!.scrollLeft = slider!.scrollLeft - 500;
};

const slideRight = () => {
  var slider = document.getElementById("slider");
  slider!.scrollLeft = slider!.scrollLeft + 500;
};

const Carousel = ({ saleOffers }: SaleOffersBasic) => {
  return (
    <div className="w-[750px]">
      <div className="relative flex bg-white mt-8 border-gray-200 border rounded-lg group items-center lg:mx-0 md:mx-0 sm:mx-4 mx-6">
        <MdChevronLeft
          size={26}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block ml-3"
          onClick={slideLeft}
        />

        <div
          id={"slider"}
          className="flex overflow-x-auto scroll-smooth scrollbar-thin scrollbar-thumb-black relative overflow-y-hidden "
        >
          {/* MAP OVER THE IMAGES AND DISPLAY */}
          {saleOffers.map((saleOffer, idx) => (
            <SaleOffer key={idx} saleOffer={saleOffer} />
          ))}
        </div>

        <MdChevronRight
          size={26}
          className="bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block mr-3"
          onClick={slideRight}
        />
      </div>
    </div>
  );
};

export default Carousel;
