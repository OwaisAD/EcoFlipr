import React from "react";
import { useAuth } from "../context/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";

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

const handleEditSaleOffer = () => {};

const EditSaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="flex flex-col w-[600px] gap-4">
        <h1 className="text-center text-2xl font-light">Edit offer</h1>
        {/* OFFER DESCRIPTION */}
        <textarea placeholder="Offer description" className="border-none rounded-[12px] h-[80px] max-h-[300px]" />

        {/* OFFER CATEGORY */}
        <select name="" id="" className="border-none rounded-[12px]">
          <option disabled selected>
            Select a category
          </option>
          <option value="">1</option>
          <option value="">2</option>
        </select>

        {/* IS SHIPPABLE */}
        <div className="flex items-center justify-between">
          <p className="text-lg">Do you offer shipping?</p>
          <input
            type="checkbox"
            className="w-6 h-6 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
            onComplete={(files) => alert(files.map((x) => x.fileUrl).join("\n"))}
            height="240px"
          />
        </div>
      </div>
    </div>
  );
};

export default EditSaleOffer;
