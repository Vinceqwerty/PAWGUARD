import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, RoleGuard } from './components/PrivateRoute';
import Navbar       from './components/Navbar';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import DogList      from './pages/DogList';
import DogForm      from './pages/DogForm';
import DogDetail    from './pages/DogDetail';
import AdminUsers   from './pages/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
          <Routes>
            <Route path="/"         element={<Navigate to="/dashboard" />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard"    element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/dogs"         element={<PrivateRoute><DogList /></PrivateRoute>} />
            <Route path="/dogs/new"     element={<PrivateRoute><DogForm /></PrivateRoute>} />
            <Route path="/dogs/:id"     element={<PrivateRoute><DogDetail /></PrivateRoute>} />
            <Route path="/dogs/:id/edit" element={<PrivateRoute><DogForm /></PrivateRoute>} />
            <Route path="/admin/users"  element={<RoleGuard roles={['admin']}><AdminUsers /></RoleGuard>} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}