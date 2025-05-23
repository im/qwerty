import Loading from "./components/Loading";
import "./index.css";
import { ErrorBook } from "./pages/ErrorBook";
import { FriendLinks } from "./pages/FriendLinks";
import MobilePage from "./pages/Mobile";
import TypingPage from "./pages/Typing";
import { isOpenDarkModeAtom } from "@/store";
import "animate.css";
import { useAtomValue } from "jotai";
import mixpanel from "mixpanel-browser";
import process from "process";
import React, { Suspense, lazy, useEffect, useState } from "react";
import "react-app-polyfill/stable";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const AnalysisPage = lazy(() => import("./pages/Analysis"));
const GalleryPage = lazy(() => import("./pages/Gallery-N"));

if (process.env.NODE_ENV === "production") {
  // for prod
  mixpanel.init("89e44d165693a9216e8c8b1357825df0");
} else {
  // for dev
  mixpanel.init("89e44d165693a9216e8c8b1357825df0", { debug: true });
}

function Root() {
  const darkMode = useAtomValue(isOpenDarkModeAtom);
  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const [isMobile, setIsMobile] = useState();

  // useEffect(() => {
  //   const handleResize = () => {
  //     const isMobile = window.innerWidth <= 600;
  //     if (!isMobile) {
  //       window.location.href = "/";
  //     }
  //     setIsMobile(isMobile);
  //   };

  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  return (
    <React.StrictMode>
      <BrowserRouter basename="/qwerty">
        <Suspense fallback={<Loading />}>
          <Routes>
            {isMobile ? (
              <Route path="/*" element={<Navigate to="/mobile" />} />
            ) : (
              <>
                <Route index element={<TypingPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/error-book" element={<ErrorBook />} />
                <Route path="/friend-links" element={<FriendLinks />} />
                <Route path="/*" element={<Navigate to="/" />} />
              </>
            )}
            <Route path="/mobile" element={<MobilePage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.StrictMode>
  );
}

const container = document.getElementById("root");

container && createRoot(container).render(<Root />);
