import { Outlet } from "react-router-dom";
import { Header } from "./client/Header";
import { Footer } from "./client/Footer";

export const ClientLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#120a0a]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
