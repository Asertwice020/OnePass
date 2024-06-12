// RegisterPage.jsx
import CardWrapper from '../utils/CardWrapper';
import AvatarInput from '../components/AvatarInput';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/axios';

const RegisterPage = () => {
  const navigate = useNavigate();

  const onSubmitHandler = async (formData) => {
    try {
      const response = await registerUser(formData);
      const { data: userData } = response?.data ?? undefined;

      if (!userData && !(userData instanceof Object)) {
        throw new Error();
      }

      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const inputFields = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "John Doe",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "johndoe@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
    },
  ];

  return (
    <main className="main-with-header">
      <CardWrapper
        heading="Register"
        CTA="Register"
        headingLabel="Let’s get you set up with a new account!"
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        redirectingPageName="Login"
        redirectingLabel="Already have an account?"
        redirectingPath="/login"
        avatarInput={<AvatarInput />}
      />
    </main>
  );
};

export default RegisterPage;