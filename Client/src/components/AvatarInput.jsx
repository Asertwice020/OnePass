import { useState, useRef, useEffect } from "react";
import userSvg from "../assets/icons/user.svg";
import { isResourceExistsOnCloudinary } from "../api/axios";
import { useSelector, useDispatch } from "react-redux";
import {setIsAvatarExist} from '../redux/Slices/isAvatarExist'

const AvatarInput = ({
  avatarSrc,
  onChange,
  showRemoveAvatar,
  avatarWatchOnly,
}) => {

  /*
  REQUIREMENTS:
    1. when user visit the edit profile page, so current avatar show on the profile dp.
    2. when user click on the "remove avatar" button so that current avatar should removed and the default "UserSvg" comes on. and also that "remove avatar" button text replaced to "restore avatar"
      this effect gives user a subtle noticeable thing that if i (user) saved avatar like this so my current avatar will be replaced by this default one.
    3. when user wants to change the username so before saving that username and making a promise to the user that ok: your current username changes with new one. it's important to check at that moment "is that username available to use"
  */

  const userAvatar = useSelector((state) => state.user.userData?.avatar);
  const userAvatarExistenceRedux = useSelector(state => state.isAvatarExist)
  const dispatch = useDispatch();

  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef(null);
  const [avatarExistence, setAvatarExistence] = useState(userAvatarExistenceRedux);
  const [removeText, setRemoveText] = useState("Remove Avatar");

  const isAvatarExist = async () => {
    if (avatarSrc) {
      const existence = await isResourceExistsOnCloudinary(avatarSrc);
      setAvatarExistence(existence);
      dispatch(setIsAvatarExist(existence));
      // setImage(userAvatar)
    }
  };

  useEffect(() => {
    if (!userAvatarExistenceRedux) {
      isAvatarExist();
      // setImage(userAvatar);
    }
  }, [userAvatarExistenceRedux]);

  const handleMouseEnter = () => {
    !image ? setText("Add") : setText("Change");
  };

  const handleMouseLeave = () => {
    setText("");
  };

  const handleAvatarChange = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    onChange({ target: { name: "avatar", files: file ? [file] : null } });
  };

  // const handleRemoveAvatar = () => {
  //   setImage(null);
  //   onChange({ target: { name: "avatar", files: [] } }); // Notify parent component that avatar has been removed
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""; // Reset file input value
  //   }
  // };

  const handleRemoveAvatar = () => {
    if (removeText === "Remove Avatar") {
      console.log(fileInputRef.current.value)
      setImage(null);
      onChange({ target: { name: "avatar", files: [] } });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input value
      }
      setRemoveText("Restore Avatar");
    } else {
      setImage(userAvatar);
      // onChange({ target: { name: "avatar", files: [userAvatar] } });
      onChange({ target: { name: "avatar", files: userAvatar ? [userAvatar] : null } });
      setRemoveText("Remove Avatar");
    }
  };

  // console.log({IMAGE: image})

  if (avatarWatchOnly) {
    return (
      <div className="relative flex flex-col items-center">
        <div
          className={`avatar relative flex justify-center items-center overflow-hidden shadow-xl w-[6.25rem] md:w-[7rem] xl:w-[7.35rem] ${ avatarExistence ? "p-0" : "p-6" }`}
        >
          <img
            src={avatarSrc || userSvg}
            alt="Avatar"
            className="w-[6.25rem] md:w-[7rem] xl:w-[7.35rem]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id="avatar"
        name="avatar"
        className="hidden"
        ref={fileInputRef}
      />
      {image ? (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleAvatarChange}
          className="avatar relative flex justify-center items-center cursor-pointer overflow-hidden hover:bg-[#00000085] md:w-24 md:text-3xl"
        >
          <img src={URL.createObjectURL(image)} alt="Avatar Preview" />
          <span className="absolute">{text}</span>
        </div>
      ) : (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`avatar relative flex justify-center items-center cursor-pointer bg-color-4 duration-300 hover:bg-[#00000085] md:w-24 md:text-3xl xl:w-[6.25rem] ${
            showRemoveAvatar && "shadow-sm"
          }`}
          onClick={handleAvatarChange}
        >
          <img src={userAvatar || userSvg} alt="" />
          {text && <span className="absolute">{text}</span>}
        </div>
      )}
      {showRemoveAvatar && (
        <button
          type="button"
          onClick={handleRemoveAvatar}
          className="text-color-1 font-poppins text-sm w-fit p-1 rounded-3xl mt-1.5 duration-300 border-2 border-transparent focus:border-2 focus:border-color-1 lg:hover:border-color-1"
        >
          {removeText}
        </button>
      )}
    </div>
  );
};

export default AvatarInput;