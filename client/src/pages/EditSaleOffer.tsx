import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { UploadDropzone } from "react-uploader";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_SALE_OFFER_BY_ID } from "../GraphQL/queries/getSaleOfferById";
import { SaleOfferType } from "../types/saleOffer";
import { GET_ALL_CATEGORIES } from "../GraphQL/queries/getAllCategories";
import { GET_CITY_BY_ZIP_CODE } from "../GraphQL/queries/getCityByZipCode";
import { IoRemoveCircle } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { UPDATE_SALE_OFFER } from "../GraphQL/mutations/updateSaleOffer";
import { Category } from "../types/category";
import { City } from "../types/city";
import { uploader } from "../uploader/uploader";
import { uploaderOptions } from "../uploader/uploaderOptions";

const EditSaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [saleOfferData, setSaleOfferData] = useState<SaleOfferType>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [foundCity, setFoundCity] = useState<City>({ id: "", name: "", zip_code: "" });

  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [updatedShipping, setUpdatedShipping] = useState(false);
  const [updatedZipCode, setUpdatedZipCode] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedImages, setUpdatedImages] = useState<string[]>([]);

  useQuery(GET_ALL_CATEGORIES, {
    onCompleted(data) {
      setCategories(data.getAllCategories);
    },
  });

  const [getCityByZipCode] = useLazyQuery(GET_CITY_BY_ZIP_CODE, {
    onCompleted(data) {
      setFoundCity(data.getCityByZipCode);
    },
  });

  useQuery(GET_SALE_OFFER_BY_ID, {
    variables: { getSaleOfferByIdId: id },
    onCompleted(data) {
      if (data.getSaleOfferById.creator_id !== auth.userId) {
        navigate("/error");
      } else {
        setSaleOfferData(data.getSaleOfferById);
        setUpdatedDescription(data.getSaleOfferById.description);
        setUpdatedCategory(data.getSaleOfferById.category.id);
        setUpdatedZipCode(data.getSaleOfferById.city.zip_code);
        setUpdatedShipping(data.getSaleOfferById.is_shippable);
        setUpdatedPrice(data.getSaleOfferById.price);
        setUpdatedImages([...data.getSaleOfferById.imgs]);
        getCityByZipCode({ variables: { zipCode: data.getSaleOfferById.city.zip_code } });
      }
    },
    onError() {
      navigate("/error");
    },
  });

  console.log(updatedImages);

  const [updateSaleOffer] = useMutation(UPDATE_SALE_OFFER);

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  const handleEditSaleOffer = () => {
    // VALIDATE IF ANYTHING HAS CHANGED.
    if (
      saleOfferData?.description === updatedDescription &&
      saleOfferData.category.id === updatedCategory &&
      saleOfferData.is_shippable === updatedShipping &&
      saleOfferData.city.zip_code === updatedZipCode &&
      saleOfferData.price === +updatedPrice
    ) {
      const imagesDiffer =
        saleOfferData.imgs.length !== updatedImages.length ||
        !saleOfferData.imgs.every((element, index) => element === updatedImages[index]);
      if (!imagesDiffer) {
        toast.error("No changes");
        return;
      }
    }
    if (!updatedDescription || updatedDescription.length < 5 || updatedDescription.length > 300) {
      toast.error("Please add a valid description with length between 5 and 300 characters");
      return;
    }

    if (!updatedCategory) {
      toast.error("Please select a category");
      return;
    }

    if (!foundCity.name) {
      toast.error("Please enter a valid zip code");
      return;
    }

    if (!updatedPrice || +updatedPrice < 1 || +updatedPrice > 9999999) {
      toast.error("Please enter a valid price");
    }

    if (!updatedImages) {
      let confirmation = confirm("Are you sure you want to create an offer with no images");
      if (!confirmation) {
        return;
      }
    }

    // update offer
    let confirmation = confirm("Are you sure you want to update your offer?");
    if (!confirmation) {
      return;
    }

    toast.promise(
      updateSaleOffer({
        variables: {
          updateSaleOfferId: saleOfferData!.id,
          input: {
            description: updatedDescription,
            category: { id: updatedCategory },
            city: { id: foundCity.id },
            imgs: updatedImages,
            is_shippable: updatedShipping,
            price: +updatedPrice,
          },
        },
      }),
      {
        loading: "Updating...",
        success: <b>Updated successfully!</b>,
        error: <b>Could not save.</b>,
      }
    );
    navigate(`/offer/${saleOfferData!.id}`);
  };

  const handleFindCity = (zipCode: string) => {
    setUpdatedZipCode(zipCode);
    if (isNaN(+zipCode)) {
      return;
    }

    if (+zipCode < 1000 || +zipCode > 9999) {
      return;
    }

    getCityByZipCode({ variables: { zipCode } });
  };

  const handleRemoveImage = (link: string) => {
    const updatedImageList = updatedImages.filter((string) => string !== link);
    setUpdatedImages(updatedImageList);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col w-[600px] gap-4">
        <h1 className="text-center text-4xl font-thin mb-10">Editing offer</h1>
        {/* OFFER DESCRIPTION */}
        <textarea
          placeholder="Offer description"
          className="border-none rounded-[12px] h-[80px] max-h-[300px]"
          value={updatedDescription}
          onChange={(e) => setUpdatedDescription(e.target.value)}
        />

        {/* OFFER CATEGORY */}
        <select
          name=""
          id=""
          title="select-category"
          className="border-none rounded-[12px]"
          onChange={(e) => setUpdatedCategory(e.target.value)}
        >
          <option disabled selected>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} selected={c.id === saleOfferData?.category.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* IS SHIPPABLE */}
        <div className="flex items-center justify-between">
          <p className="text-lg">Do you offer shipping?</p>
          <input
            title="is_shippable-checkbox"
            type="checkbox"
            className="w-6 h-6 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={updatedShipping}
            onChange={() => setUpdatedShipping(!updatedShipping)}
          />
        </div>

        {/* CITY */}
        <div>
          <input
            type="text"
            placeholder="Enter a zip code"
            className="rounded-l-[12px] border-none w-48"
            pattern="[0-9]{4}"
            value={+updatedZipCode}
            onChange={(e) => {
              handleFindCity(e.target.value);
            }}
          />
          <div className="inline-block border-slate-800 border-r-2"></div>
          <input
            type="text"
            disabled
            placeholder="Chosen city"
            className="rounded-r-[12px] border-none bg-gray-300"
            value={foundCity.name}
          />
        </div>

        {/* Price */}
        <div className="text-right ">
          <div className="relative">
            <input
              type="text"
              pattern="\d*"
              maxLength={8}
              className="border-none rounded-[12px] w-40 relative"
              placeholder="Enter a price"
              value={updatedPrice}
              onChange={(e) => setUpdatedPrice(e.target.value)}
            />
            <p className="absolute top-2 right-2 text-gray-500 cursor-default select-none">,-</p>
          </div>
        </div>

        {saleOfferData && (
          <div className="w-[600px] flex flex-wrap gap-2">
            {updatedImages.map((img) => (
              <>
                <div className="relative" onClick={() => handleRemoveImage(img)}>
                  <img src={img} alt="" className="w-44 h-44 object-cover shadow-lg rounded-[12px]" />
                  <div className="absolute top-1 right-1 hover:scale-125 duration-100 cursor-pointer">
                    <IoRemoveCircle color="red" size={24} />
                  </div>
                </div>
              </>
            ))}
          </div>
        )}

        {/* UPLOAD IMAGES */}
        <div className="bg-[#ECECEC] rounded-[12px]">
          <UploadDropzone
            uploader={uploader}
            options={uploaderOptions}
            onComplete={(files) => {
              let newImages = files.map((x) => x.fileUrl);
              setUpdatedImages((prevImages) => [...prevImages, ...newImages]);
            }}
            height="240px"
          />
        </div>
        <div className="text-center mt-5">
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:scale-105 duration-100"
            onClick={handleEditSaleOffer}
          >
            Update offer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditSaleOffer;
