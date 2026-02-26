// import { useRoutes } from 'react-router-dom';
import { useRoutes } from "react-router-dom";
import { ClientRoutes } from "./routes/Client.routes";
import { AdminRoutes } from "./routes/Admin.routes";
import "./index.css";
import "antd/dist/reset.css"; // Ant Design 5.x
import { AppNotification } from "./components/AppNotification";

function App() {
  const element = useRoutes([ClientRoutes, AdminRoutes]);
  return (
    <>
      <AppNotification />
      {element}
    </>
  );
}

export default App;
