// @ts-ignore
import { ConfigProvider } from 'antd';
// @ts-ignore
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage        from './pages/LoginPage';
import Navpage          from './pages/navpage';
import ProtectRoute     from './protecter/ProtectRoute';

// ── Page imports ──────────────────────────────────────────────────────────────

import DoctorsPage      from './doctorspage.js/DoctorsPage';
import AlertesPage      from './pages/AlertesPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RapportPage from './pages/Rapportpage';
import DoctorsEditPage from './doctorspage.js/CRUD_Doctors/DoctorsEditPage';
import DoctorAddPage from './doctorspage.js/CRUD_Doctors/DoctorAddPage';

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
            <Route path="/mainpage/doctors/edit/:id" element={<DoctorsEditPage />} /> 
            <Route path="/mainpage/doctors/new"        element={<DoctorAddPage />} />
            <Route path="alertes"         element={<AlertesPage />} />
            <Route path="changepassword" element={<ChangePasswordPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;