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
  const [showMySaleOffers, setShowMySaleOffers] = useState(true);
  const [showMyInteractedSaleOffers, setShowMyInteractedSaleOffers] = useState(false);
  const [showMyProfileSettings, setShowMyProfileSettings] = useState(false);

  const [editProfileInfo, setEditProfileInfo] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

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

  const handleEditProfileInformation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditProfileInfo(!editProfileInfo);
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
        <button
          onClick={() => {
            setShowMySaleOffers(true);
            setShowMyInteractedSaleOffers(false);
            setShowMyProfileSettings(false);
          }}
          className={`${showMySaleOffers && "font-semibold"}`}
        >
          My sale offers
        </button>
        <button
          onClick={() => {
            setShowMyInteractedSaleOffers(true);
            setShowMySaleOffers(false);
            setShowMyProfileSettings(false);
          }}
          className={`${showMyInteractedSaleOffers && "font-semibold"}`}
        >
          Sale offers interacted with
        </button>
        <button
          onClick={() => {
            setShowMyProfileSettings(true);
            setShowMySaleOffers(false);
            setShowMyInteractedSaleOffers(false);
          }}
          className={`${showMyProfileSettings && "font-semibold"}`}
        >
          Profile information
        </button>
      </div>
      {/* Display of user's sale offers */}
      {showMySaleOffers && (
        <div>
          <p className="text-center font-thin text-lg">My sale offers</p>
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
      )}

      {/* Profile information */}
      {showMyProfileSettings && (
        <div>
          <p className="text-center font-thin text-lg">Profile information</p>
          <form className="flex flex-col gap-2 mt-5" onSubmit={handleEditProfileInformation}>
            {/* FIRST NAME AND LAST NAME */}
            <div className="flex gap-5">
              <div className="flex flex-col">
                <label htmlFor="first_name">First name</label>
                <input type="text" id="first_name" placeholder="Enter first name" className="font-light" disabled={!editProfileInfo}/>
              </div>
              <div className="flex flex-col">
                <label htmlFor="last_name">Last name</label>
                <input type="text" id="last_name" className="font-light" placeholder="Enter last name" disabled={!editProfileInfo}/>
              </div>
            </div>
            {/* EMAIL*/}
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" className="font-light" placeholder="Enter email" disabled={!editProfileInfo}/>
            </div>
            {/* ADDRESS */}
            <div className="flex flex-col">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" className="font-light" placeholder="Enter address" disabled={!editProfileInfo}/>
            </div>
            {/* PHONE NUMBER */}
            <div className="flex flex-col">
              <label htmlFor="phone_number">Phone number</label>
              <input type="text" id="phone_number" className="font-light" placeholder="Enter phone number" disabled={!editProfileInfo}/>
            </div>
            <div className="text-center">
              <button type="submit" className="px-6 py-2 bg-[#2C2E48] rounded-full text-white font-normal">
                Edit
              </button>
            </div>
            {/* PASSWORD */}
            <div className="flex">
              <input type="text" />
              <button>Edit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
