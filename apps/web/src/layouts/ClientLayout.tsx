import { Outlet } from "react-router-dom"
import { Header } from "./client/Header"
import { Footer } from "./client/Footer"

export const ClientLayout = () => {
  return (
    <div className="bg-[#120a0a] min-h-screen text-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}