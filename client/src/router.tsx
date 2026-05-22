import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { IssueList } from './pages/issues/IssueList';
import { CreateIssue } from './pages/issues/CreateIssue';

export const router = createBrowserRouter([
  // Root redirect: "/" goes to /login if not authenticated (ProtectedRoute handles it)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/', element: <Dashboard /> },
          { path: '/issues', element: <IssueList /> },
          { path: '/issues/new', element: <CreateIssue /> },
        ],
      },
    ],
  },
  // Catch-all: redirect unknown routes to root
  { path: '*', element: <Navigate to="/" replace /> },
]);
