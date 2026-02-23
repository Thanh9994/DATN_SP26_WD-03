import { Upload } from '@web/components/admin/Upload'
import { AdminLayouts } from '@web/layouts/AdminLayout'
import { RouteObject } from 'react-router-dom'

export const AdminRoutes: RouteObject = {
    path: '/admin',
    element: <AdminLayouts />,
    children: [
        {path: 'upload', element: <Upload />},
    ]
}
