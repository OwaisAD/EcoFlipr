import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { SaleOffersBasic } from "../types/saleOffer";
import SaleOffer from "./SaleOffer";

type CarouselProps = {
  rowID: string;
  saleOffers: SaleOffersBasic[] | [];
};

const Carousel = ({ rowID, saleOffers }: CarouselProps) => {
  const slideLeft = () => {
    var slider = document.getElementById("slider" + rowID);
    slider!.scrollLeft = slider!.scrollLeft - 500;
  };

  const slideRight = () => {
    var slider = document.getElementById("slider" + rowID);
    slider!.scrollLeft = slider!.scrollLeft + 500;
  };

  return (
    <>
      <div className="relative flex bg-white border-gray-200 border rounded-xl group items-center lg:mx-0 md:mx-0 sm:mx-4 mx-6 p-1">
        <MdChevronLeft
          size={26}
          className="bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block ml-3"
          onClick={slideLeft}
        />

        <div
          id={"slider" + rowID}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative"
        >
          {/* MAP OVER THE IMAGES AND DISPLAY - TS BUG with the type - it is correct object passed down? */}
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
    </>
  );
};

export default Carousel;
