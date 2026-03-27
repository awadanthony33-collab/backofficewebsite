import { ConfigProvider } from '../node_modules/antd/es/index';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';

import ProtectRoute from './protecter/ProtectRoute';
import PageLayout from './navpage/pagelayout';


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
          
          
          <Route path="/mainpage" element={<ProtectRoute><PageLayout/></ProtectRoute>} />
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