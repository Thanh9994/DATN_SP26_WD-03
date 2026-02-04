import { Outlet } from "react-router-dom";
import HeaderClient from "../components/HeaderClient";
import FooterClient from "../components/FooterClient";

export const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeaderClient />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterClient />
    </div>
  );
};
