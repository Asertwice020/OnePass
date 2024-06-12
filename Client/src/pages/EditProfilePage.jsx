import CardWrapper from '../utils/CardWrapper';
import { editProfile, checkUsernameAvailability } from '../api/axios';
import { useState } from 'react';
import { debounce, checkUsernameValidity } from '../utils/apiCallingHelper';
import { CLIENT } from '../constants';

const EditProfilePage = () => {
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);

  // Function to check username availability
  const checkUsername = debounce(async (username) => {
    if (username) {
      const available = await checkUsernameAvailability(username);
      // console.log(available)
      setIsUsernameAvailable(available);
    }
  }, CLIENT.DEBOUNCE_TIME);

  // Handler for username change
  const handleUsernameChange = (e) => {
    const value = e.target.value;
    const usernameValidity = checkUsernameValidity(value);
    setIsUsernameValid(usernameValidity);
    // if (!isUsernameValid) return
    setUsername(value);
    checkUsername(value);
  };

  const onSubmitHandler = (formData) => {
    if (!isUsernameAvailable) {
      // console.log(`this USERNAME IS NOT AVAILABLE`);
      return;
    }

    formData = { ...formData, username };
    // Delete the 'new username' field
    delete formData["new username"];

    editProfile(formData);
    console.log(`i am GONNA CHANGE YOUR CURRENT PROFILE DETAILS`);
    console.log("Form submitted with data:", formData);
  };

  const inputFields = [
    {
      name: "new username",
      label: "New Username",
      type: "text",
      placeholder: "John Doe",
    },
    {
      name: "oldPassword",
      label: "Old Password",
      type: "password",
      placeholder: "Password",
    },
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "Password",
    },
  ];

  const CTAMetaData = [
    {
      id: 1,
      CTA: "Cancel",
      redirectingPath: "/profile",
    },
    {
      id: 2,
      CTA: "Save",
      redirectingPath: "/profile",
    },
  ];

  return (
    <main className="main-with-header">
      <CardWrapper
        heading="Edit Profile"
        inputFields={inputFields}
        onSubmit={onSubmitHandler}
        avatarInput={true}
        usernameText={username}
        handleUsernameChangeMethod={handleUsernameChange}
        usernameAvailability={isUsernameAvailable}
        isUsernameValid={isUsernameValid}
        showRemoveAvatar={true}
        CTAMetaData={CTAMetaData}
      />
    </main>
  );
}

export default EditProfilePage