import React from "react";
import { SaleOfferData } from "../types/saleOffer";
import Moment from "react-moment";

const SaleOfferBox = ({ data }: SaleOfferData) => {
  return (
    <div
      key={data.id}
      className="bg-gray-300 w-[500px] h-[180px] rounded-xl p-2 flex items-center shadow-md font-light"
    >
      {/* left area */}
      <div className="relative overflow-hidden bg-cover bg-no-repeat">
        <img
          src={data.imgs[0]}
          alt={`Img description ${data.description}`}
          className="h-40 w-40 rounded-xl object-cover transition duration-300 ease-in-out hover:scale-110"
        />
      </div>
      {/* right area */}
      <div className="flex-grow flex flex-col h-40 justify-center gap-4 p-4">
        <p className="text-lg">
          {data.description.substring(0, 35)}
          {data.description.length > 35 && "..."}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-xs">
            <Moment fromNow>{data.created_at}</Moment>
          </p>
          <p className="text-xl font-semibold">{data.price},- kr</p>
        </div>
        <div className="flex text-sm gap-2">
          <div>
            {data.city.zip_code} {data.city.name}
          </div>{" "}
          <div>|</div> <div>{data.is_shippable ? "Kan sendes" : "Sendes ikke"}</div>
        </div>
      </div>
    </div>
  );
};

export default SaleOfferBox;
