import axios from "axios";
import { CLIENT, SERVICES_ROUTES } from "../production-constants";
import { login, updateAccessToken } from "../redux/Slices/userSlice";
import { store } from "../redux/store";
import toast from "react-hot-toast";
import { autoLogout } from "../utils/apiCallingHelper";

const axiosInstance = axios.create({
  baseURL: CLIENT.API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // LOGIN, REGISTER, ONBOARDING: PUBLIC ROUTES
    if (CLIENT.PUBLIC_ROUTES.some((path) => config.url.includes(path))) {
      return config;
    }

    // Create and attach AbortController to config
    // if (!config.signal) {
    //   const controller = new AbortController();
    //   config.signal = controller.signal;
    //   config.controller = controller; // store controller for later use
    // }

    // EXTRACT: ACCESS-TOKEN & REFRESH-TOKEN FROM STORE
    const state = store.getState();
    const { accessToken } = state.user;

    // console.log("access token👉👉👉 REQUEST😎", accessToken);

    if (accessToken && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleErrorResponse = async (error) => {
  const originalRequest = error.config;
  const controller = new AbortController();
  originalRequest.signal = controller.signal;

  // Initialize Retry Count If Not Already Set
  if (!originalRequest._retryCount) {
    originalRequest._retryCount = 0;
  }

  const state = store.getState();
  const { refreshToken } = state.user;

  // Check If We Can Retry The Request
  if (
    originalRequest._retryCount < CLIENT.MAX_RETRIES &&
    refreshToken &&
    error.response?.status > 401
  ) {
    originalRequest._retryCount += 1;

    // Retry Request
    return retryRequestWithNewToken(originalRequest, refreshToken, controller);
  } else {
    // Handle Request Failure
    handleRequestFailure(error);
  }

  return Promise.reject(error);
};

const retryRequestWithNewToken = async (originalRequest, refreshToken, controller) => {
  const startTime = Date.now()

  const retry = async () => {
    try {
      const newAccessToken = await fetchNewAccessToken(
        refreshToken,
        controller
      );
      store.dispatch(updateAccessToken({ accessToken: newAccessToken }));
      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (error) {
      if (Date.now() - startTime >= CLIENT.TIMEOUT) {
        controller.abort();
        handleAutoLogout();
        return Promise.reject(error);
      }
      await new Promise((resolve) => setTimeout(resolve, CLIENT.RETRY_DELAY));
      return retry();
    }
  }

  return retry();
}

const fetchNewAccessToken = async (refreshToken, controller) => {
  const refreshTokenRequestConfig = {
    signal: controller.signal,
    withCredentials: true,
  }

  const { data } = await axios.get(
    SERVICES_ROUTES.GET_NEW_ACCESS_TOKEN,
    refreshTokenRequestConfig
  );

  return data.data.accessToken
}

const handleAutoLogout = () => {
  autoLogout();
  toast.error("Session Expired. Please Log-in Again!");
}

const handleRequestFailure = (error) => {
  handleAutoLogout();

  if (error.response) {
    toast.error(
      error.response.data.message ||
      error.message ||
      error.response.statusText ||
      "Unknown Error Occurred!"
    );
  }

  console.log(error)
}

axiosInstance.interceptors.response.use(
  (response) => response,
  handleErrorResponse
);

const registerUser = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axiosInstance.post(
      SERVICES_ROUTES.REGISTER,
      formData,
      options
    );

    if (!response) {
      throw new Error();
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axiosInstance.post(
      SERVICES_ROUTES.LOGIN,
      formData,
      options
    );

    if (!response) {
      throw new Error();
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const editProfile = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axiosInstance.patch(
      SERVICES_ROUTES.EDIT_PROFILE,
      formData,
      options
    );

    if (!response) {
      throw new Error();
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const checkUsernameAvailability = async (username) => {
  try {
    const response = await axiosInstance.post(
      SERVICES_ROUTES.CHECK_USERNAME_AVAILABILITY,
      {
        username,
      }
    );

    if (!response) {
      throw new Error();
    }
    // console.log({RESPONSE:response})
    return response.data.data.available;
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = async () => {
  try {
    const response = await axiosInstance.get(SERVICES_ROUTES.LOGOUT);

    if (!response) {
      throw new Error();
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const isResourceExistsOnCloudinary = async (publicId) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axiosInstance.post(
      SERVICES_ROUTES.RESOURCE_EXIST,
      { publicId },
      options
    );

    if (!response) {
      throw new Error();
    }

    return true;
  } catch (error) {
    return false;
  }
};

const addPassword = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axiosInstance.post(
      SERVICES_ROUTES.ADD_PASSWORD,
      formData,
      options
    );

    if (!response) {
      throw new Error();
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const updatePassword = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axiosInstance.patch(
      SERVICES_ROUTES.UPDATE_PASSWORD,
      formData,
      options
    );

    if (!response) {
      throw new Error();
    }
    // console.log({response})
    return response;
  } catch (error) {
    console.log(error);
  }
};

const deletePassword = async (formData) => {
  try {
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await axiosInstance.post(
      SERVICES_ROUTES.DELETE_PASSWORD,
      formData,
      options
    );

    if (!response) {
      throw new Error();
    }
    console.log({ response });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const fetchUpdatedUserDetails = async () => {
  try {
    const response = await axiosInstance.get(SERVICES_ROUTES.FETCH_USER);
    console.log({ response });
    if (!response) {
      throw new Error();
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

const getPasswordCardsData = async () => {
  try {
    const response = await axiosInstance.get(
      SERVICES_ROUTES.GET_STORED_PASSWORDS
    );
    if (!response) {
      throw new Error();
    }
    const { data } = response?.data ?? [];

    if (data.length) {
      // console.log({DATA: data})
      return data[0];
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};

const getDecryptedPassword = async (password) => {
  try {
    const response = await axiosInstance.post(
      SERVICES_ROUTES.GET_DECRYPTED_PASSWORDS,
      { password }
    );

    if (!response) {
      throw new Error();
    }

    const { data } = response?.data ?? [];
    return data;
  } catch (error) {
    console.log(error);
  }
};

export {
  registerUser,
  loginUser,
  getPasswordCardsData,
  editProfile,
  checkUsernameAvailability,
  logoutUser,
  isResourceExistsOnCloudinary,
  addPassword,
  updatePassword,
  deletePassword,
  fetchUpdatedUserDetails,
  getDecryptedPassword,
};
export default axiosInstance;