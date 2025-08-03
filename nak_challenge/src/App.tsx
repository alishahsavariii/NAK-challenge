import { Routes, Route } from 'react-router-dom';
import SignUpForm from './components/SignUpPage';
import SignInPage from './components/SignInPage';
import Dashboard from './components/Dashboard';
import Attributes from './components/Attribiuttes';
import Layout from './components/Layout';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/attributes" element={<Attributes />} />
      </Route>
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpForm />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes >
  );
}

export default App;