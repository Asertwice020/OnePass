import MiniWrapper from "../utils/MiniWrapper";
// import UserSvg from "../assets/icons/user.svg"
import OrangeUserSvg from "../assets/icons/orange/user.svg"
import LockSvg from "../assets/icons/lock.svg"
import LogoutSvg from "../assets/icons/logout.svg"
import ApplicationVersion from "../components/ApplicationVersion";
import { useSelector } from "react-redux";
import { logoutUser } from "../api/axios"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { logout, performLogout } from "../redux/Slices/userSlice";
import { useDispatch } from "react-redux";

const ProfilePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData) ?? {};

  console.log({avatar: userData?.avatar, name: userData?.username, email: userData?.email})

  const metaData = [
    {
      id: 1,
      icon: OrangeUserSvg,
      body: "Update Profile",
      redirectingPath: "/edit-profile",
    },
    {
      id: 2,
      icon: LockSvg,
      body: "Master Key",
      redirectingPath: "/change-password",
    },
    {
      id: 3,
      icon: LogoutSvg,
      body: "Logout",
      // redirectingPath: "/logout"
    },
  ];

   const handleLogout = async () => {
  const response = await logoutUser();
    const { data, message, success } = response?.data ?? {};
    console.log(message, success, data)

    if (success) {
      dispatch(logout(data));
      toast.success(message);
      navigate("/onboarding");
    }
    console.log(`we are performing to logout the stored passwords from the redux store!`)
    dispatch(performLogout());
  }

  return (
    <main className="main-with-header">
      <MiniWrapper
        heading="Profile"
        avatarWatchOnly={true}
        avatarSrc={userData?.avatar ?? null}
        name={userData?.username ?? null}
        email={userData?.email ?? null}
        metaData={metaData}
        handleLogout={handleLogout}
      >
        <ApplicationVersion />
      </MiniWrapper>
      {/* <CardWrapper
        headingLabel="Let’s get you set up with a new account!"
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        redirectingPageName="Login"
        redirectingLabel="Already have an account?"
        redirectingPath="/login"
        avatarInput={<AvatarInput />}
      /> */}
    </main>
  );
}

export default ProfilePage