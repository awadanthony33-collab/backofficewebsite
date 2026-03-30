// @ts-ignore
import { ConfigProvider } from 'antd';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage        from './pages/LoginPage';
import Navpage          from './pages/navpage';
import ProtectRoute     from './protecter/ProtectRoute';

// ── Page imports ──────────────────────────────────────────────────────────────

import DoctorsPage      from './pages/DoctorsPage';
import AlertesPage      from './pages/AlertesPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RapportPage from './pages/Rapportpage';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#a4091b',
          borderRadius: 8,
          fontFamily: "'DM Sans', sans-serif",
        },
      }}
    >
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/mainpage"
            element={
              <ProtectRoute>
                <Navpage />
              </ProtectRoute>
            }
          >

            <Route index element={<Navigate to="rapport" replace />} />
            <Route path="rapport"         element={<RapportPage />} />
            <Route path="doctors"         element={<DoctorsPage />} />
            <Route path="alertes"         element={<AlertesPage />} />
            <Route path="change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* Fallbacks */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;