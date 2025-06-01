import React, { useContext } from "react";
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom';
import { AuthContext } from "./context/AuthContext";

import Layout from "./components/Layout";
import Home from "./components/Home";
import Login from "./components/Login";
import MyProfile from "./components/MyProfile"
import EditMyProfile from "./components/EditMyProfile";
import EmployeesList from "./components/EmployeesList";
import CreateEmployee from "./components/CreateEmployee";
import EditEmployee from "./components/EditEmployee";
import Notifications from "./components/Notifications"
import Departments from "./components/departments"
import CreateDepartment from "./components/CreateDepartment";
import EditDepartment from "./components/EditDepartment";
import Projects from "./components/Projects"
import ProjectDetails from "./components/ProjectDetails"
import EditProject from "./components/EditProject"
import CreateProject from "./components/CreateProject"
import Teams from "./components/Teams"
import TeamDetails from "./components/TeamDetails";
import EditTeam from "./components/EditTeam";
import CreateTeam from "./components/CreateTeam";
import TasksByProjects from "./components/TaskByProjects";
import TasksKanban from "./components/TasksKanbanBoard";
import AllTasksKanbanBoard from "./components/AllTasksKanbanBoard";
import RealtimeTest from './components/RealtimeTest';
import Chat from './components/Chat';
import Test from "./components/test";


const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Wrapper pour récupérer l'id du destinataire depuis l'URL
const ChatPage = () => {
    const { id } = useParams();
    return <Chat receiverId={id} />;
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
            { path: '/edit-my-profile', element: <EditMyProfile /> },
            { path: '/notifications', element: <Notifications /> },
            { path: '/departments', element: <Departments /> },
            { path: '/departments/create', element: <CreateDepartment /> },
            { path: '/departments/edit/:id', element: <EditDepartment /> },
            { path: '/projects', element: <Projects /> },
            { path: '/projects/:id', element: <ProjectDetails /> },
            { path: '/projects/create', element: <CreateProject /> },
            { path: '/projects/edit/:id', element: <EditProject /> },
            { path: '/teams', element: <Teams /> },
            { path: "/teams/:id", element: <TeamDetails /> },
            { path: "/teams/create", element: <CreateTeam /> },
            { path: "/teams/edit/:id", element: <EditTeam /> },
            { path: '/tasks', element: <TasksByProjects /> },
            { path: "/projects/:projectId/tasks", element: <TasksKanban /> },
            { path: "/projects/:projectId/tasks/all", element: <AllTasksKanbanBoard /> },
            { path: "/employees", element: <EmployeesList /> },
            { path: "/employees/create", element: <CreateEmployee /> },
            { path: "/employees/:id/edit", element: <EditEmployee /> },
            { path: "/realtime", element: <RealtimeTest /> },
            { path: "/chat/:id", element: <ChatPage /> },
        ],
    },

    { path: "*", element: <Navigate to="/login" /> },

];

const router = createBrowserRouter(routes);

export default router;
