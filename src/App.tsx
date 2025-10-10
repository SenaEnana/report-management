import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import CreateUser from "./pages/user/CreateUser";
// import ViewUser from "./pages/user/ViewUser";
// import DetailUser from "./pages/user/DetailUser";
// import EditUser from "./pages/user/EditUser";
import ChangePassword from "./pages/auth/ChangePassword";
import Custom404 from "./pages/page-not-found/page-not-found";
import PageForbidden from "./pages/page-not-found/page-forbidden";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/Dashboard";
import ImportReport from "./pages/reports/ImportReport";
import ViewReportTable from "./pages/reports/ViewReportTable";
  
  function App() {
  const queryClient = new QueryClient();
    return (
     <div>
        <ThemeProvider>
       <QueryClientProvider client={queryClient}>
         <Router>
           <Routes>
             {/* Public Route */}
            <Route path="/sign-in" element={<SignIn />} />

             <Route
               path="/"
               element={
                   <ProtectedRoute>
                   <Dashboard />
                   </ProtectedRoute>
               }
             />
             <Route
               path="/change-password"
               element={
                 <ProtectedRoute>
                   <ChangePassword />
                 </ProtectedRoute>
               }
             />
             <Route
               path="*"
               element={
                 <ProtectedRoute>
                   <Custom404 />
                 </ProtectedRoute>
               }
             />
             <Route
               path="/page-forbidden"
               element={
                 <ProtectedRoute>
                   <PageForbidden />
                 </ProtectedRoute>
               }
             />
             <Route
               path="/reports/import-report"
               element={
                 <ProtectedRoute>
                   < ImportReport/>
                 </ProtectedRoute>
               }
             />
             <Route
               path="/reports/view-report-table"
               element={
                 <ProtectedRoute>
                   <ViewReportTable/>
                 </ProtectedRoute>
               }
             />
           </Routes>
         </Router>
       </QueryClientProvider>
     </ThemeProvider>

</div>
    );
  }
  
  export default App;
