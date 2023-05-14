import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { SaleOfferType } from "../types/saleOffer";
import SaleOffer from "./SaleOffer";

type CarouselProps = {
  rowID: string;
  saleOffers: SaleOfferType[] | [];
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
      <div className="relative flex bg-white/80 border-gray-200 border rounded-xl group items-center lg:mx-0 md:mx-0 sm:mx-4 mx-6 py-2 px-11">
        <MdChevronLeft
          size={26}
          className="bg-black text-white left-0 rounded-full absolute opacity-40 hover:opacity-90 cursor-pointer z-10 hidden group-hover:block ml-3"
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
          className="bg-black text-white right-0 rounded-full absolute opacity-40 hover:opacity-90 cursor-pointer z-10 hidden group-hover:block mr-3"
          onClick={slideRight}
        />
      </div>
    </>
  );
};

export default Carousel;
