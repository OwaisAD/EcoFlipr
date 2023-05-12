import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_USER } from "../GraphQL/queries/getSaleOfferByUser";
import { Carousel } from "react-responsive-carousel";
import Moment from "react-moment";
import { DELETE_SALE_OFFER_BY_ID } from "../GraphQL/mutations/deleteSaleOfferById";
import { SaleOffer, SaleOfferInterface } from "../types/saleOffer";
import { isValidHttpUrl } from "../utils/urlValidator";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaShuttleVan } from "react-icons/fa";
import { IoRemoveCircle } from "react-icons/io5";

const Profile = () => {
  const auth = useAuth();
  const location = useLocation();
  const [userSaleOffers, setUserSaleOffers] = useState<SaleOffer[]>([]);
  const { loading, error, data } = useQuery(GET_SALE_OFFERS_BY_USER, {
    onCompleted(data) {
      setUserSaleOffers(data.getSaleOffersByUser);
    },
  });
  const [deleteSaleOffer, { data: data2, loading: loading2, error: error2 }] = useMutation(DELETE_SALE_OFFER_BY_ID, {
    refetchQueries: [GET_SALE_OFFERS_BY_USER],
  });

  const handleDeleteSaleOffer = (saleOfferId: string) => {
    let confirmation = confirm("Are you sure you want to delete the offer?");
    if (!confirmation) {
      return;
    }
    deleteSaleOffer({ variables: { deleteSaleOfferById: saleOfferId } });
  };

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Tab bar to switch between 'Mine annoncer' and 'Profiloplysninger'*/}
      <div className="flex gap-32 text-lg font-light bg-[#D9D9D9] p-3 rounded-[12px] mt-10 mb-20">
        <p>My sale offers</p>
        <p>Sale offers interacted with</p>
        <p>Profile information</p>
      </div>
      {/* Display of user's sale offers */}
      <div>
        {userSaleOffers.map((userSaleOffer) => (
          <div className="relative">
            <Link to={`/offer/${userSaleOffer.id}`}>
              <div
                key={userSaleOffer.id}
                className="relative bg-gray-300 w-[500px] h-[180px] rounded-xl p-2 flex shadow-md font-light hover:scale-105 transform 
           transition duration-100 my-4"
              >
                {userSaleOffer.notification_count > 0 && (
                  <div className="absolute bg-red-400 bottom-[-10px] right-[-4px] z-50 px-2 py-1 text-white rounded-full text-sm">
                    <div className="">{userSaleOffer.notification_count}</div>
                  </div>
                )}
                <div className="absolute top-0 right-0 flex items-center gap-1 text-[10px] bg-gray-100 rounded-bl rounded-tr p-[1.5px] shadow-sm">
                  {userSaleOffer.is_shippable ? "Kan sendes" : "Sendes ikke"}{" "}
                  {userSaleOffer.is_shippable && <FaShuttleVan className="" />}
                </div>
                {/* left area */}
                <div className="relative overflow-hidden bg-cover bg-no-repeat">
                  <img
                    src={
                      isValidHttpUrl(userSaleOffer.imgs[0])
                        ? userSaleOffer.imgs[0]
                        : `../../images/No-Image-Placeholder.svg.png`
                    }
                    alt={`Img description ${userSaleOffer.description}`}
                    className="h-40 w-40 rounded-xl object-cover transition duration-300 ease-in-out hover:scale-110"
                  />
                </div>
                {/* right area */}
                <div className="flex-grow flex flex-col h-40 justify-center gap-4 p-4">
                  <p className="text-lg">
                    {userSaleOffer.description.substring(0, 35)}
                    {userSaleOffer.description.length > 35 && "..."}
                  </p>
                  <div className="flex justify-between items-center">
                    <p className="text-xs">
                      <Moment fromNow>{userSaleOffer.created_at}</Moment>
                    </p>
                    <p className="text-xl font-semibold">{userSaleOffer.price},- kr</p>
                  </div>
                  <div className="text-sm">
                    <div>
                      {userSaleOffer.city.zip_code} {userSaleOffer.city.name}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <button
              className="absolute top-0 right-[-30px] hover:scale-110 duration:100"
              onClick={() => handleDeleteSaleOffer(userSaleOffer.id)}
            >
              <IoRemoveCircle color="red" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
