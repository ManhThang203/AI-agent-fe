import { AuthProvider } from "@/features/auth/AuthProvider.jsx";
import { BrowserRouter } from "react-router-dom";

/** App-level providers — mở rộng (QueryClient, …) ở các task sau. */
export function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}
