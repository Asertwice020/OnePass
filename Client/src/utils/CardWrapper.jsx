import { useEffect, useState } from "react";
import openEye from "../assets/icons/open-eye.svg";
import closeEye from "../assets/icons/close-eye.svg";
import AvatarInput from "../components/AvatarInput";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import CircleCheckSvg from "../assets/icons/circle-check.svg"
import CircleWarnSvg from "../assets/icons/circle-warn.svg"
import Modal from "../components/Modal";

const CardWrapper = ({
  heading,
  headingLabel,
  inputFields,
  onSubmit,
  redirectingPageName,
  redirectingLabel,
  avatarInput,
  paddingTop,
  children,
  CTA,
  redirectingPath,
  showRemoveAvatar,
  CTAMetaData,
  usernameText,
  handleUsernameChangeMethod,
  usernameAvailability,
  isUsernameValid,
  isModalShowing,
  hideModal,
  modalContent,
}) => {
  const navigate = useNavigate();
  const generatePassword = useSelector((state) => state.generatePassword);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (generatePassword) {
      setFormData((prevData) => ({
        ...prevData,
        password: generatePassword,
      }));
    }
  }, [generatePassword]);

  useEffect(() => {
    // Initialize formData with default values from inputFields
    const initialFormData = inputFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || "";
      return acc;
    }, {});
    setFormData(initialFormData);
  }, [inputFields]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "new username") {
      handleUsernameChangeMethod(e);
    }

    setFormData((prevData) => {
      let updatedData = {
        ...prevData,
        [name]: name === "avatar" ? files[0] : value,
      };

      // Preserve the values of other fields if they are not being updated
      for (const field of inputFields) {
        if (field.name !== name) {
          updatedData[field.name] = prevData[field.name];
        }
      }

      if (avatarInput && name !== "avatar") {
        console.log(`fix it after you successfully integrate with backend`);
        updatedData.avatar = prevData.avatar || undefined;
      }

      return updatedData;
    });
  };

  const isPasswordField = (field) => {
    if (!field) return null;

    if (field.name.includes("password") || field.name.includes("Password")) {
      return true;
    } else {
      return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // VALIDATOR: CHECK IF CATEGORY IS SELECTED ON ADD NEW PASSWORD PAGE
    if (
      inputFields[0].name === "category" &&
      (!formData.category || formData.category === "Select")
    ) {
      toast.error("Select A Category Please!");
      return;
    }

    onSubmit(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Update input fields with password value if generatePassword is present
  const updatedFields = inputFields.map((field) => {
    if (isPasswordField(field) && generatePassword) {
      return { ...field, value: formData.password || generatePassword };
    }
    return field;
  });

  return (
    <main className="container">
      <header>
        {heading === "change password" ? (
          <>
            <h1 className="h1 text-[4.2rem]">CHANGE</h1>
            <h1 className="h1 text-[4.2rem]">PASSWORD</h1>
          </>
        ) : (
          <>
            <h1 className="h1 text-[4.2rem]">{heading}</h1>
            <h3 className="p">{headingLabel}</h3>
          </>
        )}
      </header>

      <form
        onSubmit={handleSubmit}
        className={`mt-7 flex flex-col gap-5 sm:gap-6 md:gap-7 xl:gap-8 ${paddingTop}`}
      >
        {avatarInput && (
          <AvatarInput
            onChange={handleChange}
            avatarSrc={formData.avatar}
            showRemoveAvatar={showRemoveAvatar}
          />
        )}

        {updatedFields.map((field, index) => (
          <div key={index} className="flex flex-col space-y-1.5">
            <label htmlFor={field.name} className="label md:text-[0.85rem]">
              {field.label}
            </label>
            {field.type === "file" ? (
              <input
                type={field.type}
                onChange={handleChange}
                id={field.name}
                name={field.name}
                className="input xl:py-[0.75rem] xl:text-2xl"
              />
            ) : field.type === "select" ? (
              <select
                id={field.name}
                name={field.name}
                className="input"
                value={formData[field.name] || field.defaultValue}
                // defaultValue={field.defaultValue}
                onChange={handleChange}
              >
                {field.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  type={
                    isPasswordField(field)
                      ? showPassword
                        ? "text"
                        : "password"
                      : field.type
                  }
                  autoComplete="off"
                  aria-autocomplete="none"
                  // value={formData[field.name]}
                  // defaultValue={field.defaultValue}
                  value={formData[field.name] || field.defaultValue}
                  onChange={handleChange}
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  className={`input duration-200 ${
                    isPasswordField(field) && "pr-10"
                  }} 

                  ${
                    usernameText
                      ? (field.name === "new username" ||
                          field.name === "username") &&
                        (isUsernameValid
                          ? usernameAvailability
                            ? "focus:border-green-600"
                            : "focus:border-pink-600"
                          : "focus:border-pink-600")
                      : ""
                  }

                  `}
                />

                {/* USERNAME IS AVAILABLE OR NOT */}
                {field.name === "new username" && (
                  <p
                    className={`flex items-center text-xs font-poppins font-light ${
                      usernameText
                        ? isUsernameValid
                          ? usernameAvailability
                            ? "text-green-600"
                            : "text-pink-600"
                          : "text-pink-600"
                        : "text-transparent"
                    }`}
                  >
                    {usernameText ? (
                      <span className="flex ml-1 w-full overflow-hidden">
                        <img
                          src={
                            isUsernameValid
                              ? usernameAvailability
                                ? CircleCheckSvg
                                : CircleWarnSvg
                              : CircleWarnSvg
                          }
                          className="w-3 aspect-square mr-1"
                          alt={
                            isUsernameValid
                              ? usernameAvailability
                                ? "circle-check"
                                : "circle-warn"
                              : "circle-warn"
                          }
                        />
                        {isUsernameValid
                          ? usernameAvailability
                            ? `"${usernameText}" Is Available`
                            : `"${usernameText}" Is Already Taken!`
                          : `"${usernameText}" Is Invalid`}
                      </span>
                    ) : (
                      <span className="bg-transparent text-transparent">
                        dummy text
                      </span>
                    )}
                  </p>
                )}

                {isPasswordField(field) && (
                  <img
                    src={showPassword ? closeEye : openEye}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    className="absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer w-6"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {/* RENDER THE CHILDREN */}
        {children}
        {CTA && (
          <button type="submit" className="filledButton mt-3 cursor-pointer">
            {CTA}
          </button>
        )}
        {CTAMetaData && (
          <main className="flex flex-wrap justify-between">
            {CTAMetaData.map((item) => (
              <button
                key={item.id}
                type={item.id === 1 ? "button" : "submit"}
                onClick={() => item.id === 1 && navigate(item.redirectingPath)}
                className={`${item.id === 1 && "outlinedButton"} ${
                  item.id === 2 && "filledButton"
                } w-[45%] mt-[4.5rem] cursor-pointer sm:mt-[3.25rem] md:mt-8 lg:mt-16 xl:mt-[4.5rem] 2xl:[4.8rem]`}
              >
                {item.CTA}
              </button>
            ))}
          </main>
        )}
      </form>
      <div className="mt-8 text-center">
        <h4 className="p text-black leading-none">{redirectingLabel}</h4>
        <h3
          className="p-bebas text-color-1 leading-relaxed cursor-pointer"
          onClick={() => navigate(redirectingPath)}
        >
          {redirectingPageName}
        </h3>
      </div>
      {/* Modal component to be rendered based on the props */}
      <Modal isShowing={isModalShowing} hide={hideModal}>
        {modalContent} {/* Render the modal content passed from the parent */}
      </Modal>
    </main>
  );
};

export default CardWrapper;