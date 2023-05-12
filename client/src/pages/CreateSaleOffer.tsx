import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";
import { toast } from "react-hot-toast";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_ALL_CATEGORIES } from "../GraphQL/queries/getAllCategories";
import { GET_CITY_BY_ZIP_CODE } from "../GraphQL/queries/getCityByZipCode";
import { CREATE_SALE_OFFER } from "../GraphQL/mutations/createSaleOffer";

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

const CreateSaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();

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

  const [createSaleOffer, { data: data2 }] = useMutation(CREATE_SALE_OFFER);

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  const handleCreateSaleOffer = () => {
    console.log(description);
    if (!description || description.length < 10 || description.length > 300) {
      toast.error("Please add a valid description with length between 5 and 300 characters");
      return;
    }

    console.log(category);
    if (!category) {
      toast.error("Please select a category");
      return;
    }

    console.log(shipping);

    console.log(zipCode);
    if (!foundCity.name) {
      toast.error("Please enter a valid zip code");
      return;
    }

    console.log(price);
    if (!price || +price < 1 || +price > 9999999) {
      toast.error("Please enter a valid price");
    }

    console.log(images);

    if (!images) {
      let confirmation = confirm("Are you sure you want to create an offer with no images");
      if (!confirmation) {
        return;
      }
    }

    // create comment
    let comment = {
      category: { id: category },
      city: { id: foundCity.id },
      description,
      imgs: images,
      is_shippable: shipping,
      price: +price,
    };

    console.log(comment)
    createSaleOffer({ variables: { input: comment } });
  };

  const handleFindCity = (zipCode: string) => {
    if (isNaN(+zipCode)) {
      console.log("Not a number");
      return;
    }

    if (+zipCode < 1000 || +zipCode > 9999) {
      return;
    }

    getCityByZipCode({ variables: { zipCode } });
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col w-[600px] gap-4">
        <h1 className="text-center text-2xl font-light">Create offer</h1>
        {/* OFFER DESCRIPTION */}
        <textarea
          placeholder="Offer description"
          className="border-none rounded-[12px] h-[80px] max-h-[300px]"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />

        {/* OFFER CATEGORY */}
        <select name="" id="" className="border-none rounded-[12px]" onChange={(e) => setCategory(e.target.value)}>
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
        <div className="flex items-center justify-between">
          <p className="text-lg">Do you offer shipping?</p>
          <input
            type="checkbox"
            className="w-6 h-6 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            onChange={(e) => setShipping(!shipping)}
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
            onUpdate={(files) => console.log(files.map((x) => x.fileUrl).join("\n"))}
            onComplete={(files) => {
              files.map((x) => setImages([...images, x.fileUrl]));
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
