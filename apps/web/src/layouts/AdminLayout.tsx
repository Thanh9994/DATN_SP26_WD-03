import { Outlet } from "react-router-dom"

export const AdminLayout = () => {
  return (
    <div className=" bg-background-light min-h-screen">
      <Outlet />
    </div>
  )
}
