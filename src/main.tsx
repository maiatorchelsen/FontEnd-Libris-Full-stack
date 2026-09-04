import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import Cadastro from './Cadastro.tsx'
import Detalhes from './Detalhes.tsx'
import Carrinho from './Carrinho.tsx'
import Contato from './components/Contato.tsx'
import AdminLogin from './AdminLogin.tsx'
import Admin from './Admin.tsx'

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const rotas = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'cadastro', element: <Cadastro /> },
      { path: 'detalhes/:livroId', element: <Detalhes /> },
      { path: 'carrinho', element: <Carrinho /> },
      { path: 'contato', element: <Contato /> },
    ],
  },
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin/painel',
    element: <Admin />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)