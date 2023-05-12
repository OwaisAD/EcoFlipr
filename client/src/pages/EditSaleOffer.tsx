import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_SALE_OFFER_BY_ID } from "../GraphQL/queries/getSaleOfferById";
import { SaleOffer } from "../types/saleOffer";
import { GET_ALL_CATEGORIES } from "../GraphQL/queries/getAllCategories";
import { GET_CITY_BY_ZIP_CODE } from "../GraphQL/queries/getCityByZipCode";
import { IoRemoveCircle } from "react-icons/io5";

// https://www.npmjs.com/package/uploader
// Initialize once (at the start of your app).
const uploader = Uploader({ apiKey: import.meta.env.VITE_IMAGE_UPLOADER_API });
const uploaderOptions = {
  multi: true,

  // Comment out this line & use 'onUpdate' instead of
  // 'onComplete' to have the dropzone close after upload.
  showFinishButton: true,

  styles: {
    colors: {
      active: "#528fff",
      error: "#d23f4d",
      primary: "#377dff",
      shade100: "#333",
      shade200: "#7a7a7a",
      shade300: "#999",
      shade400: "#a5a6a8",
      shade500: "#d3d3d3",
      shade600: "#dddddd",
      shade700: "#f0f0f0",
      shade800: "#f8f8f8",
      shade900: "#fff",
    },
    fontSizes: {
      base: 16,
    },
  },
};

type Category = {
  id: string;
  name: string;
};

type City = {
  id: string;
  name: string;
  zip_code: string;
};

const EditSaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [saleOfferData, setSaleOfferData] = useState<SaleOffer>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [foundCity, setFoundCity] = useState<City>({ id: "", name: "", zip_code: "" });

  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [shipping, setShipping] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES, {
    onCompleted(data) {
      setCategories(data.getAllCategories);
    },
  });

  const [getCityByZipCode, { data: data1, loading: loading1, error: error1 }] = useLazyQuery(GET_CITY_BY_ZIP_CODE, {
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
        setDescription(data.getSaleOfferById.description);
        setCategory(data.getSaleOfferById.category.id);
        setZipCode(data.getSaleOfferById.city.zip_code);
        setShipping(data.getSaleOfferById.is_shippable);
        setPrice(data.getSaleOfferById.price);
        setImages([...data.getSaleOfferById.imgs]);
      }
    },
    onError(error) {
      navigate("/error");
    },
  });

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  const handleEditSaleOffer = () => {};

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col w-[600px] gap-4">
        <h1 className="text-center text-2xl font-light">Edit offer</h1>
        {/* OFFER DESCRIPTION */}
        <textarea
          placeholder="Offer description"
          className="border-none rounded-[12px] h-[80px] max-h-[300px]"
          value={description}
        />

        {/* OFFER CATEGORY */}
        <select name="" id="" className="border-none rounded-[12px]">
          <option disabled selected>
            Select a category
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id} selected={c.id === category}>
              {c.name}
            </option>
          ))}
        </select>

        {/* IS SHIPPABLE */}
        <div className="flex items-center justify-between">
          <p className="text-lg">Do you offer shipping?</p>
          <input
            type="checkbox"
            className="w-6 h-6 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            checked={shipping}
          />
        </div>

        {/* CITY */}
        <div>
          <input
            type="number"
            placeholder="Select zip code"
            className="rounded-l-[12px] border-none w-48"
            min={1000}
            max={9999}
            value={+zipCode}
          />
          <div className="inline-block border-slate-800 border-r-2"></div>
          <input type="text" disabled placeholder="Chosen city" className="rounded-r-[12px] border-none bg-gray-300" />
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
              value={price}
            />
            <p className="absolute top-2 right-2 text-gray-500 cursor-default select-none">,-</p>
          </div>
        </div>

        {images.length && (
          <div className="w-[600px] flex flex-wrap justify-center gap-2">
            {images.map((img) => (
              <>
                <div className="relative">
                  <img src={img} alt="" className="w-44 h-44 object-cover shadow-lg" />
                  <div className="absolute top-1 right-1 hover:scale-125 duration-100">
                    <IoRemoveCircle color="red" size={24}/>
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
            onUpdate={(files) => console.log(files.map((x) => x.fileUrl).join("\n"))}
            onComplete={(files) => alert(files.map((x) => x.fileUrl).join("\n"))}
            height="240px"
          />
        </div>
      </div>
    </div>
  );
};

export default EditSaleOffer;
