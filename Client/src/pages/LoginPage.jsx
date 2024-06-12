// LoginPage.jsx
import { useDispatch } from "react-redux";
import {loginUser} from "../api/axios";
import CardWrapper from "../utils/CardWrapper";
import { login } from "../redux/Slices/userSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
// import { useEffect } from "react";

const LoginPage = () => {
  const dispatch = useDispatch() 
  const navigate = useNavigate()

  const onSubmitHandler = async (formData) => {
    try {
      const response = await loginUser(formData);
      const { data: userData } = response?.data ?? {};

      // console.log({
      //   fullResponse: response,
      //   responseData: response.data,
      //   userData: response.data.data,
      //   accessToken: userData.accessToken,
      // });

      if (!userData && !(userData instanceof Object)) {
        throw new Error("Invalid User Credentials!");
      }

      if (response?.data?.success) {
        dispatch(login(userData));
        toast.success(response?.data?.message);
        navigate("/");
      } else {
        throw new Error(response?.data?.message || "Failed To Login!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "johndoe@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
    },
  ];

  return (
    <main className="main-with-header">
      <CardWrapper
        heading="Login"
        CTA="Login"
        headingLabel="Welcome back! Let's get you logged in"
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        redirectingPageName="Register"
        redirectingLabel="Don't have an account?"
        redirectingPath="/register"
        paddingTop="pt-5"
      />
    </main>
  );
};

export default LoginPage;
