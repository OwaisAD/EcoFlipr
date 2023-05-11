import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_SALE_OFFERS_BY_USER } from "../GraphQL/queries/getSaleOfferByUser";
import { Carousel } from "react-responsive-carousel";
import Moment from "react-moment";
import { DELETE_SALE_OFFER_BY_ID } from "../GraphQL/mutations/deleteSaleOfferById";
import { SaleOfferInterface } from "../types/saleOffer";
import { isValidHttpUrl } from "../utils/urlValidator";

const Profile = () => {
  const auth = useAuth();
  const location = useLocation();
  const { loading, error, data } = useQuery(GET_SALE_OFFERS_BY_USER);

  function DeleteSaleOffer({ saleOfferId }: { saleOfferId: string }) {
    const [mutation] = useMutation(DELETE_SALE_OFFER_BY_ID, {
      variables: { deleteSaleOfferById: saleOfferId },
      refetchQueries: [GET_SALE_OFFERS_BY_USER],
    });
    return (
      <button
        className="flex justify-center rounded-3xl mt-1 h-[12px] w-[12px] bg-red-500 text-[8px] text-slate-300"
        style={{ float: "right" }}
        onClick={() => {
          if (confirm("Are you sure you want to delete this sale offer")) {
            mutation();
          } else {
            return;
          }
        }}
      >
        X
      </button>
    );
  }

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      {/* Tab bar to switch between 'Mine annoncer' and 'Profiloplysninger'*/}
      <div></div>
      {/* Display of user's sale offers */}
      <p className="text-2xl">Mine annoncer</p>
      <div>
        {data.getSaleOffersByUser.map((offer: SaleOfferInterface) => (
          <div className="flex bg-slate-300 sm:flex-col lg:flex-row gap-2 mt-6">
            {/* Images */}
            <Carousel width={"110px"} showThumbs={false} showStatus={false}>
              {offer.imgs.map((img) => (
                <div key={img}>
                  <img src={isValidHttpUrl(img) ? img : "../../images/No-Image-Placeholder.svg.png"} alt="" />
                </div>
              ))}
            </Carousel>
            {/* Delete button */}
            <DeleteSaleOffer saleOfferId={offer.id} />
            <div className="flex flex-col">
              {/* Description and category name */}
              <p>
                {offer.description}, {offer.category.name}
              </p>
              {/* Price */}
              <div className="flex">
                <Moment fromNow>{offer.created_at}</Moment>
                <p className="ml-auto font-semibold">
                  {new Intl.NumberFormat("dk-DK", { style: "currency", currency: "DKK" }).format(offer.price)}
                </p>
              </div>
              {/* Location and shippable*/}
              <div className="flex text-xs">
                <p>
                  {offer.city.zip_code}, {offer.city.name}
                </p>
                <p className="pr-2 pl-2">|</p>
                {offer.is_shippable ? <p>Kan sendes</p> : <p>Sendes ikke</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
