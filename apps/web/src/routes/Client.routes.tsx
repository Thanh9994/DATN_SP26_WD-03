import { NotFound } from '@web/components/NotFound'
import { ClientLayout } from '@web/layouts/ClientLayout'
import { Home } from '@web/pages/Home'
import { RouteObject } from 'react-router-dom'

export const ClientRoutes: RouteObject = {
    path: '/',
    element: <ClientLayout/>,
    children: [
        { path: '', element: <Home />},
        { path: '*', element: <NotFound />}
    ]
}
