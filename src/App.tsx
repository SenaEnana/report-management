import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChangePassword from "./pages/auth/ChangePassword";
import Custom404 from "./pages/page-not-found/page-not-found";
import PageForbidden from "./pages/page-not-found/page-forbidden";
import SignIn from "./pages/auth/SignIn";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./pages/user/CreateUser";
import ViewUser from "./pages/user/ViewUser";
import ImportMerchantReport from "./pages/reports/merchant-pos/ImportMerchantReport";
import ImportBranchReport from "./pages/reports/branch-pos/ImportBranchReport";
import ViewMerchantReport from "./pages/reports/merchant-pos/ViewMerchantReport";
import ViewBranchReport from "./pages/reports/branch-pos/ViewBranchReport";
import MerchantHistoryPage from "./pages/reports/merchant-pos/MerchantHistoryPage";
import BranchHistoryPage from "./pages/reports/branch-pos/BranchHistoryPage";
import EditUser from "./pages/user/EditUser";
import CreateMerchant from "./pages/merchant/CreateMerchant";
import ViewMerchant from "./pages/merchant/ViewMerchant";
  
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
               path="user/view/create"
               element={
                 <ProtectedRoute>
                   <CreateUser />
                 </ProtectedRoute>
               }
             />
            <Route
               path="user/view"
               element={
                 <ProtectedRoute>
                   <ViewUser />
                 </ProtectedRoute>
               }
             />    
            <Route
               path="user/view/edit/:id"
               element={
                 <ProtectedRoute>
                   <EditUser />
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
               path="/reports/merchant-pos/import-report"
               element={
                 <ProtectedRoute>
                   <ImportMerchantReport/>
                 </ProtectedRoute>
               }
             />
             <Route
               path="/reports/merchant-pos/view"
               element={
                 <ProtectedRoute>
                   <ViewMerchantReport/>
                 </ProtectedRoute>
               }
             />  
              <Route
               path="/reports/merchant-pos/merchant-history"
               element={
                 <ProtectedRoute>
                   <MerchantHistoryPage/>
                 </ProtectedRoute>
               }
             />                 
              <Route
               path="/reports/branch-pos/import-report"
               element={
                 <ProtectedRoute>
                   <ImportBranchReport/>
                 </ProtectedRoute>
               }
             />
             <Route
               path="/reports/branch-pos/view"
               element={
                 <ProtectedRoute>
                   <ViewBranchReport/>
                 </ProtectedRoute>
               }
             />
              <Route
               path="/reports/branch-pos/branch-history"
               element={
                 <ProtectedRoute>
                   <BranchHistoryPage/>
                 </ProtectedRoute>
               }
             />
              <Route
               path="/merchant/view/create"
               element={
                 <ProtectedRoute>
                   <CreateMerchant/>
                 </ProtectedRoute>
               }
             />
             <Route
               path="/merchant/view"
               element={
                 <ProtectedRoute>
                   <ViewMerchant/>
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
