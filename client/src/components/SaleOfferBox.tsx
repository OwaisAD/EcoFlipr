import { SaleOfferData } from "../types/saleOffer";
import Moment from "react-moment";
import { isValidHttpUrl } from "../utils/urlValidator";
import { Link } from "react-router-dom";
import { FaShuttleVan } from "react-icons/fa";

const SaleOfferBox = ({ data }: SaleOfferData) => {
  return (
    <Link to={`/offer/${data.id}`}>
      <div
        key={data.id}
        className="relative bg-gray-300 w-[500px] h-[180px] rounded-xl p-2 flex shadow-md font-light hover:scale-105 transform 
        transition duration-100"
      >
        <div className="absolute top-0 right-0 flex items-center gap-1 text-[10px] bg-gray-100 rounded-bl rounded-tr p-[1.5px] shadow-sm">
          {data.is_shippable ? "Kan sendes" : "Sendes ikke"} {data.is_shippable && <FaShuttleVan className="" />}
        </div>

        {/* left area */}
        <div className="relative overflow-hidden bg-cover bg-no-repeat">
          <img
            src={isValidHttpUrl(data.imgs[0]) ? data.imgs[0] : `../../images/No-Image-Placeholder.svg.png`}
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
          <div className="text-sm">
            <div>
              {data.city.zip_code} {data.city.name}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SaleOfferBox;