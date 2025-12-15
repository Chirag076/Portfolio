import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AdminLogin from "./components/AdminPage";
import Landing from "./components/Landing";
import { Loader } from "lucide-react";
const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-screen">
                <Loader className="w-12 h-12 animate-spin text-gray-500" />
              </div>
            }
          >
            <Landing />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-screen">
                <Loader className="w-12 h-12 animate-spin text-gray-500" />
              </div>
            }
          >
            <AdminLogin />
          </Suspense>
        }
      />
    </Routes>
  );
};
export default App;
