// import { useRoutes } from 'react-router-dom';
import "antd/dist/reset.css"; // Ant Design 5.x
import { useRoutes } from "react-router-dom";
import { ClientRoutes } from "./routes/Client.routes";
import { AdminRoutes } from "./routes/Admin.routes";

function App() {
  const element = useRoutes([ClientRoutes, AdminRoutes]);
  return element;
}

export default App
