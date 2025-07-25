import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Auth pages
import TabbedLogin from './pages/Auth/Login.jsx';
import Signup from "@/pages/Auth/Signup";
// Dashboard pages
import TeacherDashboard from "@/pages/Dashboard/TeacherDashboard";
import StudentDashboard from "@/pages/Dashboard/StudentDashboard";
import ParentDashboard from "@/pages/Dashboard/ParentDashboard";
// Class Management
import ClassList from "@/pages/Classes/ClassList";
import CreateClass from "@/pages/Classes/CreateClass";
// Student Management  
import StudentList from "@/pages/Students/StudentList";
import AddStudent from "@/pages/Students/AddStudent";
// Grade Management
import AssignGrade from "@/pages/Grades/AssignGrade";
import GradeReport from "@/pages/Grades/GradeReport";
// Parent Management
import ParentList from "@/pages/Parents/ParentList";

const queryClient = new QueryClient();

// Fixed DashboardRedirect with proper navigation state
const DashboardRedirect = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Navigate to={`/dashboard/${user.role}`} state={{ from: location }} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/login" element={<TabbedLogin />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route 
              path="/dashboard/teacher" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/student" 
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/parent" 
              element={
                <ProtectedRoute requiredRole="parent">
                  <ParentDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Teacher-only Routes */}
            <Route 
              path="/classes" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <ClassList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/classes/create" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <CreateClass />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <StudentList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/students/add" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <AddStudent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/grades" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <GradeReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/grades/assign" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <AssignGrade />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/parents" 
              element={
                <ProtectedRoute requiredRole="teacher">
                  <ParentList />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;