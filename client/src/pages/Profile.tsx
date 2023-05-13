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
import { FiEdit } from "react-icons/fi";
import { GET_USER } from "../GraphQL/queries/getUser";
import { toast } from "react-hot-toast";
import { UPDATE_USER } from "../GraphQL/mutations/updateUser";
import validator from "validator";
import { AiOutlineSave } from "react-icons/ai";
import { UPDATE_PASSWORD } from "../GraphQL/mutations/updatePassword";
import { GET_SALE_OFFERS_BY_USER_INTERACTION } from "../GraphQL/queries/getSaleOffersByUserInteraction";

type User = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
};

const Profile = () => {
  const auth = useAuth();
  const location = useLocation();
  const [userData, setUserData] = useState<User>({
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    address: "",
  });
  const [updatedFirstName, setUpdatedFirstName] = useState(userData.first_name);
  const [updatedLastName, setUpdatedLastName] = useState("");
  const [updatedAddress, setUpdatedAddress] = useState("");
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPass, setUpdatedPass] = useState("");
  const [updatedPassConfirm, setUpdatedPassConfirm] = useState("");

  const [userSaleOffers, setUserSaleOffers] = useState<SaleOffer[]>([]);
  const [userSaleOffersInteractions, setUserSaleOffersInteractions] = useState<SaleOffer[]>([]);

  const [showMySaleOffers, setShowMySaleOffers] = useState(true);
  const [showMyInteractedSaleOffers, setShowMyInteractedSaleOffers] = useState(false);
  const [showMyProfileSettings, setShowMyProfileSettings] = useState(false);

  const [editProfileInfo, setEditProfileInfo] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const { loading, error, data } = useQuery(GET_SALE_OFFERS_BY_USER, {
    onCompleted(data) {
      let saleOffers = [...data.getSaleOffersByUser].sort((a: SaleOffer, b: SaleOffer) => b.notification_count - a.notification_count);
      setUserSaleOffers(saleOffers);
    },
  });

  const {
    loading: loading6,
    error: error6,
    data: data6,
  } = useQuery(GET_SALE_OFFERS_BY_USER_INTERACTION, {
    onCompleted(data) {
      setUserSaleOffersInteractions(data.getSaleOffersByUserInteraction);
    },
  });

  const [deleteSaleOffer, { data: data2, loading: loading2, error: error2 }] = useMutation(DELETE_SALE_OFFER_BY_ID, {
    refetchQueries: [GET_SALE_OFFERS_BY_USER],
  });

  const {
    data: data3,
    loading: loading3,
    error: error3,
  } = useQuery(GET_USER, {
    onCompleted(data) {
      setUserData(data.getUser);
      setUpdatedFirstName(data.getUser.first_name);
      setUpdatedLastName(data.getUser.last_name);
      setUpdatedEmail(data.getUser.email);
      setUpdatedAddress(data.getUser.address);
      setUpdatedPhoneNumber(data.getUser.phone_number);
    },
  });

  const [updateUser, { data: data4, loading: loading4, error: error4 }] = useMutation(UPDATE_USER);

  const [updatePassword, { data: data5, loading: loading5, error: error5 }] = useMutation(UPDATE_PASSWORD);

  const handleDeleteSaleOffer = (saleOfferId: string) => {
    let confirmation = confirm("Are you sure you want to delete the offer?");
    if (!confirmation) {
      return;
    }
    deleteSaleOffer({ variables: { deleteSaleOfferById: saleOfferId } });
  };

  const handleEditProfileInformation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editProfileInfo) {
      let confirmation = confirm("Are you sure you want to edit your profile information?");
      if (!confirmation) {
        return;
      }
    } else {
      // check if any information changed and update the user if true
      if (
        userData.first_name !== updatedFirstName ||
        userData.last_name !== updatedLastName ||
        userData.email !== updatedEmail ||
        userData.phone_number !== updatedPhoneNumber ||
        userData.address !== updatedAddress
      ) {
        console.log("Trying to update");
        if (!updatedFirstName || updatedFirstName.length < 2 || updatedFirstName.length > 50) {
          toast.error("Please enter a valid first name");
          setUpdatedFirstName(userData.first_name);
          return;
        }
        if (!updatedLastName || updatedLastName.length < 2 || updatedLastName.length > 50) {
          toast.error("Please enter a valid last name");
          setUpdatedLastName(userData.last_name);
          return;
        }

        if (!updatedEmail || !validator.isEmail(updatedEmail)) {
          toast.error("Please enter a valid email");
          setUpdatedEmail(userData.email);
          return;
        }

        if (!updatedAddress || updatedAddress.length < 5 || updatedAddress.length > 100) {
          toast.error("Address must be between 5 and 100 characters");
          setUpdatedEmail(userData.address);
          return;
        }

        if (!updatedPhoneNumber || !validator.isMobilePhone(updatedPhoneNumber, "da-DK")) {
          toast.error("Phone number must be a valid danish number");
          setUpdatedPhoneNumber(userData.phone_number);
          return;
        }

        toast.promise(
          updateUser({
            variables: {
              input: {
                first_name: updatedFirstName,
                last_name: updatedLastName,
                email: updatedEmail,
                address: updatedAddress,
                phone_number: updatedPhoneNumber,
              },
            },
          }),
          {
            loading: "Updating...",
            success: <b>Updated successfully!</b>,
            error: <b>Could not save.</b>,
          }
        );
      } else {
        toast.error("Applied no changes.");
      }
    }

    setEditProfileInfo(!editProfileInfo);
  };

  const handlePasswordChange = () => {
    if (!editPassword) {
      let confirmation = confirm("Are you sure you want to change your password?");
      if (!confirmation) {
        return;
      }
    } else {
      if (!updatedPass || updatedPass.length < 8) {
        toast.error("Password should be at least 8 characters");
        return;
      }

      if (updatedPassConfirm !== updatedPass) {
        toast.error("Passwords does not match");
        return;
      }

      toast.promise(
        updatePassword({
          variables: {
            input: {
              newPassword: updatedPass,
            },
          },
        }),
        {
          loading: "Updating...",
          success: <b>Updated successfully!</b>,
          error: <b>Could not save.</b>,
        }
      );

      setUpdatedPass("");
      setUpdatedPassConfirm("");
    }
    setEditPassword(!editPassword);
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
      <div className="flex gap-32 text-lg font-light bg-[#D9D9D9] p-3 rounded-[12px] mt-10 mb-20 cursor-pointer">
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
          {!userSaleOffers.length && <p className="font-light text-sm">You haven't created any offers</p>}
          {userSaleOffers.map((userSaleOffer) => (
            <div className="relative" key={userSaleOffer.id}>
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

      {showMyInteractedSaleOffers && (
        <div>
          <p className="text-center font-thin text-lg">Your sale offer interactions</p>
          {!userSaleOffersInteractions.length && (
            <p className="font-light text-sm">You haven't interacted with any offers</p>
          )}
          {userSaleOffersInteractions.map((userSaleOffer) => (
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
          <form className="flex flex-col gap-3 mt-5" onSubmit={handleEditProfileInformation}>
            {/* FIRST NAME AND LAST NAME */}
            <div className="flex gap-5">
              <div className="flex flex-col gap-1">
                <label htmlFor="first_name" className="font-light">
                  First name
                </label>
                <input
                  type="text"
                  id="first_name"
                  placeholder="Enter first name"
                  className="font-light border-none rounded-[12px] disabled:bg-gray-300"
                  disabled={!editProfileInfo}
                  value={updatedFirstName}
                  onChange={(e) => setUpdatedFirstName(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="last_name" className="font-light">
                  Last name
                </label>
                <input
                  type="text"
                  id="last_name"
                  className="font-light border-none rounded-[12px] disabled:bg-gray-300"
                  placeholder="Enter last name"
                  disabled={!editProfileInfo}
                  value={updatedLastName}
                  onChange={(e) => setUpdatedLastName(e.target.value)}
                />
              </div>
            </div>
            {/* EMAIL*/}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="font-light">
                Email
              </label>
              <input
                type="text"
                id="email"
                className="font-light border-none rounded-[12px] disabled:bg-gray-300"
                placeholder="Enter email"
                disabled={!editProfileInfo}
                value={updatedEmail}
                onChange={(e) => setUpdatedEmail(e.target.value)}
              />
            </div>
            {/* ADDRESS */}
            <div className="flex flex-col gap-1">
              <label htmlFor="address" className="font-light">
                Address
              </label>
              <input
                type="text"
                id="address"
                className="font-light border-none rounded-[12px] disabled:bg-gray-300"
                placeholder="Enter address"
                disabled={!editProfileInfo}
                value={updatedAddress}
                onChange={(e) => setUpdatedAddress(e.target.value)}
              />
            </div>
            {/* PHONE NUMBER */}
            <div className="flex flex-col gap-1">
              <label htmlFor="phone_number" className="font-light">
                Phone number
              </label>
              <input
                type="text"
                id="phone_number"
                className="font-light border-none rounded-[12px] disabled:bg-gray-300"
                placeholder="Enter phone number"
                disabled={!editProfileInfo}
                value={updatedPhoneNumber}
                onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
              />
            </div>
            <div className="text-center">
              <button type="submit" className="px-6 py-2 bg-[#2C2E48] rounded-full text-white font-normal">
                {editProfileInfo ? "Save" : "Edit"}
              </button>
            </div>
          </form>
          {/* PASSWORD */}
          <div className="flex gap-2">
            <div className="flex flex-col flex-1 gap-1">
              <label htmlFor="password" className="font-light">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="******************"
                className="border-none rounded-[12px] disabled:bg-gray-300"
                disabled={!editPassword}
                value={updatedPass}
                onChange={(e) => setUpdatedPass(e.target.value)}
              />
              {editPassword && (
                <>
                  <label htmlFor="password" className="font-light">
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="******************"
                    className="border-none rounded-[12px] disabled:bg-gray-300"
                    disabled={!editPassword}
                    onChange={(e) => setUpdatedPassConfirm(e.target.value)}
                    value={updatedPassConfirm}
                  />
                </>
              )}
            </div>
            <div className="mt-8">
              <button className="py-2 px-2 bg-[#2C2E48] text-white rounded-full" onClick={handlePasswordChange}>
                {editPassword ? <AiOutlineSave /> : <FiEdit />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
