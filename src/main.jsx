import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router';
import { Header } from './components/Header';
import { CriarPostagem } from './pages/CriarPostagem';
import { ListarPostagens } from './pages/ListarPostagens';
import { EditarPostagem } from './pages/EditarPostagem';
import { Categorias } from './pages/Categorias';
import { Login } from './pages/Login';
import { Cadastro } from './pages/Cadastro';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

function ProtectedLayout() {
  return (
    <PrivateRoute>
      <RootLayout />
    </PrivateRoute>
  );
}

function AppLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'cadastro',
        element: <Cadastro />,
      },
      {
        path: '/',
        element: <ProtectedLayout />,
        children: [
          { index: true, element: <Categorias /> },
          { path: 'postagens', element: <ListarPostagens /> },
          { path: 'criar-postagem', element: <CriarPostagem /> },
          { path: 'postagens/editar/:id', element: <EditarPostagem /> },
        ],
      },
    ],
  },
]);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
