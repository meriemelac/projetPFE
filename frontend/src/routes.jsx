import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile"

import Test from "./components/test";

export const routes = [

    {
        path: '/login',
        element: <Login />,
    },

    {
        path: '/',
        element: <Layout />,  // Le Layout est toujours présent
        children: [
            { path: '/', element: <Home /> },
            { path: '/test', element: <Test /> },
            { path: '/profile', element: <Profile /> },
        ],
    },

    
];

const router = createBrowserRouter(routes);

export default router;
