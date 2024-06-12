import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slidesData = [
    {
      title1: "GENERATE",
      title2: "SECURE",
      title3: "PASSWORDS.",
      text: "Stop using unsecure passwords for your online accounts, level up with OnePass. Get the most secure and difficult-to-crack passwords.",
    },
    {
      title1: "ALL YOUR",
      spanText: "PASSWORDS",
      title2: " ARE",
      title3: "HERE.",
      text: "Store and manage all of your passwords from one place. Don’t remember hundreds of passwords, just remember one.",
    },
    {
      title1: "DON’T TYPE,",
      spanText: "AUTOFILL",
      title2: " YOUR",
      title3: "CREDENTIALS.",
      text: "Don’t compromise your passwords by typing them in public, let OnePass autofill those and keep your credentials secure.",
    },
  ];

  const settings = {
    cssEase: "ease-in-out",
    speed: 700,
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => setCurrentSlide(next),
    customPaging: function (i) {
      return (
        <div
          className={`slick-number ${
            currentSlide === i ? "active" : ""
          } bottom-12 left-0 absolute z-10 font-bebas hover:text-color-1`}
        >
          {i + 1}
        </div>
      );
    },
  };

  return (
    <Slider {...settings} dotsClass="slick-dots relative">
      {slidesData.map((slide, index) => (
        <article key={index} className="h-[calc(100vh-9rem)]">
          <main className="flex justify-center h-full flex-col">
            <div>
              <h1 className="h1">{slide.title1}</h1>
              {slide.spanText ? (
                <h1 className="h1 text-color-1">
                  <span>{slide.spanText}</span>
                  <span className="text-color-2">{slide.title2}</span>
                </h1>
              ) : (
                <h1 className="h1 text-color-1">{slide.title2}</h1>
              )}
              <h1 className="h1">{slide.title3}</h1>
              <div className="max-w-[30rem]">
                <p className="p text-sm pt-10 mb-8">{slide.text}</p>
              </div>
            </div>
          </main>
        </article>
      ))}
    </Slider>
  );
};

export default Carousel;
