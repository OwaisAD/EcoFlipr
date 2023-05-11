import React, { DetailedHTMLProps, ImgHTMLAttributes } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_USER } from "../GraphQL/queries/getSaleOfferByUser";
import { Carousel } from "react-responsive-carousel";
import Moment from "react-moment";

interface SaleOfferOnProfilePage {
  notification_count: number;
  description: string;
  is_shippable: boolean;
  price: number;
  imgs: string[];
  created_at: string;
  updated_at: string;
  category: {
    name: string;
  };
  city: {
    name: string;
    zip_code: number;
  };
}

const Profile = () => {
  const auth = useAuth();
  const location = useLocation();
  const { loading, error, data } = useQuery(GET_SALE_OFFERS_BY_USER);

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data.getSaleOffersByUser);

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Tab bar to switch between 'Mine annoncer' and 'Profiloplysninger'*/}
      <div></div>
      {/* Display of user's sale offers */}
      <p className="text-2xl">Mine annoncer</p>
      <div className="bg-slate-400">
        {data.getSaleOffersByUser.map((offer: SaleOfferOnProfilePage) => (
          <div className="flex">
            <Carousel width={"200px"} showThumbs={false} showStatus={false}>
              {offer.imgs.map((img) => (
                <div>
                  <img src={img} alt="" />
                </div>
              ))}
            </Carousel>
            <div className="flex flex-col">
              <p>
                {offer.description}, {offer.category.name}
              </p>
              <div className="flex">
                <Moment fromNow>{offer.created_at}</Moment>
                <p className="m-auto">
                  {new Intl.NumberFormat("dk-DK", { style: "currency", currency: "DKK" }).format(offer.price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
