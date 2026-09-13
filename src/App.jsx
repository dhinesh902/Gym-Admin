import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layouts
import MainLayout from './components/layout/MainLayout';
// Pages
import Dashboard from './pages/dashboard/Dashboard';
import MembersList from './pages/members/MembersList';
import AddMember from './pages/members/AddMember';
import MemberDetail from './pages/members/MemberDetail';
import Login from './pages/auth/Login';
import NotFound from './pages/auth/NotFound';
import TrainersList from './pages/trainers/TrainersList';
import AddTrainer from './pages/trainers/AddTrainer';
import TrainerDetail from './pages/trainers/TrainerDetail';
import MembershipsList from './pages/memberships/MembershipsList';
import AddMembership from './pages/memberships/AddMembership';
import AttendanceList from './pages/attendance/AttendanceList';
import Reports from './pages/reports/Reports';
import Notifications from './pages/notifications/Notifications';
import Settings from './pages/settings/Settings';
import PaymentsList from './pages/payments/PaymentsList';
import AddPayment from './pages/payments/AddPayment';
import PaymentDetail from './pages/payments/PaymentDetail';
import WorkoutsList from './pages/workouts/WorkoutsList';
import AddWorkout from './pages/workouts/AddWorkout';
import DietList from './pages/diet/DietList';
import AddDiet from './pages/diet/AddDiet';

import ProgressTracking from './pages/progress/ProgressTracking';

// Placeholders for other routes (to be replaced progressively)
const Placeholder = ({ title }) => <div className="p-8"><h1 className="text-2xl font-bold">{title}</h1><p className="text-slate-500 mt-2">This module is under construction.</p></div>;

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Members Module */}
            <Route path="/members" element={<MembersList />} />
            <Route path="/members/add" element={<AddMember />} />
            <Route path="/members/edit/:id" element={<AddMember />} />
            <Route path="/members/:id" element={<MemberDetail />} />
            {/* Trainers Module */}
            <Route path="/trainers" element={<TrainersList />} />
            <Route path="/trainers/add" element={<AddTrainer />} />
            <Route path="/trainers/edit/:id" element={<AddTrainer />} />
            <Route path="/trainers/:id" element={<TrainerDetail />} />
            {/* Other Modules */}
            <Route path="/memberships" element={<MembershipsList />} />
            <Route path="/memberships/add" element={<AddMembership />} />
            <Route path="/attendance" element={<AttendanceList />} />
            <Route path="/workouts" element={<WorkoutsList />} />
            <Route path="/workouts/add" element={<AddWorkout />} />
            <Route path="/workouts/edit/:id" element={<AddWorkout />} />
            <Route path="/diet" element={<DietList />} />
            <Route path="/diet/add" element={<AddDiet />} />
            <Route path="/diet/edit/:id" element={<AddDiet />} />
            <Route path="/payments" element={<PaymentsList />} />
            <Route path="/payments/add" element={<AddPayment />} />
            <Route path="/payments/edit/:id" element={<AddPayment />} />
            <Route path="/payments/:id" element={<PaymentDetail />} />
            <Route path="/progress" element={<ProgressTracking />} />
            {/* Admin Modules */}
            <Route path="/reports" element={<Reports />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
