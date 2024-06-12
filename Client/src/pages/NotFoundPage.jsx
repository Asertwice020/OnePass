import { useNavigate } from "react-router-dom";
import HeroIconsLeftSvg from "../assets/icons/heroicons-left.svg"
import NotFoundImg from "../assets/images/404.jpg";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="container main-with-header font-poppins select-none flex gap-x-5">
      <div className="">
        <h1 className="font-bebas text-[calc(3.5rem+5vw)] leading-tight not-found mt-5 2xl:text-[132px]">
          404
        </h1>
        <h2 className="font-bebas text-[calc(2.75rem+5vw)] leading-none 2xl:text-[120px]">
          <span className="text-color-2">Lost in </span>
          <span className="text-color-1">OnePass</span>
        </h2>

        <p className="mt-10 text-[calc(9px+0.5vw)] 2xl:text-[1rem]">
          You have reached the edge of OnePass.
          <br />
          the page you request could not be found.
          <br />
          Don't worry and return to the previous page
        </p>

        <button className="flex items-center mt-10 filledButton gap-x-2" onClick={() => navigate(-1)}>
          <img
            src={HeroIconsLeftSvg}
            className="w-5 aspect-square mb-[1px] inline-block"
            alt="go back"
          />
          Go Back
        </button>
      </div>

      <div className="xxs:w-0 md:w-1/2 aspect-auto flex justify-center mt-20 items-start">
        <img src={NotFoundImg} className="w-full" alt="404-img" />
      </div>
    </main>
  );
};

export default NotFoundPage;
