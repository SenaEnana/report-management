import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./pages/auth/SignIn";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import Dashboard from "./pages/Dashboard";
  
  function App() {
  
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar/>
         <main className="flex-1 flex flex-col">
          <Topbar/>
            <Router>
              <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/reports" element={<Dashboard/>} />
            <Route path="/users" element={<Dashboard/>} />
            <Route path="/settings" element={<Dashboard/>} />
            <Route path="/sign-in" element={<SignIn/>} />
          </Routes>
      </Router>
  </main>
</div>
    );
  }
  
  export default App;










// import "./App.css";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import SignIn from "./pages/auth/SignIn";
// import { ThemeProvider } from "./components/theme-provider";
// import ProtectedRoute from "@/components/common/ProtectedRoute";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import CreateUser from "./pages/user/CreateUser";
// import ViewUser from "./pages/user/ViewUser";
// import DetailUser from "./pages/user/DetailUser";
// import EditUser from "./pages/user/EditUser";
// import ChangePassword from "./pages/auth/ChangePassword";
// import Custom404 from "./pages/page-not-found/page-not-found";
// import PageForbidden from "./pages/page-not-found/page-forbidden";
// import SyncRole from "./pages/user/SyncRole";
// import AssignCampus from "./pages/user/AssignCampus";
// import SyncPermission from "./pages/user/SyncPermission";
// import CreateGender from "./pages/gender/CreateGender";
// import ViewGender from "./pages/gender/ViewGender";


// function App() {
//   const queryClient = new QueryClient();

//   return (
//     <ThemeProvider>
//       <QueryClientProvider client={queryClient}>
//         <Router>
//           <Routes>
//             {/* Public Route */}
//             {/* <Route path="/sign-in" element={<SignIn />} /> */}

//             {/* Protected Routes */}
//             <Route
//               path="/"
//               element={
//                 // <ProtectedRoute>
//                   <Dashboard />
//                 // </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 // <ProtectedRoute>
//                   <Dashboard />
//                 // </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/change-password"
//               element={
//                 <ProtectedRoute>
//                   <ChangePassword />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="*"
//               element={
//                 <ProtectedRoute>
//                   <Custom404 />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/page-forbidden"
//               element={
//                 <ProtectedRoute>
//                   <PageForbidden />
//                 </ProtectedRoute>
//               }
//             />
//             {/* user menu include{role, permission, gender} */}
//             <Route
//               path="/user/view/create"
//               element={
//                 <ProtectedRoute>
//                   <CreateUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/view"
//               element={
//                 <ProtectedRoute>
//                   <ViewUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/view/detail/:id"
//               element={
//                 <ProtectedRoute>
//                   <DetailUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/view/edit/:id"
//               element={
//                 <ProtectedRoute>
//                   <EditUser />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/view/sync-role"
//               element={
//                 <ProtectedRoute>
//                   <SyncRole />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/view/assign-campus"
//               element={
//                 <ProtectedRoute>
//                   <AssignCampus />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/view/sync-permission"
//               element={
//                 <ProtectedRoute>
//                   <SyncPermission />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/gender/view/create"
//               element={
//                 <ProtectedRoute>
//                   <CreateGender />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/user/gender/view"
//               element={
//                 <ProtectedRoute>
//                   <ViewGender />
//                 </ProtectedRoute>
//               }
//             />

//           </Routes>
//         </Router>
//       </QueryClientProvider>
//     </ThemeProvider>
//   );
// }

// export default App;
