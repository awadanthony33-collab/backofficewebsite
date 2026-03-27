import { ConfigProvider } from '../node_modules/antd/es/index';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';

import ProtectRoute from './protecter/ProtectRoute';
import Mainpage from './pages/mainpage';


function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a4091b',
        },
      }}
    >
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          
          <Route path="/mainpage" element={<ProtectRoute><Mainpage /></ProtectRoute>} />
          {/* <Route path="/users" element={<ProtectRoute><UsersPage /></ProtectRoute>} />
          <Route path="/customers" element={<ProtectRoute><CustomersPage /></ProtectRoute>} />
          <Route path="/settings" element={<ProtectRoute><CustomersPage /></ProtectRoute>} /> */}


          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;