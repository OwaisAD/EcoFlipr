import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { QueryHookOptions, useQuery } from "@apollo/client";
import { GET_SALE_OFFER_BY_ID } from "../GraphQL/queries/getSaleOfferById";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SaleOfferInterface } from "../types/saleOffer";
import Moment from "react-moment";
import { FaShuttleVan } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { isValidHttpUrl } from "../utils/urlValidator";

const defaultSaleOffer: SaleOfferInterface = {
  id: "",
  creator_id: "",
  description: "",
  category: {
    id: "",
    name: "",
  },
  is_shippable: false,
  city: {
    id: "",
    zip_code: "",
    name: "",
  },
  price: 0,
  imgs: [],
  threads: [],
  created_at: "",
  updated_at: "",
};

const SaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();
  const [saleOffer, setSaleOffer] = useState<SaleOfferInterface>(defaultSaleOffer);
  const { id } = useParams();
  const queryOptions: QueryHookOptions = {
    variables: { getSaleOfferByIdId: id },
    skip: !auth.isAuthenticated,
  };
  const { loading, error, data } = useQuery(GET_SALE_OFFER_BY_ID, queryOptions);

  useEffect(() => {
    if (data) {
      console.log(data.getSaleOfferById);

      setSaleOffer(data.getSaleOfferById);
    }
  }, [data]);

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <>
      <div className="flex flex-col justify-center items-center sm:flex-col lg:flex-row gap-8 mt-6">
        {/* TOP PART THAT CONSISTS OF LEFT SIDE: IMAGE CAROUSEL AND RIGHT SIDE: SALE OFFER INFORMATION*/}
        {/* left side img carousel */}
        <Carousel width={"500px"} autoPlay interval={5000} infiniteLoop swipeable={true} thumbWidth={100}>
          {saleOffer.imgs.map((img, idx) => (
            <div className="h-64" key={idx}>
              <img
                className="h-full object-contain"
                alt=""
                src={isValidHttpUrl(img) ? img : "../../images/No-Image-Placeholder.svg.png"}
              />
            </div>
          ))}
        </Carousel>
        {/* right side information */}
        <div className="w-[350px] bg-white rounded-lg flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-1">
            {/* Price */}
            <p className="text-xl cursor-default">
              {saleOffer.description}, {saleOffer.category.name}
            </p>
            <div className="font-light text-xs cursor-default">
              <Moment fromNow>{saleOffer.created_at}</Moment>
            </div>
            <p className="text-blue-700 font-medium text-lg cursor-default">
              {new Intl.NumberFormat("dk-DK", { style: "currency", currency: "DKK" }).format(saleOffer.price)}
            </p>
          </div>

          {/* Location */}
          <div>
            <p className="my-2 cursor-default">
              {saleOffer.city.zip_code}, {saleOffer.city.name}
            </p>
            <iframe
              height="280"
              width="320"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API}
    &q=${saleOffer.city.zip_code},${saleOffer.city.name}&zoom=10`}
            ></iframe>
          </div>
          {/*isShipable*/}
          <div>
            {saleOffer.is_shippable ? (
              <p className="text-green-600 font-medium flex items-center gap-2 cursor-default">
                Kan sendes
                <FaShuttleVan className="mt-1" />
              </p>
            ) : (
              <p className="text-red-600 font-medium cursor-default">Sendes ikke</p>
            )}
          </div>
          {/*TODO:On click Contact button will show the owner's phone number for the sale offer*/}
          <div>
            <button>Contact</button>
          </div>
        </div>
      </div>
      {/* THREAD LOGIC */}

      <div className="flex flex-col items-center justify-center mt-14 mb-28">
        <div className="flex gap-6">
          {/* Left side scrollbar only showing if you are the owner have more than one thread*/}
          {saleOffer.threads && saleOffer.threads.length > 1 && (
            <>
              <div>
                <p className="text-xs font-light mt-3">Threads</p>
                <div className="w-[50px] bg-slate-300 rounded-[10px] mt-2 h-full max-h-[200px] scroll-smooth scrollbar-hide overflow-y-scroll flex flex-col items-center py-2">
                  {saleOffer.threads.map((thread, idx) => (
                    <>
                      <div
                        className="rounded-full my-[7px] bg-green-600 p-[6px] cursor-pointer hover:scale-110 hover:border hover:border-gray-500 duration-100"
                        key={idx}
                      ></div>
                    </>
                  ))}
                </div>
              </div>
            </>
          )}
          {/* Right side */}
          <div>
            <p className="text-lg text-center">Messages</p>
            {/* Message display */}
            {saleOffer.threads && saleOffer.threads.length > 0 && (
              <>
                {saleOffer.threads[0].comments.map((comment, idx) => (
                  <div
                    className={`w-[450px] py-4 px-6 rounded-[12px] my-2 ${
                      comment.author_id === saleOffer.creator_id ? "bg-slate-400" : "bg-slate-300"
                    }`}
                    key={idx}
                  >
                    <p className="font-light text-lg mb-1 break-words">{comment.content}</p>
                    <div className="flex justify-between">
                      <p className="font-thin text-[10px] text-gray-600">
                        Written by {comment.author_id} <Moment fromNow>{comment.created_at}</Moment>
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
            {/* Message input and Button to submit message input */}
            <div className="flex gap-2 mt-3">
              <textarea rows={1} placeholder="Write here..." className="border-none rounded-[12px] font-base flex-1" />
              <div>
                <button className="text-white text-lg bg-blue-700 w-[104px] h-[38px] rounded-[12px] font-light">
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaleOffer;
