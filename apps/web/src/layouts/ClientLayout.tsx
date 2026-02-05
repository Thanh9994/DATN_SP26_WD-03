import { Outlet } from "react-router-dom"
import { Header } from "./client/Header"
import { Footer } from "./client/Footer"

export const ClientLayout = () => {
  return (
    <>
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}
