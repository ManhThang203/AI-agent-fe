import { AppProviders } from "@/app/AppProviders.jsx";
import { LoginPage } from "@/features/auth/LoginPage.jsx";
import { useAuth } from "@/features/auth/useAuth.js";
import { ChatPage } from "@/features/chat/ChatPage.jsx";
import { Navigate, Route, Routes } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, bootstrapping } = useAuth();
  if (bootstrapping) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-zinc-950 text-zinc-400">
        Đang tải…
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProviders>
  );
}

export default App;
