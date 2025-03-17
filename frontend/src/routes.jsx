import React from 'react'
import { createBrowserRouter } from 'react-router-dom';

import Home from "./components/Home"
import Login from "./components/Login"
import Test from "./components/test"

export const routes = [
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/test',
        element: <Test />,
    },
   
]


const router=createBrowserRouter(routes)


export default router
