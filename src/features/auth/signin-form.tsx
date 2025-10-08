import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store"; // Import the store types
import { signInThunk } from '@/store/slices/user-slice';
import * as yup from "yup";
import niblogo from "@/assets/img/imageeeeu.png";
import { useNavigate } from "react-router-dom";


// Define Yup validation schema
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  // rememberMe: yup.boolean(),
});

interface LoginFormInputs {
  username: string,
  password: string;
  // rememberMe?: boolean;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    // control,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch<AppDispatch>();
  const navigate  = useNavigate();
  const { loading,  isAuth } = useSelector((state: RootState) => state.user);
  

  const onSubmit = async(data: LoginFormInputs) => {
    await dispatch(signInThunk({ username: data.username, password: data.password}));
    
    
  };

    // Use useEffect to handle redirection after successful login
    useEffect(() => {
      if (isAuth) {
        navigate("/");
      }
    }, [isAuth, navigate]);

  return (
    <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-md">
      <div className="text-center mb-6">
        <img
          src={niblogo}
          alt="NIB Logo"
          className="mx-auto h-20"
        />
        <h1 className="text-2xl font-bold mt-4">
          NIB <br /> Report Management Login
        </h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 float-start mb-2"
          >
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 mt-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.2505 13.8307C8.33752 13.8307 4.90552 16.1327 4.90552 18.7557C4.90552 22.1307 10.4345 22.1307 12.2505 22.1307C14.0665 22.1307 19.5945 22.1307 19.5945 18.7337C19.5945 16.1217 16.1625 13.8307 12.2505 13.8307Z"
                  fill="#2E2E2E"
                  fillOpacity="0.82"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.212 11.6423H12.243C14.938 11.6423 17.13 9.45026 17.13 6.75526C17.13 4.06126 14.938 1.86926 12.243 1.86926C9.54805 1.86926 7.35605 4.06126 7.35605 6.75326C7.34705 9.43926 9.52405 11.6323 12.212 11.6423Z"
                  fill="#2E2E2E"
                  fillOpacity="0.82"
                />
              </svg>
            </span>
            <input
              type="text"
              id="username"
              placeholder="username"
              {...register("username")}
              className={`w-full pl-10 px-4 py-2 border ${
                errors.username ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">
                {errors.username.message}
              </p>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 float-start mb-2"
          >
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 mt-6">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.0001 17.0471C13.0001 17.4611 12.6641 17.7971 12.2501 17.7971C11.8361 17.7971 11.5001 17.4611 11.5001 17.0471V14.8261C11.5001 14.4121 11.8361 14.0761 12.2501 14.0761C12.6641 14.0761 13.0001 14.4121 13.0001 14.8261V17.0471ZM12.2501 8.99407C10.7471 8.99407 9.48609 9.10507 8.43909 9.34807V7.91707C8.47309 5.84207 10.1241 4.19607 12.1991 4.17107H12.2471C13.9141 4.17107 15.4131 5.27807 15.9031 6.87807C16.0241 7.27407 16.4401 7.49907 16.8401 7.37507C17.2351 7.25407 17.4591 6.83507 17.3371 6.43907C16.6481 4.19107 14.4861 2.65607 12.1811 2.67107C9.28809 2.70707 6.98609 5.00007 6.93909 7.90507V9.86207C4.90609 10.8311 4.09009 12.6831 4.09009 15.7651C4.09009 20.7651 6.22609 22.5371 12.2501 22.5371C18.2741 22.5371 20.4101 20.7651 20.4101 15.7651C20.4101 10.7661 18.2741 8.99407 12.2501 8.99407Z"
                  fill="#2E2E2E"
                  fillOpacity="0.82"
                />
              </svg>
            </span>
            <input
              type="password"
              id="password"
              placeholder="password"
              {...register("password")}
              className={`w-full pl-10 px-4 py-2 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

         {/* Remember Me Checkbox */} 
       {/* <div className="flex items-center">
          {/* <Controller
            name="rememberMe"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <input
                type="checkbox"
                id="rememberMe"
                checked={field.value || false} // Use `checked` instead of `value`
                onChange={field.onChange} // Pass the handler from Controller
                className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded"
              />
            )}
          />

          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
            Keep me logged in
          </label>
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 px-4 text-white rounded-md font-medium focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-amber-700 hover:bg-amber-800"
          }`}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;