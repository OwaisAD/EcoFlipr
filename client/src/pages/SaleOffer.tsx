import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { QueryHookOptions, useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_SALE_OFFER_BY_ID } from "../GraphQL/queries/getSaleOfferById";
import { useParams } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { SaleOfferInterface } from "../types/saleOffer";
import Moment from "react-moment";
import { FaShuttleVan } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { isValidHttpUrl } from "../utils/urlValidator";
import { GET_USER_DATA_BY_ID } from "../GraphQL/queries/getUserDataById";
import { FcPhoneAndroid } from "react-icons/fc";
import { MARK_THREAD_AS_READ } from "../GraphQL/mutations/markThreadAsRead";
import { CREATE_COMMENT } from "../GraphQL/mutations/createComment";
import { RiCheckDoubleFill } from "react-icons/ri";

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

type UserData = {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
};

type Comment = {
  id: string;
  thread_id: string;
  author_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

type Thread = {
  id: string;
  sale_offer_id: string;
  creator_id: string;
  comments: Comment[];
};

const SaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();
  const [saleOffer, setSaleOffer] = useState<SaleOfferInterface>(defaultSaleOffer);
  const [buyerData, setBuyerData] = useState<UserData>({ id: "", first_name: "", last_name: "", phone_number: "" });
  const [sellerData, setSellerData] = useState<UserData>({ id: "", first_name: "", last_name: "", phone_number: "" });
  const [showNumber, setShowNumber] = useState(false);
  const [comment, setComment] = useState("");
  const { id } = useParams();

  // Queries
  const queryOptions: QueryHookOptions = {
    variables: { getSaleOfferByIdId: id },
    skip: !auth.isAuthenticated,
  };
  const { loading, error, data, refetch } = useQuery(GET_SALE_OFFER_BY_ID, queryOptions);

  const queryOptions2: QueryHookOptions = {
    variables: { getUserDataByIdId: id },
    skip: !auth.isAuthenticated,
  };
  const [getBuyerDataById, { loading: loading2, error: error2, data: data2 }] = useLazyQuery(GET_USER_DATA_BY_ID, {
    fetchPolicy: "no-cache",
    onCompleted(data2) {
      setBuyerData({ ...data2.getUserDataById });
      console.log("BUYER DATA", data2.getUserDataById);
    },
  });

  const [getSellerDataById, { loading: loading3, error: error3, data: data3 }] = useLazyQuery(GET_USER_DATA_BY_ID, {
    fetchPolicy: "no-cache",
    onCompleted(data3) {
      setSellerData({ ...data3.getUserDataById });
      console.log("SELLER DATA", data3.getUserDataById);
    },
  });

  // mutations
  const [markThreadAsRead, { data: data4, error: error4 }] = useMutation(MARK_THREAD_AS_READ);
  const [createComment, { data: data5, error: error5 }] = useMutation(CREATE_COMMENT, {
    onCompleted(data, clientOptions) {
      refetch();
    },
  });

  const [currentThreadId, setCurrentThreadId] = useState("");
  const [currentThread, setCurrentThread] = useState<Thread>({
    id: "",
    sale_offer_id: "",
    creator_id: "",
    comments: [
      {
        id: "",
        thread_id: "",
        author_id: "",
        content: "",
        is_read: false,
        created_at: "",
      },
    ],
  });

  useEffect(() => {
    if (data) {
      setSaleOffer(data.getSaleOfferById);
      if (data.getSaleOfferById.threads && data.getSaleOfferById.threads.length > 1) {
        if (!currentThreadId) {
          setCurrentThreadId(data.getSaleOfferById.threads[0].id);
          // markThreadAsRead({ variables: { threadId: data.getSaleOfferById.threads[0].id } });
          setCurrentThread(data.getSaleOfferById.threads[0]);
        } else {
          //@ts-ignore
          let currentThread = data.getSaleOfferById.threads.filter((thread) => thread.id === currentThreadId)[0];
          setCurrentThread(currentThread);
        }
        getBuyerDataById({ variables: { getUserDataByIdId: data.getSaleOfferById.threads[0].creator_id } });
      }
      if (data.getSaleOfferById.threads && data.getSaleOfferById.threads.length === 1) {
        setCurrentThreadId(data.getSaleOfferById.threads[0].id);
        markThreadAsRead({ variables: { threadId: data.getSaleOfferById.threads[0].id } });
        setCurrentThread(data.getSaleOfferById.threads[0]);
        getBuyerDataById({ variables: { getUserDataByIdId: data.getSaleOfferById.threads[0].creator_id } });
      }
    }
  }, [data]);

  useEffect(() => {
    if (data && saleOffer) {
      if (saleOffer.creator_id) {
        getSellerDataById({ variables: { getUserDataByIdId: saleOffer.creator_id } });
      }
    }
  }, [saleOffer]);

  const handleThreadChange = (threadId: string) => {
    setCurrentThreadId(threadId);
    markThreadAsRead({ variables: { threadId } });
    let thread = saleOffer.threads.filter((thread) => thread.id === threadId)[0];
    getBuyerDataById({ variables: { getUserDataByIdId: thread.creator_id } });
    setCurrentThread({ ...thread });
  };

  const handleCreateComment = () => {
    //  validate comment length
    if (!comment || comment.length < 5 || comment.length > 500) {
      toast.error("Please enter a valid message between 1 and 500 characters");
      return;
    }

    // add comment
    if (saleOffer.creator_id === auth.userId) {
      if (!currentThreadId) {
        toast.error("You can't start a conversation on your own offer");
        return;
      }

      createComment({
        variables: { input: { content: comment, saleOfferId: saleOffer.id, threadId: currentThreadId } },
      });
    } else {
      createComment({ variables: { input: { content: comment, saleOfferId: saleOffer.id, threadId: "" } } });
    }

    // clear comment from textarea
    setComment("");
  };

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <>
      <div className="flex flex-col justify-center sm:flex-col lg:flex-row gap-8 mt-6">
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
        <div className="relative w-[400px] bg-white rounded-lg flex flex-col gap-3 py-8 p-4 shadow-md">
          <div className="flex flex-col gap-1">
            {/* Description */}
            <p className="text-xl cursor-default mt-3">
              {saleOffer.description}, {saleOffer.category.name}
            </p>
            {/* Created at */}
            {saleOffer.creator_id !== auth.userId && (
              <>
                <div className="font-light text-xs cursor-default">
                  <Moment fromNow>{saleOffer.created_at}</Moment>
                </div>
              </>
            )}
            {/* Price */}
            <p className="text-blue-700 font-medium text-lg cursor-default">
              {new Intl.NumberFormat("dk-DK", { style: "currency", currency: "DKK" }).format(saleOffer.price)}
            </p>
          </div>

          {/* Location */}
          <div>
            <p className="my-2 cursor-default text-[8px] text-end">
              The items are located in {saleOffer.city.name}, {saleOffer.city.zip_code}
            </p>
            <iframe
              height="250"
              width="370"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API}
    &q=${saleOffer.city.zip_code},${saleOffer.city.name}&zoom=10`}
            ></iframe>
          </div>
          {/*isShipable*/}
          <div className="absolute top-0 right-0 text-xs font-light bg-gray-300 rounded-bl rounded-tr px-2">
            {saleOffer.is_shippable ? (
              <p className="flex items-center gap-2 cursor-default">
                Kan sendes
                <FaShuttleVan className="mt-1" />
              </p>
            ) : (
              <p className="cursor-default">Sendes ikke</p>
            )}
          </div>
          {/* Display seller data */}
          <div>
            <div className="rounded-lg p-4 mt-2 h-15 flex flex-col justify-between items-center">
              {saleOffer.creator_id !== auth.userId ? (
                <div className="w-full flex justify-between">
                  <p>Seller:</p>
                  <p>
                    {sellerData.first_name} {sellerData.last_name}
                  </p>
                </div>
              ) : (
                <div className="text-sm">
                  <p>
                    You have had this item for sale since <Moment fromNow>{saleOffer.created_at}</Moment>
                  </p>
                </div>
              )}
              {/*On click Contact button will show the owner's phone number for the sale offer*/}
              {saleOffer.creator_id !== auth.userId && (
                <div className="flex relative ">
                  <button
                    className="shadow-lg px-6 py-2 mt-4 rounded-lg bg-[#dcfce7] flex gap-2 items-center"
                    onClick={() => setShowNumber(!showNumber)}
                  >
                    {showNumber ? (
                      <>
                        <FcPhoneAndroid /> {sellerData.phone_number}
                      </>
                    ) : (
                      <>
                        <FcPhoneAndroid /> Show Number
                      </>
                    )}
                  </button>
                  {showNumber ? (
                    <div className="absolute">
                      <p></p>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THREAD LOGIC */}

      <div className="flex flex-col items-center justify-center mt-14 mb-28">
        {saleOffer.threads && saleOffer.threads.length === 0 && (
          <p className="text-lg font-light text-center">Currently no</p>
        )}
        <div className="flex gap-6">
          {/* Left side scrollbar only showing if you are the owner have more than one thread*/}
          {saleOffer.threads && saleOffer.threads.length > 1 && (
            <>
              <div>
                <p className="text-xs font-light mt-3">Threads</p>
                <div className="w-[50px] bg-slate-300 rounded-[10px] mt-2 h-full max-h-[200px] scroll-smooth scrollbar-hide overflow-y-scroll flex flex-col items-center py-2 shadow-sm">
                  {saleOffer.threads.map((thread) => {
                    let hasUnreadComments = thread.comments.some(
                      (comment) => !comment.is_read && comment.author_id !== auth.userId
                    );
                    return (
                      <>
                        <div
                          className={`rounded-full my-[7px] p-[6px] cursor-pointer hover:scale-110 hover:border hover:border-white duration-100 ${
                            hasUnreadComments ? "bg-red-700" : "bg-green-500"
                          } ${currentThreadId === thread.id ? "border-[1.5px] border-gray-700" : ""}`}
                          key={thread.id}
                          onClick={() => handleThreadChange(thread.id)}
                        ></div>
                      </>
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {/* Right side */}
          <div>
            <p className="text-lg font-light text-center">Messages</p>
            {/* Message display */}
            {saleOffer.threads && saleOffer.threads.length > 0 && (
              <>
                {currentThread.comments.map((comment, idx) => (
                  <div
                    className={`w-[450px] py-4 px-6 rounded-[12px] my-3 shadow-sm ${
                      comment.author_id === saleOffer.creator_id ? "bg-slate-400/60" : "bg-slate-300"
                    }`}
                    key={idx}
                  >
                    <p className="font-light text-base mb-2 break-words">{comment.content}</p>
                    <div className="flex justify-between">
                      <p className="font-thin text-[11px] text-stone-600">
                        Written by{" "}
                        {comment.author_id === auth.userId ? (
                          <div className="inline-block font-medium">you</div>
                        ) : (
                          <>
                            {" "}
                            {comment.author_id === sellerData.id && (
                              <>
                                {sellerData.first_name.charAt(0).toUpperCase() + sellerData.first_name.slice(1)}{" "}
                                {sellerData.last_name.charAt(0).toUpperCase() + sellerData.last_name.slice(1)}
                              </>
                            )}{" "}
                            {comment.author_id === buyerData.id && (
                              <>
                                {buyerData.first_name.charAt(0).toUpperCase() + buyerData.first_name.slice(1)}{" "}
                                {buyerData.last_name.charAt(0).toUpperCase() + buyerData.last_name.slice(1)}
                              </>
                            )}{" "}
                          </>
                        )}{" "}
                        <Moment fromNow>{comment.created_at}</Moment>
                      </p>
                      {comment.is_read && <RiCheckDoubleFill className="text-stone-600" />}
                    </div>
                  </div>
                ))}
              </>
            )}
            {/* Message input and Button to submit message input */}
            <div className="flex gap-2 mt-5">
              <textarea
                rows={1}
                placeholder="Write here..."
                className="border-none rounded-[12px] font-base flex-1"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
              <div>
                <button
                  className={`text-white text-lg bg-blue-700 w-[104px] h-[38px] rounded-[12px] font-light disabled:bg-gray-300 `}
                  onClick={handleCreateComment}
                  disabled={!comment.length}
                >
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
