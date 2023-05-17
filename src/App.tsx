import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Home from './pages/home';
import AdminHome from './pages/admin/home';
import routes from './routes';
import PageNotFound from './pages/PageNotFound';
import MainLayout from './pages/MainLayout';
import AdminLayout from './pages/AdminLayout';
import Users from './pages/admin/users';

function App() {
  return (
    <div className='bg-[#f8f9fa] flex flex-col justify-between min-h-screen'>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={routes.HOME} element={<Home />} />
          <Route path={routes.LOGIN} element={<Login />} />
          <Route path={routes.REGISTER} element={<Register />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path={routes.ADMIN} element={<AdminHome />} />
          <Route path={routes.ADMIN_USERS} element={<Users />} />
          <Route path={routes.ADMIN_LOGIN} element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
