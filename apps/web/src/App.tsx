// import { useRoutes } from 'react-router-dom';
import { useLocation, useRoutes } from "react-router-dom";
import { ClientRoutes } from "./routes/Client.routes";
import { AdminRoutes } from "./routes/Admin.routes";
import "./index.css";
import "antd/dist/reset.css"; // Ant Design 5.x
import { AppNotification } from "./components/AppNotification";
import { useEffect, useState } from "react";
import { Splash } from "./components/tools/Splash";

function App() {
  const location = useLocation();

  // Kiểm tra trực tiếp khi khởi tạo để tránh bị "chớp"
  const [showSplash, setShowSplash] = useState(() => {
    return location.pathname === "/" && !sessionStorage.getItem("splash");
  });

  useEffect(() => {
    if (showSplash) {
      sessionStorage.setItem("splash", "true");
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const element = useRoutes([ClientRoutes, AdminRoutes]);
  return (
    <>
      {showSplash && <Splash />}
      <div style={{ display: showSplash ? "none" : "block" }}>
        <AppNotification />
        {element}
      </div>
    </>
  );
}

export default App;
