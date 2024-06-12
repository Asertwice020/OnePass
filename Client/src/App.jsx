// App.jsx
import {
  RouterProvider,
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from "react-router-dom";

import Loader from "./components/Loader";
import { lazy, Suspense } from "react";
import Router from "./Router";

import { createPublicRoute, createProtectedRoute } from "./utils/routeHelpers"

const LoginPage = lazy(() => import("./pages/LoginPage"));
const HomePage = lazy(() => import("./pages/HomePage"));
const AddNewPage = lazy(() => import("./pages/AddNewPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));
const UpdatePasswordDetailsPage = lazy(() => import("./pages/UpdatePasswordDetailsPage"));
const EditProfilePage = lazy(() => import("./pages/EditProfilePage"));
const ReadPasswordPage = lazy(() => import("./pages/ReadPasswordPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Router />}>
      {createPublicRoute("onboarding", <OnboardingPage />)}
      {createPublicRoute("register", <RegisterPage />)}
      {createPublicRoute("login", <LoginPage />)}
      {createProtectedRoute("", <HomePage />)}
      {createProtectedRoute("add", <AddNewPage />)}
      {createProtectedRoute("profile", <ProfilePage />)}
      {createProtectedRoute("edit-profile", <EditProfilePage />)}
      {createProtectedRoute("change-password", <ChangePasswordPage />)}
      {createProtectedRoute("update", <UpdatePasswordDetailsPage />)}
      {createProtectedRoute("read", <ReadPasswordPage />)}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
          <Toaster />
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default App;