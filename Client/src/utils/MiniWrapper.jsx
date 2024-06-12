import { useState } from "react";
import { useNavigate } from "react-router-dom";
import openEye from "../assets/icons/open-eye.svg";
import closeEye from "../assets/icons/close-eye.svg";
import CopySvg from "../assets/icons/copy.svg"
import AvatarInput from "../components/AvatarInput";
import { handleCopyPassword } from "./apiCallingHelper";

const MiniWrapper = ({
  heading,
  ReadOnly,
  isCompromisedFlag,
  metaData,
  footer,
  avatarSrc,
  avatarWatchOnly,
  children,
  name,
  email,
  handleLogout,
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = (field) => {
    if (!field) return null;

    if (field.name.includes("password")) {
      return true;
    } else {
      return null;
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getCompromisedText = (isCompromisedFlag) => {
    if (isCompromisedFlag) {
      return (
        <h3 className="p leading-none text-pink-600">Compromised Password</h3>
      );
    } else {
      return <h3 className="p leading-none">Not Compromised</h3>;
    }
  };

  const handlePathNavigation = (path) => {
    navigate(path);
  };

  return (
    <main className="container relative flex flex-col min-h-[calc(100vh-11rem)]">
      <header>
        {ReadOnly && getCompromisedText(isCompromisedFlag)}
        <h1 className="h1">{heading}</h1>
      </header>

      {/* AVATAR, NAME, EMAIL SHOWCASE */}
      <div className="mt-10">
        {!ReadOnly && (
          <>
            <AvatarInput
              avatarSrc={avatarSrc}
              avatarWatchOnly={avatarWatchOnly}
            />

            <div className="w-full text-center select-none">
              <h1 className="font-bebas text-[1.25rem] mt-3 text-color-2 leading-none">
                {name}
              </h1>
              <p className="font-poppins text-color-5 text-sm leading-5">
                {email}
              </p>
            </div>
          </>
        )}
      </div>

      {/* FORM AND FOOTER */}
      <form className="mt-7 flex gap-5 sm:gap-6 md:gap-7 xl:gap-8 flex-col flex-wrap text-color-2 select-none">
        {metaData.map((field) => (
          <main
            key={field.id}
            className={`flex flex-wrap font-poppins ${
              ReadOnly ? "flex-col" : "gap-2"
            } ${field.body === "Logout" ? "mt-6" : ""}`}
          >
            {/* ICONS */}
            <img
              src={field.icon}
              alt="icon"
              // FIXME: REDUCE THE WIDTH OF LOCK-SVG ON THE PROFILE PAGE
              className="w-4 aspect-square xs:w-[1.125rem]"
            />
            {/* PASSWORD FIELD, COPY, OPEN & CLOSE EYE TOGGLE */}
            {field.name === "password" ? (
              <div className="relative">
                <input
                  readOnly
                  type={
                    isPasswordField(field)
                      ? showPassword
                        ? "text"
                        : "password"
                      : field.type
                  }
                  value={field.body}
                  name={field.name}
                  className={`${
                    isPasswordField(field) && "pr-10"
                  } input p-0 border-none rounded-none text-base lg:text-[1.0625rem] pr-[4.5rem] `}
                />

                {field.name === "note" && <p>hello</p>}

                {isPasswordField(field) && (
                  <img
                    src={showPassword ? closeEye : openEye}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className="absolute top-1/2 transform -translate-y-1/2 right-10 cursor-pointer w-6"
                    onClick={togglePasswordVisibility}
                  />
                )}
                <img
                  src={CopySvg}
                  alt="Copy"
                  className="absolute top-1/2 transform -translate-y-1/2 right-0 cursor-pointer w-5"
                  onClick={() => handleCopyPassword(field.body, "Password")}
                />
              </div>
            ) : field.body === "Logout" ? (
              <button type="button" onClick={() => handleLogout()}>
                {field.body}
              </button>
            ) : (
              <p
                onClick={() => handlePathNavigation(field.redirectingPath)}
                className={`text-base lg:text-[1.0625rem] ${
                  !ReadOnly && "cursor-pointer"
                }`}
                id={field.name}
              >
                {field.body}
              </p>
            )}
          </main>
        ))}
        {/* FOOTER - READ-PASSWORD */}
        {footer && (
          <div className="fixed inset-x-0 bottom-0 bg-color-3">{footer}</div>
        )}
      </form>
      {/* CHILDREN - PROFILE PAGE */}
      <div className="mt-auto select-none">{children}</div>
    </main>
  );
};

export default MiniWrapper;
