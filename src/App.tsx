import SignUp from "./pages/signup";
import SignIn from "./pages/signin";
import "./index.css";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import Tasks from "./pages/tasks";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
