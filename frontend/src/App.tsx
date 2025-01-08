import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScanPage from './pages/ScanPage';
import UserProfile from './pages/UserProfile';
import LoginPage from './admin/Login';
import UserLoginPage from './pages/LoginPage'
import AdminRoutes from './admin/AdminRoutes';
import HeroPage from './pages/HeroPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/" element={<Navigate to="/admin" replace />} /> */}
        <Route path="/" element={<HeroPage />} />
        {/* <Route path="/admin" element={<AdminDashboard />} /> */}
        <Route path="/p/:code" element={<ScanPage />} />
        <Route path="/profile/:username" element={<UserProfile username={''} />} />
        <Route path='/user/login' element={<UserLoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
