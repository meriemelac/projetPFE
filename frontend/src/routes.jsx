import React, { useContext } from "react";
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import MyProfile from "./components/MyProfile"
import EmployeesList from "./components/EmployeesList";
import Notifications from "./components/Notifications"
import Departments from "./components/departments"
import Projects from "./components/Projects"
import ProjectDetails from "./components/ProjectDetails"
import CreateProject from "./components/CreateProject"
import Teams from "./components/Teams"
import TeamDetails from "./components/TeamDetails";
import TasksKanban from "./components/TasksKanbanBoard"
import TasksByProjects from "./components/TaskByProjects";

import Test from "./components/test";


const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};


export const routes = [

    {
        path: '/login',
        element: <Login />,
    },

    {
        path: '/',
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),  // Le Layout est toujours présent
        children: [
            { path: '/', element: <Home /> },
            { path: '/test', element: <Test /> },
            { path: '/profile', element: <MyProfile /> },
            { path: '/notifications', element: <Notifications /> },
            { path: '/departments', element: <Departments /> },
            { path: '/projects', element: <Projects /> },
            { path: '/projects/:id', element: <ProjectDetails /> },
            { path: '/projects/create', element: <CreateProject />},
            { path: '/teams', element: <Teams /> },
            { path: "/teams/:id", element: <TeamDetails />},
            { path: '/tasks', element: <TasksByProjects /> },
            { path: "/projects/:projectId/tasks", element: <TasksKanban />},
            { path: "/employees", element: <EmployeesList />},
        ],
    },

    { path: "*", element: <Navigate to="/login" /> },
    
];

const router = createBrowserRouter(routes);

export default router;
