// Header.jsx
import LogoSvg from "../assets/icons/symbolic-logo.svg";
import GithubSvg from "../assets/icons/github.svg";
import LeftArrowSvg from "../assets/icons/left-arrow.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout as generatePasswordLogout } from "../redux/Slices/generatePasswordSlice";

const Header = ({ showLeftArrow, hideHeader }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const generatedPassword = useSelector(state => state.generatePassword);

  const handleLeftArrowClick = () => {
    if (generatedPassword) {
      dispatch(generatePasswordLogout());
    }
    navigate(-1);
  };

  return !hideHeader ? (
    <header className="flex justify-between items-center flex-wrap h-[5rem] container">
      {showLeftArrow && (
        <img
          title="👈Go Back"
          src={LeftArrowSvg}
          className="w-9 md:w-11 lg:w-13 cursor-pointer duration-300 hover:bg-color-4 rounded-full"
          alt="left-arrow"
          onClick={() => handleLeftArrowClick()}
        />
      )}
      {!showLeftArrow && (
        <img src={LogoSvg} className="w-9 cursor-pointer md:w-11 lg:w-13" alt="logo" title="OnePass 💚💙 Logo" onClick={() => navigate("/")} />
      )}
      {!showLeftArrow && (
        <a href="https://github.com/Asertwice020" target="_blank">
          <img
            src={GithubSvg}
            title="Visit My Github Profile🧡💜😎"
            className="w-9 cursor-pointer md:w-11 lg:w-13"
            alt="github"
          />
        </a>
      )}
    </header>
  ) : null;
};

export default Header;
