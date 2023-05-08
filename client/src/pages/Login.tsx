import React from "react";

const Login = () => {
 const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {

  event.preventDefault();
 }

  return (
    <div className="min-h-screen w-full flex">
      {/* left side */}
      <div className="relative hidden lg:block">
        <img
          src={"../../images/signin_background.jpg"}
          alt="sign in background image"
          className="object-cover h-full"
        />
        {/* color on top of image layer */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-40"></div>
      </div>
      {/* right side with inputs */}
      <div className="bg-white flex flex-col justify-center py-[35px] px-[70px] w-full md:max-w-full lg:max-w-[640px]">
        <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <p className="text-3xl font-light" >Login</p>
        <p >Please login to continue</p>
        <label  
        htmlFor="email"
        >Email</label>
          <input type="email" placeholder="Enter email" required id="email" className="rounded-[0.2rem]"/>
          <label htmlFor="password">Password</label>
          <input type="password" minLength={8} placeholder="Enter password" required id="password" className="rounded-[0.2rem]"/>
          <div>
          <p className="float-right text-xs text-blue-700 font-medium">Forgot your password?</p>
            </div>
<div className="flex flex-col items-center justify-center gap-2 mt-2">
  <div>
     <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded-full">Sign in</button>
  </div>
<div className="flex gap-2">
<p>Don't have an account?</p>
    <p className="text-blue-700">Sign up</p>
</div>
</div>
    
        </form>
      </div>
    </div>
  );
};

export default Login;
