import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { lazy } from 'react';

// Layouts
import MainLayout from './components/layout/MainLayout';
// Pages
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const MembersList = lazy(() => import('./pages/members/MembersList'));
const AddMember = lazy(() => import('./pages/members/AddMember'));
const MemberDetail = lazy(() => import('./pages/members/MemberDetail'));
const Login = lazy(() => import('./pages/auth/Login'));
const NotFound = lazy(() => import('./pages/auth/NotFound'));
const TrainersList = lazy(() => import('./pages/trainers/TrainersList'));
const AddTrainer = lazy(() => import('./pages/trainers/AddTrainer'));
const TrainerDetail = lazy(() => import('./pages/trainers/TrainerDetail'));
const MembershipsList = lazy(() => import('./pages/memberships/MembershipsList'));
const AddMembership = lazy(() => import('./pages/memberships/AddMembership'));
const AttendanceList = lazy(() => import('./pages/attendance/AttendanceList'));
const Reports = lazy(() => import('./pages/reports/Reports'));
const Notifications = lazy(() => import('./pages/notifications/Notifications'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const PaymentsList = lazy(() => import('./pages/payments/PaymentsList'));
const AddPayment = lazy(() => import('./pages/payments/AddPayment'));
const PaymentDetail = lazy(() => import('./pages/payments/PaymentDetail'));
const WorkoutsList = lazy(() => import('./pages/workouts/WorkoutsList'));
const AddWorkout = lazy(() => import('./pages/workouts/AddWorkout'));
const DietList = lazy(() => import('./pages/diet/DietList'));
const AddDiet = lazy(() => import('./pages/diet/AddDiet'));
const ProgressTracking = lazy(() => import('./pages/progress/ProgressTracking'));

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
