import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import { useSelector } from "react-redux";

function PrivateLayout() {
  const { access, user } = useSelector((state) => state.user);

if (!access || !user) {
  return <Navigate to="/" replace />;
}


  return (
    <div>
      <main className="flex flex-col h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden">
        <div className="sticky top-0 z-50 shadow-md h-16">
          <Navbar />
        </div>
        <Outlet />
      </main>
    </div>
  );
}

export default PrivateLayout;
