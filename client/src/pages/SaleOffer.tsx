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
  if (error) return <p>Error :(</p>;

  return (
    <>
      <div className="flex flex-col justify-center items-center sm:flex-col lg:flex-row gap-8 mt-6">
        {/* TOP PART THAT CONSISTS OF LEFT SIDE: IMAGE CAROUSEL AND RIGHT SIDE: SALE OFFER INFORMATION*/}
        {/* left side img carousel */}
        <Carousel
          width={"500px"}
          autoPlay
          interval={5000}
          infiniteLoop
          swipeable={true}
          showThumbs
          axis="horizontal"
          thumbWidth={100}
          dynamicHeight={false}
        >
          {saleOffer.imgs.map((img) => (
            <div className="h-64">
              <img
                className="h-full object-cover"
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
            <p className="text-xl">
              {saleOffer.description}, {saleOffer.category.name}
            </p>
            <div className="font-light text-xs">
              <Moment fromNow>{saleOffer.created_at}</Moment>
            </div>
            <p className="text-blue-700 font-medium text-lg">
              {new Intl.NumberFormat("dk-DK", { style: "currency", currency: "DKK" }).format(saleOffer.price)}
            </p>
          </div>

          {/* Location */}
          <div>
            <p className="my-2">
              {saleOffer.city.name}, {saleOffer.city.zip_code}
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d71330.8159947423!2d12.539608949999991!3d56.03446514999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465231112f400bb3%3A0xf3e36e3c5817f767!2s3000%20Helsing%C3%B8r!5e0!3m2!1sda!2sdk!4v1683708659329!5m2!1sda!2sdk"
              height="250"
              loading="lazy"
            />
          </div>
          {/*isShipable*/}
          <div>
            {saleOffer.is_shippable ? (
              <p className="text-green-600 font-medium flex items-center gap-2">
                Kan sendes
                <FaShuttleVan className="mt-1" />
              </p>
            ) : (
              <p className="text-red-600 font-medium">Sendes ikke</p>
            )}
          </div>
          {/*TODO:On click Contact button will show the owner's phone number for the sale offer*/}
          <div>
            <button>Contact</button>
          </div>
        </div>
      </div>
      {/* THREAD LOGIC */}
      <div className="flex flex-col items-center justify-center my-14">
        <p>Messages</p>
        <div>
          {/* Left side scrollbar */}
          <div></div>
          {/* Right side */}
          <div className="bg-slate-300 rounded-[12px]">
            {/* Message display */}
            {saleOffer.threads && saleOffer.threads.length > 0 && (
              <>
                {saleOffer.threads[0].comments.map((comment) => (
                  <div className="w-[450px] pt-6 pl-6 pr-6">
                    <p className="font-light text-lg mb-1">{comment.content}</p>
                    <div className="flex justify-between">
                      <p className="font-thin text-[10px] text-gray-600">
                        Written by {comment.author_id} <Moment fromNow>{comment.created_at}</Moment>
                      </p>
                    </div>
                    <div className="w-full mt-4 border-t border-black"></div>
                  </div>
                ))}
              </>
            )}
          </div>
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
    </>
  );
};

export default SaleOffer;
