import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import { MainLayout } from "@/layouts/MainLayout";
import { DashboardLayout } from "@/layouts/DashboardLayout";

// Auth Components
import { RequireAuth } from "@/components/auth/RequireAuth";
import { RequireAdmin } from "@/components/auth/RequireAdmin";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";

// User Dashboard Pages
import UserDashboard from "@/pages/dashboard/UserDashboard";
import KYCSubmit from "@/pages/dashboard/KYCSubmit";
import KYCStatus from "@/pages/dashboard/KYCStatus";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AllSubmissions from "@/pages/admin/AllSubmissions";
import KYCReview from "@/pages/admin/KYCReview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* User Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <DashboardLayout />
              </RequireAuth>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="submit" element={<KYCSubmit />} />
            <Route path="status" element={<KYCStatus />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <DashboardLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="submissions" element={<AllSubmissions />} />
            <Route path="review/:id" element={<KYCReview />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
