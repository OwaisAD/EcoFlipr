import React from "react";
import { SaleOfferData } from "../types/saleOffer";

const SaleOfferBox = ({ data }: SaleOfferData) => {
  return (
    <div key={data.id} className="bg-gray-300 w-[500px] h-[180px] rounded-xl p-2 flex items-center">
      {/* left area */}
      <div>
        <img
          src={data.imgs[0]}
          alt={`Img description ${data.description}`}
          className="h-40 w-40 rounded-xl object-cover"
        />
      </div>
      {/* right area */}
      <div></div>
    </div>
  );
};

export default SaleOfferBox;
