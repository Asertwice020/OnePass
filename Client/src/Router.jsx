import { Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect } from "react";
import Loader from "./components/Loader";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import SplashScreenPage from "./pages/SplashScreenPage";
import ScrollToTop from "./components/ScrollToTop";
import { useSelector, useDispatch } from "react-redux";
import {setLoadingState} from './redux/Slices/isAppLoading'
import { CLIENT } from "./production-constants";

const Router = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAppLoading = useSelector((state) => state.isAppLoading);

  // Paths requiring left arrow header
  const pathsWithLeftArrowHeader = [
    "/add",
    "/edit-profile",
    "/change-password",
    "/read",
    "/update",
  ];

  // Paths that don't require a header
  const pathsToHideHeader = ["/generate-password"];

  // Check for left arrow header and hide header based on path
  const showLeftArrowHeader = pathsWithLeftArrowHeader.includes(location.pathname);
  const hideHeader = pathsToHideHeader.includes(location.pathname);

  // Paths requiring navigation
  const pathsWithNavigation = ["/", "/profile"];
  const showNavigation = pathsWithNavigation.includes(location.pathname);

  useEffect(() => {
    if (isAppLoading) {
      const timeoutId = setTimeout(() => {
        dispatch(setLoadingState(false));
      }, CLIENT.SPLASH_SCREEN_TIME);
      return () => clearTimeout(timeoutId);
    }
  }, [isAppLoading]);

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        {isAppLoading ? (
          <SplashScreenPage />
        ) : (
          <>
            {!hideHeader && (
              <Header
                showLeftArrow={showLeftArrowHeader}
                hideHeader={hideHeader}
              />
            )}
            {showNavigation && <Navigation />}
            <Outlet />
          </>
        )}
      </Suspense>
    </>
  );
};

export default Router;