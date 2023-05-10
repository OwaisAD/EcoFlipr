import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { QueryHookOptions, useQuery } from "@apollo/client";
import { GET_SALE_OFFER_BY_ID } from "../GraphQL/queries/getSaleOfferById";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SaleOfferInterface } from "../types/saleOffer";
import Moment from "react-moment";

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
    <div>
      {/* TOP PART THAT CONSISTS OF LEFT SIDE: IMAGE CAROUSEL AND RIGHT SIDE: SALE OFFER INFORMATION*/}
      <div>
        {/* left side img carousel */}
        <div></div>
        {/* right side information */}
        <div className="h-[400px] w-[250px] bg-white rounded-lg ">
          <div className="flex items-center justify-between">
            {/* Price */}
            <div>
              <p className="text-xl">{saleOffer.description}</p>
              <p className="">
                {new Intl.NumberFormat("dk-DK", { style: "currency", currency: "DKK" }).format(saleOffer.price)}
              </p>
            </div>
            <div>
              <Moment fromNow>{saleOffer.created_at}</Moment>
            </div>
          </div>

          {/* Location */}
        </div>
      </div>

      {/* THREAD LOGIC */}
    </div>
  );
};

export default SaleOffer;
