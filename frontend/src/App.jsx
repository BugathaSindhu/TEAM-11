import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import SelectRole from './pages/SelectRole';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Impact from './pages/Impact';
import Contact from './pages/Contact';
import DonorDashboard from './pages/DonorDashboard';
import Donate from './pages/Donate';
import DonorMyDonations from './pages/DonorMyDonations';
import DonorRewards from './pages/DonorRewards';
import DonorProfile from './pages/DonorProfile';
import VolunteerDashboard from './pages/VolunteerDashboard';
import VolunteerTasks from './pages/VolunteerTasks';
import VolunteerHistory from './pages/VolunteerHistory';
import VolunteerProfile from './pages/VolunteerProfile';
import NGODashboard from './pages/NGODashboard';
import NGORequests from './pages/NGORequests';
import NGOHistory from './pages/NGOHistory';
import NGOProfile from './pages/NGOProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminDonations from './pages/AdminDonations';
import AdminReports from './pages/AdminReports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/select-role" element={<SelectRole />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/contact" element={<Contact />} />
        
        <Route
          path="/donor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/donate"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <Donate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/my-donations"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorMyDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/rewards"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorRewards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/donor/profile"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <DonorProfile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/volunteer/dashboard"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/tasks"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/history"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/volunteer/profile"
          element={
            <ProtectedRoute allowedRoles={['volunteer']}>
              <VolunteerProfile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGODashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/requests"
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGORequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/history"
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGOHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/profile"
          element={
            <ProtectedRoute allowedRoles={['ngo']}>
              <NGOProfile />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/donations"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDonations />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReports />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


