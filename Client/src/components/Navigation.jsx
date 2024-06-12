import HomeSvg from "../assets/icons/home.svg";
import UserSvg from "../assets/icons/user.svg";
import AddSvg from "../assets/icons/add.svg";
import { useNavigate, useLocation, Link } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateData = [
    {
      id: 0,
      name: "Home",
      src: HomeSvg,
      path: "/",
    },
    {
      id: 1,
      name: "Add",
      src: AddSvg,
      path: "/add",
      onClick: () => navigate("/add"),
    },
    {
      id: 2,
      name: "Profile",
      src: UserSvg,
      path: "/profile",
    },
  ];

  return (
    <nav className="container fixed pt-4 inset-x-0 bottom-0 z-50 h-[6rem] bg-color-3">
      <main className="bg-color-4 mb-[0.625rem] rounded-xl flex justify-between px-[17%] base:px-[19%]">
        {navigateData.map((item) =>
          item.id === 1 && item.onClick ? (
            <img
              key={item.id}
              src={AddSvg}
              alt={item.name}
              title="Add New Password➕"
              onClick={item.onClick}
              className="addButton"
            />
          ) : (
            <Link
              to={item.path}
              key={item.id}
              className="flex flex-col items-center justify-center relative"
            >
              <img
                src={item.src}
                alt={item.name}
                title={`${item.name}`}
                className={`navSvg ${item.id == 2 && "mb-[0.05rem]"}`}
              />
              {location.pathname === item.path && (
                <div className="activePageIndictor"></div>
              )}
              {location.pathname !== item.path && (
                <div className="activePageIndictor bg-transparent"></div>
              )}
            </Link>
          )
        )}
      </main>
    </nav>
  );
};

export default Navigation;
