// import { useRoutes } from 'react-router-dom';
import { useRoutes } from "react-router-dom";
import { ClientRoutes } from "./routes/Client.routes";
import { AdminRoutes } from "./routes/Admin.routes";
import './index.css'
import "antd/dist/reset.css"; // Ant Design 5.x

function App() {
  const element = useRoutes([ClientRoutes, AdminRoutes]);
  return element;
}

export default App
