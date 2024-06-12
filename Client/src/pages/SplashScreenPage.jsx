import LogoSvg from "../assets/icons/full-logo.svg";
import { useEffect } from "react";
import gsap from "gsap";

const SplashScreenPage = () => {
  useEffect(() => {
    const tl = gsap.timeline();

    // Animation for the logo shrinking down
    tl.from(".logo", { scale: 0, duration: 1.5, ease: "power3.out" })
      // Animation for the logo scaling up to 100%
      .to(".logo", { scale: 1, duration: 0.8, ease: "power3.out" }, "-=0.7")
      // Animation for the paragraph moving up from the bottom
      .from(".para", { y: 50, duration: 1, ease: "power3.out" }, "-=0.8")
      // Fade out both the logo and paragraph at the same time
      .to(
        [".logo", ".para"],
        { opacity: 0, duration: 1, ease: "power3.out" },
        "+=1"
      );

    // Cleanup function to kill the animation on unmount
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <main
      className="h-screen flex flex-col items-center justify-center relative"
      style={{ overflow: "hidden" }}
    >
      <img
        src={LogoSvg}
        className="logo w-[30%] md:w-[24%] lg:w-[22%]"
        alt="logo"
      />
      <p className="para absolute bottom-10">
        The only password manager you’ll ever need.
      </p>
    </main>
  );
};

export default SplashScreenPage;