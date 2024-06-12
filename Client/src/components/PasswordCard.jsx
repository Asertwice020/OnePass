import GroupSvg from "../assets/icons/group.svg";
import AppSvg from "../assets/icons/apps.svg";
import DocumentSvg from "../assets/icons/document.svg";
import CardSvg from "../assets/icons/card.svg";
import WorkSvg from "../assets/icons/work.svg";
import BrowserSvg from "../assets/icons/browser.svg";
import CopySvg from "../assets/icons/copy.svg";
import SearchIllustrationSvg from "../assets/icons/search-illustration.svg"
import { useDispatch, useSelector } from "react-redux";
import { getDecryptedPassword } from "../api/axios"
import { useNavigate } from "react-router-dom"
import { handleCopyPassword } from "../utils/apiCallingHelper";
import { handleToggle, handleCardId } from "../redux/Slices/fullCardToggle.js"

const PasswordCard = ({ searchResult }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const allStoredPasswords = useSelector(
    (state) => state.storedPasswords.allStoredPasswords
  );

  const getIcon = (cardCategory) => {
    switch (cardCategory) {
      case "social":
        return GroupSvg;
      case "work":
        return WorkSvg;
      case "apps":
        return AppSvg;
      case "documents":
        return DocumentSvg;
      case "cards":
        return CardSvg;
      default:
        return BrowserSvg;
    }
  };

  const handleCopyClick = async (cardId) => {
    try {
      const card = allStoredPasswords.find(
        (item) => item._id === cardId && item.password
      );

      if (!card) {
        throw new Error(
          "Card not found or no password associated with the card"
        );
      }

      const decryptedPassword = await getDecryptedPassword(card.password);
      decryptedPassword && handleCopyPassword(decryptedPassword, "Password");
    } catch (error) {
      console.log(error);
    }
  };

  const handlePasswordCardClick = (cardId) => {
    try {
      if (!cardId) return

      dispatch(handleCardId(cardId))
      dispatch(handleToggle(true))

      navigate("/read")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-4 h-[calc(100vh-11rem)] overflow-y-auto container select-none">
        {searchResult.length ? (
          searchResult.map((card) => (
            <div
              key={card.id}
              className="flex justify-between items-center border-2 border-color-4 rounded-xl h-[4.25rem] p-2.5"
            >
              <div className="flex">
                <img
                  src={getIcon(card.category)}
                  alt={card.name}
                  className="w-11 aspect-square bg-color-9 rounded-2xl text-color-3 p-2.5 mr-4"
                />

                <div>
                  <h1
                    className="text-[1.875rem] capitalize leading-none font-bebas cursor-pointer"
                    onClick={() => handlePasswordCardClick(card.id)}
                    title="👀See Full Details📃"
                  >
                    {card.title}
                  </h1>
                  <p className="text-[11px] font-poppins leading-tight">
                    {card.email}
                  </p>
                </div>
              </div>

              <img
                src={CopySvg}
                title="Copy Password📋"
                alt="copy"
                onClick={() => handleCopyClick(card.id)}
                className="w-12 aspect-square p-2 cursor-pointer"
              />
            </div>
          ))
        ) : (
          <div
            key={"empty"}
            className="bg-green-0 w-full mt-[20%] xs:mt-[16%] sm:mt-[14%] md2:mt-[12%] lg:mt-[10.5%] xl:mt-[7.5%]"
          >
            <img
              src={SearchIllustrationSvg}
              alt="search illustration"
              className="w-[180px] aspect-square mx-auto mb-4"
            />
            <h2 className="font-bebas text-lg text-center text-color-2 font-medium mb-2">
              No Results!
            </h2>
            <h3 className="font-poppins text-xs text-center text-color-5">
              We couldn’t find anything. Try searching for something else.
            </h3>
          </div>
        )}
        <p
          key={"end-of-the-line"}
          className={`font-poppins text-xs text-color-5 text-center ${
            !searchResult.length && "hidden"
          }`}
        >
          end of the line.
        </p>
      </div>

      {/* IT'S THE HIDDEN BOTTOM DIV WHICH IS USED TO FILLOUT THE NAVIGATION PART SO THE ALL PASSWORDS ARE VISIBLE  */}
      <div
        key={"invisible-navigation-cover-part"}
        className="h-[4.75rem]"
      ></div>
    </>
  );
};

export default PasswordCard;