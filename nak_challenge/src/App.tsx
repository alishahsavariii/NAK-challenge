import { Routes, Route } from 'react-router-dom';
import SignUpForm from './components/SignUpPage';

const LoginPage = () => <div>Login Page</div>;
const DashboardPage = () => <div>Welcome to your Dashboard!</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpForm />} />

      <Route path="/" element={<DashboardPage />} />

      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  );
}

export default App;