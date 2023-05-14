import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center gap-2">
      <div>
        <p className="text-[200px] font-light">Oops!</p>
      </div>
      <div className="text-3xl font-bold tracking-wide">
        <p>404 - PAGE NOT FOUND</p>
      </div>
      <div className="flex flex-col items-center m-4">
        <p>The page you are looking for might have been removed</p>
        <p>had its name changed or is temporarily unavailable.</p>
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => navigate("/")}
        >
          GO TO HOMEPAGE
        </button>
      </div>
    </div>
  );
};

export default Error;
