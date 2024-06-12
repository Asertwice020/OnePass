import toast from "react-hot-toast";
import { logout, performLogout } from "../redux/Slices/userSlice";
import { store } from "../redux/store";

// Debounce function to limit the rate of function calls
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const checkUsernameValidity = (username) => {
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;

  if (!usernameRegex.test(username.trim()) || username.length < 0) {
    console.log(`${username} is not valid`);
    return false;
  } else {
    console.log(`${username} is valid`);
    return true;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const handleCopyPassword = (text, textIdentifier = "") => {
  if (!text) {
    toast.error(`No ${textIdentifier} Found!`);
    return;
  }

  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${textIdentifier} Copied!`);
      })
      .catch((err) => {
        console.error(`Failed To Copy ${textIdentifier}: ${err}`);
      });
  } else {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success(`${textIdentifier} Copied!`);
    } catch (error) {
      console.error(`Failed To Copy ${textIdentifier}: ${error}`);
      toast.error(`Failed To Copy ${textIdentifier}!`);
    }
  }
};

const autoLogout = () => {
  store.dispatch(performLogout());
  store.dispatch(logout({}));
}

export { debounce, checkUsernameValidity, formatDate, handleCopyPassword, autoLogout }