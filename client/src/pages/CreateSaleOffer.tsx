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


const handleCreateSaleOffer = () => {}

const CreateSaleOffer = () => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    localStorage.setItem("lastPath", location.pathname);
    return <Navigate to="/login" />;
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col w-[600px]">
        <h1 className="text-center">Create offer</h1>
        {/* OFFER DESCRIPTION */}
        <input type="text" placeholder="Offer description" />

        {/* OFFER CATEGORY */}
        <select name="" id="">
          <option disabled selected>
            Select a category
          </option>
          <option value="">1</option>
          <option value="">2</option>
        </select>

        {/* IS SHIPPABLE */}
        <div className="flex items-center justify-between">
          <p>Can the item be shipped?</p>
          <input
            type="checkbox"
            className="w-4 h-4 text-blue-600  border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* CITY */}
        <div>
          <input type="text" placeholder="Select zip code" className="rounded-lg" />
          <input type="text" disabled placeholder="Chosen city" />
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

export default CreateSaleOffer;
