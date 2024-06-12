// AddNewPage.jsx
import CardWrapper from "../utils/CardWrapper";
import RightTailArrow from "../assets/icons/right-tail-arrow.svg";
import KeySvg from "../assets/icons/key.svg";
import AddSvg from "../assets/icons/add.svg";
import { useState } from "react";
import { addPassword } from "../api/axios";
import GeneratePassword from "../components/GeneratePassword";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { logout as generatePasswordLogout } from "../redux/Slices/generatePasswordSlice";

const AddNewPage = () => {
  const dispatch = useDispatch();

  // const allStoredPasswords = useSelector(
  //   (state) => state.storedPasswords.allStoredPasswords
  // );

  // console.log(
  //   "allStoredPasswords are there from the redux store:",
  //   allStoredPasswords
  // );

  const navigate = useNavigate();
  const [isMasterKeyAvailable, setIsMasterKeyAvailable] = useState(true);
  const [showGeneratePasswordPanel, setShowGeneratePasswordPanel] = useState(false);
  const [isModalShowing, setIsModalShowing] = useState(false);

  const onSubmitHandler = async (formData) => {
    console.log("Form submitted with data:", formData);
    try {
      const response = await addPassword(formData);
      const { data: userData } = response?.data ?? {};

      if (!userData && !(userData instanceof Object)) {
        throw new Error();
      }

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/");
        dispatch(generatePasswordLogout());
        // TODO: show a popup with the options: close -> navigate to the home page, use the password (just copy that password which you had saved in the db)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputFields = [
    {
      id: 1,
      name: "category",
      label: "Category",
      type: "select",
      options: ["Select", "Social", "Work", "Apps", "Documents", "Cards"],
      defaultValue: "Select",
    },
    {
      id: 2,
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Website/App Name",
    },
    {
      id: 3,
      name: "url",
      label: "URL",
      type: "text",
      placeholder: "Website/App Link",
    },
    {
      id: 4,
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "johndoe@example.com",
    },
    {
      id: 5,
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
    },
    {
      id: 6,
      name: "note",
      label: "note",
      type: "text",
      placeholder: "Add a note",
    },
  ];

  const generateNewPassword = (
    <div className="flex flex-wrap justify-between">
      {!isMasterKeyAvailable ? (
        // CREATE - MASTER KEY
        <button type="button" className="thirdButton">
          Create Master Key
          <img
            src={AddSvg}
            alt="key"
            className="w-4 ml-4 p-[0.0625rem] rounded-full bg-color-6 sm:w-5 md:w-[1.4rem]"
          />
        </button>
      ) : (
        // USAGE - MASTER KEY
        <button type="button" className="thirdButton">
          Use Master Key
          <img
            src={KeySvg}
            alt="key"
            className="w-4 ml-4 p-[0.0625rem] rounded-full bg-color-6 sm:w-5 md:w-[1.4rem]"
          />
        </button>
      )}

      {/* USAGE - GENERATE PASSWORD */}
      <button
        type="button"
        className="thirdButton"
        onClick={() => {
          setShowGeneratePasswordPanel((prev) => !prev);
        }}
      >
        Generate Password
        <img
          src={RightTailArrow}
          alt="right-tail-arrow"
          className="w-4 ml-4 rounded-full bg-color-6 sm:w-5 md:w-[1.4rem]"
        />
      </button>
    </div>
  );

  const modalContent = (
    <div>
      <p>Options after form submission...</p>
      <button onClick={() => navigate("/")}>Go to Home</button>
      <button onClick={() => setIsModalShowing(false)}>Close</button>
    </div>
  );

  return (
    <main className="main-with-header relative">
      <CardWrapper
        heading="add new"
        CTA="add password"
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        paddingTop="pt-8"
        isModalShowing={isModalShowing}
        hideModal={() => setIsModalShowing(false)}
        modalContent={modalContent}
      >
        {generateNewPassword}
        {showGeneratePasswordPanel && (
          <GeneratePassword
            onClose={() => setShowGeneratePasswordPanel(false)}
          />
        )}
      </CardWrapper>
    </main>
  );
};

export default AddNewPage;
