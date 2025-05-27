import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from 'react-router';
import { Header } from './components/Header';
import { CriarPostagem } from './pages/CriarPostagem';
import { ListarPostagens } from './pages/ListarPostagens';

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <ListarPostagens /> },
      { path: 'criar-postagem', element: <CriarPostagem /> },
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
