import { useNavigate } from "react-router-dom";
import Carousel from "../components/Carousel"

const OnboardingPage = () => {
  const navigate = useNavigate();
  return (
    <main className="main-with-header container">
      <div className="overflow-hidden">
        <Carousel />
      </div>

      <footer className="rounded-xl flex flex-wrap justify-between">
        <button className="outlinedButton w-[45%]" onClick={() => navigate("/register")}>REGISTER</button>
        <button className="filledButton w-[45%]" onClick={() => navigate("/login")}>LOGIN</button>
      </footer>
    </main>
  );
}

export default OnboardingPage