import { NotFound } from '@web/components/NotFound'
import { ClientLayout } from '@web/layouts/ClientLayout'
import { Home } from '@web/pages/Home'
import Login from '@web/layouts/client/Login'
import { RouteObject } from 'react-router-dom'
import Register from '@web/layouts/client/Register'

export const ClientRoutes: RouteObject = {
  path: '/',
  element: <ClientLayout />,
  children: [
    { index: true, element: <Home /> },     
    { path: 'login', element: <Login /> }, 
    { path: '*', element: <NotFound /> },
    { path: 'register', element: <Register /> },
  ]
} 