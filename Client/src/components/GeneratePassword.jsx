import { createRef, useState, useEffect } from "react";
import gsap from "gsap";
import RefreshSvg from "../assets/icons/refresh.svg";
import { useDispatch } from "react-redux";
import { usePassword } from "../redux/Slices/generatePasswordSlice";

const GeneratePassword = ({ onClose }) => {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const generatePasswordRef = createRef();
  const overlayRef = createRef();

  const [length, setLength] = useState(8);
  const [upperCaseAllowed, setUpperCaseAllowed] = useState(true);
  const [lowerCaseAllowed, setLowerCaseAllowed] = useState(true);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [symbolAllowed, setSymbolAllowed] = useState(false);
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const handleUsePassword = () => {
    if (!password) return;
    dispatch(usePassword(password));
    handleClose();
  };

  const characters = {
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{};':\"\\|.<>/?",
  };

  const generatePassword = () => {
    let charSet = "";
    if (upperCaseAllowed) charSet += characters.uppercase;
    if (lowerCaseAllowed) charSet += characters.lowercase;
    if (numberAllowed) charSet += characters.numbers;
    if (symbolAllowed) charSet += characters.symbols;

    if (!charSet.length) {
      // Handle no character types selected
      return; // Prevent empty password generation
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charSet.length);
      generatedPassword += charSet.charAt(randomIndex);
    }

    setPassword(generatedPassword);
  };

  const handleRefreshClick = () => {
    generatePassword();
  };

  useEffect(() => generatePassword(), []);

  useEffect(() => {
    if (generatePasswordRef.current) {
      const tl = gsap.timeline({ paused: true });

      // Bottom-to-top animation on component mount
      tl.from(generatePasswordRef.current, {
        y: windowHeight / 2, // Start from half viewport height
        duration: 0.5, // Animation duration
        ease: "power3.out", // Easing function
      });

      // Play the timeline when the component is shown (controlled by parent)
      tl.play();

      // Cleanup function to kill animation on unmount
      return () => tl.kill();
    }
  }, [windowHeight]);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Prevent background scrolling when the modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleClose = () => {
    const tl = gsap.timeline({
      onComplete: () => {
        if (onClose) onClose();
      },
    });

    // Top-to-bottom animation on close
    tl.to(generatePasswordRef.current, {
      y: windowHeight / 2, // Move to half viewport height
      duration: 0.5, // Animation duration
      ease: "power3.in", // Easing function
    });

    tl.play();
  };

  const handleClickOutside = (event) => {
    if (
      generatePasswordRef.current &&
      !generatePasswordRef.current.contains(event.target)
    ) {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const optionsData = [
    {
      id: "UpperCase",
      onchange: () => setUpperCaseAllowed((prev) => !prev),
      defaultChecked: upperCaseAllowed,
    },
    {
      id: "LowerCase",
      onchange: () => setLowerCaseAllowed((prev) => !prev),
      defaultChecked: lowerCaseAllowed,
    },
    {
      id: "Numbers",
      onchange: () => setNumberAllowed((prev) => !prev),
      defaultChecked: numberAllowed,
    },
    {
      id: "Symbol",
      onchange: () => setSymbolAllowed((prev) => !prev),
      defaultChecked: symbolAllowed,
    },
  ];

  const passwordStrength = (password) => {
    if (!password) return "No";

    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

    if (password.length >= 20 && hasSymbol) {
      return "Strong";
    } else if (password.length >= 28 && hasNumber) {
      return "Strong";
    } else if ((hasLowerCase || hasUpperCase) && password.length <= 16) {
      return "Weak";
    } else if ((hasLowerCase || hasUpperCase) && hasNumber) {
      return "Average";
    } else {
      return "Average";
    }
  };

  const passwordStrengthText = passwordStrength(password);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>
      <main
        ref={generatePasswordRef}
        className={`fixed font-poppins bottom-0 left-0 w-full bg-color-4 shadow-[0_35px_60px_-5px_rgba(0,0,0,0.5)] flex justify-start flex-col flex-wrap items-center rounded-t-2xl py-2 px-4`}
        style={{ height: windowHeight / 1.95 }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="bg-color-5 w-[20%] rounded-full h-2 mb-4"
        />

        <div className="flex flex-wrap justify-between items-center font-semibold text-[0.9rem] w-full">
          <p>Generate Password</p>
          <button type="button">
            <img
              src={RefreshSvg}
              className="w-8 rounded-full p-2 aspect-square cursor-pointer select-none hover:outline-transparent hover:bg-color-6"
              alt="refresh"
              onClick={handleRefreshClick}
            />
          </button>
        </div>

        <div className="flex justify-start text-lg w-full overflow-x-auto">
          <p>{password}</p>
        </div>

        <div className="flex justify-start w-full mb-5">
          <span
            className={`text-[0.5rem] font-medium leading-none w-fit p-1.5 font-poppins rounded-lg ${
              passwordStrengthText == "Weak" && "bg-color-7"
            } ${passwordStrengthText == "Average" && "bg-color-8"} ${
              passwordStrengthText == "Strong" && "bg-color-9"
            }`}
          >
            {passwordStrengthText} Password
          </span>
        </div>

        <div className="flex flex-wrap justify-between w-full text-xs mb-1">
          Password Length
          <span>{length}</span>
        </div>

        <input
          type="range"
          value={length}
          min={8}
          max={50}
          onChange={(e) => setLength(e.target.value)}
          className=" slider accent-color-1 w-full cursor-pointer mb-1"
        />

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 w-full my-3">
          {optionsData.map((option) => (
            <article
              key={option.id}
              className="p-2 bg-color-6 flex items-center rounded-lg text-sm"
            >
              <input
                type="checkbox"
                id={option.id}
                onChange={option.onchange}
                defaultChecked={option.defaultChecked}
                className="accent-color-1"
              />
              <label htmlFor={option.id} className="select-none">
                {option.id}
              </label>
            </article>
          ))}
        </div>

        <button
          onClick={handleUsePassword}
          className="bg-color-1 font-bebas text-white w-full mt-1 p-2 rounded-lg"
        >
          Use Password
        </button>
      </main>
    </div>
  );
};

export default GeneratePassword;