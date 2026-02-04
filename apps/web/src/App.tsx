import { useRoutes } from "react-router-dom";
import { ClientLayout } from "./layouts/ClientLayout";

const Home = () => (
  <div className="max-w-7xl mx-auto px-4 py-10">
    <h1 className="text-3xl font-bold">Trang chủ</h1>
  </div>
);

function App() {
  const routes = useRoutes([
    {
      element: <ClientLayout />,
      children: [
        { path: "/", element: <Home /> },
        // { path: "/movies", element: <Movies /> },
      ],
    },
  ]);

  return routes;
}

export default App;
