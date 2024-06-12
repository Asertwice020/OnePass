// ChangePasswordPage.jsx
import CardWrapper from "../utils/CardWrapper";

const ChangePasswordPage = () => {
  const onSubmitHandler = (formData) => {
    // Process the form data here (e.g., send it to the server)
    console.log("Form submitted with data:", formData);
  };

  const inputFields = [
    {
      name: "old-password",
      label: "old password",
      type: "password",
      placeholder: "Old Password",
    },
    {
      name: "new-password",
      label: "new Password",
      type: "password",
      placeholder: "New Password",
    },
  ];

  return (
    <main className="main-with-header">
      <CardWrapper
        heading="change password"
        CTA="Change Password"
        headingLabel=""
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        paddingTop={true}
      />
    </main>
  );
};

export default ChangePasswordPage;
