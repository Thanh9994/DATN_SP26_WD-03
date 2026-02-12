import AdminLayout from '@web/layouts/AdminLayout'
import { RouteObject } from 'react-router-dom'

export const AdminRoutes: RouteObject = {
    path: '/admin',
    element: <AdminLayout/>,
    children: [
        
    ]
}
