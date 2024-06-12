import MiniWrapper from "../utils/MiniWrapper";
import Color5UserSvg from "../assets/icons/color5/user.svg";
import CalenderSvg from "../assets/icons/calender.svg";
// import EmailSvg from "../assets/icons/email.svg";
import NotesSvg from "../assets/icons/notes.svg";
import LinkSvg from "../assets/icons/link.svg"
import Color5LockSvg from "../assets/icons/color5/lock.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deletePassword, getDecryptedPassword } from "../api/axios";
import { formatDate } from "../utils/apiCallingHelper";
import toast from "react-hot-toast";

const ReadPassword = () => {
  const navigate = useNavigate();

  const [updatedCardData, setUpdatedCardData] = useState({
    _id: "",
    userId: "",
    title: "",
    category: "",
    url: "",
    email: "",
    password: "",
    note: "",
    createdAt: "",
    updatedAt: "",
    __v: "",
  });

  const {toggle, cardId} = useSelector((state) => state.fullCardToggle);
  const allStoredPasswords = useSelector((state) => state.storedPasswords.allStoredPasswords);
  const {compromisedPasswords} = useSelector((state) => state.user.userData);

  const getIsCompromisedFlag = (cardId) => {
    return compromisedPasswords.some(cardId => cardId === cardId)
  }

  const handlePasswordCardData = async () => {
    if (!toggle || !cardId || !allStoredPasswords) return;

    try {
      const card = allStoredPasswords.find(item => item._id === cardId);

      if (!card) {
        throw new Error("Card not found or no password associated with the card");
      }
      const decryptedPassword = await getDecryptedPassword(card.password);

      setUpdatedCardData(prev => (
        {
          ...prev,
          _id: card._id,
          userId: card.userId,
          title: card.title,
          category: card.category,
          url: card.url,
          email: card.email,
          password: decryptedPassword,
          note: card.note,
          createdAt: formatDate(card.createdAt),
          updatedAt: formatDate(card.updatedAt),
          __v: card.__v
        }
      ))
      return;
    } catch (error) {
      console.log(error)
    }
  };

  let compromisedFlag = false;
  useEffect(() => { 
    handlePasswordCardData();
    compromisedFlag = getIsCompromisedFlag(cardId)
  }, [])
  
  const metaData = [
    {
      id: 1,
      name: "date",
      icon: CalenderSvg,
      body: updatedCardData.updatedAt,
    },
    {
      id: 2,
      name: "url",
      icon: LinkSvg,
      body: updatedCardData.url,
    },
    {
      id: 3,
      name: "email",
      icon: Color5UserSvg,
      body: updatedCardData.email,
    },
    {
      id: 4,
      name: "notes",
      icon: NotesSvg,
      body: updatedCardData.note,
    },
    {
      id: 5,
      name: "password",
      icon: Color5LockSvg,
      body: updatedCardData.password,
    },
  ];

  const handleDeletePassword = async (e) => {
    e.preventDefault();
    console.log("deleting password");

    try {
      const cardId = updatedCardData?._id || "";

      if (!cardId) {
        toast.error("Card ID is missing");
        return null;
      }

      const response = await deletePassword({cardId});
      const { data } = response?.data ?? {};

      console.log({data, response, Response: response, ResponseData: response?.data});

      // if (!userData && !(userData instanceof Object)) {
      //   throw new Error();
      // }

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

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    console.log("updating password");
    navigate(`/update?cardId=${cardId}`);
  };

  const footer = (
    <footer className="rounded-xl flex flex-wrap justify-between mb-4 container">
      <button
        className="outlinedButton w-[45%]"
        onClick={(e) => handleDeletePassword(e)}
      >
        Delete
      </button>
      <button
        className="filledButton w-[45%]"
        onClick={(e) => handleUpdatePassword(e)}
      >
        Update
      </button>
    </footer>
  );
  
  return (
    <main className={`main-with-header}`}>
      <MiniWrapper
        heading={updatedCardData.title}
        ReadOnly={true}
        isCompromisedFlag={compromisedFlag}
        footer={footer}
        metaData={metaData}
        isScrollbarVisible={false}
      >
        <div
          key={"invisible-navigation-cover-part"}
          className="h-[5.25rem]"
        ></div>
      </MiniWrapper>
    </main>
  );
};

export default ReadPassword;
