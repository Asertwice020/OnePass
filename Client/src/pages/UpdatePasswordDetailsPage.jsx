// UpdatePasswordDetailsPage.jsx
import CardWrapper from "../utils/CardWrapper";
import RightTailArrow from "../assets/icons/right-tail-arrow.svg";
import KeySvg from "../assets/icons/key.svg";
import AddSvg from "../assets/icons/add.svg";
import { useEffect, useState } from "react";
import GeneratePassword from "../components/GeneratePassword";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { updatePassword, getDecryptedPassword } from "../api/axios";

const UpdatePasswordDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { allStoredPasswords } = useSelector((state) => state.storedPasswords);

  const [card, setCard] = useState(null);
  const [isMasterKeyAvailable, setIsMasterKeyAvailable] = useState(true);
  const [showGeneratePasswordPanel, setShowGeneratePasswordPanel] = useState(false);
  
  const handleCardId = () => {
    const param = new URLSearchParams(location.search);
    const cardId = param.get("cardId");
    const card = allStoredPasswords.find((item) => item._id === cardId);

    if (!cardId || !card) {
      navigate(-1);
      toast.error("Card Not Found!");
      return null;
    }
    return card;
  }

  const decryptPassword = async (password) => {
    try {
      const decryptedPassword = await getDecryptedPassword(password);
      if (!decryptedPassword) {
        throw new Error();
      }
      return decryptedPassword;
    } catch (error) {
      toast.error("There is something wrong");
      navigate(-1);
    }
  };

  useEffect(() => {
    const fetchCardData = async () => {
      const card = handleCardId()

      if (card && card?.password) {
        const decryptedPassword = await decryptPassword(card?.password)
        if (decryptedPassword) {
          setCard({ ...card, password: decryptedPassword });
        }
      }
    };
    fetchCardData();
  }, [location.search]);
  
  const onSubmitHandler = async (formData) => {
    try {
      const cardId = card?._id || "";

      if (!cardId) {
        toast.error("Card ID is missing");
        return null;
      }

      const response = await updatePassword({...formData, cardId});
      const { data: userData } = response?.data ?? {};

      if (!userData && !(userData instanceof Object)) {
        throw new Error();
      }

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/");
        // dispatch(generatePasswordLogout());
        // TODO: show a popup with the options: close -> navigate to the home page, use the password (just copy that password which you had saved in the db)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toCapitalCase = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const inputFields = [
    {
      id: 1,
      name: "category",
      label: "Category",
      type: "select",
      options: ["Select", "Social", "Work", "Apps", "Documents", "Cards"],
      defaultValue: toCapitalCase(card?.category) || "Select", // Ensure capitalization
    },
    {
      id: 2,
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Website/App Name",
      defaultValue: card?.title || "",
    },
    {
      id: 3,
      name: "url",
      label: "URL",
      type: "text",
      placeholder: "Website/App Link",
      defaultValue: card?.url || "",
    },
    {
      id: 4,
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "johndoe@example.com",
      defaultValue: card?.email || "",
    },
    {
      id: 5,
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
      defaultValue: card?.password || "",
    },
    {
      id: 6,
      name: "note",
      label: "note",
      type: "text",
      placeholder: "Add a note",
      defaultValue: card?.note || "",
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

  return (
    <main className="main-with-header relative">
      <CardWrapper
        heading="update"
        CTA="save changes"
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        paddingTop="pt-8"
        // redirectingPath={"/"}
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

export default UpdatePasswordDetailsPage;
