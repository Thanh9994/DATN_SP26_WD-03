import { Outlet } from "react-router-dom";
import { Header } from "./client/Header";
import { Footer } from "./client/Footer";
import { ConfigProvider, theme } from "antd";
import ChatBot from "@web/components/chatbot/ChatBot";

export const ClientLayout = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm, // Giao diện tối cho User
        token: { colorPrimary: "#ea2a33" },
      }}
    >
      <div className="min-h-screen font-display flex flex-col bg-background-dark">
        <Header />
        <main className="flex-1 pb-24 md:pb-12">
          <Outlet />
        </main>
        <Footer />
        <ChatBot />
      </div>
    </ConfigProvider>
  );
};
