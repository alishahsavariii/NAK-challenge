import { Routes, Route } from 'react-router-dom';
import { SignUpPage } from './components/SignUpPage';

const LoginPage = () => <div>Login Page</div>;
const DashboardPage = () => <div>Welcome to your Dashboard!</div>;

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/" element={<DashboardPage />} />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;