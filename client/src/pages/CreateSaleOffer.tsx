import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UploadDropzone } from "react-uploader";
import { toast } from "react-hot-toast";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../GraphQL/queries/getAllCategories";
import { GET_CITY_BY_ZIP_CODE } from "../GraphQL/queries/getCityByZipCode";
import { CREATE_SALE_OFFER } from "../GraphQL/mutations/createSaleOffer";
import { GET_SALE_OFFERS_BY_USER } from "../GraphQL/queries/getSaleOfferByUser";
import { Category } from "../types/category";
import { City } from "../types/city";
import { uploaderOptions } from "../uploader/uploaderOptions";
import { uploader } from "../uploader/uploader";

const CreateSaleOffer = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories] = useState<Category[]>([]);
  const [foundCity, setFoundCity] = useState<City>({ id: "", name: "", zip_code: "" });

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);

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

  const [createSaleOffer] = useMutation(CREATE_SALE_OFFER, {
    refetchQueries: [GET_SALE_OFFERS_BY_USER],
  });

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  const handleCreateSaleOffer = () => {
    if (!description || description.length < 5 || description.length > 300) {
      toast.error("Please add a valid description with length between 5 and 300 characters");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    if (!foundCity.name) {
      toast.error("Please enter a valid zip code");
      return;
    }

    if (!price || +price < 1 || +price > 9999999) {
      toast.error("Please enter a valid price");
    }

    if (!images) {
      let confirmation = confirm("Are you sure you want to create an offer with no images");
      if (!confirmation) {
        return;
      }
    }

    // create offer
    let offer = {
      category: { id: category },
      city: { id: foundCity.id },
      description,
      imgs: images,
      is_shippable: shipping,
      price: +price,
    };
    createSaleOffer({ variables: { input: offer } });
    navigate("/profile");
  };

  const handleFindCity = (zipCode: string) => {
    if (isNaN(+zipCode)) {
      return;
    }

    if (+zipCode < 1000 || +zipCode > 9999) {
      return;
    }

    getCityByZipCode({ variables: { zipCode } });
  };

  return (
    <div className="h-screen  flex items-center justify-center font-light">
      <div className="flex flex-col w-[600px] gap-4">
        <h1 className="text-center text-4xl font-thin mb-10">Create Offer</h1>
        {/* OFFER DESCRIPTION */}
        <textarea
          placeholder="Offer description"
          className="border-none rounded-[12px] h-[80px] max-h-[300px]"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />

        {/* OFFER CATEGORY */}
        <select
          name=""
          title="select-offer"
          id=""
          className="border-none rounded-[12px]"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled selected>
            Select a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* IS SHIPPABLE */}
        <div className="flex items-center gap-4">
          <p className="text-lg">Do you offer shipping?</p>
          <input
            title="is_shippable-checkbox"
            type="checkbox"
            className="w-6 h-6 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={() => setShipping(!shipping)}
          />
        </div>

        {/* CITY */}
        <div>
          <input
            type="text"
            pattern="[0-9]{4}"
            maxLength={4}
            placeholder="Enter a zip code"
            className="rounded-l-[12px] border-none w-44"
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
            value={foundCity && foundCity.name}
          />
        </div>

        {/* Price */}
        <div className="text-right ">
          <div className="relative">
            <input
              type="text"
              pattern="\d*"
              maxLength={8}
              className="border-none rounded-[12px] w-36 relative"
              placeholder="Enter a price"
              onChange={(e) => setPrice(e.target.value)}
            />
            <p className="absolute top-2 right-2 text-gray-500 cursor-default select-none">,-</p>
          </div>
        </div>

        {/* UPLOAD IMAGES */}
        <div className="bg-[#ECECEC] rounded-[12px]">
          <UploadDropzone
            uploader={uploader}
            options={uploaderOptions}
            onUpdate={(files) => {
              let newImages = files.map((x) => x.fileUrl);
              setImages([...images, ...newImages]);
            }}
            onComplete={(files) => {
              let newImages = files.map((x) => x.fileUrl);
              setImages([...images, ...newImages]);
            }}
            height="240px"
          />
        </div>
        <div className="text-center mt-5">
          <button
            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:scale-105 duration-100"
            onClick={handleCreateSaleOffer}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSaleOffer;
